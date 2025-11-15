# 🏦 Configurar Cuenta Contable en Holded

## ❗️ Problema Actual

Los presupuestos se crean con **precio 0€** porque:
1. ~~El campo `price` no se está enviando~~ ✅ CORREGIDO
2. La cuenta contable "Prestaciones de servicios" no está configurada

## 🔍 Cómo Encontrar el ID de la Cuenta Contable

### Opción 1: Usar el componente de Debug (Recomendado)

1. Ve al sidebar izquierdo → **"Holded API Debug"**
2. Click en el botón **"Ver Cuentas"**
3. Se mostrarán todas las cuentas contables de servicios
4. Busca la cuenta **"Prestaciones de servicios"** o similar
5. Copia el **ID** (campo `id` o `_id`)

### Opción 2: Buscar en Holded manualmente

1. Ve a https://app.holded.com
2. Navega a **Contabilidad → Plan contable**
3. Busca **"Prestaciones de servicios"** (código 70x)
4. Anota el ID de esa cuenta

### Opción 3: Revisar la consola del navegador

Después de hacer click en "Ver Cuentas":
```javascript
// En la consola verás:
🏦 Cuentas de servicios: [
  {
    "id": "abc123xyz",
    "code": "705",
    "name": "Prestaciones de servicios",
    ...
  }
]
```

## ⚙️ Configurar el ID en el Código

Una vez tengas el ID correcto:

1. Abre `/supabase/functions/server/index.tsx`
2. Busca la línea comentada (aproximadamente línea 115):
   ```typescript
   // holdedItem.salesAccountId = '7050001'; // Example ID
   ```
3. Descomenta y reemplaza con el ID real:
   ```typescript
   holdedItem.salesAccountId = 'TU_ID_AQUI'; // ID de "Prestaciones de servicios"
   ```

## 📋 Ejemplo de Configuración Final

```typescript
const holdedItem: any = {
  name: item.concept || item.name || 'Item',
  desc: item.description || '',
  units: units,
  price: priceFixed,
  tax: Number(item.ivaRate) || 21,
  discount: 0,
  salesAccountId: '67890abcdef', // ✅ ID real de tu cuenta
};
```

## ✅ Verificar que Funciona

Después de configurar el `salesAccountId`:

1. Crea un nuevo presupuesto
2. Click en "Add to Holded"
3. Ve a Holded → Facturación → Presupuestos
4. Abre el presupuesto recién creado
5. Verifica que:
   - ✅ Los precios aparecen correctamente
   - ✅ El subtotal se calcula bien
   - ✅ El total con IVA es correcto
   - ✅ La cuenta contable es "Prestaciones de servicios"

## 🐛 Troubleshooting

### Si los precios siguen apareciendo como 0€:

Revisa la consola del servidor y busca logs como:
```
🔍 Processing item: Servicio Corte Láser
   - Original quantity: 37.44, parsed: 37.44
   - Original pricePerUnit: 0.66, price: undefined, parsed: 0.66
   - Final price to send: 0.66
```

Si `parsed` es 0, el problema está en los datos del presupuesto.
Si `Final price to send` es correcto pero en Holded aparece 0, el problema es el `salesAccountId`.

### Si aparece error al crear presupuesto:

```
Invalid salesAccountId
```

Significa que el ID que configuraste no existe en Holded. Usa el botón "Ver Cuentas" para obtener el ID correcto.

## 💡 Notas Importantes

- El `salesAccountId` es **opcional** según la documentación de Holded
- Sin embargo, algunos planes de Holded lo requieren para calcular correctamente los totales
- Si tu plan no lo requiere, puedes dejarlo comentado
- Cada empresa puede tener IDs diferentes para las mismas cuentas contables
