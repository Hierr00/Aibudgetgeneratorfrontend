import { useState, useCallback, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface BudgetData {
  budgetNumber: string;
  clientName: string;
  clientLocation: string;
  date: string;
  dueDate: string;
  items: Array<{
    id: string;
    concept: string;
    description: string;
    price: number; // Precio por unidad
    quantity: number;
    ivaRate: number;
  }>;
}

interface UseOpenAIChatOptions {
  apiKey: string;
  budgetData?: BudgetData;
  onBudgetUpdate?: (updates: Partial<BudgetData>) => void;
  onItemAdd?: (item: any) => void;
  onItemUpdate?: (index: number, updates: any) => void;
  onItemRemove?: (index: number) => void;
  externalMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
}

const SYSTEM_PROMPT = `Eres Fin, el asistente de IA de Arkcutt especializado en presupuestos de corte láser con CO2.

===== INFORMACIÓN DE ARKCUTT =====
Empresa: Arkcutt
Servicio: Corte láser de precisión con CO2
Tarifa: 0,8€/minuto de corte (más material y variables adicionales)
Tiempo de validación: Máximo 24 horas laborables (L-V, 9:00-18:00h)

UBICACIONES Y HORARIOS:
- Madrid: C. de las Hileras, 18, Centro, 28013 Madrid | L-V: 9:00-18:00h
- Barcelona: Carrer de la ciutat d'asunció, 16, San Andrés de Palomar, 08030 Barcelona | L-V: 9:00-18:00h

===== MATERIALES DISPONIBLES =====
Si el cliente elige que Arkcutt proporcione el material:

1. DM (Densidad Media)
   - Grosores: 3mm, 5mm, 10mm, 19mm
   - Características: Económico, superficie lisa, sin vetas
   - Ideal para: Prototipos, pruebas, proyectos sin acabado natural

2. Madera de Contrachapado
   - Grosores: 3mm, 5mm, 10mm, 15mm
   - Características: Resistente, acabado natural con vetas
   - Ideal para: Maquetas, productos finales, proyectos con acabado visto

3. Madera de Balsa
   - Limitación: Máximo 10x100 cm por plancha
   - Características: Muy ligera, fácil manipulación
   - Ideal para: Proyectos pequeños, maquetas de aeromodelismo

4. Metacrilato
   - Grosores: 3mm, 5mm, 8mm
   - Colores: Transparente y varios colores
   - Características: Acabado premium, alta calidad visual
   - Ideal para: Señalética, displays, proyectos premium

5. Cartón Gris
   - Grosores: 2mm, 3mm
   - Características: Asequible, ligero
   - Ideal para: Pruebas rápidas, modelos de concepto, prototipos económicos

Si el cliente aporta su propio material:
- DEBE ser compatible con corte láser CO2
- Materiales compatibles: Maderas naturales, acrílicos, cartones, textiles, cuero, goma EVA
- Materiales NO compatibles: PVC (gases tóxicos), metales, materiales reflectantes, fibra de vidrio

===== DATOS OBLIGATORIOS PARA PRESUPUESTO =====
Debes recopilar en este orden:

1. CIUDAD (obligatorio)
   - Opciones: Madrid o Barcelona
   - Pregunta: "¿En qué ciudad necesitas el servicio de corte láser: Madrid o Barcelona?"

2. PROVEEDOR DE MATERIAL (obligatorio)
   - Opciones: Cliente o Arkcutt
   - Pregunta: "¿Quién proporcionará el material: lo aportas tú o prefieres que te lo suministremos nosotros?"

3. MATERIAL ESPECÍFICO (obligatorio)
   - Si Arkcutt lo proporciona: Ofrecer lista completa con características
   - Si cliente lo aporta: Verificar compatibilidad con CO2

4. DISEÑO (obligatorio)
   - Opción A: Cliente tiene archivo DXF/DWG vectorizado
   - Opción B: Cliente NO tiene diseño → Servicio de diseño (coste adicional)
   - Requisitos DXF: Medidas en cm, vectores cerrados, capas organizadas (corte exterior, corte interior, grabado, grabado interno)

5. MÉTODO DE ENTREGA (obligatorio)
   - Opción A: Recogida en taller (sin coste, indicar ubicación y horario)
   - Opción B: Envío a domicilio (coste adicional, solicitar dirección completa)

===== TONO Y PERSONALIDAD =====
- Profesional pero cercano, eficiente y servicial
- Amable y paciente
- Claro y directo, evita jerga técnica innecesaria
- Proactivo en identificar necesidades
- Educativo cuando sea necesario
- Usa frases cortas y comprensibles

===== INSTRUCCIONES ESPECÍFICAS =====
1. Cuando el usuario solicite un presupuesto, recopila TODOS los datos obligatorios de forma conversacional
2. Haz preguntas claras y específicas, una a la vez
3. Confirma cada dato antes de continuar
4. Si el cliente menciona un material no disponible, recomienda el más similar de Arkcutt
5. Para materiales del cliente, verifica compatibilidad con CO2
6. Explica que la validación técnica del archivo DXF toma máximo 24h laborables
7. Usa las funciones disponibles para crear el presupuesto con PRECISIÓN TOTAL
8. NO inventes datos - si falta información, pregúntala
9. Siempre confirma antes de añadir o modificar items del presupuesto
10. **MUY IMPORTANTE**: Cuando tengas TODOS los datos obligatorios (ciudad, material, diseño, entrega), usa la función createCompleteBudget para crear el presupuesto COMPLETO de UNA SOLA VEZ con TODOS los conceptos necesarios:
    - Servicio de corte láser: 0.80€/min × minutos estimados
    - Material (si Arkcutt lo proporciona): precio según tipo y dimensiones
    - Diseño CAD (si el cliente NO tiene archivo): 25€
    - Envío (si es a domicilio): coste estimado según ubicación
11. NO uses addBudgetItem para crear presupuestos desde cero - usa createCompleteBudget
12. Cada concepto debe tener descripción específica y completa
13. Los precios deben ser sin IVA (el IVA se calcula aparte con ivaRate)
14. Siempre explica al usuario qué conceptos estás añadiendo y por qué

===== PRECIOS ESTIMADOS DE MATERIALES =====
(Estos son precios de referencia - ajusta según dimensiones reales)

DM (Tablero por 100x80cm aprox):
- 3mm: ~9€
- 5mm: ~12€
- 10mm: ~20€
- 19mm: ~35€

Contrachapado (Tablero por 100x80cm aprox):
- 3mm: ~10€
- 5mm: ~15€
- 10mm: ~25€
- 15mm: ~35€

Metacrilato (Tablero por 100x80cm aprox):
- 3mm transparente: ~25€
- 5mm transparente: ~40€
- 3mm color: ~30€

Cartón Gris (Tablero por 100x80cm aprox):
- 2mm: ~5€
- 3mm: ~7€

Madera de Balsa (por plancha 10x100cm):
- Variable: ~8-15€

SERVICIO DE DISEÑO: 25€ (si el cliente no tiene archivo DXF/DWG)

TIEMPO DE CORTE ESTIMADO:
- Piezas simples pequeñas (10x10cm): 2-5 minutos
- Piezas medianas (30x30cm): 10-20 minutos
- Piezas complejas grandes (100x80cm): 30-60 minutos
(Ajusta según complejidad y detalles)

===== OPCIONES DE IVA =====
21% (estándar - usar por defecto), 10% (reducido), 4% (superreducido), 0% (Exenta)

===== EJEMPLO DE PRESUPUESTO COMPLETO =====
Cuando tengas todos los datos, crea un presupuesto como este ejemplo:

EJEMPLO: Cliente en Madrid, necesita cortar 20 posavasos de 10x10cm en Contrachapado 5mm, tiene archivo DXF, recoge en taller.

Conceptos a incluir:
1. Servicio Corte Láser
   - Descripción: "Precio €/min de corte"
   - Precio: 0.80€
   - Cantidad: 25 minutos (estimado)
   - IVA: 21%

2. Tablero Contrachapado · 100x80cm
   - Descripción: "Grosor · 5mm"
   - Precio: 15.00€
   - Cantidad: 1
   - IVA: 21%

Si necesitara diseño, añadirías:
3. Diseño CAD .dxf
   - Descripción: "Diseño vectorial para corte"
   - Precio: 25.00€
   - Cantidad: 1
   - IVA: 21%

Si necesitara envío, añadirías:
4. Envío a domicilio
   - Descripción: "Envío a [ciudad]"
   - Precio: 8.00€ (estimado)
   - Cantidad: 1
   - IVA: 21%

===== IMPORTANTE =====
- Tu trabajo es la fase PRE-PRODUCCIÓN: recopilar información para generar presupuestos
- NO gestiones seguimiento de pedidos ya confirmados
- NO gestiones incidencias de pedidos recibidos
- Enfócate en crear presupuestos precisos y profesionales
- SIEMPRE usa createCompleteBudget cuando tengas todos los datos
- NO dejes conceptos a medias ni olvides incluir algo
- Verifica que cada precio tenga sentido antes de añadirlo`;

export function useOpenAIChat(options: UseOpenAIChatOptions) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Use external messages if provided, otherwise use internal state
  const messages = options.externalMessages || [];
  
  // Wrapper para setMessages que maneja tanto funciones como valores directos
  const setMessages = useCallback((update: Message[] | ((prev: Message[]) => Message[])) => {
    if (options.onMessagesChange) {
      const newMessages = typeof update === 'function' ? update(messages) : update;
      options.onMessagesChange(newMessages);
    }
  }, [options.onMessagesChange, messages]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const callOpenAI = async (conversationMessages: Message[]) => {
    if (!options.apiKey) {
      throw new Error('API Key de OpenAI no configurada');
    }

    // Preparar mensajes para OpenAI
    const systemMessage = {
      role: 'system',
      content: SYSTEM_PROMPT + `\n\nPRESUPUESTO ACTUAL:\nCliente: ${options.budgetData?.clientName}\nNúmero: ${options.budgetData?.budgetNumber}\nFecha: ${options.budgetData?.date}\nVencimiento: ${options.budgetData?.dueDate}\nItems: ${options.budgetData?.items.length || 0}`
    };

    const apiMessages = [
      systemMessage,
      ...conversationMessages.map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    // Definir funciones disponibles
    const functions = [
      {
        name: 'updateBudgetInfo',
        description: 'Actualiza la información general del presupuesto (cliente, fechas, ubicación)',
        parameters: {
          type: 'object',
          properties: {
            clientName: {
              type: 'string',
              description: 'Nombre del cliente'
            },
            clientLocation: {
              type: 'string',
              description: 'Ubicación del cliente'
            },
            date: {
              type: 'string',
              description: 'Fecha del presupuesto en formato DD/MM/YYYY'
            },
            dueDate: {
              type: 'string',
              description: 'Fecha de vencimiento en formato DD/MM/YYYY'
            }
          }
        }
      },
      {
        name: 'createCompleteBudget',
        description: 'IMPORTANTE: Crea un presupuesto COMPLETO de corte láser con TODOS los conceptos necesarios de UNA SOLA VEZ. Esta función REEMPLAZA todos los items existentes. Úsala cuando tengas TODOS los datos recopilados (ciudad, material, diseño, entrega). Incluye SIEMPRE: 1) Servicio de corte, 2) Material (si Arkcutt lo proporciona), 3) Diseño (si aplica), 4) Envío (si aplica).',
        parameters: {
          type: 'object',
          properties: {
            clientName: {
              type: 'string',
              description: 'Nombre del cliente'
            },
            clientLocation: {
              type: 'string',
              description: 'Ciudad: Madrid o Barcelona'
            },
            items: {
              type: 'array',
              description: 'Array con TODOS los conceptos del presupuesto completo',
              items: {
                type: 'object',
                properties: {
                  concept: {
                    type: 'string',
                    description: 'Nombre exacto (ej: "Servicio Corte Láser", "Tablero DM · 100x80cm", "Diseño CAD .dxf")'
                  },
                  description: {
                    type: 'string',
                    description: 'Descripción específica (ej: "Precio €/min de corte", "Grosor · 3mm", "Diseño vectorial")'
                  },
                  pricePerUnit: {
                    type: 'number',
                    description: 'Precio por unidad SIN IVA en euros (ej: 0.80 para corte, 9.17 para material)'
                  },
                  quantity: {
                    type: 'number',
                    description: 'Cantidad (minutos de corte, unidades de material, etc.)'
                  },
                  ivaRate: {
                    type: 'number',
                    enum: [21, 10, 4, 0],
                    description: 'Porcentaje de IVA (normalmente 21 para servicios)'
                  }
                },
                required: ['concept', 'description', 'pricePerUnit', 'quantity', 'ivaRate']
              }
            }
          },
          required: ['items']
        }
      },
      {
        name: 'addBudgetItem',
        description: 'Añade UN SOLO concepto adicional al presupuesto existente. NO uses esta función para crear presupuestos completos, usa createCompleteBudget en su lugar.',
        parameters: {
          type: 'object',
          properties: {
            concept: {
              type: 'string',
              description: 'Nombre del concepto (ej: "Servicio Corte Láser", "Diseño CAD .dxf")'
            },
            description: {
              type: 'string',
              description: 'Descripción detallada del servicio'
            },
            pricePerUnit: {
              type: 'number',
              description: 'Precio por unidad en euros'
            },
            quantity: {
              type: 'number',
              description: 'Cantidad de unidades'
            },
            ivaRate: {
              type: 'number',
              enum: [21, 10, 4, 0],
              description: 'Porcentaje de IVA'
            }
          },
          required: ['concept', 'description', 'pricePerUnit', 'quantity', 'ivaRate']
        }
      },
      {
        name: 'updateBudgetItem',
        description: 'Modifica un concepto existente en el presupuesto',
        parameters: {
          type: 'object',
          properties: {
            itemIndex: {
              type: 'number',
              description: 'Índice del item (0 para el primero, 1 para el segundo, etc.)'
            },
            concept: {
              type: 'string',
              description: 'Nuevo nombre del concepto'
            },
            description: {
              type: 'string',
              description: 'Nueva descripción'
            },
            pricePerUnit: {
              type: 'number',
              description: 'Nuevo precio por unidad'
            },
            quantity: {
              type: 'number',
              description: 'Nueva cantidad'
            },
            ivaRate: {
              type: 'number',
              enum: [21, 10, 4, 0],
              description: 'Nuevo porcentaje de IVA'
            }
          },
          required: ['itemIndex']
        }
      },
      {
        name: 'removeBudgetItem',
        description: 'Elimina un concepto del presupuesto',
        parameters: {
          type: 'object',
          properties: {
            itemIndex: {
              type: 'number',
              description: 'Índice del item a eliminar (0 para el primero, 1 para el segundo, etc.)'
            }
          },
          required: ['itemIndex']
        }
      },
      {
        name: 'calculateBudgetTotal',
        description: 'Calcula el total del presupuesto con todos los conceptos actuales',
        parameters: {
          type: 'object',
          properties: {}
        }
      }
    ];

    // Llamada a OpenAI
    abortControllerRef.current = new AbortController();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: apiMessages,
        functions: functions,
        function_call: 'auto',
        temperature: 0.7,
        max_tokens: 1000
      }),
      signal: abortControllerRef.current.signal
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error al llamar a OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message;
  };

  const executeFunctionCall = (functionName: string, args: any) => {
    console.log('Executing function:', functionName, args);

    switch (functionName) {
      case 'updateBudgetInfo':
        if (options.onBudgetUpdate) {
          options.onBudgetUpdate(args);
        }
        return { success: true, message: 'Información del presupuesto actualizada' };

      case 'createCompleteBudget':
        // Esta función limpia todos los items existentes y crea el presupuesto completo
        if (args.items && args.items.length > 0) {
          // Primero actualiza la información general si está presente
          if ((args.clientName || args.clientLocation) && options.onBudgetUpdate) {
            const updates: any = {};
            if (args.clientName) updates.clientName = args.clientName;
            if (args.clientLocation) updates.clientLocation = args.clientLocation;
            options.onBudgetUpdate(updates);
          }
          
          // Crear nuevos items con IDs únicos
          const newItems = args.items.map((itemData: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            concept: itemData.concept,
            description: itemData.description,
            price: Number(itemData.price || itemData.pricePerUnit), // Soportar ambos nombres
            quantity: Number(itemData.quantity),
            ivaRate: Number(itemData.ivaRate)
          }));
          
          // Reemplazar todos los items de una vez
          if (options.onBudgetUpdate) {
            options.onBudgetUpdate({
              items: newItems
            } as any);
          }
          
          return { 
            success: true, 
            message: `Presupuesto completo creado con ${args.items.length} conceptos: ${args.items.map((i: any) => i.concept).join(', ')}`,
            itemsCreated: args.items.length
          };
        }
        return { success: false, message: 'No se proporcionaron items para el presupuesto' };

      case 'addBudgetItem':
        if (options.onItemAdd) {
          const item = {
            id: Date.now().toString(),
            concept: args.concept,
            description: args.description,
            price: args.pricePerUnit, // Mapear pricePerUnit a price
            quantity: args.quantity,
            ivaRate: args.ivaRate
          };
          options.onItemAdd(item);
          return { success: true, message: `Item "${args.concept}" añadido` };
        }
        break;

      case 'updateBudgetItem':
        if (options.onItemUpdate) {
          const { itemIndex, ...updates } = args;
          options.onItemUpdate(itemIndex, updates);
          return { success: true, message: `Item ${itemIndex + 1} actualizado` };
        }
        break;

      case 'removeBudgetItem':
        if (options.onItemRemove) {
          options.onItemRemove(args.itemIndex);
          return { success: true, message: `Item ${args.itemIndex + 1} eliminado` };
        }
        break;

      case 'calculateBudgetTotal':
        if (options.budgetData) {
          let baseImponible = 0;
          let totalIVA = 0;

          options.budgetData.items.forEach(item => {
            const subtotal = item.price * item.quantity;
            const iva = subtotal * (item.ivaRate / 100);
            baseImponible += subtotal;
            totalIVA += iva;
          });

          return {
            baseImponible: baseImponible.toFixed(2),
            totalIVA: totalIVA.toFixed(2),
            total: (baseImponible + totalIVA).toFixed(2),
            itemCount: options.budgetData.items.length
          };
        }
        break;
    }
    
    return { success: false, message: 'Función no reconocida' };
  };

  const append = useCallback(async ({ role, content }: { role: 'user' | 'assistant'; content: string }) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationMessages = [...messages, userMessage];
      let assistantResponse = await callOpenAI(conversationMessages);

      // Si hay function call, ejecutarlo y pedir respuesta final
      if (assistantResponse.function_call) {
        const functionName = assistantResponse.function_call.name;
        const functionArgs = JSON.parse(assistantResponse.function_call.arguments);
        
        const functionResult = executeFunctionCall(functionName, functionArgs);

        // Añadir el resultado de la función a la conversación
        const functionMessage = {
          role: 'function' as const,
          name: functionName,
          content: JSON.stringify(functionResult || { success: true })
        };

        // Pedir a OpenAI que genere una respuesta basada en el resultado
        const finalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${options.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...conversationMessages.map(m => ({ role: m.role, content: m.content })),
              { 
                role: 'assistant', 
                content: assistantResponse.content || '',
                function_call: assistantResponse.function_call 
              },
              functionMessage
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        const finalData = await finalResponse.json();
        assistantResponse = finalData.choices[0].message;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse.content || 'Lo siento, no pude procesar esa solicitud.',
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error al llamar a OpenAI:', error);
      
      let errorMessage = 'Lo siento, ha ocurrido un error. ';
      if (error.message.includes('API Key')) {
        errorMessage += 'Por favor, verifica tu API Key de OpenAI.';
      } else if (error.message.includes('quota')) {
        errorMessage += 'Has excedido tu cuota de OpenAI.';
      } else {
        errorMessage += 'Por favor, intenta de nuevo.';
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, options]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setInput('');
    
    await append({ role: 'user', content: userInput });
  }, [input, isLoading, append]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const resetMessages = useCallback(() => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
  }, [setMessages]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    setInput,
    stopGeneration,
    resetMessages,
  };
}