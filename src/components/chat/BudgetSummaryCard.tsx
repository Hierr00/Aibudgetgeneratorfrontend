import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface BudgetItem {
  id: string;
  concept: string;
  description: string;
  price: number;
  quantity: number;
  ivaRate: number;
}

interface BudgetSummaryCardProps {
  items: BudgetItem[];
  clientName?: string;
  clientLocation?: string;
}

export function BudgetSummaryCard({ items, clientName, clientLocation }: BudgetSummaryCardProps) {
  const calculateTotals = () => {
    let baseImponible = 0;
    let totalIVA = 0;

    items.forEach((item) => {
      const subtotal = item.price * item.quantity;
      const iva = subtotal * (item.ivaRate / 100);
      baseImponible += subtotal;
      totalIVA += iva;
    });

    return {
      baseImponible,
      totalIVA,
      total: baseImponible + totalIVA,
    };
  };

  const totals = calculateTotals();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Resumen del Presupuesto</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {items.length} {items.length === 1 ? 'concepto' : 'conceptos'}
          </Badge>
        </div>
        {(clientName || clientLocation) && (
          <div className="mt-2 text-xs text-neutral-500">
            {clientName && <div>{clientName}</div>}
            {clientLocation && <div>{clientLocation}</div>}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const subtotal = item.price * item.quantity;
          return (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-start text-xs">
                <div className="flex-1">
                  <div className="text-neutral-950">{item.concept}</div>
                  <div className="text-neutral-500">{item.description}</div>
                </div>
                <div className="text-right text-neutral-950">
                  {subtotal.toFixed(2)}€
                </div>
              </div>
              <div className="text-[10px] text-neutral-400">
                {item.price.toFixed(2)}€ × {item.quantity} | IVA {item.ivaRate}%
              </div>
            </div>
          );
        })}

        <Separator className="my-3" />

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-neutral-500">
            <span>Base imponible</span>
            <span>{totals.baseImponible.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>IVA</span>
            <span>{totals.totalIVA.toFixed(2)}€</span>
          </div>
          <Separator />
          <div className="flex justify-between text-neutral-950">
            <span>Total</span>
            <span>{totals.total.toFixed(2)}€</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
