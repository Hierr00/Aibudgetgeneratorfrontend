/**
 * Utilidad para migrar datos locales a Supabase
 * 
 * Uso:
 * 1. Abre la consola del navegador (F12)
 * 2. Ejecuta: migrateLocalDataToSupabase()
 * 3. Los datos del estado actual se guardarán en Supabase
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface LocalBudgetData {
  budgetNumber: string;
  clientName: string;
  clientLocation: string;
  date: string;
  dueDate: string;
  items: Array<{
    id: string;
    concept: string;
    description: string;
    pricePerUnit: number;
    quantity: number;
    ivaRate: number;
  }>;
}

export interface LocalChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Migra un presupuesto con sus items a Supabase
 */
export async function migrateBudget(
  budgetId: string,
  budgetName: string,
  budgetData: LocalBudgetData,
  userId: string = 'demo-user'
) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no está configurado. Configura las variables de entorno primero.');
  }

  try {
    console.log(`📦 Migrando presupuesto ${budgetId}...`);

    // 1. Crear el presupuesto principal
    const { data: newBudget, error: budgetError } = await supabase
      .from('budgets')
      .insert([{
        name: budgetName,
        budget_number: budgetData.budgetNumber,
        client_name: budgetData.clientName,
        client_location: budgetData.clientLocation,
        date: budgetData.date,
        due_date: budgetData.dueDate,
        user_id: userId,
      }])
      .select()
      .single();

    if (budgetError) throw budgetError;

    console.log(`✅ Presupuesto creado con ID: ${newBudget.id}`);

    // 2. Crear los items del presupuesto
    if (budgetData.items && budgetData.items.length > 0) {
      const itemsToInsert = budgetData.items.map((item, index) => ({
        budget_id: newBudget.id,
        concept: item.concept,
        description: item.description,
        price_per_unit: item.pricePerUnit,
        quantity: item.quantity,
        iva_rate: item.ivaRate,
        order_index: index,
      }));

      const { error: itemsError } = await supabase
        .from('budget_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      console.log(`✅ ${budgetData.items.length} items migrados`);
    }

    return newBudget.id;
  } catch (error) {
    console.error('❌ Error migrando presupuesto:', error);
    throw error;
  }
}

/**
 * Migra mensajes de chat de un presupuesto
 */
export async function migrateChatMessages(
  supabaseBudgetId: string,
  messages: LocalChatMessage[]
) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no está configurado.');
  }

  if (!messages || messages.length === 0) {
    console.log('⏭️ No hay mensajes para migrar');
    return;
  }

  try {
    console.log(`💬 Migrando ${messages.length} mensajes...`);

    const messagesToInsert = messages.map(msg => ({
      budget_id: supabaseBudgetId,
      role: msg.role,
      content: msg.content,
    }));

    const { error } = await supabase
      .from('chat_messages')
      .insert(messagesToInsert);

    if (error) throw error;

    console.log(`✅ ${messages.length} mensajes migrados`);
  } catch (error) {
    console.error('❌ Error migrando mensajes:', error);
    throw error;
  }
}

/**
 * Migra todos los presupuestos y mensajes del estado local
 */
export async function migrateAllLocalData(
  budgets: Array<{ id: string; name: string }>,
  budgetData: Record<string, LocalBudgetData>,
  chatMessages: Record<string, LocalChatMessage[]>,
  userId: string = 'demo-user'
) {
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase no está configurado. Configura las variables de entorno primero.');
    return;
  }

  console.log('🚀 Iniciando migración completa de datos...');
  console.log(`📊 Presupuestos a migrar: ${budgets.length}`);

  const migrationMap: Record<string, string> = {}; // localId -> supabaseId

  try {
    for (const budget of budgets) {
      const data = budgetData[budget.id];
      
      if (!data) {
        console.warn(`⚠️ No hay datos para el presupuesto ${budget.id}`);
        continue;
      }

      // Migrar presupuesto
      const newId = await migrateBudget(
        budget.id,
        budget.name,
        data,
        userId
      );

      if (newId) {
        migrationMap[budget.id] = newId;

        // Migrar mensajes de chat
        const messages = chatMessages[budget.id] || [];
        if (messages.length > 0) {
          await migrateChatMessages(newId, messages);
        }
      }
    }

    console.log('✅ Migración completada exitosamente!');
    console.log('📋 Mapa de IDs:', migrationMap);
    
    return migrationMap;
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  }
}

/**
 * Función de utilidad para exportar datos locales a JSON
 * Útil para backup antes de migrar
 */
export function exportLocalDataToJSON(
  budgets: Array<{ id: string; name: string }>,
  budgetData: Record<string, LocalBudgetData>,
  chatMessages: Record<string, LocalChatMessage[]>
) {
  const exportData = {
    exportDate: new Date().toISOString(),
    budgets,
    budgetData,
    chatMessages,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `budget-backup-${Date.now()}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  console.log('✅ Datos exportados a JSON');
}

/**
 * Verificar si Supabase está listo para migración
 */
export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase no está configurado');
    console.log('📝 Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return false;
  }

  try {
    // Intenta hacer una consulta simple
    const { error } = await supabase.from('budgets').select('count').limit(1);
    
    if (error) {
      console.error('❌ Error conectando con Supabase:', error.message);
      return false;
    }

    console.log('✅ Conexión con Supabase verificada');
    return true;
  } catch (error) {
    console.error('❌ Error verificando Supabase:', error);
    return false;
  }
}

// Exportar para uso en consola del navegador
if (typeof window !== 'undefined') {
  (window as any).migrateLocalDataToSupabase = migrateAllLocalData;
  (window as any).checkSupabaseConnection = checkSupabaseConnection;
  (window as any).exportLocalDataToJSON = exportLocalDataToJSON;
}
