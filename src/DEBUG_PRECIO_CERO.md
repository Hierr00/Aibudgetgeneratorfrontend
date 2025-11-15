# 🔍 Debug: Precio 0€ en Holded

## ✅ Cambios Aplicados

1. **Cuenta contable configurada**: `salesAccountId: '70500000'` (Prestaciones de servicios)
2. **Logging mejorado**: Ahora se muestra cada paso de transformación de datos
3. **Hover eliminado**: Botón "Add to Holded" sin efectos de hover

## 🧪 Cómo Diagnosticar el Problema

### Paso 1: Abre la Consola del Navegador

**Chrome/Edge**: F12 → Pestaña "Console"
**Firefox**: F12 → Pestaña "Consola"

### Paso 2: Crea un Presupuesto de Prueba

Usa el agente AI o llena manualmente:
```
Cliente: Test Cliente
Servicio: Corte Láser
Cantidad: 10 minutos
Precio por unidad: 0.66€
```

### Paso 3: Busca Estos Logs en la Consola

#### A) Transformación de Items

```javascript
🔍 Processing item: Servicio Corte Láser
   - Original quantity: 10, parsed: 10
   - Original pricePerUnit: 0.66, price: undefined, parsed: 0.66
   - Final price to send: 0.66
   ✓ Holded item created: {
     "name": "Servicio Corte Láser",
     "desc": "...",
     "units": 10,
     "price": 0.66,  // ❓ ¿Este valor es correcto?
     "tax": 21,
     "discount": 0,
     "salesAccountId": "70500000"
   }
```

**Verifica:**
- ✅ ¿El campo `price` tiene un valor diferente de 0?
- ✅ ¿El campo `units` es correcto?

#### B) Payload Final Enviado a Holded

```javascript
📤 Final estimate payload: {
  "date": 1730592000,
  "items": [
    {
      "name": "Servicio Corte Láser",
      "units": 10,
      "price": 0.66,  // ❓ ¿Se está enviando correctamente?
      "tax": 21,
      "discount": 0,
      "salesAccountId": "70500000"
    }
  ],
  "approveDoc": true,
  "contactName": "Test Cliente"
}
```

**Verifica:**
- ✅ ¿El array `items` contiene objetos con `price` > 0?
- ✅ ¿El campo `salesAccountId` es "70500000"?

#### C) Respuesta de Holded

```javascript
✅ Holded API Response: {
  "_id": "abc123xyz",
  "items": [
    {
      "name": "Servicio Corte Láser",
      "units": 10,
      "price": 0.66,  // ❓ ¿Holded recibió el precio?
      ...
    }
  ],
  "subtotal": 6.6,  // ❓ ¿Se calculó correctamente?
  "total": 7.99,    // ❓ ¿Con IVA del 21%?
  ...
}
```

**Verifica:**
- ✅ ¿El campo `price` en la respuesta es correcto?
- ✅ ¿El `subtotal` y `total` son correctos?

## 🚨 Casos de Error Comunes

### Caso 1: `pricePerUnit` es `undefined`

**Log que verás:**
```
- Original pricePerUnit: undefined, price: undefined, parsed: 0
- Final price to send: 0
```

**Problema:** Los datos del presupuesto no tienen el campo `pricePerUnit`

**Solución:** Revisa cómo el agente AI está creando los items. Debe incluir:
```typescript
{
  concept: "Servicio Corte Láser",
  quantity: 10,
  pricePerUnit: 0.66,  // ❗️ Este campo es crítico
  description: "..."
}
```

### Caso 2: El precio se envía correctamente pero Holded responde con 0

**Log que verás:**
```
📤 Final estimate payload: { ... "price": 0.66 ... }
✅ Holded API Response: { ... "price": 0 ... }
```

**Problema:** Holded no está aceptando el precio (posible problema con `salesAccountId`)

**Solución:**
1. Verifica que `salesAccountId: '70500000'` sea correcto
2. Usa el botón "Ver Cuentas" en Holded Debug para confirmar el ID
3. Puede que Holded requiera otros campos como `productId`

### Caso 3: El precio se redondea a 0

**Log que verás:**
```
- Original pricePerUnit: 0.001, price: undefined, parsed: 0.001
- Final price to send: 0
```

**Problema:** El precio es demasiado pequeño (< 0.01)

**Solución:** Los precios deben ser >= 0.01€ (1 céntimo)

## 📋 Checklist de Verificación

Después de crear un presupuesto, marca cada punto:

- [ ] El log muestra `pricePerUnit` con valor > 0
- [ ] El log muestra `Final price to send` con valor > 0
- [ ] El payload a Holded incluye `"price": X.XX` (no 0)
- [ ] El payload incluye `"salesAccountId": "70500000"`
- [ ] La respuesta de Holded incluye `"subtotal"` con valor > 0
- [ ] El presupuesto en Holded muestra el precio correcto

## 🆘 Si Todo Falla

Si después de verificar los logs el precio sigue siendo 0:

1. **Copia el log completo** del payload enviado a Holded
2. **Copia la respuesta completa** de Holded
3. **Toma captura** del presupuesto en Holded
4. Comparte estos datos para diagnosticar el problema

## 💡 Próximo Paso

**Crea un presupuesto ahora** y pégame los logs que aparecen en la consola.
Especialmente necesito ver:
- El log `🔍 Processing item`
- El log `📤 Final estimate payload`
- El log `✅ Holded API Response`
