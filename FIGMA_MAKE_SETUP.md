# 🎨 Guía de Setup para Figma Make

Esta guía te ayudará a integrar todas las mejoras en tu proyecto de Figma Make **sin usar Git Pull**.

---

## 📂 **ARCHIVOS A CREAR EN FIGMA MAKE**

### **Paso 1: Crear Archivos Nuevos**

En Figma Make, crea estos **5 archivos nuevos** con el contenido que se indica:

---

#### **1. `/src/lib/aiMemory.ts`**

```typescript
// Copiar todo el contenido de este archivo desde:
// https://github.com/Hierr00/Aibudgetgeneratorfrontend/blob/claude/enhance-sales-ai-agent-01Hd89K6WjyLweiA73XyU7CN/src/lib/aiMemory.ts

// O copiar desde el proyecto local en la ruta indicada
```

**Cómo hacerlo en Figma Make:**
1. Click en "+" o "New File"
2. Ruta: `src/lib/aiMemory.ts`
3. Copia y pega el contenido completo del archivo

---

#### **2. `/src/hooks/useAIMemory.ts`**

```typescript
// Copiar desde:
// https://github.com/Hierr00/Aibudgetgeneratorfrontend/blob/claude/enhance-sales-ai-agent-01Hd89K6WjyLweiA73XyU7CN/src/hooks/useAIMemory.ts
```

**Cómo hacerlo en Figma Make:**
1. Click en "+" o "New File"
2. Ruta: `src/hooks/useAIMemory.ts`
3. Copia y pega el contenido completo del archivo

---

#### **3. `/src/components/chat/BudgetLineItem.tsx`**

```typescript
// Copiar desde:
// https://github.com/Hierr00/Aibudgetgeneratorfrontend/blob/claude/enhance-sales-ai-agent-01Hd89K6WjyLweiA73XyU7CN/src/components/chat/BudgetLineItem.tsx
```

---

#### **4. `/src/components/chat/BudgetInsightsPanel.tsx`**

```typescript
// Copiar desde:
// https://github.com/Hierr00/Aibudgetgeneratorfrontend/blob/claude/enhance-sales-ai-agent-01Hd89K6WjyLweiA73XyU7CN/src/components/chat/BudgetInsightsPanel.tsx
```

---

#### **5. `/src/components/chat/SmartSuggestions.tsx`**

```typescript
// Copiar desde:
// https://github.com/Hierr00/Aibudgetgeneratorfrontend/blob/claude/enhance-sales-ai-agent-01Hd89K6WjyLweiA73XyU7CN/src/components/chat/SmartSuggestions.tsx
```

---

### **Paso 2: Actualizar Archivos Existentes**

Reemplaza el contenido de estos **3 archivos** con las nuevas versiones:

---

#### **1. `/src/api/chat/route.ts` - ACTUALIZAR**

Reemplazar con:
```typescript
// Copiar desde GitHub el archivo actualizado
```

**Cambios principales:**
- Añadidas 5 nuevas tools (analyzeBudgetHealth, suggestPriceOptimization, etc.)
- Prompt del sistema mejorado
- Contexto de memoria integrado

---

#### **2. `/src/components/chat/BudgetSummaryCard.tsx` - ACTUALIZAR**

Reemplazar con la nueva versión que incluye:
- Visualización de márgenes
- Componente BudgetLineItem
- Panel de análisis de rentabilidad

---

#### **3. `/src/hooks/useAIChatV2.ts` - ACTUALIZAR**

Reemplazar con la nueva versión que incluye:
- Sistema de memoria integrado
- Registro automático de eventos

---

## 🚀 **PROCESO RECOMENDADO**

### **Método A: GitHub Web Interface (Más Fácil)**

1. **Abre GitHub en tu navegador:**
   ```
   https://github.com/Hierr00/Aibudgetgeneratorfrontend/tree/claude/enhance-sales-ai-agent-01Hd89K6WjyLweiA73XyU7CN
   ```

2. **Navega a cada archivo** listado arriba

3. **Click en el botón "Raw"** (esquina superior derecha del código)

4. **Copia todo el contenido** (Ctrl+A → Ctrl+C)

5. **En Figma Make:**
   - Crea el archivo nuevo o abre el existente
   - Pega el contenido
   - Guarda

6. **Repite para los 8 archivos**

---

### **Método B: Desde Terminal Local (Si tienes acceso)**

Si tienes el proyecto local, puedes copiar directamente desde:

```bash
# Ver el contenido de un archivo
cat /home/user/Aibudgetgeneratorfrontend/src/lib/aiMemory.ts

# Copiar al portapapeles (en Linux)
cat /home/user/Aibudgetgeneratorfrontend/src/lib/aiMemory.ts | xclip -selection clipboard

# Copiar al portapapeles (en Mac)
cat /home/user/Aibudgetgeneratorfrontend/src/lib/aiMemory.ts | pbcopy
```

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

Después de copiar todos los archivos, verifica:

- [ ] 5 archivos nuevos creados
- [ ] 3 archivos existentes actualizados
- [ ] No hay errores de TypeScript en Figma Make
- [ ] Los imports se resuelven correctamente
- [ ] La preview se compila sin errores

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Cannot find module"**

**Solución:** Verifica que la ruta del archivo sea exacta:
- ✅ Correcto: `src/lib/aiMemory.ts`
- ❌ Incorrecto: `/src/lib/aiMemory.ts` (barra inicial extra)
- ❌ Incorrecto: `lib/aiMemory.ts` (falta `src`)

### **Error: TypeScript errors**

**Solución:**
1. Guarda todos los archivos
2. Espera a que Figma Make recompile
3. Refresca la página si es necesario

### **Error: "Module not found: BudgetLineItem"**

**Solución:**
1. Asegúrate de haber creado `/src/components/chat/BudgetLineItem.tsx`
2. Verifica que el archivo tenga la exportación: `export function BudgetLineItem(...)`

---

## 📞 **¿NECESITAS AYUDA?**

Si encuentras algún error, dime:
1. El mensaje de error exacto
2. En qué archivo ocurre
3. Captura de pantalla (opcional)

Y te ayudo a solucionarlo paso a paso!
