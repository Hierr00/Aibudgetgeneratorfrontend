import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Proactive AI prompt - estilo Cursor
const PROACTIVE_SYSTEM_PROMPT = `Eres Fin, el asistente inteligente de presupuestos de Arkcutt.

# TU MISIÓN
No solo respondes preguntas - GUÍAS activamente al usuario para crear presupuestos rentables y profesionales.
Como Cursor para presupuestos: anticipas necesidades, haces las preguntas correctas, validas números.

# INFORMACIÓN DE ARKCUTT
📍 Ubicaciones:
  • Madrid: C. de las Hileras, 18
  • Barcelona: Carrer de la ciutat d'asunción, 16

💰 Servicios:
  • Corte Láser CO2: 0,80€/min
  • Diseño CAD (.dxf): 25€

🎯 Materiales (100x80cm):
  • DM: 3mm(9€) | 5mm(12€) | 10mm(20€) | 19mm(35€)
  • Contrachapado: 3mm(10€) | 5mm(15€) | 10mm(25€) | 15mm(35€)
  • Metacrilato: 3mm(25€) | 5mm(40€) | 8mm(30€)
  • Cartón Gris: 2mm(5€) | 3mm(7€)

# COMPORTAMIENTO PROACTIVO Y ANÁLISIS AUTOMÁTICO

🔍 **SIEMPRE ANALIZA AUTOMÁTICAMENTE** (en cada interacción):
1. **Usa analyzeBudgetHealth** cuando haya items en el presupuesto
2. **Usa calculateMargin** para CADA línea nueva que agregues
3. **Usa suggestPriceOptimization** si detectas margen < 25%
4. **Usa compareWithSimilarBudgets** después de crear presupuesto completo
5. **Usa predictBudgetConversion** para estimar probabilidad de cierre

❗ **NO PREGUNTES** si debes analizar - HAZLO AUTOMÁTICAMENTE

🎯 **VALIDACIONES CRÍTICAS** (en cada interacción):
1. ¿Qué datos CRÍTICOS faltan?
2. ¿El margen es rentable? (mín 30% recomendado) → Si no, usa suggestPriceOptimization
3. ¿Hay errores de pricing obvios? → Analiza con analyzeBudgetHealth
4. ¿El cliente entiende todos los costes?
5. ¿El ticket es suficiente? (mín 50€)

❓ **PREGUNTA ESTRATÉGICAMENTE**:
- "¿Cuántas unidades necesitas?" → Afecta descuentos
- "¿Tienes el archivo .dxf?" → +25€ si no
- "¿Material propio o lo suministramos?" → Afecta margen
- "¿Recogida o envío?" → Logística
- "¿Plazo de entrega?" → Urgencia = premium

💡 **SUGIERE MEJORAS**:
- "Con 10 unidades te sale 15% más barato"
- "DM 5mm es más resistente y solo 3€ más"
- "Este presupuesto tiene margen bajo (18%), ¿subimos cantidad de corte?"

⚠️ **VALIDA VIABILIDAD**:
- Tiempo de corte realista (10x10cm simple ≈ 2-5min)
- Precio competitivo pero rentable
- Especificaciones claras

🎯 **USA TOOLS PROACTIVAMENTE**:
- Cuando tengas TODOS los datos → createCompleteBudget automáticamente
- NO preguntes "¿quieres que lo cree?" → ¡HAZLO!
- Informa al usuario: "✅ Presupuesto creado con 4 conceptos"

# CHAIN OF THOUGHT (importante)
Cuando proceses solicitudes complejas, usa pasos mentales:

1. **Analizar**: ¿Qué me está pidiendo?
2. **Identificar gaps**: ¿Qué falta?
3. **Calcular**: Tiempos, costes, márgenes
4. **Proponer**: Mejor opción + alternativas
5. **Ejecutar**: Crear presupuesto

# MÁRGENES Y PRICING
- Coste corte: 0,80€/min (fijo)
- Diseño CAD: 25€ (fijo)
- Material: Precio coste + 20-40% margen
- **SIEMPRE** menciona el margen al usuario: "Margen de esta línea: 35%"

# EJEMPLOS DE RESPUESTAS PROACTIVAS

❌ MAL (reactivo):
User: "Necesito un presupuesto"
Bot: "Claro, ¿qué necesitas?"

✅ BIEN (proactivo):
User: "Necesito un presupuesto"
Bot: "¡Perfecto! Para crear el mejor presupuesto necesito:
1. ¿Qué vas a cortar? (dimensiones aprox)
2. ¿Material? (o tienes el tuyo)
3. ¿Cantidad de piezas?
4. ¿Madrid o Barcelona?
5. ¿Tienes archivo .dxf o necesitas diseño?

Mientras me cuentas, te anticipo: corte láser a 0,80€/min, diseño 25€ si hace falta."

# TONO
- Directo pero amigable
- Usa emojis con moderación (✅ ⚠️ 💡)
- Números claros
- "Margen X%" siempre visible

# RECORDATORIO CRÍTICO
🚨 TU TRABAJO NO ES SOLO CREAR PRESUPUESTOS - ES ASEGURAR QUE SEAN RENTABLES, VIABLES Y PROFESIONALES
`;

export async function POST(req: Request) {
  const { messages, data } = await req.json();

  // Get current budget data and memory context from the request
  const currentBudget = data?.budgetData || {
    budgetNumber: "001",
    clientName: "Clientes varios",
    clientLocation: "España",
    date: new Date().toLocaleDateString('es-ES'),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
    items: [],
  };

  // Obtener contexto de memoria del usuario (si está disponible)
  const memoryContext = data?.memoryContext || '';

  // Calcular margen actual de cada item si hay datos
  let itemsWithMargins = '';
  if (currentBudget.items && currentBudget.items.length > 0) {
    itemsWithMargins = currentBudget.items.map((item: any, i: number) => {
      const subtotal = item.price * item.quantity;

      // Estimar coste (esto se puede mejorar con datos reales)
      // Por ahora, asumimos un margen del 35% para mostrar el concepto
      const estimatedCost = subtotal * 0.65;
      const estimatedMargin = ((subtotal - estimatedCost) / subtotal * 100).toFixed(1);

      return `${i + 1}. ${item.concept}: ${item.quantity} × ${item.price}€ = ${subtotal.toFixed(2)}€ (IVA: ${item.ivaRate}%, Margen estimado: ${estimatedMargin}%)`;
    }).join('\n');
  }

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    system: `${PROACTIVE_SYSTEM_PROMPT}

# ESTADO ACTUAL DEL PRESUPUESTO
Cliente: ${currentBudget.clientName}
Número: ${currentBudget.budgetNumber}
Ubicación: ${currentBudget.clientLocation}
Fecha: ${currentBudget.date}
Vencimiento: ${currentBudget.dueDate}
Items actuales: ${currentBudget.items.length}

${currentBudget.items && currentBudget.items.length > 0 ? `
Conceptos (con márgenes):
${itemsWithMargins}
` : 'Sin items todavía - perfecto momento para crear uno completo.'}

${memoryContext}`,
    tools: {
      updateBudgetInfo: tool({
        description: 'Actualiza información general del presupuesto (cliente, ubicación, fechas)',
        parameters: z.object({
          clientName: z.string().optional().describe('Nombre del cliente'),
          clientLocation: z.string().optional().describe('Ubicación: Madrid o Barcelona'),
          date: z.string().optional().describe('Fecha del presupuesto DD/MM/YYYY'),
          dueDate: z.string().optional().describe('Fecha de vencimiento DD/MM/YYYY'),
        }),
        execute: async ({ clientName, clientLocation, date, dueDate }) => {
          const updates: any = {};
          if (clientName) updates.clientName = clientName;
          if (clientLocation) updates.clientLocation = clientLocation;
          if (date) updates.date = date;
          if (dueDate) updates.dueDate = dueDate;

          return {
            success: true,
            message: `✅ Info actualizada`,
            updates,
          };
        },
      }),

      createCompleteBudget: tool({
        description: 'Crea presupuesto completo con TODOS los conceptos. USA ESTA herramienta cuando tengas toda la información necesaria.',
        parameters: z.object({
          clientName: z.string().optional().describe('Nombre del cliente'),
          clientLocation: z.string().optional().describe('Madrid o Barcelona'),
          items: z.array(z.object({
            concept: z.string().describe('Nombre del concepto (ej: "Servicio Corte Láser")'),
            description: z.string().describe('Descripción detallada'),
            price: z.number().describe('Precio unitario SIN IVA'),
            quantity: z.number().describe('Cantidad de unidades'),
            ivaRate: z.number().describe('Tasa IVA: 21, 10, 4 o 0'),
          })).describe('Lista completa de conceptos del presupuesto'),
        }),
        execute: async ({ clientName, clientLocation, items }) => {
          const itemsWithIds = items.map((item, i) => ({
            id: `${Date.now()}-${i}`,
            ...item,
          }));

          return {
            success: true,
            message: `✅ Presupuesto creado con ${items.length} conceptos`,
            items: itemsWithIds,
            clientName,
            clientLocation,
          };
        },
      }),

      addBudgetItem: tool({
        description: 'Añade UN concepto adicional al presupuesto existente',
        parameters: z.object({
          concept: z.string().describe('Nombre del concepto'),
          description: z.string().describe('Descripción detallada'),
          price: z.number().describe('Precio unitario SIN IVA'),
          quantity: z.number().describe('Cantidad'),
          ivaRate: z.number().describe('21, 10, 4 o 0'),
        }),
        execute: async ({ concept, description, price, quantity, ivaRate }) => {
          const subtotal = price * quantity;
          const iva = subtotal * (ivaRate / 100);
          const total = subtotal + iva;

          return {
            success: true,
            message: `✅ Añadido: ${concept}`,
            item: {
              id: Date.now().toString(),
              concept,
              description,
              price,
              quantity,
              ivaRate,
            },
            calculations: {
              subtotal: subtotal.toFixed(2),
              iva: iva.toFixed(2),
              total: total.toFixed(2),
            },
          };
        },
      }),

      updateBudgetItem: tool({
        description: 'Modifica un concepto existente en el presupuesto',
        parameters: z.object({
          itemIndex: z.number().describe('Índice del item (0 = primero)'),
          concept: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          quantity: z.number().optional(),
          ivaRate: z.number().optional(),
        }),
        execute: async ({ itemIndex, concept, description, price, quantity, ivaRate }) => {
          const updates: any = {};
          if (concept !== undefined) updates.concept = concept;
          if (description !== undefined) updates.description = description;
          if (price !== undefined) updates.price = price;
          if (quantity !== undefined) updates.quantity = quantity;
          if (ivaRate !== undefined) updates.ivaRate = ivaRate;

          return {
            success: true,
            message: `✅ Item ${itemIndex + 1} actualizado`,
            itemIndex,
            updates,
          };
        },
      }),

      removeBudgetItem: tool({
        description: 'Elimina un concepto del presupuesto',
        parameters: z.object({
          itemIndex: z.number().describe('Índice del item a eliminar (0 = primero)'),
        }),
        execute: async ({ itemIndex }) => {
          return {
            success: true,
            message: `✅ Item ${itemIndex + 1} eliminado`,
            itemIndex,
          };
        },
      }),

      calculateMargin: tool({
        description: 'Calcula el margen de beneficio de una línea de presupuesto comparando precio de venta vs coste',
        parameters: z.object({
          sellPrice: z.number().describe('Precio de venta al cliente (sin IVA)'),
          costPrice: z.number().describe('Precio de coste real'),
          quantity: z.number().default(1).describe('Cantidad de unidades'),
        }),
        execute: async ({ sellPrice, costPrice, quantity }) => {
          const totalSell = sellPrice * quantity;
          const totalCost = costPrice * quantity;
          const profit = totalSell - totalCost;
          const marginPercent = ((profit / totalSell) * 100).toFixed(1);

          let assessment = '';
          const margin = parseFloat(marginPercent);
          if (margin < 20) assessment = '⚠️ Margen bajo - poco rentable';
          else if (margin < 30) assessment = '💡 Margen aceptable';
          else if (margin < 50) assessment = '✅ Margen bueno';
          else assessment = '🎯 Margen excelente';

          return {
            success: true,
            sellPrice: totalSell.toFixed(2),
            costPrice: totalCost.toFixed(2),
            profit: profit.toFixed(2),
            marginPercent,
            assessment,
            message: `${assessment} | Margen: ${marginPercent}% (${profit.toFixed(2)}€ beneficio)`,
          };
        },
      }),

      estimateCuttingTime: tool({
        description: 'Estima tiempo de corte láser según dimensiones y complejidad del diseño',
        parameters: z.object({
          width: z.number().describe('Ancho en cm'),
          height: z.number().describe('Alto en cm'),
          complexity: z.enum(['simple', 'medio', 'complejo']).describe('Complejidad del diseño'),
          quantity: z.number().describe('Número de piezas'),
        }),
        execute: async ({ width, height, complexity, quantity }) => {
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
            success: true,
            timePerPiece: timePerPiece.toFixed(1),
            totalTime,
            totalCost: cost.toFixed(2),
            pricePerMinute: 0.8,
            message: `⏱️ ${totalTime}min total (${timePerPiece.toFixed(1)}min/pieza) = ${cost.toFixed(2)}€`,
          };
        },
      }),

      recommendMaterial: tool({
        description: 'Recomienda material según uso y presupuesto del cliente',
        parameters: z.object({
          usage: z.string().describe('Para qué lo va a usar el cliente'),
          budget: z.enum(['bajo', 'medio', 'alto']).describe('Rango de presupuesto'),
          finish: z.enum(['natural', 'cualquiera']).describe('¿Prefiere acabado natural de madera?'),
        }),
        execute: async ({ usage, budget, finish }) => {
          const recommendations: any = {
            bajo: {
              natural: { material: 'DM 3mm', price: 9, reason: 'Económico y funcional' },
              cualquiera: { material: 'Cartón Gris 2mm', price: 5, reason: 'Ideal para prototipos' },
            },
            medio: {
              natural: { material: 'Contrachapado 3mm', price: 10, reason: 'Buen acabado con vetas naturales' },
              cualquiera: { material: 'DM 5mm', price: 12, reason: 'Resistente y versátil' },
            },
            alto: {
              natural: { material: 'Contrachapado 10mm', price: 25, reason: 'Premium, acabado natural superior' },
              cualquiera: { material: 'Metacrilato 3mm', price: 25, reason: 'Acabado profesional transparente/color' },
            },
          };

          const rec = recommendations[budget][finish];

          return {
            success: true,
            recommendation: `${rec.material} (${rec.price}€) - ${rec.reason}`,
            price: rec.price,
            material: rec.material,
            message: `💡 Recomiendo ${rec.material} (${rec.price}€): ${rec.reason}`,
          };
        },
      }),

      validateBudgetViability: tool({
        description: 'Valida que un presupuesto sea viable económicamente y tenga sentido comercial',
        parameters: z.object({
          totalSellPrice: z.number().describe('Precio total de venta (sin IVA)'),
          estimatedCosts: z.number().describe('Costes estimados totales'),
        }),
        execute: async ({ totalSellPrice, estimatedCosts }) => {
          const profit = totalSellPrice - estimatedCosts;
          const margin = ((profit / totalSellPrice) * 100).toFixed(1);
          const marginNum = parseFloat(margin);

          let issues: string[] = [];
          let suggestions: string[] = [];

          if (marginNum < 15) {
            issues.push('⚠️ Margen muy bajo (<15%) - No rentable');
            suggestions.push('Aumentar precio de venta o reducir costes');
          } else if (marginNum < 25) {
            issues.push('💡 Margen justo (15-25%) - Poco margen de error');
            suggestions.push('Considerar aumentar un 10-15% para mayor seguridad');
          }

          if (totalSellPrice < 30) {
            issues.push('⚠️ Ticket bajo (<30€) - Coste administrativo alto');
            suggestions.push('Pedido mínimo recomendado: 50€');
          }

          const assessment =
            marginNum >= 30 ? '✅ Presupuesto viable y rentable' :
            marginNum >= 20 ? '💡 Presupuesto aceptable con precaución' :
            '⚠️ Presupuesto poco viable';

          return {
            success: true,
            margin,
            profit: profit.toFixed(2),
            assessment,
            issues,
            suggestions,
            message: `${assessment} | Margen: ${margin}%`,
          };
        },
      }),

      calculateBudget: tool({
        description: 'Calcula el total del presupuesto actual con todos los conceptos',
        parameters: z.object({}),
        execute: async () => {
          let baseImponible = 0;
          let totalIVA = 0;

          currentBudget.items.forEach((item: any) => {
            const subtotal = item.price * item.quantity;
            const iva = subtotal * (item.ivaRate / 100);
            baseImponible += subtotal;
            totalIVA += iva;
          });

          const total = baseImponible + totalIVA;

          return {
            success: true,
            message: `💰 Total: ${total.toFixed(2)}€ (Base: ${baseImponible.toFixed(2)}€ + IVA: ${totalIVA.toFixed(2)}€)`,
            calculations: {
              baseImponible: baseImponible.toFixed(2),
              totalIVA: totalIVA.toFixed(2),
              total: total.toFixed(2),
              itemCount: currentBudget.items.length,
            },
          };
        },
      }),

      analyzeBudgetHealth: tool({
        description: 'Analiza la salud financiera del presupuesto completo y proporciona insights accionables',
        parameters: z.object({
          includeRecommendations: z.boolean().default(true).describe('Incluir recomendaciones de mejora'),
        }),
        execute: async ({ includeRecommendations }) => {
          if (currentBudget.items.length === 0) {
            return {
              success: false,
              message: 'No hay items para analizar',
            };
          }

          let totalSell = 0;
          let totalCost = 0;
          let lowMarginItems = 0;
          let itemsWithoutDesign = 0;

          currentBudget.items.forEach((item: any) => {
            const sell = item.price * item.quantity;
            const cost = sell * 0.65; // Estimación 35% margen
            totalSell += sell;
            totalCost += cost;

            const itemMargin = ((sell - cost) / sell) * 100;
            if (itemMargin < 25) lowMarginItems++;

            if (item.concept.toLowerCase().includes('corte') &&
                !item.concept.toLowerCase().includes('diseño')) {
              itemsWithoutDesign++;
            }
          });

          const profit = totalSell - totalCost;
          const margin = (profit / totalSell) * 100;

          const issues: string[] = [];
          const recommendations: string[] = [];

          // Análisis de margen
          if (margin < 20) {
            issues.push('⚠️ Margen global muy bajo (<20%)');
            recommendations.push('Aumenta precios un 15-20% o reduce costes');
          } else if (margin < 30) {
            issues.push('💡 Margen justo (20-30%)');
            recommendations.push('Considera aumentar margen objetivo al 35-40%');
          }

          // Análisis de ticket mínimo
          if (totalSell < 50) {
            issues.push('⚠️ Ticket por debajo del mínimo (50€)');
            recommendations.push('Añade servicios complementarios o establece pedido mínimo');
          }

          // Análisis de items con bajo margen
          if (lowMarginItems > 0) {
            issues.push(`💡 ${lowMarginItems} items con margen bajo (<25%)`);
            recommendations.push('Revisa pricing de items individuales');
          }

          // Oportunidades de upsell
          if (itemsWithoutDesign > 0) {
            recommendations.push('Pregunta si necesitan diseño CAD (+25€)');
          }

          const hasMaterial = currentBudget.items.some((item: any) =>
            ['dm', 'metacrilato', 'contrachapado', 'material'].some(mat =>
              item.concept.toLowerCase().includes(mat)
            )
          );

          if (!hasMaterial) {
            recommendations.push('¿El cliente necesita suministro de material?');
          }

          return {
            success: true,
            analysis: {
              totalSell: totalSell.toFixed(2),
              totalCost: totalCost.toFixed(2),
              profit: profit.toFixed(2),
              margin: margin.toFixed(1),
              health: margin >= 30 ? 'Saludable' : margin >= 20 ? 'Aceptable' : 'Crítico',
            },
            issues,
            recommendations: includeRecommendations ? recommendations : [],
            message: `📊 Análisis: Margen ${margin.toFixed(1)}% | ${issues.length} puntos de atención | ${recommendations.length} mejoras sugeridas`,
          };
        },
      }),

      suggestPriceOptimization: tool({
        description: 'Sugiere optimizaciones de precio para alcanzar un margen objetivo específico',
        parameters: z.object({
          targetMargin: z.number().describe('Margen objetivo deseado (%)'),
          currentPrice: z.number().describe('Precio actual total'),
          currentCost: z.number().describe('Coste actual total'),
        }),
        execute: async ({ targetMargin, currentPrice, currentCost }) => {
          // Calcular precio necesario para alcanzar el margen objetivo
          // Fórmula: PrecioObjetivo = Coste / (1 - MargenObjetivo/100)
          const targetPrice = currentCost / (1 - targetMargin / 100);
          const priceIncrease = targetPrice - currentPrice;
          const percentageIncrease = (priceIncrease / currentPrice) * 100;

          const currentMargin = ((currentPrice - currentCost) / currentPrice) * 100;

          return {
            success: true,
            current: {
              price: currentPrice.toFixed(2),
              cost: currentCost.toFixed(2),
              margin: currentMargin.toFixed(1),
            },
            target: {
              price: targetPrice.toFixed(2),
              margin: targetMargin.toFixed(1),
              increase: priceIncrease.toFixed(2),
              percentageIncrease: percentageIncrease.toFixed(1),
            },
            message: `💡 Para alcanzar margen del ${targetMargin}%, aumenta el precio de ${currentPrice.toFixed(2)}€ a ${targetPrice.toFixed(2)}€ (+${percentageIncrease.toFixed(1)}%)`,
          };
        },
      }),

      predictBudgetConversion: tool({
        description: 'Predice la probabilidad de conversión basándose en características del presupuesto',
        parameters: z.object({
          budgetAmount: z.number().describe('Monto total del presupuesto'),
          clientType: z.enum(['new', 'returning', 'unknown']).describe('Tipo de cliente'),
          responseTime: z.enum(['fast', 'normal', 'slow']).describe('Rapidez de respuesta'),
        }),
        execute: async ({ budgetAmount, clientType, responseTime }) => {
          // Algoritmo simple de predicción basado en reglas
          let baseConversion = 40; // Base 40%

          // Ajuste por monto
          if (budgetAmount < 100) baseConversion += 15; // Tickets pequeños convierten más
          else if (budgetAmount > 500) baseConversion -= 10; // Tickets grandes menos

          // Ajuste por tipo de cliente
          if (clientType === 'returning') baseConversion += 20;
          else if (clientType === 'new') baseConversion -= 5;

          // Ajuste por tiempo de respuesta
          if (responseTime === 'fast') baseConversion += 15;
          else if (responseTime === 'slow') baseConversion -= 20;

          // Limitar entre 10-90%
          const conversionRate = Math.max(10, Math.min(90, baseConversion));

          const recommendations: string[] = [];

          if (conversionRate < 40) {
            recommendations.push('⚠️ Probabilidad baja - Considera añadir urgencia o descuento limitado');
          }
          if (responseTime === 'slow') {
            recommendations.push('⏰ Responde rápido para aumentar conversión (+15%)');
          }
          if (clientType === 'returning') {
            recommendations.push('✅ Cliente recurrente - Alta probabilidad de cierre');
          }

          return {
            success: true,
            conversionRate: conversionRate.toFixed(0),
            confidence: 'medium',
            recommendations,
            message: `🎯 Probabilidad de conversión estimada: ${conversionRate.toFixed(0)}%`,
          };
        },
      }),

      compareWithSimilarBudgets: tool({
        description: 'Compara el presupuesto actual con presupuestos similares históricos',
        parameters: z.object({
          currentAmount: z.number().describe('Monto del presupuesto actual'),
        }),
        execute: async ({ currentAmount }) => {
          // Simulación de datos históricos (en producción vendría de Supabase/Holded)
          const historicalAverage = 250; // Promedio histórico simulado
          const historicalRange = { min: 80, max: 600 };

          const vsAverage = ((currentAmount - historicalAverage) / historicalAverage) * 100;

          let positioning = '';
          if (currentAmount < historicalRange.min) positioning = 'por debajo del rango típico';
          else if (currentAmount > historicalRange.max) positioning = 'por encima del rango típico';
          else if (vsAverage > 20) positioning = 'significativamente mayor que el promedio';
          else if (vsAverage < -20) positioning = 'significativamente menor que el promedio';
          else positioning = 'dentro del rango esperado';

          return {
            success: true,
            comparison: {
              current: currentAmount.toFixed(2),
              average: historicalAverage.toFixed(2),
              difference: vsAverage.toFixed(1),
              positioning,
            },
            insights: [
              vsAverage > 20
                ? '💡 Oportunidad grande - Asegura que el cliente vea el valor'
                : '✅ Ticket en rango normal',
              currentAmount < historicalRange.min
                ? '⚠️ Ticket bajo - Considera servicios adicionales'
                : '',
            ].filter(Boolean),
            message: `📊 Este presupuesto está ${positioning} (${vsAverage > 0 ? '+' : ''}${vsAverage.toFixed(1)}% vs promedio)`,
          };
        },
      }),
    },
    onFinish: ({ response }) => {
      console.log('✅ Chat response finished');
    },
  });

  return result.toDataStreamResponse();
}
