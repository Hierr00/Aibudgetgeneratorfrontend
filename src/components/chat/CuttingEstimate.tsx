import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, Scissors, Euro } from "lucide-react";

interface CuttingEstimateProps {
  timePerPiece: number;
  totalTime: number;
  totalCost: number;
  quantity: number;
  pricePerMinute: number;
}

export function CuttingEstimate({
  timePerPiece,
  totalTime,
  totalCost,
  quantity,
  pricePerMinute,
}: CuttingEstimateProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Estimación de Corte</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Scissors className="w-3 h-3" />
              <span className="text-xs">Por pieza</span>
            </div>
            <div className="text-sm text-neutral-950">{timePerPiece} min</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Tiempo total</span>
            </div>
            <div className="text-sm text-neutral-950">{totalTime} min</div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Euro className="w-3 h-3" />
              <span className="text-xs">Coste estimado</span>
            </div>
            <div className="text-sm text-neutral-950">{totalCost}€</div>
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            {pricePerMinute}€/min × {totalTime} min para {quantity} {quantity === 1 ? 'pieza' : 'piezas'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
