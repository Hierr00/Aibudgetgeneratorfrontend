-- SCHEMA DE BASE DE DATOS PARA SUPABASE
-- Copiar y ejecutar este SQL en el SQL Editor de Supabase

-- ============================================
-- TABLA: budgets
-- Almacena la información principal de cada presupuesto
-- ============================================
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    budget_number TEXT NOT NULL,
    client_name TEXT NOT NULL DEFAULT 'Clientes varios',
    client_location TEXT NOT NULL DEFAULT 'España',
    date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_created_at ON public.budgets(created_at DESC);

-- ============================================
-- TABLA: budget_items
-- Almacena los items/líneas de cada presupuesto
-- ============================================
CREATE TABLE IF NOT EXISTS public.budget_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
    concept TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price_per_unit DECIMAL(10, 2) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    iva_rate INTEGER NOT NULL DEFAULT 21,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_budget_items_budget_id ON public.budget_items(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_order ON public.budget_items(budget_id, order_index);

-- ============================================
-- TABLA: chat_messages
-- Almacena el historial de chat por presupuesto
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    budget_id UUID NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_chat_messages_budget_id ON public.chat_messages(budget_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(budget_id, created_at);

-- ============================================
-- TRIGGERS: Actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON public.budget_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Importante: Descomentar solo si vas a usar autenticación
-- ============================================

-- Habilitar RLS en las tablas
-- ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso (ejemplo básico - ajustar según necesidades)
-- CREATE POLICY "Users can view their own budgets" ON public.budgets
--     FOR SELECT USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can insert their own budgets" ON public.budgets
--     FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- CREATE POLICY "Users can update their own budgets" ON public.budgets
--     FOR UPDATE USING (auth.uid()::text = user_id);

-- CREATE POLICY "Users can delete their own budgets" ON public.budgets
--     FOR DELETE USING (auth.uid()::text = user_id);

-- Políticas similares para budget_items y chat_messages...

-- ============================================
-- DATOS DE EJEMPLO (opcional)
-- ============================================

-- Insertar un presupuesto de ejemplo
-- INSERT INTO public.budgets (name, budget_number, client_name, client_location, date, due_date, user_id)
-- VALUES ('Presupuesto · 001', '001', 'Cliente Ejemplo', 'Madrid, España', '03/11/2025', '18/11/2025', 'demo-user');

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- SELECT * FROM public.budgets;
-- SELECT * FROM public.budget_items;
-- SELECT * FROM public.chat_messages;
