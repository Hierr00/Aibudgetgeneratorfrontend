# Integración con Holded - Guía Completa

## ✅ Estado Actual

La integración con Holded está completamente configurada y lista para usar. Se implementaron dos enfoques complementarios:

### 1. **Crear Presupuestos en Holded** (Exportación)
- Botón "Add to Holded" en el sidebar
- Crea automáticamente **presupuestos (estimate)** en Holded
- Los presupuestos se aprueban automáticamente y son visibles inmediatamente
- Crea contactos automáticamente si no existen

### 2. **Conocimiento desde Holded** (Importación de datos)
- Componente "HoldedKnowledge" que analiza presupuestos históricos
- Muestra estadísticas: total de presupuestos, ingresos, servicios frecuentes
- El agente AI puede consultar estos datos para mejorar recomendaciones

---

## 🔧 Configuración

### API Key de Holded
Ya configurada en variables de entorno:
```
HOLDED_API_KEY=889b6326128fbf4b744ba709773af53f
```

### Endpoints Utilizados

**Para crear presupuestos:**
```
POST https://api.holded.com/api/invoicing/v1/documents/estimate
```

**Para obtener presupuestos:**
```
GET https://api.holded.com/api/invoicing/v1/documents/estimate
```

---

## 📋 Formato de Datos

### Crear Presupuesto (Estimate)

**Campos obligatorios:**
- `date`: timestamp en SEGUNDOS (integer) - ⚠️ Muy importante: usar segundos, no milisegundos
- `items`: array de productos/servicios
- `contactName` o `contactId`: identificación del cliente
- `approveDoc`: true (para que sea visible inmediatamente)

**Campos opcionales:**
- `contactEmail`: email del cliente
- `desc`: notas/descripción del presupuesto

**Formato de items:**
```json
{
  "name": "Servicio Corte Láser",
  "desc": "Precio €/min de corte",
  "units": 10,
  "price": 0.8,
  "tax": 21,
  "discount": 0
}
```

### Ejemplo completo:
```json
{
  "contactName": "Cliente Ejemplo",
  "contactEmail": "cliente@ejemplo.com",
  "date": 1730592000,
  "approveDoc": true,
  "desc": "Presupuesto 001 - Corte Láser",
  "items": [
    {
      "name": "Servicio Corte Láser",
      "desc": "10 minutos a 0,8€/min",
      "units": 10,
      "price": 0.8,
      "tax": 21,
      "discount": 0
    },
    {
      "name": "Material DM 3mm",
      "desc": "Plancha 100x80cm",
      "units": 1,
      "price": 9,
      "tax": 21,
      "discount": 0
    }
  ]
}
```

---

## 🧪 Cómo Probar

### 1. Probar Conexión
En el sidebar izquierdo, dentro del componente "Holded Debug":
1. Click en "Probar Conexión"
2. Deberías ver: "✅ API conectada - X contactos encontrados"
3. Si falla, revisa la consola del navegador para logs detallados

### 2. Consultar Presupuestos Históricos
En el componente "Holded Knowledge":
1. Click en "Cargar Datos"
2. Se analizarán todos los presupuestos de Holded
3. Verás:
   - Total de presupuestos e ingresos
   - Servicios más frecuentes
   - Últimos 5 presupuestos

### 3. Crear Presupuesto en Holded
1. Crea un presupuesto usando el agente AI o manualmente
2. Asegúrate de tener al menos:
   - Nombre del cliente
   - Al menos 1 item con concepto, precio y cantidad
3. Click en "Add to Holded" (botón en el sidebar)
4. Verás una notificación de éxito o error
5. **Verifica en Holded**: Ve a **Facturación → Presupuestos** (no "Pedidos de venta")
6. Revisa la consola del navegador para logs detallados

---

## 🐛 Debugging

### Logs Detallados

Toda la comunicación con Holded está loggeada:

**En el servidor (Supabase Functions):**
- `📤 Holded API Request Body`: Datos enviados a Holded
- `📞 Holded API Request`: Método y endpoint
- `✅ Holded API Response`: Respuesta exitosa
- `❌ Holded API Error`: Errores con código de estado

**En el cliente (consola del navegador):**
- `📋 Budget data being sent`: Datos del presupuesto antes de enviar
- `📤 Sending budget to Holded`: Inicio del proceso
- `✅ Quote created in Holded`: Presupuesto creado exitosamente
- `❌ Error completo al crear presupuesto`: Error detallado

### Errores Comunes

**400 Bad Request - "Wrong date":**
- ⚠️ La fecha debe estar en **segundos** (Unix timestamp), no milisegundos
- El servidor ahora convierte automáticamente: DD/MM/YYYY → timestamp en segundos
- Si envías `Date.now()`, divídelo por 1000: `Math.floor(Date.now() / 1000)`

**400 Bad Request - otros:**
- Revisa que todos los items tengan `name`, `units`, `price`, `tax`
- Asegúrate de incluir `contactName` o `contactId`

**401 Unauthorized:**
- La API key no es válida o ha expirado
- Verifica `HOLDED_API_KEY` en variables de entorno

**Presupuesto creado pero no visible:**
- ✅ Ahora se incluye `approveDoc: true` automáticamente
- Busca en: **Facturación → Presupuestos** (no en "Pedidos de venta")

---

## 🔍 Verificar Presupuestos en Holded

Después de crear un presupuesto:
1. Ve a https://app.holded.com
2. Navega a **"Facturación" → "Presupuestos"** (NO "Pedidos de venta")
3. Busca el presupuesto recién creado
4. Verifica que todos los datos sean correctos
5. El documento debe estar **aprobado** y visible inmediatamente

---

## 💡 Tips

- **Nombres de contacto únicos**: Si usas el mismo nombre, Holded creará contactos duplicados
- **Usar email**: Si proporcionas `contactEmail`, Holded puede identificar contactos existentes
- **IVA**: Por defecto es 21%, pero puedes cambiarlo según el tipo de servicio
- **Descuentos**: El campo `discount` acepta un porcentaje (0-100)
- **Notas**: El campo `desc` es opcional pero útil para contexto adicional

---

## 📊 Estructura de Archivos

```
/lib/holded.ts                    # Cliente frontend (llamadas a API)
/supabase/functions/server/
  ├── index.tsx                   # Endpoints del servidor
  └── holded.tsx                  # Lógica de integración con Holded
/components/
  ├── HoldedButton.tsx           # Botón para crear presupuestos
  ├── HoldedDebug.tsx            # Componente de debug
  └── HoldedKnowledge.tsx        # Análisis de datos históricos
```

---

## ✨ Features Implementadas

- [x] Conexión con API de Holded
- [x] Crear presupuestos (estimate)
- [x] Obtener presupuestos históricos
- [x] Crear/buscar contactos automáticamente
- [x] Logging detallado para debugging
- [x] Manejo de errores robusto
- [x] Componente de visualización de datos
- [x] Integración con agente AI

---

## 📞 Soporte

Si encuentras errores:
1. Revisa la consola del navegador
2. Revisa los logs de Supabase Functions
3. Verifica que la API key sea válida en Holded
4. Comprueba el formato de datos según la documentación oficial

**Documentación oficial de Holded:**
https://developers.holded.com/reference