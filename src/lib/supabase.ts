import { createClient } from '@supabase/supabase-js';

// Tipos de la base de datos
export interface Database {
  public: {
    Tables: {
      budgets: {
        Row: {
          id: string;
          name: string;
          budget_number: string;
          client_name: string;
          client_location: string;
          date: string;
          due_date: string;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['budgets']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['budgets']['Insert']>;
      };
      budget_items: {
        Row: {
          id: string;
          budget_id: string;
          concept: string;
          description: string;
          price_per_unit: number;
          quantity: number;
          iva_rate: number;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['budget_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['budget_items']['Insert']>;
      };
      chat_messages: {
        Row: {
          id: string;
          budget_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chat_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>;
      };
    };
  };
}

// Configuración de Supabase
// Nota: En este entorno, las variables deben estar definidas directamente
const getEnvVar = (key: string): string => {
  // Intentar diferentes formas de acceder a las variables de entorno
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as any)[key] || '';
  }
  // Fallback: intentar desde window (si las variables fueron inyectadas)
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key] || '';
  }
  return '';
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 'https://adejrhkdujjbwmyhpsxt.supabase.co';
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZWpyaGtkdWpqYndteWhwc3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTYzMDUsImV4cCI6MjA3ODM5MjMwNX0.gfkZ_-DAqyO9tnv62pvO4brLON4TD8jpeq5BoFxl1_0';

// Cliente de Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};