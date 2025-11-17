/**
 * Sistema de Memoria Contextual para el Agente de IA
 * Gestiona preferencias, patrones y contexto histórico del usuario
 */

import { supabase, isSupabaseConfigured } from './supabase';

// ============ TIPOS ============

export interface UserPreferences {
  // Márgenes preferidos
  preferredMarginMin: number; // Margen mínimo aceptable (default: 30%)
  preferredMarginTarget: number; // Margen objetivo (default: 40%)

  // Materiales favoritos
  favoriteMaterials: string[]; // ['DM 5mm', 'Metacrilato 3mm']

  // Ubicación por defecto
  defaultLocation: string; // 'Madrid' o 'Barcelona'

  // Configuración de precios
  customPriceMultiplier: number; // Multiplicador de precios (default: 1.0)

  // Comportamiento del agente
  autoCalculateMargins: boolean; // Calcular márgenes automáticamente
  showDetailedAnalysis: boolean; // Mostrar análisis detallado
  proactiveSuggestions: boolean; // Sugerencias proactivas
}

export interface BudgetPattern {
  // Patrones de presupuestos recurrentes
  clientName: string;
  averageTicket: number; // Ticket promedio
  commonMaterials: string[]; // Materiales más usados
  averageMargin: number; // Margen promedio
  totalBudgets: number; // Total de presupuestos generados
  conversionRate: number; // Tasa de conversión (0-100%)
  lastInteraction: string; // Fecha última interacción
}

export interface SessionContext {
  // Contexto de la sesión actual
  sessionId: string;
  startTime: string;
  budgetsCreated: number;
  questionsAsked: string[]; // Preguntas que ya hizo el agente
  topicsDiscussed: string[]; // Temas discutidos
  userIntent: string; // Intención del usuario detectada
  currentFocus: string; // Foco actual de la conversación
}

export interface AIMemory {
  userId: string;
  preferences: UserPreferences;
  patterns: BudgetPattern[];
  sessionContext: SessionContext;
  lastUpdated: string;
}

// ============ PREFERENCIAS POR DEFECTO ============

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredMarginMin: 30,
  preferredMarginTarget: 40,
  favoriteMaterials: [],
  defaultLocation: 'Madrid',
  customPriceMultiplier: 1.0,
  autoCalculateMargins: true,
  showDetailedAnalysis: true,
  proactiveSuggestions: true,
};

// ============ CLASE DE MEMORIA ============

export class AIMemoryManager {
  private userId: string;
  private memory: AIMemory;
  private storageKey: string;

  constructor(userId: string = 'demo-user') {
    this.userId = userId;
    this.storageKey = `ai_memory_${userId}`;
    this.memory = this.loadFromLocalStorage() || this.createNewMemory();
  }

  // ========== INICIALIZACIÓN ==========

  private createNewMemory(): AIMemory {
    return {
      userId: this.userId,
      preferences: DEFAULT_PREFERENCES,
      patterns: [],
      sessionContext: this.createNewSession(),
      lastUpdated: new Date().toISOString(),
    };
  }

  private createNewSession(): SessionContext {
    return {
      sessionId: `session_${Date.now()}`,
      startTime: new Date().toISOString(),
      budgetsCreated: 0,
      questionsAsked: [],
      topicsDiscussed: [],
      userIntent: 'unknown',
      currentFocus: 'general',
    };
  }

  // ========== PERSISTENCIA ==========

  private loadFromLocalStorage(): AIMemory | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const memory = JSON.parse(stored);
        // Crear nueva sesión si han pasado más de 2 horas
        const lastSession = new Date(memory.sessionContext.startTime);
        const hoursSinceLastSession = (Date.now() - lastSession.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastSession > 2) {
          memory.sessionContext = this.createNewSession();
        }

        return memory;
      }
    } catch (error) {
      console.error('Error cargando memoria:', error);
    }
    return null;
  }

  private saveToLocalStorage(): void {
    try {
      this.memory.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
    } catch (error) {
      console.error('Error guardando memoria:', error);
    }
  }

  async saveToSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado, solo guardando en localStorage');
      return false;
    }

    try {
      // Guardar en tabla ai_memory (necesitarás crear esta tabla)
      const { error } = await supabase
        .from('ai_memory')
        .upsert({
          user_id: this.userId,
          preferences: this.memory.preferences,
          patterns: this.memory.patterns,
          session_context: this.memory.sessionContext,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error guardando en Supabase:', error);
      return false;
    }
  }

  // ========== PREFERENCIAS ==========

  getPreferences(): UserPreferences {
    return { ...this.memory.preferences };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.memory.preferences = { ...this.memory.preferences, ...updates };
    this.saveToLocalStorage();
  }

  // ========== PATRONES ==========

  addOrUpdatePattern(pattern: BudgetPattern): void {
    const existingIndex = this.memory.patterns.findIndex(
      p => p.clientName.toLowerCase() === pattern.clientName.toLowerCase()
    );

    if (existingIndex >= 0) {
      this.memory.patterns[existingIndex] = pattern;
    } else {
      this.memory.patterns.push(pattern);
    }

    this.saveToLocalStorage();
  }

  getPatternForClient(clientName: string): BudgetPattern | null {
    return this.memory.patterns.find(
      p => p.clientName.toLowerCase() === clientName.toLowerCase()
    ) || null;
  }

  getTopPatterns(limit: number = 5): BudgetPattern[] {
    return [...this.memory.patterns]
      .sort((a, b) => b.totalBudgets - a.totalBudgets)
      .slice(0, limit);
  }

  // ========== ANÁLISIS DE PATRONES ==========

  analyzeUserBehavior(budgets: any[]): {
    avgMargin: number;
    mostUsedMaterials: string[];
    avgTicket: number;
    preferredLocation: string;
  } {
    if (budgets.length === 0) {
      return {
        avgMargin: 35,
        mostUsedMaterials: [],
        avgTicket: 0,
        preferredLocation: this.memory.preferences.defaultLocation,
      };
    }

    // Calcular margen promedio, materiales más usados, etc.
    const margins: number[] = [];
    const materials: { [key: string]: number } = {};
    const locations: { [key: string]: number } = {};
    let totalAmount = 0;

    budgets.forEach(budget => {
      if (budget.items && budget.items.length > 0) {
        budget.items.forEach((item: any) => {
          // Extraer materiales del concepto/descripción
          const text = `${item.concept} ${item.description}`.toLowerCase();

          ['dm', 'metacrilato', 'contrachapado', 'cartón gris'].forEach(mat => {
            if (text.includes(mat.toLowerCase())) {
              materials[mat] = (materials[mat] || 0) + 1;
            }
          });

          totalAmount += item.pricePerUnit * item.quantity;
        });
      }

      if (budget.clientLocation) {
        locations[budget.clientLocation] = (locations[budget.clientLocation] || 0) + 1;
      }
    });

    // Material más usado
    const mostUsedMaterials = Object.entries(materials)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([mat]) => mat);

    // Ubicación preferida
    const preferredLocation = Object.entries(locations)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || this.memory.preferences.defaultLocation;

    return {
      avgMargin: 35, // Calculado desde los datos reales si tienes costes
      mostUsedMaterials,
      avgTicket: totalAmount / budgets.length,
      preferredLocation,
    };
  }

  // ========== CONTEXTO DE SESIÓN ==========

  getSessionContext(): SessionContext {
    return { ...this.memory.sessionContext };
  }

  updateSessionContext(updates: Partial<SessionContext>): void {
    this.memory.sessionContext = { ...this.memory.sessionContext, ...updates };
    this.saveToLocalStorage();
  }

  recordQuestion(question: string): void {
    if (!this.memory.sessionContext.questionsAsked.includes(question)) {
      this.memory.sessionContext.questionsAsked.push(question);
      this.saveToLocalStorage();
    }
  }

  hasAskedQuestion(question: string): boolean {
    return this.memory.sessionContext.questionsAsked.includes(question);
  }

  recordTopic(topic: string): void {
    if (!this.memory.sessionContext.topicsDiscussed.includes(topic)) {
      this.memory.sessionContext.topicsDiscussed.push(topic);
      this.saveToLocalStorage();
    }
  }

  incrementBudgetsCreated(): void {
    this.memory.sessionContext.budgetsCreated += 1;
    this.saveToLocalStorage();
  }

  // ========== GENERACIÓN DE CONTEXTO PARA IA ==========

  generateContextForAI(): string {
    const prefs = this.memory.preferences;
    const patterns = this.getTopPatterns(3);
    const session = this.memory.sessionContext;

    let context = `\n# MEMORIA Y CONTEXTO DEL USUARIO\n\n`;

    // Preferencias
    context += `## Preferencias del Usuario:\n`;
    context += `- Margen mínimo aceptable: ${prefs.preferredMarginMin}%\n`;
    context += `- Margen objetivo: ${prefs.preferredMarginTarget}%\n`;
    context += `- Ubicación por defecto: ${prefs.defaultLocation}\n`;

    if (prefs.favoriteMaterials.length > 0) {
      context += `- Materiales favoritos: ${prefs.favoriteMaterials.join(', ')}\n`;
    }

    // Patrones de clientes frecuentes
    if (patterns.length > 0) {
      context += `\n## Clientes Frecuentes:\n`;
      patterns.forEach(p => {
        context += `- ${p.clientName}: ${p.totalBudgets} presupuestos, ticket promedio ${p.averageTicket.toFixed(2)}€, margen promedio ${p.averageMargin}%\n`;
      });
    }

    // Contexto de sesión
    context += `\n## Contexto de Sesión:\n`;
    context += `- Presupuestos creados en esta sesión: ${session.budgetsCreated}\n`;
    context += `- Intención del usuario: ${session.userIntent}\n`;
    context += `- Foco actual: ${session.currentFocus}\n`;

    if (session.topicsDiscussed.length > 0) {
      context += `- Temas ya discutidos: ${session.topicsDiscussed.join(', ')}\n`;
      context += `  → NO repitas información sobre estos temas a menos que el usuario lo pida.\n`;
    }

    if (session.questionsAsked.length > 0) {
      context += `- Preguntas ya realizadas: ${session.questionsAsked.join(', ')}\n`;
      context += `  → NO vuelvas a preguntar lo mismo.\n`;
    }

    // Instrucciones basadas en preferencias
    context += `\n## Instrucciones Adaptadas:\n`;
    if (prefs.autoCalculateMargins) {
      context += `- SIEMPRE calcula y muestra márgenes automáticamente\n`;
    }
    if (prefs.proactiveSuggestions) {
      context += `- Sé EXTRA proactivo con sugerencias de mejora\n`;
    }
    if (prefs.showDetailedAnalysis) {
      context += `- Proporciona análisis detallado de rentabilidad\n`;
    }

    return context;
  }

  // ========== RESETEAR SESIÓN ==========

  resetSession(): void {
    this.memory.sessionContext = this.createNewSession();
    this.saveToLocalStorage();
  }

  // ========== OBTENER TODA LA MEMORIA ==========

  getMemory(): AIMemory {
    return { ...this.memory };
  }
}

// ============ INSTANCIA SINGLETON ============

let memoryInstance: AIMemoryManager | null = null;

export function getAIMemoryInstance(userId: string = 'demo-user'): AIMemoryManager {
  if (!memoryInstance || memoryInstance['userId'] !== userId) {
    memoryInstance = new AIMemoryManager(userId);
  }
  return memoryInstance;
}

// ============ UTILIDADES ============

/**
 * Detecta la intención del usuario basándose en el mensaje
 */
export function detectUserIntent(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('presupuesto') || lowerMessage.includes('quote')) {
    return 'create_budget';
  }
  if (lowerMessage.includes('modifica') || lowerMessage.includes('cambia') || lowerMessage.includes('actualiza')) {
    return 'modify_budget';
  }
  if (lowerMessage.includes('elimina') || lowerMessage.includes('borra')) {
    return 'delete_item';
  }
  if (lowerMessage.includes('margen') || lowerMessage.includes('rentabilidad')) {
    return 'analyze_margin';
  }
  if (lowerMessage.includes('recomienda') || lowerMessage.includes('suger')) {
    return 'get_recommendation';
  }

  return 'general_question';
}

/**
 * Extrae temas del mensaje del usuario
 */
export function extractTopics(message: string): string[] {
  const topics: string[] = [];
  const lowerMessage = message.toLowerCase();

  const topicKeywords = {
    'materiales': ['material', 'dm', 'metacrilato', 'contrachapado', 'cartón'],
    'corte': ['corte', 'láser', 'tiempo'],
    'diseño': ['diseño', 'cad', 'dxf'],
    'precios': ['precio', 'coste', 'margen'],
    'ubicación': ['madrid', 'barcelona', 'ubicación'],
  };

  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      topics.push(topic);
    }
  });

  return topics;
}
