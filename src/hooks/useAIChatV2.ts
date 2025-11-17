import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import { useAIMemory } from './useAIMemory';

interface BudgetData {
  id: string;
  budgetNumber: string;
  clientName: string;
  clientLocation: string;
  date: string;
  dueDate: string;
  items: any[];
}

interface UseAIChatOptions {
  budgetData: BudgetData[];
  selectedBudget: number;
  onBudgetUpdate?: (updates: any) => void;
  userId?: string;
}

export function useAIChatV2({
  budgetData,
  selectedBudget,
  onBudgetUpdate,
  userId = 'demo-user'
}: UseAIChatOptions) {
  const [apiKey, setApiKey] = useState<string>('');

  // Inicializar sistema de memoria
  const memory = useAIMemory({ userId, budgets: budgetData });

  // Load API key from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('openai_api_key');
    if (stored) setApiKey(stored);
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: {
      budgetData: budgetData[selectedBudget],
      apiKey: apiKey,
      memoryContext: memory.getContextForAI(), // Añadir contexto de memoria
    },
    onError(error) {
      console.error('❌ Chat error:', error);
    },
    onFinish(message) {
      console.log('✅ Message finished', message);

      // Parse tool results from message
      if (message.toolInvocations) {
        message.toolInvocations.forEach((invocation) => {
          if (invocation.state === 'result' && invocation.result) {
            console.log('🔧 Tool result:', invocation.toolName, invocation.result);

            // Handle budget updates
            if (onBudgetUpdate && invocation.result.budgetUpdate) {
              onBudgetUpdate(invocation.result.budgetUpdate);
            }

            // Registrar cuando se crea un presupuesto
            if (invocation.toolName === 'createCompleteBudget' || invocation.toolName === 'addBudgetItem') {
              memory.recordBudgetCreated();
            }
          }
        });
      }
    },
  });

  // Registrar mensaje del usuario cuando cambia el input
  const handleSubmitWithMemory = (e: React.FormEvent<HTMLFormElement>) => {
    if (input.trim()) {
      memory.recordUserMessage(input);
    }
    handleSubmit(e);
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleSubmitWithMemory,
    isLoading,
    error,
    apiKey,
    setApiKey,
    memory, // Exportar memoria para uso externo si es necesario
  };
}
