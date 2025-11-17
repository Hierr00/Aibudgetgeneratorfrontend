import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface BudgetLineItemProps {
  concept: string;
  description: string;
  price: number;
  quantity: number;
  ivaRate: number;
  costPrice?: number; // Precio de coste (opcional)
  showMargin?: boolean; // Mostrar análisis de margen
  index?: number;
}

export function BudgetLineItem({
  concept,
  description,
  price,
  quantity,
  ivaRate,
  costPrice,
  showMargin = true,
  index = 0,
}: BudgetLineItemProps) {
  const subtotal = price * quantity;

  // Calcular margen (si se proporciona el coste)
  const calculateMargin = () => {
    if (!costPrice) {
      // Estimación: asumimos un margen del 35% por defecto
      const estimatedCost = price * 0.65;
      return {
        costTotal: estimatedCost * quantity,
        profit: (price - estimatedCost) * quantity,
        marginPercent: 35,
        isEstimated: true,
      };
    }

    const costTotal = costPrice * quantity;
    const profit = subtotal - costTotal;
    const marginPercent = (profit / subtotal) * 100;

    return {
      costTotal,
      profit,
      marginPercent,
      isEstimated: false,
    };
  };

  const margin = calculateMargin();

  // Determinar color y estado del margen
  const getMarginStatus = (marginPercent: number) => {
    if (marginPercent < 15) {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertCircle,
        label: 'Bajo',
        variant: 'destructive' as const,
        progressColor: 'bg-red-500',
      };
    } else if (marginPercent < 25) {
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: TrendingDown,
        label: 'Justo',
        variant: 'secondary' as const,
        progressColor: 'bg-orange-500',
      };
    } else if (marginPercent < 40) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle,
        label: 'Bueno',
        variant: 'default' as const,
        progressColor: 'bg-green-500',
      };
    } else {
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: TrendingUp,
        label: 'Excelente',
        variant: 'default' as const,
        progressColor: 'bg-blue-500',
      };
    }
  };

  const status = getMarginStatus(margin.marginPercent);
  const Icon = status.icon;

  return (
    <div className={`rounded-lg border ${status.borderColor} p-3 space-y-2 transition-all hover:shadow-sm`}>
      {/* Header con número de línea */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-neutral-400">#{index + 1}</span>
            <h4 className="text-sm font-medium text-neutral-950">{concept}</h4>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">{description}</p>
        </div>

        {/* Precio total de la línea */}
        <div className="text-right">
          <div className="text-sm font-semibold text-neutral-950">
            {subtotal.toFixed(2)}€
          </div>
          <div className="text-[10px] text-neutral-400">
            {price.toFixed(2)}€ × {quantity}
          </div>
        </div>
      </div>

      {/* Análisis de margen */}
      {showMargin && (
        <div className={`${status.bgColor} rounded-md p-2 space-y-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Icon className={`w-3.5 h-3.5 ${status.color}`} />
              <span className="text-xs font-medium text-neutral-700">
                Margen: {margin.marginPercent.toFixed(1)}%
              </span>
              {margin.isEstimated && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                        est.
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Margen estimado (35% por defecto)</p>
                      <p className="text-xs text-neutral-500">Define el precio de coste para cálculo exacto</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <Badge variant={status.variant} className="text-[10px] px-1.5 py-0 h-5">
              {status.label}
            </Badge>
          </div>

          {/* Barra de progreso del margen */}
          <div className="space-y-1">
            <Progress
              value={Math.min(margin.marginPercent, 100)}
              className="h-1.5"
            />

            {/* Desglose de costes */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-600">
              <div>
                <div className="text-neutral-400">Coste</div>
                <div className="font-medium">{margin.costTotal.toFixed(2)}€</div>
              </div>
              <div>
                <div className="text-neutral-400">Beneficio</div>
                <div className={`font-medium ${margin.profit > 0 ? status.color : 'text-red-600'}`}>
                  +{margin.profit.toFixed(2)}€
                </div>
              </div>
              <div>
                <div className="text-neutral-400">IVA</div>
                <div className="font-medium">{ivaRate}%</div>
              </div>
            </div>
          </div>

          {/* Sugerencias si el margen es bajo */}
          {margin.marginPercent < 25 && (
            <div className="text-[10px] text-orange-700 bg-orange-100 rounded px-2 py-1">
              💡 Considera aumentar el precio o reducir costes para mejorar rentabilidad
            </div>
          )}
        </div>
      )}
    </div>
  );
}
