# 🧪 Test de Payload a Holded

## Objetivo
Verificar exactamente qué datos se están enviando a la API de Holded.

## Lo Que Deberías Estar Viendo en los Logs del Servidor

Cuando creas un presupuesto, estos son los logs que **DEBERÍAN** aparecer en Supabase Edge Functions:

### 1. Items Procesados
```
🔍 Processing item: Servicio Corte Láser
   - Original quantity: 37.44, parsed: 37.44
   - Original pricePerUnit: 2.66, price: undefined, parsed: 2.66
   - Final price to send: 2.66
   ✓ Holded item created: {
     "name": "Servicio Corte Láser",
     "desc": "Precio €/min de corte",
     "units": 37.44,
     "price": 2.66,
     "tax": 21,
     "discount": 0,
     "account": "63a451ceb78ca14e470ecfd3"
   }
```

### 2. Items Transformados
```
📦 Transformed items: [
  {
    "name": "Servicio Corte Láser",
    "desc": "Precio €/min de corte",
    "units": 37.44,
    "price": 2.66,
    "tax": 21,
    "discount": 0,
    "account": "63a451ceb78ca14e470ecfd3"
  },
  {
    "name": "Tablero DM · 100x80cm",
    "desc": "Grosor · 3mm",
    "units": 1,
    "price": 34.17,
    "tax": 21,
    "discount": 0,
    "account": "63a451ceb78ca14e470ecfd3"
  }
]
```

### 3. Payload Final a Holded
```
📤 Final estimate payload: {
  "date": 1731196800,
  "items": [
    {
      "name": "Servicio Corte Láser",
      "desc": "Precio €/min de corte",
      "units": 37.44,
      "price": 2.66,
      "tax": 21,
      "discount": 0,
      "account": "63a451ceb78ca14e470ecfd3"
    },
    {
      "name": "Tablero DM · 100x80cm",
      "desc": "Grosor · 3mm",
      "units": 1,
      "price": 34.17,
      "tax": 21,
      "discount": 0,
      "account": "63a451ceb78ca14e470ecfd3"
    }
  ],
  "approveDoc": true,
  "contactName": "Clientes varios"
}
```

### 4. Respuesta de Holded
```
✅ Holded API Response: {
  "id": "69132580cd0560f5c8041deb",
  "products": [
    {
      "name": "Servicio Corte Láser",
      "price": 2.66,  // ❓ ¿Aquí debería aparecer el precio o sigue siendo 0?
      ...
    }
  ],
  "subtotal": 139.79,
  "total": 169.15
}
```

## 🔴 Si El Precio Sigue Siendo 0

Si en el log `📤 Final estimate payload` el precio aparece correctamente (2.66), pero en la respuesta de Holded sigue siendo 0, entonces el problema es que:

**La API de Holded está rechazando el precio por alguna razón:**

### Posibles causas:

1. **El campo `account` es incorrecto**
   - Solución: Usa el botón "Ver Cuentas" para obtener el ID correcto

2. **Falta un campo requerido**
   - Puede que Holded requiera `productId` o `sku`
   - Puede que requiera `costPrice`

3. **El formato del precio es incorrecto**
   - Debe ser un número, no string
   - Debe tener máximo 2 decimales

4. **Restricciones de la cuenta de Holded**
   - La cuenta de prueba puede tener limitaciones
   - Puede requerir configuración adicional

## 📋 Cómo Ver los Logs del Servidor

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Menú izquierdo → **"Edge Functions"**
4. Click en tu función
5. Pestaña **"Logs"**
6. Crea un presupuesto
7. Busca los logs con los emojis 🔍 📦 📤 ✅

## 🚨 ACCIÓN REQUERIDA

**POR FAVOR, accede a Supabase y pégame los logs que empiezan con:**
- `🔍 Processing item:`
- `📦 Transformed items:`
- `📤 Final estimate payload:`
- `📤 Holded API Request Body:`

Sin estos logs, no puedo saber si el precio se está enviando correctamente a Holded o si se pierde antes.
