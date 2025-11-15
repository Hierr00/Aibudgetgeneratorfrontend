/**
 * Holded API integration module
 * Manages communication with Holded ERP system
 */

const HOLDED_API_BASE = 'https://api.holded.com/api';

// Types
export interface HoldedContact {
  name: string;
  email?: string;
  phone?: string;
  type?: 'client' | 'supplier' | 'lead';
}

export interface HoldedQuoteItem {
  name: string;
  desc?: string;
  units: number;
  price: number;
  tax: number;
  discount?: number;
}

export interface HoldedQuote {
  contactId?: string;
  contactName?: string;
  contactEmail?: string;
  date: number;
  notes?: string;
  items: HoldedQuoteItem[];
}

/**
 * Makes a request to Holded API
 */
async function makeHoldedRequest(
  endpoint: string,
  method: string,
  apiKey: string,
  body?: any
) {
  const url = `${HOLDED_API_BASE}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'key': apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
    console.log(`📤 Holded API Request Body:`, JSON.stringify(body, null, 2));
  }

  console.log(`📞 Holded API Request: ${method} ${endpoint}`);
  
  const response = await fetch(url, options);
  
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.log(`📄 Holded API Raw Response:`, text);
    data = { rawResponse: text };
  }

  if (!response.ok) {
    console.error(`❌ Holded API Error (${response.status}):`, data);
    const errorMessage = data.message || data.error || data.info || data.rawResponse || response.statusText;
    throw new Error(`Holded API error (${response.status}): ${errorMessage}`);
  }

  console.log('✅ Holded API Response:', JSON.stringify(data, null, 2));
  return data;
}

/**
 * Creates a quote (estimate) in Holded
 */
export async function createHoldedQuote(
  apiKey: string,
  quoteData: HoldedQuote
): Promise<any> {
  try {
    console.log('🔍 Starting createHoldedQuote with data:', JSON.stringify(quoteData, null, 2));

    // Build the quote payload according to Holded API documentation
    // https://api.holded.com/api/invoicing/v1/documents/{docType}
    const quotePayload: any = {
      date: quoteData.date, // Required: integer timestamp
      items: quoteData.items, // Required: array of items
      approveDoc: true, // Approve document so it's visible immediately
    };

    // Contact identification - three options:
    // 1. contactId (existing contact ID)
    // 2. contactCode (NIF/CIF/VAT)
    // 3. contactName (creates new contact)
    if (quoteData.contactId) {
      quotePayload.contactId = quoteData.contactId;
      console.log('✓ Using existing contactId:', quoteData.contactId);
    } else if (quoteData.contactName) {
      // Create new contact using contactName
      quotePayload.contactName = quoteData.contactName;
      console.log('✓ Creating new contact with name:', quoteData.contactName);
      
      // Optional contact fields
      if (quoteData.contactEmail) {
        quotePayload.contactEmail = quoteData.contactEmail;
      }
    } else {
      throw new Error('Either contactId or contactName is required');
    }

    // Optional fields
    if (quoteData.notes) {
      quotePayload.desc = quoteData.notes; // Notes go in 'desc' field
    }

    console.log('📤 Final estimate payload:', JSON.stringify(quotePayload, null, 2));

    // Create the estimate (presupuesto in Holded)
    const quote = await makeHoldedRequest(
      '/invoicing/v1/documents/estimate',
      'POST',
      apiKey,
      quotePayload
    );

    console.log('✅ Created Holded estimate (presupuesto) successfully:', quote._id || quote.id);
    return quote;
  } catch (error: any) {
    console.error('❌ Error creating Holded quote:', error.message);
    console.error('❌ Error details:', error);
    throw error;
  }
}

/**
 * Gets all quotes from Holded
 */
export async function getHoldedQuotes(apiKey: string): Promise<any[]> {
  try {
    const quotes = await makeHoldedRequest(
      '/invoicing/v1/documents/estimate',
      'GET',
      apiKey
    );

    return Array.isArray(quotes) ? quotes : [];
  } catch (error) {
    console.error('Error getting Holded quotes:', error);
    throw error;
  }
}

/**
 * Gets a specific quote from Holded
 */
export async function getHoldedQuote(apiKey: string, quoteId: string): Promise<any> {
  try {
    const quote = await makeHoldedRequest(
      `/invoicing/v1/documents/estimate/${quoteId}`,
      'GET',
      apiKey
    );

    return quote;
  } catch (error) {
    console.error('Error getting Holded quote:', error);
    throw error;
  }
}