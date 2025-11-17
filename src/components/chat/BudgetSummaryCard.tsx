import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { BudgetLineItem } from "./BudgetLineItem";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface BudgetItem {
  id: string;
  concept: string;
  description: string;
  price: number;
  quantity: number;
  ivaRate: number;
  costPrice?: number; // Precio de coste opcional
}

interface BudgetSummaryCardProps {
  items: BudgetItem[];
  clientName?: string;
  clientLocation?: string;
  showMargins?: boolean; // Mostrar análisis de márgenes
}

export function BudgetSummaryCard({
  items,
  clientName,
  clientLocation,
  showMargins = true,
}: BudgetSummaryCardProps) {
  const calculateTotals = () => {
    let baseImponible = 0;
    let totalIVA = 0;
    let totalCost = 0;
    let totalProfit = 0;

    items.forEach((item) => {
      const subtotal = item.price * item.quantity;
      const iva = subtotal * (item.ivaRate / 100);
      baseImponible += subtotal;
      totalIVA += iva;

      // Calcular coste (si existe, sino estimar con 35% margen)
      const cost = item.costPrice
        ? item.costPrice * item.quantity
        : subtotal * 0.65;
      totalCost += cost;
      totalProfit += subtotal - cost;
    });

    const overallMargin = baseImponible > 0 ? (totalProfit / baseImponible) * 100 : 0;

    return {
      baseImponible,
      totalIVA,
      total: baseImponible + totalIVA,
      totalCost,
      totalProfit,
      overallMargin,
    };
  };

  const totals = calculateTotals();

  // Determinar estado del margen global
  const getOverallMarginStatus = () => {
    if (totals.overallMargin < 25) {
      return {
        color: 'text-orange-600',
        icon: AlertTriangle,
        label: 'Margen bajo',
      };
    }
    return {
      color: 'text-green-600',
      icon: TrendingUp,
      label: 'Margen saludable',
    };
  };

  const marginStatus = getOverallMarginStatus();
  const MarginIcon = marginStatus.icon;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Resumen del Presupuesto</CardTitle>
          <div className="flex items-center gap-2">
            {showMargins && items.length > 0 && (
              <div className={`flex items-center gap-1 text-xs ${marginStatus.color}`}>
                <MarginIcon className="w-3.5 h-3.5" />
                <span className="font-medium">{totals.overallMargin.toFixed(1)}%</span>
              </div>
            )}
            <Badge variant="secondary" className="text-xs">
              {items.length} {items.length === 1 ? 'concepto' : 'conceptos'}
            </Badge>
          </div>
        </div>
        {(clientName || clientLocation) && (
          <div className="mt-2 text-xs text-neutral-500">
            {clientName && <div>{clientName}</div>}
            {clientLocation && <div>{clientLocation}</div>}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Líneas de presupuesto con análisis de margen */}
        <div className="space-y-2">
          {items.map((item, index) => (
            <BudgetLineItem
              key={item.id}
              concept={item.concept}
              description={item.description}
              price={item.price}
              quantity={item.quantity}
              ivaRate={item.ivaRate}
              costPrice={item.costPrice}
              showMargin={showMargins}
              index={index}
            />
          ))}
        </div>

        <Separator className="my-4" />

        {/* Resumen financiero */}
        <div className="space-y-2 text-xs">
          {showMargins && (
            <div className="bg-neutral-50 rounded-lg p-3 space-y-2 mb-3">
              <div className="text-xs font-medium text-neutral-700 mb-2">
                Análisis de Rentabilidad
              </div>
              <div className="grid grid-cols-3 gap-3 text-[10px]">
                <div>
                  <div className="text-neutral-400">Costes totales</div>
                  <div className="font-semibold text-neutral-950">
                    {totals.totalCost.toFixed(2)}€
                  </div>
                </div>
                <div>
                  <div className="text-neutral-400">Beneficio neto</div>
                  <div className="font-semibold text-green-600">
                    +{totals.totalProfit.toFixed(2)}€
                  </div>
                </div>
                <div>
                  <div className="text-neutral-400">Margen global</div>
                  <div className={`font-semibold ${marginStatus.color}`}>
                    {totals.overallMargin.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between text-neutral-500">
            <span>Base imponible</span>
            <span>{totals.baseImponible.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>IVA</span>
            <span>{totals.totalIVA.toFixed(2)}€</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-semibold text-neutral-950">
            <span>Total</span>
            <span>{totals.total.toFixed(2)}€</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
