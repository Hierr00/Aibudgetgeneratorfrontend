import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type ChatMessageRow = Database['public']['Tables']['chat_messages']['Row'];
type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert'];

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Convertir de formato Supabase a formato App
const fromSupabaseMessage = (row: ChatMessageRow): Message => ({
  id: row.id,
  role: row.role as 'user' | 'assistant',
  content: row.content,
  timestamp: new Date(row.created_at),
});

// Convertir de formato App a formato Supabase
const toSupabaseMessage = (message: Partial<Message>, budgetId: string): Partial<ChatMessageInsert> => ({
  budget_id: budgetId,
  role: message.role,
  content: message.content,
});

export function useChatMessages(budgetId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar mensajes del presupuesto
  const loadMessages = async () => {
    if (!budgetId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado, usando mensajes locales');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('budget_id', budgetId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const loadedMessages = (data || []).map(fromSupabaseMessage);
      setMessages(loadedMessages);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Añadir un nuevo mensaje
  const addMessage = async (message: Omit<Message, 'id' | 'timestamp'>): Promise<Message | null> => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado');
      // Crear mensaje local temporal
      const localMessage: Message = {
        id: `local-${Date.now()}`,
        ...message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, localMessage]);
      return localMessage;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('chat_messages')
        .insert([toSupabaseMessage(message, budgetId)])
        .select()
        .single();

      if (insertError) throw insertError;

      const newMessage = fromSupabaseMessage(data);
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      console.error('Error añadiendo mensaje:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    }
  };

  // Añadir múltiples mensajes (útil para conversaciones)
  const addMessages = async (newMessages: Omit<Message, 'id' | 'timestamp'>[]): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado');
      // Crear mensajes locales temporales
      const localMessages: Message[] = newMessages.map((msg, index) => ({
        id: `local-${Date.now()}-${index}`,
        ...msg,
        timestamp: new Date(),
      }));
      setMessages(prev => [...prev, ...localMessages]);
      return true;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('chat_messages')
        .insert(newMessages.map(msg => toSupabaseMessage(msg, budgetId)))
        .select();

      if (insertError) throw insertError;

      const addedMessages = (data || []).map(fromSupabaseMessage);
      setMessages(prev => [...prev, ...addedMessages]);
      return true;
    } catch (err) {
      console.error('Error añadiendo mensajes:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  // Eliminar todos los mensajes de un presupuesto
  const clearMessages = async (): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase no configurado');
      setMessages([]);
      return true;
    }

    try {
      const { error: deleteError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('budget_id', budgetId);

      if (deleteError) throw deleteError;

      setMessages([]);
      return true;
    } catch (err) {
      console.error('Error eliminando mensajes:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  // Actualizar mensajes manualmente (útil para sincronización)
  const setMessagesManually = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  // Cargar mensajes al cambiar de presupuesto
  useEffect(() => {
    loadMessages();
  }, [budgetId]);

  // Suscribirse a cambios en tiempo real (opcional)
  useEffect(() => {
    if (!isSupabaseConfigured() || !budgetId) return;

    const channel = supabase
      .channel(`chat_messages:${budgetId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `budget_id=eq.${budgetId}`,
        },
        (payload) => {
          console.log('Cambio detectado:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMessage = fromSupabaseMessage(payload.new as ChatMessageRow);
            setMessages(prev => {
              // Evitar duplicados
              if (prev.some(msg => msg.id === newMessage.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [budgetId]);

  return {
    messages,
    loading,
    error,
    addMessage,
    addMessages,
    clearMessages,
    setMessages: setMessagesManually,
    refreshMessages: loadMessages,
  };
}
