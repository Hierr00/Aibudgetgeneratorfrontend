/**
 * Holded API Client
 * Frontend functions to interact with Holded through Supabase Edge Functions
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { BudgetData } from './ai';

const SUPABASE_FUNCTION_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d5269fc7`;

interface HoldedResponse {
  success: boolean;
  error?: string;
  details?: string;
  message?: string;
  quote?: any;
  quotes?: any[];
  count?: number;
  contactId?: string;
}

/**
 * Creates a quote in Holded from budget data
 */
export async function createHoldedQuote(
  budgetData: BudgetData,
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  }
): Promise<HoldedResponse> {
  try {
    console.log('📤 Sending budget to Holded...', budgetData);

    const response = await fetch(`${SUPABASE_FUNCTION_URL}/holded/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        budgetData,
        contactInfo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error from Holded API:', data);
      throw new Error(data.error || data.details || 'Error al crear presupuesto en Holded');
    }

    console.log('✅ Quote created in Holded:', data);
    
    // Log the complete response for debugging
    console.log('📊 DETAILED RESPONSE FROM SERVER:');
    console.log('  - Success:', data.success);
    console.log('  - Quote ID:', data.quote?.id || data.quote?._id);
    console.log('  - Invoice Number:', data.quote?.invoiceNum);
    console.log('  - Quote Object:', JSON.stringify(data.quote, null, 2));
    
    return data;
  } catch (error: any) {
    console.error('❌ Failed to create Holded quote:', error);
    throw error;
  }
}

/**
 * Gets all quotes from Holded
 */
export async function getHoldedQuotes(): Promise<HoldedResponse> {
  try {
    console.log('📥 Fetching quotes from Holded...');

    const response = await fetch(`${SUPABASE_FUNCTION_URL}/holded/quotes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error fetching quotes from Holded:', data);
      throw new Error(data.error || data.details || 'Error al obtener presupuestos de Holded');
    }

    console.log(`✅ Retrieved ${data.count} quotes from Holded`);
    return data;
  } catch (error: any) {
    console.error('❌ Failed to get Holded quotes:', error);
    throw error;
  }
}

/**
 * Gets a specific quote from Holded
 */
export async function getHoldedQuote(quoteId: string): Promise<HoldedResponse> {
  try {
    console.log('📥 Fetching quote from Holded:', quoteId);

    const response = await fetch(`${SUPABASE_FUNCTION_URL}/holded/quote/${quoteId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error fetching quote from Holded:', data);
      throw new Error(data.error || data.details || 'Error al obtener presupuesto de Holded');
    }

    console.log('✅ Retrieved quote from Holded:', data.quote);
    return data;
  } catch (error: any) {
    console.error('❌ Failed to get Holded quote:', error);
    throw error;
  }
}

/**
 * Creates or finds a contact in Holded
 */
export async function createHoldedContact(contactData: {
  name: string;
  email?: string;
  phone?: string;
  type?: 'client' | 'supplier' | 'both';
}): Promise<HoldedResponse> {
  try {
    console.log('📤 Creating/finding contact in Holded...', contactData);

    const response = await fetch(`${SUPABASE_FUNCTION_URL}/holded/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(contactData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error managing contact in Holded:', data);
      throw new Error(data.error || data.details || 'Error al gestionar contacto en Holded');
    }

    console.log('✅ Contact managed in Holded:', data.contactId);
    return data;
  } catch (error: any) {
    console.error('❌ Failed to manage Holded contact:', error);
    throw error;
  }
}

/**
 * Gets training data from Holded quotes to improve AI agent
 * Returns formatted data that can be used to train the agent
 */
export async function getHoldedTrainingData(): Promise<string> {
  try {
    const { quotes } = await getHoldedQuotes();
    
    if (!quotes || quotes.length === 0) {
      return 'No hay presupuestos históricos en Holded.';
    }

    // Format quotes data for AI training
    const trainingData = quotes.map((quote: any, index: number) => {
      const items = quote.items?.map((item: any) => 
        `- ${item.name}: ${item.units} unidades a ${item.price}€`
      ).join('\n') || 'Sin items';

      return `
Presupuesto ${index + 1}:
- Cliente: ${quote.contactName || 'N/A'}
- Fecha: ${new Date(quote.date).toLocaleDateString()}
- Total: ${quote.total || 0}€
- Items:
${items}
- Notas: ${quote.notes || 'Sin notas'}
      `.trim();
    }).join('\n\n');

    const summary = `
DATOS HISTÓRICOS DE HOLDED (${quotes.length} presupuestos):

${trainingData}

Esta información representa presupuestos reales creados anteriormente y puede usarse como referencia para precios, servicios comunes y estructura de presupuestos.
    `.trim();

    console.log('📊 Generated training data from Holded quotes');
    return summary;
  } catch (error: any) {
    console.error('❌ Failed to get Holded training data:', error);
    return 'No se pudo obtener datos de entrenamiento de Holded.';
  }
}