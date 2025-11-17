import { useState, useEffect, useCallback } from 'react';
import {
  AIMemoryManager,
  getAIMemoryInstance,
  UserPreferences,
  BudgetPattern,
  SessionContext,
  detectUserIntent,
  extractTopics,
} from '../lib/aiMemory';
import type { BudgetData } from './useBudgets';

interface UseAIMemoryOptions {
  userId?: string;
  budgets?: BudgetData[]; // Para analizar patrones
}

export function useAIMemory({ userId = 'demo-user', budgets = [] }: UseAIMemoryOptions = {}) {
  const [memoryManager] = useState<AIMemoryManager>(() => getAIMemoryInstance(userId));
  const [preferences, setPreferences] = useState<UserPreferences>(
    memoryManager.getPreferences()
  );
  const [sessionContext, setSessionContext] = useState<SessionContext>(
    memoryManager.getSessionContext()
  );
  const [patterns, setPatterns] = useState<BudgetPattern[]>([]);

  // ========== SINCRONIZAR CON MEMORIA ==========

  const syncFromMemory = useCallback(() => {
    setPreferences(memoryManager.getPreferences());
    setSessionContext(memoryManager.getSessionContext());
    setPatterns(memoryManager.getTopPatterns(10));
  }, [memoryManager]);

  useEffect(() => {
    syncFromMemory();
  }, [syncFromMemory]);

  // ========== ANALIZAR PATRONES DE PRESUPUESTOS ==========

  useEffect(() => {
    if (budgets.length > 0) {
      const behavior = memoryManager.analyzeUserBehavior(budgets);

      // Actualizar preferencias basadas en comportamiento
      const updates: Partial<UserPreferences> = {};

      if (behavior.mostUsedMaterials.length > 0) {
        updates.favoriteMaterials = behavior.mostUsedMaterials;
      }

      if (behavior.preferredLocation) {
        updates.defaultLocation = behavior.preferredLocation;
      }

      if (Object.keys(updates).length > 0) {
        memoryManager.updatePreferences(updates);
        syncFromMemory();
      }

      // Crear/actualizar patrones por cliente
      const clientGroups = groupBudgetsByClient(budgets);
      Object.entries(clientGroups).forEach(([clientName, clientBudgets]) => {
        const pattern = analyzeClientPattern(clientName, clientBudgets);
        memoryManager.addOrUpdatePattern(pattern);
      });

      syncFromMemory();
    }
  }, [budgets, memoryManager, syncFromMemory]);

  // ========== ACTUALIZAR PREFERENCIAS ==========

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    memoryManager.updatePreferences(updates);
    syncFromMemory();
  }, [memoryManager, syncFromMemory]);

  // ========== CONTEXTO DE SESIÓN ==========

  const updateSessionContext = useCallback((updates: Partial<SessionContext>) => {
    memoryManager.updateSessionContext(updates);
    syncFromMemory();
  }, [memoryManager, syncFromMemory]);

  const recordUserMessage = useCallback((message: string) => {
    // Detectar intención
    const intent = detectUserIntent(message);
    memoryManager.updateSessionContext({ userIntent: intent });

    // Extraer y registrar temas
    const topics = extractTopics(message);
    topics.forEach(topic => memoryManager.recordTopic(topic));

    syncFromMemory();
  }, [memoryManager, syncFromMemory]);

  const recordBudgetCreated = useCallback(() => {
    memoryManager.incrementBudgetsCreated();
    syncFromMemory();
  }, [memoryManager, syncFromMemory]);

  const recordQuestion = useCallback((question: string) => {
    memoryManager.recordQuestion(question);
    syncFromMemory();
  }, [memoryManager, syncFromMemory]);

  const hasAskedQuestion = useCallback((question: string): boolean => {
    return memoryManager.hasAskedQuestion(question);
  }, [memoryManager]);

  // ========== OBTENER CONTEXTO PARA IA ==========

  const getContextForAI = useCallback((): string => {
    return memoryManager.generateContextForAI();
  }, [memoryManager]);

  // ========== PATRONES DE CLIENTE ==========

  const getPatternForClient = useCallback((clientName: string): BudgetPattern | null => {
    return memoryManager.getPatternForClient(clientName);
  }, [memoryManager]);

  // ========== RESETEAR SESIÓN ==========

  const resetSession = useCallback(() => {
    memoryManager.resetSession();
    syncFromMemory();
  }, [memoryManager, syncFromMemory]);

  // ========== GUARDAR EN SUPABASE ==========

  const saveToCloud = useCallback(async (): Promise<boolean> => {
    return await memoryManager.saveToSupabase();
  }, [memoryManager]);

  // ========== OBTENER MEMORIA COMPLETA ==========

  const getMemory = useCallback(() => {
    return memoryManager.getMemory();
  }, [memoryManager]);

  return {
    // Estado
    preferences,
    sessionContext,
    patterns,

    // Métodos de actualización
    updatePreferences,
    updateSessionContext,

    // Métodos de registro
    recordUserMessage,
    recordBudgetCreated,
    recordQuestion,
    hasAskedQuestion,

    // Contexto para IA
    getContextForAI,

    // Patrones
    getPatternForClient,

    // Utilidades
    resetSession,
    saveToCloud,
    getMemory,
  };
}

// ========== UTILIDADES ==========

/**
 * Agrupa presupuestos por cliente
 */
function groupBudgetsByClient(budgets: BudgetData[]): Record<string, BudgetData[]> {
  const groups: Record<string, BudgetData[]> = {};

  budgets.forEach(budget => {
    const clientName = budget.clientName || 'Sin cliente';
    if (!groups[clientName]) {
      groups[clientName] = [];
    }
    groups[clientName].push(budget);
  });

  return groups;
}

/**
 * Analiza el patrón de un cliente específico
 */
function analyzeClientPattern(clientName: string, budgets: BudgetData[]): BudgetPattern {
  let totalAmount = 0;
  const materials: { [key: string]: number } = {};

  budgets.forEach(budget => {
    if (budget.items) {
      budget.items.forEach(item => {
        totalAmount += item.pricePerUnit * item.quantity;

        // Detectar materiales
        const text = `${item.concept} ${item.description}`.toLowerCase();
        ['dm', 'metacrilato', 'contrachapado', 'cartón gris'].forEach(mat => {
          if (text.includes(mat.toLowerCase())) {
            materials[mat] = (materials[mat] || 0) + 1;
          }
        });
      });
    }
  });

  const avgTicket = budgets.length > 0 ? totalAmount / budgets.length : 0;
  const commonMaterials = Object.entries(materials)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([mat]) => mat);

  return {
    clientName,
    averageTicket: avgTicket,
    commonMaterials,
    averageMargin: 35, // Estimado (podrías calcularlo si tienes costes)
    totalBudgets: budgets.length,
    conversionRate: 0, // Esto requeriría datos de conversión
    lastInteraction: budgets[budgets.length - 1]?.date || new Date().toISOString(),
  };
}
