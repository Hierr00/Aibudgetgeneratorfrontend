typescript
import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';

interface BudgetData {
  // ... (copiar la interfaz completa del archivo actual)
}

interface UseAIChatOptions {
  budgetData: BudgetData[];
  selectedBudget: number;
  onBudgetUpdate?: (updates: any) => void;
}

export function useAIChatV2({ budgetData, selectedBudget, onBudgetUpdate }: UseAIChatOptions) {
  const [apiKey, setApiKey] = useState<string>('');

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
          }
        });
      }
    },
    onError(error) {
      console.error('❌ Chat error:', error);
    },
  });

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    apiKey,
    setApiKey,
  };
}
