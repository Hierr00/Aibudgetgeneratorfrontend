import { useState, useCallback, useRef } from 'react';
import { generateAIResponse, executeToolCall, type BudgetData, type BudgetItem } from '../lib/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  component?: React.ReactNode;
}

interface UseAIChatOptions {
  apiKey: string;
  budgetData?: BudgetData;
  onBudgetUpdate?: (updates: Partial<BudgetData>) => void;
  onItemAdd?: (item: BudgetItem) => void;
  onItemUpdate?: (index: number, updates: Partial<BudgetItem>) => void;
  onItemRemove?: (index: number) => void;
  externalMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
}

export function useAIChat(options: UseAIChatOptions) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const messages = options.externalMessages || [];

  const setMessages = useCallback(
    (update: Message[] | ((prev: Message[]) => Message[])) => {
      if (options.onMessagesChange) {
        const newMessages = typeof update === 'function' ? update(options.externalMessages || []) : update;
        options.onMessagesChange(newMessages);
      }
    },
    [options.onMessagesChange, options.externalMessages]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const sendMessage = useCallback(async (userContent: string) => {
    if (!options.apiKey) {
      throw new Error('API Key no configurada');
    }

    const currentMessages = options.externalMessages || [];

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
    };

    // Agregar mensaje del usuario inmediatamente
    const messagesWithUser = [...currentMessages, userMessage];
    if (options.onMessagesChange) {
      options.onMessagesChange(messagesWithUser);
    }
    
    setIsLoading(true);

    try {
      const conversationMessages = messagesWithUser.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await generateAIResponse(
        conversationMessages,
        options.apiKey,
        options.budgetData,
        {
          onBudgetUpdate: options.onBudgetUpdate,
          onItemAdd: options.onItemAdd,
          onItemUpdate: options.onItemUpdate,
          onItemRemove: options.onItemRemove,
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };

      // Agregar mensaje del asistente
      const messagesWithAssistant = [...messagesWithUser, assistantMessage];
      if (options.onMessagesChange) {
        options.onMessagesChange(messagesWithAssistant);
      }
    } catch (error: any) {
      console.error('Error en chat:', error);

      let errorMessage = 'Hubo un problema. ';
      
      if (error.message.includes('API key')) {
        errorMessage = 'Tu API Key parece inválida. Verifica la configuración.';
      } else if (error.message.includes('quota') || error.message.includes('Cuota')) {
        errorMessage = 'Has excedido tu cuota de OpenAI. Revisa tu cuenta.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      } else {
        errorMessage = 'Error inesperado. Intenta de nuevo.';
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
      };

      // Agregar mensaje de error
      const messagesWithError = [...messagesWithUser, errorMsg];
      if (options.onMessagesChange) {
        options.onMessagesChange(messagesWithError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [options.apiKey, options.externalMessages, options.onMessagesChange, options.budgetData, options.onBudgetUpdate, options.onItemAdd, options.onItemUpdate, options.onItemRemove]);

  const append = useCallback(
    async ({ role, content }: { role: 'user' | 'assistant'; content: string }) => {
      if (role === 'user') {
        await sendMessage(content);
      }
    },
    [sendMessage]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userInput = input;
      setInput('');

      await sendMessage(userInput);
    },
    [input, isLoading, sendMessage]
  );

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