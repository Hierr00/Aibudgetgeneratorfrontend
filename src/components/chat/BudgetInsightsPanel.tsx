import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  AlertCircle,
  Lightbulb,
  Users,
  Clock,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface BudgetItem {
  concept: string;
  description: string;
  price: number;
  quantity: number;
  ivaRate: number;
  costPrice?: number;
}

interface BudgetData {
  budgetNumber: string;
  clientName: string;
  clientLocation: string;
  date: string;
  items: BudgetItem[];
}

interface InsightsPanelProps {
  currentBudget: BudgetData;
  historicalBudgets?: BudgetData[]; // Presupuestos históricos para comparar
  clientPattern?: {
    // Patrón del cliente (si existe)
    averageTicket: number;
    totalBudgets: number;
    averageMargin: number;
  };
}

export function BudgetInsightsPanel({
  currentBudget,
  historicalBudgets = [],
  clientPattern,
}: InsightsPanelProps) {
  // ========== CÁLCULOS ==========

  const calculateCurrentMetrics = () => {
    let totalSell = 0;
    let totalCost = 0;

    currentBudget.items.forEach((item) => {
      const sell = item.price * item.quantity;
      const cost = item.costPrice ? item.costPrice * item.quantity : sell * 0.65;
      totalSell += sell;
      totalCost += cost;
    });

    const profit = totalSell - totalCost;
    const margin = totalSell > 0 ? (profit / totalSell) * 100 : 0;

    return { totalSell, totalCost, profit, margin };
  };

  const calculateHistoricalAverage = () => {
    if (historicalBudgets.length === 0) {
      return { avgTicket: 0, avgMargin: 35, count: 0 };
    }

    let totalTicket = 0;
    let count = 0;

    historicalBudgets.forEach((budget) => {
      let budgetTotal = 0;
      budget.items.forEach((item) => {
        budgetTotal += item.price * item.quantity;
      });
      totalTicket += budgetTotal;
      count++;
    });

    return {
      avgTicket: count > 0 ? totalTicket / count : 0,
      avgMargin: 35, // Estimado
      count,
    };
  };

  const currentMetrics = calculateCurrentMetrics();
  const historical = calculateHistoricalAverage();

  // Comparación con promedio histórico
  const vsHistorical =
    historical.avgTicket > 0
      ? ((currentMetrics.totalSell - historical.avgTicket) / historical.avgTicket) * 100
      : 0;

  // Comparación con patrón del cliente
  const vsClientPattern =
    clientPattern && clientPattern.averageTicket > 0
      ? ((currentMetrics.totalSell - clientPattern.averageTicket) / clientPattern.averageTicket) * 100
      : null;

  // ========== INSIGHTS Y SUGERENCIAS ==========

  const generateInsights = () => {
    const insights: Array<{
      type: "success" | "warning" | "info" | "tip";
      icon: any;
      title: string;
      description: string;
    }> = [];

    // Análisis de margen
    if (currentMetrics.margin < 20) {
      insights.push({
        type: "warning",
        icon: AlertCircle,
        title: "Margen bajo detectado",
        description: `El margen actual es ${currentMetrics.margin.toFixed(1)}%. Considera aumentar precios o reducir costes para alcanzar el objetivo del 30-40%.`,
      });
    } else if (currentMetrics.margin >= 40) {
      insights.push({
        type: "success",
        icon: TrendingUp,
        title: "Excelente margen",
        description: `Margen de ${currentMetrics.margin.toFixed(1)}% está por encima del objetivo. ¡Presupuesto muy rentable!`,
      });
    }

    // Comparación con histórico
    if (vsHistorical > 20) {
      insights.push({
        type: "success",
        icon: BarChart3,
        title: "Por encima del promedio",
        description: `Este presupuesto es ${vsHistorical.toFixed(0)}% mayor que el promedio histórico. Oportunidad de venta grande.`,
      });
    } else if (vsHistorical < -20) {
      insights.push({
        type: "info",
        icon: TrendingDown,
        title: "Por debajo del promedio",
        description: `Este presupuesto es ${Math.abs(vsHistorical).toFixed(0)}% menor que el promedio. Considera añadir servicios complementarios.`,
      });
    }

    // Comparación con cliente
    if (clientPattern && vsClientPattern !== null) {
      if (vsClientPattern > 10) {
        insights.push({
          type: "info",
          icon: Users,
          title: "Mayor que presupuestos anteriores",
          description: `Este cliente normalmente gasta ${clientPattern.averageTicket.toFixed(2)}€. Este presupuesto es ${vsClientPattern.toFixed(0)}% mayor.`,
        });
      }
    }

    // Sugerencias proactivas
    if (currentBudget.items.length === 1) {
      insights.push({
        type: "tip",
        icon: Lightbulb,
        title: "Oportunidad de cross-sell",
        description:
          "¿Has considerado ofrecer servicios adicionales como diseño CAD, materiales premium o acabados especiales?",
      });
    }

    // Análisis de cantidad
    const totalQuantity = currentBudget.items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity >= 10) {
      insights.push({
        type: "tip",
        icon: Target,
        title: "Volumen alto - Descuento estratégico",
        description:
          "Con este volumen podrías ofrecer un pequeño descuento (5-10%) para cerrar la venta sin sacrificar mucho margen.",
      });
    }

    return insights;
  };

  const insights = generateInsights();

  // ========== MÉTRICAS CLAVE ==========

  const keyMetrics = [
    {
      label: "Valor del presupuesto",
      value: `${currentMetrics.totalSell.toFixed(2)}€`,
      change: vsHistorical,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Margen de beneficio",
      value: `${currentMetrics.margin.toFixed(1)}%`,
      change: currentMetrics.margin - 35,
      icon: Target,
      color: currentMetrics.margin >= 30 ? "text-green-600" : "text-orange-600",
      bgColor: currentMetrics.margin >= 30 ? "bg-green-50" : "bg-orange-50",
    },
    {
      label: "Beneficio neto",
      value: `${currentMetrics.profit.toFixed(2)}€`,
      change: null,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Líneas de presupuesto",
      value: `${currentBudget.items.length}`,
      change: null,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Métricas clave */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className={`p-4 ${metric.bgColor}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-medium text-neutral-600 mb-1">
                      {metric.label}
                    </div>
                    <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                    {metric.change !== null && (
                      <div
                        className={`text-[10px] font-medium mt-1 ${
                          metric.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {metric.change >= 0 ? "+" : ""}
                        {metric.change.toFixed(1)}%{" "}
                        <span className="text-neutral-500">vs promedio</span>
                      </div>
                    )}
                  </div>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparativa con histórico */}
      {historical.count > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Comparativa con Histórico
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {historical.count} presupuestos
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-600">Ticket promedio histórico</span>
                  <span className="font-medium">{historical.avgTicket.toFixed(2)}€</span>
                </div>
                <Progress value={50} className="h-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-600">Ticket actual</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{currentMetrics.totalSell.toFixed(2)}€</span>
                    {vsHistorical !== 0 && (
                      <span
                        className={`text-[10px] ${
                          vsHistorical > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        ({vsHistorical > 0 ? "+" : ""}
                        {vsHistorical.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                </div>
                <Progress
                  value={Math.min((currentMetrics.totalSell / historical.avgTicket) * 50, 100)}
                  className="h-1.5"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patrón del cliente */}
      {clientPattern && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
              <Users className="w-4 h-4" />
              Historial con {currentBudget.clientName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-blue-700">Presupuestos previos</div>
                <div className="font-semibold text-blue-950 text-base">
                  {clientPattern.totalBudgets}
                </div>
              </div>
              <div>
                <div className="text-blue-700">Ticket promedio</div>
                <div className="font-semibold text-blue-950 text-base">
                  {clientPattern.averageTicket.toFixed(0)}€
                </div>
              </div>
              <div>
                <div className="text-blue-700">Margen habitual</div>
                <div className="font-semibold text-blue-950 text-base">
                  {clientPattern.averageMargin.toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights y sugerencias */}
      {insights.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Insights y Sugerencias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              const colors = {
                success: "bg-green-50 border-green-200 text-green-800",
                warning: "bg-orange-50 border-orange-200 text-orange-800",
                info: "bg-blue-50 border-blue-200 text-blue-800",
                tip: "bg-purple-50 border-purple-200 text-purple-800",
              };

              return (
                <div
                  key={index}
                  className={`rounded-lg border p-3 ${colors[insight.type]}`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold mb-1">{insight.title}</div>
                      <div className="text-[11px] opacity-90">{insight.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Acciones recomendadas */}
      {currentMetrics.margin < 25 && (
        <Card className="border-orange-300 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-900">
              <Clock className="w-4 h-4" />
              Acciones Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs text-orange-900">
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Aumenta el precio un 15% para alcanzar margen objetivo del 30%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Revisa costes de materiales y busca alternativas más económicas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Añade servicios complementarios (diseño, acabados) con margen alto</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
