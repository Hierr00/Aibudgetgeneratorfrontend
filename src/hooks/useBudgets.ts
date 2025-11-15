import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type BudgetRow = Database['public']['Tables']['budgets']['Row'];
type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
type BudgetItemRow = Database['public']['Tables']['budget_items']['Row'];
type BudgetItemInsert = Database['public']['Tables']['budget_items']['Insert'];

export interface Budget {
  id: string;
  name: string;
  budgetNumber: string;
  clientName: string;
  clientLocation: string;
  date: string;
  dueDate: string;
}

export interface BudgetItem {
  id: string;
  concept: string;
  description: string;
  pricePerUnit: number;
  quantity: number;
  ivaRate: number;
}

export interface BudgetData extends Budget {
  items: BudgetItem[];
}

// Convertir de formato Supabase a formato App
const fromSupabaseBudget = (row: BudgetRow): Budget => ({
  id: row.id,
  name: row.name,
  budgetNumber: row.budget_number,
  clientName: row.client_name,
  clientLocation: row.client_location,
  date: row.date,
  dueDate: row.due_date,
});

const fromSupabaseBudgetItem = (row: BudgetItemRow): BudgetItem => ({
  id: row.id,
  concept: row.concept,
  description: row.description,
  pricePerUnit: Number(row.price_per_unit),
  quantity: Number(row.quantity),
  ivaRate: row.iva_rate,
});

// Convertir de formato App a formato Supabase
const toSupabaseBudget = (budget: Partial<Budget>, userId: string): Partial<BudgetInsert> => ({
  name: budget.name,
  budget_number: budget.budgetNumber,
  client_name: budget.clientName,
  client_location: budget.clientLocation,
  date: budget.date,
  due_date: budget.dueDate,
  user_id: userId,
});

const toSupabaseBudgetItem = (item: Partial<BudgetItem>, budgetId: string): Partial<BudgetItemInsert> => ({
  budget_id: budgetId,
  concept: item.concept,
  description: item.description,
  price_per_unit: item.pricePerUnit,
  quantity: item.quantity,
  iva_rate: item.ivaRate,
});

export function useBudgets(userId: string = 'demo-user') {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetData, setBudgetData] = useState<Record<string, BudgetData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los presupuestos del usuario
  const loadBudgets = async () => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado, usando datos locales');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const loadedBudgets = (data || []).map(fromSupabaseBudget);
      setBudgets(loadedBudgets);

      // Cargar items para cada presupuesto
      for (const budget of loadedBudgets) {
        await loadBudgetItems(budget.id);
      }
    } catch (err) {
      console.error('Error cargando presupuestos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar items de un presupuesto específico
  const loadBudgetItems = async (budgetId: string) => {
    if (!isSupabaseConfigured()) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('budget_items')
        .select('*')
        .eq('budget_id', budgetId)
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;

      const items = (data || []).map(fromSupabaseBudgetItem);
      
      setBudgetData(prev => ({
        ...prev,
        [budgetId]: {
          ...prev[budgetId],
          items,
        } as BudgetData,
      }));
    } catch (err) {
      console.error(`Error cargando items del presupuesto ${budgetId}:`, err);
    }
  };

  // Crear un nuevo presupuesto
  const createBudget = async (budget: Omit<Budget, 'id'>): Promise<string | null> => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado');
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('budgets')
        .insert([toSupabaseBudget(budget, userId)])
        .select()
        .single();

      if (insertError) throw insertError;

      const newBudget = fromSupabaseBudget(data);
      setBudgets(prev => [newBudget, ...prev]);
      setBudgetData(prev => ({
        ...prev,
        [newBudget.id]: { ...newBudget, items: [] },
      }));

      return newBudget.id;
    } catch (err) {
      console.error('Error creando presupuesto:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    }
  };

  // Actualizar un presupuesto
  const updateBudget = async (budgetId: string, updates: Partial<Budget>): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado');
      return false;
    }

    try {
      const { error: updateError } = await supabase
        .from('budgets')
        .update(toSupabaseBudget(updates, userId))
        .eq('id', budgetId);

      if (updateError) throw updateError;

      setBudgets(prev => prev.map(b => 
        b.id === budgetId ? { ...b, ...updates } : b
      ));

      setBudgetData(prev => ({
        ...prev,
        [budgetId]: {
          ...prev[budgetId],
          ...updates,
        } as BudgetData,
      }));

      return true;
    } catch (err) {
      console.error('Error actualizando presupuesto:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  // Eliminar un presupuesto
  const deleteBudget = async (budgetId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado');
      return false;
    }

    try {
      const { error: deleteError } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId);

      if (deleteError) throw deleteError;

      setBudgets(prev => prev.filter(b => b.id !== budgetId));
      setBudgetData(prev => {
        const { [budgetId]: _, ...rest } = prev;
        return rest;
      });

      return true;
    } catch (err) {
      console.error('Error eliminando presupuesto:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  // Añadir un item a un presupuesto
  const addBudgetItem = async (budgetId: string, item: Omit<BudgetItem, 'id'>): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado');
      return false;
    }

    try {
      const currentItems = budgetData[budgetId]?.items || [];
      const orderIndex = currentItems.length;

      const { data, error: insertError } = await supabase
        .from('budget_items')
        .insert([{ ...toSupabaseBudgetItem(item, budgetId), order_index: orderIndex }])
        .select()
        .single();

      if (insertError) throw insertError;

      const newItem = fromSupabaseBudgetItem(data);
      setBudgetData(prev => ({
        ...prev,
        [budgetId]: {
          ...prev[budgetId],
          items: [...(prev[budgetId]?.items || []), newItem],
        } as BudgetData,
      }));

      return true;
    } catch (err) {
      console.error('Error añadiendo item:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  // Actualizar un item de presupuesto
  const updateBudgetItem = async (budgetId: string, itemId: string, updates: Partial<BudgetItem>): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado');
      return false;
    }

    try {
      const { error: updateError } = await supabase
        .from('budget_items')
        .update(toSupabaseBudgetItem(updates, budgetId))
        .eq('id', itemId);

      if (updateError) throw updateError;

      setBudgetData(prev => ({
        ...prev,
        [budgetId]: {
          ...prev[budgetId],
          items: prev[budgetId].items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        } as BudgetData,
      }));

      return true;
    } catch (err) {
      console.error('Error actualizando item:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  // Eliminar un item de presupuesto
  const deleteBudgetItem = async (budgetId: string, itemId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado');
      return false;
    }

    try {
      const { error: deleteError } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;

      setBudgetData(prev => ({
        ...prev,
        [budgetId]: {
          ...prev[budgetId],
          items: prev[budgetId].items.filter(item => item.id !== itemId),
        } as BudgetData,
      }));

      return true;
    } catch (err) {
      console.error('Error eliminando item:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  // Cargar presupuestos al montar el componente
  useEffect(() => {
    loadBudgets();
  }, [userId]);

  return {
    budgets,
    budgetData,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    refreshBudgets: loadBudgets,
  };
}
