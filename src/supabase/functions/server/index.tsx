import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as holded from "./holded.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d5269fc7/health", (c) => {
  return c.json({ status: "ok" });
});

// Test Holded API connection
app.get("/make-server-d5269fc7/holded/test", async (c) => {
  try {
    const apiKey = Deno.env.get('HOLDED_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'Holded API key not configured' }, 500);
    }

    // Test the API by getting contacts (simple GET request)
    const response = await fetch('https://api.holded.com/api/invoicing/v1/contacts', {
      method: 'GET',
      headers: {
        'key': apiKey,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return c.json({ 
        success: false,
        status: response.status,
        error: 'API key test failed',
        details: data 
      }, response.status);
    }

    return c.json({ 
      success: true,
      message: 'Holded API connection successful',
      contactCount: Array.isArray(data) ? data.length : 0
    });
  } catch (error: any) {
    console.error('Error testing Holded API:', error);
    return c.json({ 
      success: false,
      error: 'Failed to test Holded API', 
      details: error.message 
    }, 500);
  }
});

// Holded API Routes

/**
 * POST /make-server-d5269fc7/holded/quote
 * Creates a quote in Holded
 * Body: { budgetData: {...}, contactInfo?: {...} }
 */
app.post("/make-server-d5269fc7/holded/quote", async (c) => {
  try {
    const apiKey = Deno.env.get('HOLDED_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'Holded API key not configured' }, 500);
    }

    const body = await c.req.json();
    console.log('📥 Received budget data:', JSON.stringify(body, null, 2));
    
    const { budgetData, contactInfo } = body;

    if (!budgetData || !budgetData.items || budgetData.items.length === 0) {
      return c.json({ error: 'Invalid budget data: items required' }, 400);
    }

    // Transform budget items to Holded format
    const holdedItems = budgetData.items.map((item: any) => {
      const units = Number(item.quantity) || 1;
      // Try 'price' first (new format), then 'pricePerUnit' (legacy)
      const pricePerUnit = Number(item.price) || Number(item.pricePerUnit) || 0;
      
      console.log(`🔍 Processing item: ${item.concept}`);
      console.log(`   - Quantity (units): ${units}`);
      console.log(`   - Price per unit: ${pricePerUnit}`);
      
      const holdedItem: any = {
        name: item.concept || item.name || 'Item',
        desc: item.description || '',
        units: units,
        subtotal: pricePerUnit, // En Holded, 'subtotal' es el precio UNITARIO
        tax: Number(item.ivaRate) || 21,
        discount: 0,
      };
      
      console.log(`   ✓ Holded item created:`, JSON.stringify(holdedItem, null, 2));
      
      return holdedItem;
    });

    console.log('📦 Transformed items:', JSON.stringify(holdedItems, null, 2));

    // Convert date string to Unix timestamp (seconds, not milliseconds)
    let dateTimestamp: number;
    if (budgetData.date) {
      // Parse DD/MM/YYYY format
      const [day, month, year] = budgetData.date.split('/').map(Number);
      const dateObj = new Date(year, month - 1, day);
      dateTimestamp = Math.floor(dateObj.getTime() / 1000); // Convert to seconds
      console.log(`📅 Converted date "${budgetData.date}" to timestamp: ${dateTimestamp}`);
    } else {
      // Use current date if not provided
      dateTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds
      console.log(`📅 Using current timestamp: ${dateTimestamp}`);
    }

    // Prepare quote data
    const quoteData = {
      contactName: contactInfo?.name || budgetData.clientName || 'Cliente',
      contactEmail: contactInfo?.email || budgetData.clientEmail,
      date: dateTimestamp, // Unix timestamp in SECONDS
      notes: budgetData.notes || `Presupuesto ${budgetData.budgetNumber || ''} - ${budgetData.templateType || 'General'}`.trim(),
      items: holdedItems,
    };

    console.log('📋 Final quote data:', JSON.stringify(quoteData, null, 2));

    const quote = await holded.createHoldedQuote(apiKey, quoteData);
    
    console.log('✅ Holded quote created:', JSON.stringify(quote, null, 2));
    
    // Fetch the complete quote details to verify items and prices
    let fullQuote = quote;
    if (quote.id || quote._id) {
      try {
        const quoteId = quote.id || quote._id;
        console.log('🔍 Fetching full quote details for ID:', quoteId);
        fullQuote = await holded.getHoldedQuote(apiKey, quoteId);
        console.log('📄 Full quote details:', JSON.stringify(fullQuote, null, 2));
      } catch (fetchError: any) {
        console.warn('⚠️ Could not fetch full quote details:', fetchError.message);
        // Continue with the original quote response
      }
    }

    return c.json({ 
      success: true, 
      quote: fullQuote,
      message: 'Presupuesto creado en Holded exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error creating Holded quote:', error);
    return c.json({ 
      error: 'Failed to create quote in Holded', 
      details: error.message 
    }, 500);
  }
});

/**
 * GET /make-server-d5269fc7/holded/quotes
 * Gets all quotes from Holded
 */
app.get("/make-server-d5269fc7/holded/quotes", async (c) => {
  try {
    const apiKey = Deno.env.get('HOLDED_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'Holded API key not configured' }, 500);
    }

    const quotes = await holded.getHoldedQuotes(apiKey);

    return c.json({ 
      success: true, 
      quotes,
      count: quotes.length
    });
  } catch (error: any) {
    console.error('Error getting Holded quotes:', error);
    return c.json({ 
      error: 'Failed to get quotes from Holded', 
      details: error.message 
    }, 500);
  }
});

/**
 * GET /make-server-d5269fc7/holded/quote/:id
 * Gets a specific quote from Holded
 */
app.get("/make-server-d5269fc7/holded/quote/:id", async (c) => {
  try {
    const apiKey = Deno.env.get('HOLDED_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'Holded API key not configured' }, 500);
    }

    const quoteId = c.req.param('id');
    const quote = await holded.getHoldedQuote(apiKey, quoteId);

    return c.json({ 
      success: true, 
      quote
    });
  } catch (error: any) {
    console.error('Error getting Holded quote:', error);
    return c.json({ 
      error: 'Failed to get quote from Holded', 
      details: error.message 
    }, 500);
  }
});

/**
 * POST /make-server-d5269fc7/holded/contact
 * Creates or finds a contact in Holded
 */
app.post("/make-server-d5269fc7/holded/contact", async (c) => {
  try {
    const apiKey = Deno.env.get('HOLDED_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'Holded API key not configured' }, 500);
    }

    const contactData = await c.req.json();
    const contactId = await holded.ensureHoldedContact(apiKey, contactData);

    return c.json({ 
      success: true, 
      contactId
    });
  } catch (error: any) {
    console.error('Error managing Holded contact:', error);
    return c.json({ 
      error: 'Failed to manage contact in Holded', 
      details: error.message 
    }, 500);
  }
});

/**
 * GET /make-server-d5269fc7/holded/accounts
 * Gets accounting accounts from Holded (to find the correct salesAccountId)
 */
app.get("/make-server-d5269fc7/holded/accounts", async (c) => {
  try {
    const apiKey = Deno.env.get('HOLDED_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'Holded API key not configured' }, 500);
    }

    // Get accounting accounts
    const response = await fetch('https://api.holded.com/api/accounting/v1/accounts', {
      method: 'GET',
      headers: {
        'key': apiKey,
        'Accept': 'application/json',
      },
    });

    const accounts = await response.json();

    if (!response.ok) {
      return c.json({ 
        error: 'Failed to get accounts', 
        details: accounts 
      }, response.status);
    }

    // Filter for service accounts (70x codes)
    const serviceAccounts = Array.isArray(accounts) 
      ? accounts.filter((acc: any) => 
          acc.code?.startsWith('70') || 
          acc.name?.toLowerCase().includes('prestaciones') ||
          acc.name?.toLowerCase().includes('servicios')
        )
      : [];

    return c.json({ 
      success: true, 
      serviceAccounts,
      allAccounts: accounts
    });
  } catch (error: any) {
    console.error('Error getting Holded accounts:', error);
    return c.json({ 
      error: 'Failed to get accounts from Holded', 
      details: error.message 
    }, 500);
  }
});

/**
 * GET /make-server-d5269fc7/holded/products
 * Gets products from Holded catalog
 */
app.get("/make-server-d5269fc7/holded/products", async (c) => {
  try {
    const apiKey = Deno.env.get('HOLDED_API_KEY');
    if (!apiKey) {
      return c.json({ error: 'Holded API key not configured' }, 500);
    }

    // Get products from Holded
    const response = await fetch('https://api.holded.com/api/invoicing/v1/products', {
      method: 'GET',
      headers: {
        'key': apiKey,
        'Accept': 'application/json',
      },
    });

    const products = await response.json();

    if (!response.ok) {
      return c.json({ 
        error: 'Failed to get products', 
        details: products 
      }, response.status);
    }

    console.log('📦 Products from Holded:', JSON.stringify(products, null, 2));

    return c.json({ 
      success: true, 
      products: Array.isArray(products) ? products : [],
      count: Array.isArray(products) ? products.length : 0
    });
  } catch (error: any) {
    console.error('Error getting Holded products:', error);
    return c.json({ 
      error: 'Failed to get products from Holded', 
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);