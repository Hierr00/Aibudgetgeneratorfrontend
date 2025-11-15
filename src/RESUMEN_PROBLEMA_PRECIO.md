# 🔴 Resumen: Problema de Precio 0€ en Holded

## Estado Actual

✅ **Cambios Aplicados:**
1. Hover effect eliminado del botón "Add to Holded"
2. Campo `account` configurado con el ID: `'63a451ceb78ca14e470ecfd3'`
3. Logging exhaustivo agregado en servidor y frontend

❌ **Problema Persistente:**
- Los presupuestos se crean en Holded con `price: 0` en todos los items
- El `subtotal` y `total` son 0€

## Datos Observados

### Frontend → Servidor ✅
Los datos SE ENVÍAN correctamente desde el frontend:
```json
{
  "items": [
    {
      "concept": "Servicio Corte Láser",
      "pricePerUnit": 2.66,
      "quantity": 37.44
    },
    {
      "concept": "Tablero DM",
      "pricePerUnit": 34.17,
      "quantity": 1
    }
  ]
}
```

### Servidor → Holded ❓
**DESCONOCIDO** - Necesitamos ver los logs del servidor

### Holded Responde ❌
La respuesta de Holded muestra:
```json
{
  "products": [
    {
      "name": "Servicio Corte Láser",
      "price": 0,  // ❌ Debería ser 2.66
      "units": 37.44,
      "account": "63a451ceb78ca14e470ecfd3"
    }
  ],
  "subtotal": 0,
  "total": 0
}
```

## Hipótesis

### Hipótesis 1: El Precio Se Pierde en el Servidor ❓
**Evidencia:** No hemos visto los logs del servidor  
**Solución:** Ver logs de Supabase Edge Functions

### Hipótesis 2: Holded Rechaza el Precio ❓
**Evidencia:** El precio se envía correctamente pero Holded lo resetea a 0  
**Posibles causas:**
- Formato incorrecto del precio
- Campo `account` incorrecto (aunque ya aparece en la respuesta)
- Falta algún campo requerido (productId, sku, etc.)
- Restricciones de la cuenta de Holded

### Hipótesis 3: Bug en la API de Holded ❓
**Evidencia:** Poco probable, pero posible  
**Solución:** Revisar documentación oficial o contactar soporte

## Logs Críticos Que Necesitamos

### Del Servidor (Supabase Edge Functions):

```
🔍 Processing item: Servicio Corte Láser
   - Original pricePerUnit: 2.66
   - Final price to send: 2.66

📦 Transformed items: [...]

📤 Holded API Request Body: {
  "date": ...,
  "items": [
    {
      "name": "...",
      "price": ???,  // ❓ ¿Qué valor tiene aquí?
      "units": ...,
      ...
    }
  ]
}

✅ Holded API Response: {
  "products": [
    {
      "price": 0  // ❌ Holded devuelve 0
    }
  ]
}
```

## Acción Inmediata Requerida

**Por favor, sigue estos pasos:**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Menú izquierdo → "Edge Functions"
4. Busca tu función (puede aparecer como "server" o similar)
5. Click en ella
6. Pestaña "Logs" (arriba)
7. **Crea un nuevo presupuesto**
8. En los logs, busca las líneas que empiezan con:
   - `🔍 Processing item:`
   - `📦 Transformed items:`
   - `📤 Holded API Request Body:`
   - `✅ Holded API Response:`

9. **Copia y pega TODOS esos logs aquí**

## Plan de Acción Según Logs

### Si el precio es correcto en el Request Body:
→ El problema está en cómo Holded procesa los datos  
→ Necesitamos revisar la documentación de Holded  
→ Posiblemente falta un campo requerido

### Si el precio es 0 en el Request Body:
→ El problema está en la transformación del servidor  
→ Necesitamos depurar la línea `const price = Number(item.pricePerUnit) || Number(item.price) || 0;`  
→ Revisar por qué `item.pricePerUnit` no se está capturando

## Documentación de Referencia

**API de Holded para Documentos:**
https://api.holded.com/api/invoicing/v1/documents/estimate

**Campos de Item según documentación:**
```typescript
{
  name: string;        // ✅ Enviamos
  desc: string;        // ✅ Enviamos
  units: number;       // ✅ Enviamos
  price: number;       // ✅ Enviamos (pero llega 0)
  tax: number;         // ✅ Enviamos
  discount: number;    // ✅ Enviamos
  account?: string;    // ✅ Enviamos
  productId?: string;  // ❓ ¿Requerido?
  sku?: string;        // ❓ ¿Requerido?
}
```

## Siguiente Paso

**LOGS DEL SERVIDOR → AQUÍ** 🎯

Sin esos logs, no podemos avanzar. Es la pieza crítica que falta.
