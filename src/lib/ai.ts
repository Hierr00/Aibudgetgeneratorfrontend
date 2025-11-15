import { generateText, tool } from 'ai';
import { openai, createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { getHoldedTrainingData } from './holded';

export interface BudgetItem {
  id: string;
  concept: string;
  description: string;
  price: number;
  quantity: number;
  ivaRate: number;
}

export interface BudgetData {
  budgetNumber: string;
  clientName: string;
  clientEmail?: string;
  clientLocation: string;
  date: string;
  dueDate: string;
  items: BudgetItem[];
}

// Prompt del sistema optimizado y minimalista
const SYSTEM_PROMPT = `Eres Fin, asistente de IA para presupuestos de corte láser de Arkcutt.

INFORMACIÓN CLAVE:
• Arkcutt: Corte láser CO2 a 0,8€/min
• Ubicaciones: Madrid (C. de las Hileras, 18) y Barcelona (Carrer de la ciutat d'asunció, 16)
• Horario: L-V 9:00-18:00h
• Validación: Máx. 24h laborables

MATERIALES DISPONIBLES:
1. DM: 3/5/10/19mm (~9/12/20/35€ por 100x80cm)
2. Contrachapado: 3/5/10/15mm (~10/15/25/35€)
3. Metacrilato: 3/5/8mm (~25/40/30€)
4. Cartón Gris: 2/3mm (~5/7€)
5. Balsa: 10x100cm (~8-15€)

DATOS REQUERIDOS:
1. Ciudad (Madrid/Barcelona)
2. Material (¿quién lo aporta?)
3. Diseño (¿archivo .dxf/.dwg o diseño CAD 25€?)
4. Entrega (¿recogida o envío?)

TIEMPOS ESTIMADOS:
• Piezas simples 10x10cm: 2-5 min
• Medianas 30x30cm: 10-20 min
• Grandes 100x80cm: 30-60 min

TONO:
• Minimalista y directo
• Ayudar sin sobrecarga de información
• Pregunta clara → Respuesta clara

IMPORTANTE - USO DE TOOLS:
• Cuando tengas TODOS los datos necesarios, usa AUTOMÁTICAMENTE createCompleteBudget para generar el presupuesto
• NO preguntes si quieres que edites el presupuesto - HAZLO DIRECTAMENTE
• Después de crear/actualizar el presupuesto, informa brevemente al usuario de lo que hiciste
• Si falta info crítica, pregunta directo

FLUJO ÓPTIMO:
1. Usuario da información → Tú recopilas datos faltantes
2. Cuando tengas todo → CREAS el presupuesto automáticamente con createCompleteBudget
3. Confirmas la creación al usuario brevemente
4. Listo para siguiente acción`;

// Tools del agente
export const budgetTools = {
  updateBudgetInfo: tool({
    description: 'Actualiza información general del presupuesto',
    parameters: z.object({
      clientName: z.string().optional().describe('Nombre del cliente'),
      clientLocation: z.string().optional().describe('Ciudad: Madrid o Barcelona'),
      date: z.string().optional().describe('Fecha DD/MM/YYYY'),
      dueDate: z.string().optional().describe('Vencimiento DD/MM/YYYY'),
    }),
  }),

  createCompleteBudget: tool({
    description: 'Crea presupuesto completo con TODOS los conceptos (corte, material, diseño, envío)',
    parameters: z.object({
      clientName: z.string().optional(),
      clientLocation: z.string().optional(),
      items: z.array(z.object({
        concept: z.string().describe('Ej: "Servicio Corte Láser"'),
        description: z.string().describe('Ej: "Precio €/min de corte"'),
        price: z.number().describe('Precio SIN IVA'),
        quantity: z.number().describe('Cantidad'),
        ivaRate: z.number().describe('21, 10, 4 o 0'),
      })),
    }),
  }),

  addBudgetItem: tool({
    description: 'Añade UN concepto adicional al presupuesto',
    parameters: z.object({
      concept: z.string(),
      description: z.string(),
      price: z.number(),
      quantity: z.number(),
      ivaRate: z.number(),
    }),
  }),

  updateBudgetItem: tool({
    description: 'Modifica un concepto existente',
    parameters: z.object({
      itemIndex: z.number().describe('Índice del item (0 = primero)'),
      concept: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      quantity: z.number().optional(),
      ivaRate: z.number().optional(),
    }),
  }),

  removeBudgetItem: tool({
    description: 'Elimina un concepto',
    parameters: z.object({
      itemIndex: z.number(),
    }),
  }),

  calculateBudgetTotal: tool({
    description: 'Calcula total del presupuesto',
    parameters: z.object({}),
  }),

  estimateCuttingTime: tool({
    description: 'Estima tiempo de corte según dimensiones y complejidad',
    parameters: z.object({
      width: z.number().describe('Ancho en cm'),
      height: z.number().describe('Alto en cm'),
      complexity: z.enum(['simple', 'medio', 'complejo']).describe('Nivel de complejidad'),
      quantity: z.number().describe('Número de piezas'),
    }),
  }),

  recommendMaterial: tool({
    description: 'Recomienda material según uso y presupuesto',
    parameters: z.object({
      usage: z.string().describe('Uso del proyecto'),
      budget: z.enum(['bajo', 'medio', 'alto']).describe('Presupuesto disponible'),
      finish: z.enum(['natural', 'cualquiera']).describe('Acabado deseado'),
    }),
  }),

  validateDesign: tool({
    description: 'Valida compatibilidad de diseño con corte láser',
    parameters: z.object({
      fileFormat: z.string().describe('Formato del archivo'),
      hasVectors: z.boolean().describe('¿Tiene vectores cerrados?'),
      hasMeasurements: z.boolean().describe('¿Tiene medidas en cm?'),
    }),
  }),

  consultHoldedData: tool({
    description: 'Consulta presupuestos históricos de Holded para obtener referencias de precios, servicios comunes o trabajos similares. Usa esta función cuando el usuario pregunte por trabajos anteriores o cuando necesites contexto de pricing.',
    parameters: z.object({
      query: z.string().describe('Qué información necesitas de los presupuestos históricos. Ej: "trabajos similares de corte láser", "precios promedio de metacrilato", "últimos presupuestos"'),
    }),
  }),
};

export async function generateAIResponse(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  budgetData?: BudgetData,
  callbacks?: {
    onBudgetUpdate?: (updates: Partial<BudgetData>) => void;
    onItemAdd?: (item: BudgetItem) => void;
    onItemUpdate?: (index: number, updates: Partial<BudgetItem>) => void;
    onItemRemove?: (index: number) => void;
  }
): Promise<string> {
  try {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('API key inválida. Por favor configura tu API key de OpenAI.');
    }

    const systemMessage = `${SYSTEM_PROMPT}\n\nPRESUPUESTO ACTUAL:\nCliente: ${budgetData?.clientName || 'Sin definir'}\nNúmero: ${budgetData?.budgetNumber || 'Sin definir'}\nCiudad: ${budgetData?.clientLocation || 'Sin definir'}\nItems: ${budgetData?.items?.length || 0}`;

    // Definir las funciones para OpenAI
    const functions = [
      {
        name: 'updateBudgetInfo',
        description: 'Actualiza información general del presupuesto como nombre del cliente, ciudad, fechas',
        parameters: {
          type: 'object',
          properties: {
            clientName: { type: 'string', description: 'Nombre del cliente' },
            clientLocation: { type: 'string', description: 'Ciudad: Madrid o Barcelona' },
            date: { type: 'string', description: 'Fecha en formato DD/MM/YYYY' },
            dueDate: { type: 'string', description: 'Vencimiento en formato DD/MM/YYYY' },
          },
        },
      },
      {
        name: 'createCompleteBudget',
        description: 'Crea un presupuesto completo con TODOS los conceptos necesarios (corte láser, material, diseño si aplica, envío si aplica). USA ESTA FUNCIÓN cuando tengas toda la información.',
        parameters: {
          type: 'object',
          properties: {
            clientName: { type: 'string', description: 'Nombre del cliente' },
            clientLocation: { type: 'string', description: 'Ciudad: Madrid o Barcelona' },
            items: {
              type: 'array',
              description: 'Lista de conceptos del presupuesto',
              items: {
                type: 'object',
                properties: {
                  concept: { type: 'string', description: 'Ej: "Servicio Corte Láser"' },
                  description: { type: 'string', description: 'Ej: "Precio €/min de corte"' },
                  price: { type: 'number', description: 'Precio unitario SIN IVA' },
                  quantity: { type: 'number', description: 'Cantidad de unidades' },
                  ivaRate: { type: 'number', description: 'Tasa de IVA: 21, 10, 4 o 0' },
                },
                required: ['concept', 'description', 'price', 'quantity', 'ivaRate'],
              },
            },
          },
          required: ['items'],
        },
      },
      {
        name: 'addBudgetItem',
        description: 'Añade UN concepto adicional al presupuesto existente',
        parameters: {
          type: 'object',
          properties: {
            concept: { type: 'string', description: 'Nombre del concepto' },
            description: { type: 'string', description: 'Descripción del concepto' },
            price: { type: 'number', description: 'Precio unitario SIN IVA' },
            quantity: { type: 'number', description: 'Cantidad' },
            ivaRate: { type: 'number', description: 'Tasa de IVA: 21, 10, 4 o 0' },
          },
          required: ['concept', 'description', 'price', 'quantity', 'ivaRate'],
        },
      },
      {
        name: 'consultHoldedData',
        description: 'Consulta presupuestos históricos de Holded para obtener referencias de precios, servicios comunes o trabajos similares. Usa esta función cuando el usuario pregunte por trabajos anteriores o cuando necesites contexto de pricing.',
        parameters: {
          type: 'object',
          properties: {
            query: { 
              type: 'string', 
              description: 'Qué información necesitas de los presupuestos históricos. Ej: "trabajos similares de corte láser", "precios promedio de metacrilato", "últimos presupuestos"' 
            },
          },
          required: ['query'],
        },
      },
    ];

    // Llamar a OpenAI con function calling
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        functions,
        function_call: 'auto',
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      
      if (response.status === 401) {
        throw new Error('API key inválida. Verifica tu configuración.');
      }
      if (response.status === 429) {
        throw new Error('Cuota de OpenAI excedida. Verifica tu cuenta.');
      }
      if (response.status === 404) {
        throw new Error('Modelo no disponible. Verifica tu acceso a OpenAI.');
      }
      
      throw new Error(`Error de OpenAI: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Respuesta inválida de OpenAI.');
    }

    const message = data.choices[0].message;

    // Si hay un function call, ejecutarlo
    if (message.function_call && callbacks) {
      const functionName = message.function_call.name;
      const functionArgs = JSON.parse(message.function_call.arguments);

      console.log('🔧 Ejecutando función:', functionName, functionArgs);

      const toolResult = executeToolCall(
        functionName,
        functionArgs,
        budgetData!,
        callbacks
      );

      // Hacer una segunda llamada para que el modelo genere una respuesta natural
      const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemMessage },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: 'assistant',
              content: null,
              function_call: message.function_call,
            },
            {
              role: 'function',
              name: functionName,
              content: JSON.stringify(toolResult),
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (followUpResponse.ok) {
        const followUpData = await followUpResponse.json();
        return followUpData.choices[0].message.content;
      }
    }

    return message.content || 'No pude generar una respuesta.';
  } catch (error: any) {
    console.error('Error generando respuesta:', error);
    
    if (error.message?.includes('API key') || error.message?.includes('apiKey') || error.message?.includes('401')) {
      throw new Error('API key inválida. Verifica tu configuración.');
    }
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error('Cuota de OpenAI excedida. Verifica tu cuenta.');
    }
    if (error.message?.includes('model') || error.message?.includes('404')) {
      throw new Error('Modelo no disponible. Verifica tu acceso a OpenAI.');
    }
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error('Error de conexión. Verifica tu internet.');
    }
    
    throw new Error(error.message || 'Error al generar respuesta. Intenta de nuevo.');
  }
}

// Función auxiliar para ejecutar tools
export function executeToolCall(
  toolName: string,
  args: any,
  budgetData: BudgetData,
  callbacks: {
    onBudgetUpdate?: (updates: Partial<BudgetData>) => void;
    onItemAdd?: (item: BudgetItem) => void;
    onItemUpdate?: (index: number, updates: Partial<BudgetItem>) => void;
    onItemRemove?: (index: number) => void;
  }
): any {
  switch (toolName) {
    case 'updateBudgetInfo':
      callbacks.onBudgetUpdate?.(args);
      return { success: true, message: 'Información actualizada' };

    case 'createCompleteBudget':
      if (args.items?.length > 0) {
        if (args.clientName || args.clientLocation) {
          const updates: any = {};
          if (args.clientName) updates.clientName = args.clientName;
          if (args.clientLocation) updates.clientLocation = args.clientLocation;
          callbacks.onBudgetUpdate?.(updates);
        }

        const newItems = args.items.map((item: any, index: number) => ({
          id: `${Date.now()}-${index}`,
          concept: item.concept,
          description: item.description,
          price: Number(item.price),
          quantity: Number(item.quantity),
          ivaRate: Number(item.ivaRate),
        }));

        callbacks.onBudgetUpdate?.({ items: newItems } as any);
        
        return {
          success: true,
          message: `Presupuesto creado con ${args.items.length} conceptos`,
          itemsCreated: args.items.length,
        };
      }
      return { success: false, message: 'No hay items' };

    case 'addBudgetItem':
      const item: BudgetItem = {
        id: Date.now().toString(),
        concept: args.concept,
        description: args.description,
        price: args.price,
        quantity: args.quantity,
        ivaRate: args.ivaRate,
      };
      callbacks.onItemAdd?.(item);
      return { success: true, message: `"${args.concept}" añadido` };

    case 'updateBudgetItem':
      const { itemIndex, ...updates } = args;
      callbacks.onItemUpdate?.(itemIndex, updates);
      return { success: true, message: `Item ${itemIndex + 1} actualizado` };

    case 'removeBudgetItem':
      callbacks.onItemRemove?.(args.itemIndex);
      return { success: true, message: `Item ${args.itemIndex + 1} eliminado` };

    case 'calculateBudgetTotal':
      let baseImponible = 0;
      let totalIVA = 0;

      budgetData.items.forEach((item) => {
        const subtotal = item.price * item.quantity;
        const iva = subtotal * (item.ivaRate / 100);
        baseImponible += subtotal;
        totalIVA += iva;
      });

      return {
        baseImponible: baseImponible.toFixed(2),
        totalIVA: totalIVA.toFixed(2),
        total: (baseImponible + totalIVA).toFixed(2),
        itemCount: budgetData.items.length,
      };

    case 'estimateCuttingTime':
      const { width, height, complexity, quantity } = args;
      const area = (width * height) / 100; // convertir a dm²
      let timePerPiece = 0;

      if (complexity === 'simple') {
        timePerPiece = Math.max(2, area * 0.5);
      } else if (complexity === 'medio') {
        timePerPiece = Math.max(5, area * 1.5);
      } else {
        timePerPiece = Math.max(10, area * 3);
      }

      const totalTime = Math.ceil(timePerPiece * quantity);
      const cost = totalTime * 0.8;

      return {
        timePerPiece: timePerPiece.toFixed(1),
        totalTime,
        totalCost: cost.toFixed(2),
        pricePerMinute: 0.8,
      };

    case 'recommendMaterial':
      const { usage, budget: budgetLevel, finish } = args;
      const recommendations: any = {
        bajo: {
          natural: 'DM 3mm (~9€) - Económico pero funcional',
          cualquiera: 'Cartón Gris 2mm (~5€) - Ideal para prototipos',
        },
        medio: {
          natural: 'Contrachapado 3mm (~10€) - Buen acabado con vetas',
          cualquiera: 'DM 5mm (~12€) - Resistente y versátil',
        },
        alto: {
          natural: 'Contrachapado 10mm (~25€) - Premium con acabado natural',
          cualquiera: 'Metacrilato 3mm (~25€) - Acabado profesional',
        },
      };

      return {
        recommendation: recommendations[budgetLevel][finish],
        alternatives: Object.values(recommendations[budgetLevel]),
      };

    case 'validateDesign':
      const { fileFormat, hasVectors, hasMeasurements } = args;
      const validFormats = ['.dxf', '.dwg', '.ai', '.svg'];
      const isValid = validFormats.some((f) => fileFormat.toLowerCase().includes(f));

      let issues = [];
      if (!isValid) issues.push('Formato no compatible. Usa .dxf o .dwg');
      if (!hasVectors) issues.push('Necesitas vectores cerrados');
      if (!hasMeasurements) issues.push('Añade medidas en cm');

      return {
        isValid: isValid && hasVectors && hasMeasurements,
        issues,
        needsDesignService: !isValid || !hasVectors,
        designServiceCost: 25,
      };

    case 'consultHoldedData':
      // Nota: Esta función consulta datos en el contexto del servidor/llamada async
      // Por ahora retornaremos una indicación de que los datos históricos deben consultarse
      return {
        success: true,
        message: 'Consulta de Holded en progreso',
        note: 'El agente puede usar getHoldedQuotes() para obtener datos históricos de presupuestos',
        suggestion: 'Consulta el componente HoldedKnowledge para ver datos históricos visualizados',
      };

    default:
      return { success: false, message: 'Tool no reconocida' };
  }
}