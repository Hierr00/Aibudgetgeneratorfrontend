import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Sparkles,
  TrendingUp,
  Package,
  DollarSign,
  Clock,
  Target,
  X,
} from "lucide-react";
import { Button } from "../ui/button";

interface Suggestion {
  id: string;
  type: "price" | "material" | "optimization" | "upsell" | "timing" | "margin";
  title: string;
  description: string;
  action?: string; // Texto a insertar automáticamente
  confidence: number; // 0-100
}

interface SmartSuggestionsProps {
  budgetData: {
    items: Array<{
      concept: string;
      description: string;
      price: number;
      quantity: number;
    }>;
  };
  input: string; // El texto que está escribiendo el usuario
  onApplySuggestion?: (suggestion: Suggestion) => void;
  onDismiss?: (suggestionId: string) => void;
}

export function SmartSuggestions({
  budgetData,
  input,
  onApplySuggestion,
  onDismiss,
}: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // ========== GENERAR SUGERENCIAS INTELIGENTES ==========

  useEffect(() => {
    const newSuggestions: Suggestion[] = [];

    // ===== ANÁLISIS DEL INPUT ACTUAL =====

    const lowerInput = input.toLowerCase();

    // Detectar si está preguntando por precios
    if (lowerInput.includes("precio") || lowerInput.includes("coste") || lowerInput.includes("cuanto")) {
      newSuggestions.push({
        id: "price-info",
        type: "price",
        title: "Información de precios",
        description: "Corte láser: 0,80€/min | Diseño CAD: 25€ | Materiales desde 5€",
        confidence: 95,
      });
    }

    // Detectar si menciona materiales
    const materials = ["dm", "metacrilato", "contrachapado", "cartón"];
    const mentionedMaterial = materials.find((mat) => lowerInput.includes(mat));

    if (mentionedMaterial) {
      newSuggestions.push({
        id: "material-spec",
        type: "material",
        title: `Especificaciones de ${mentionedMaterial}`,
        description: `Tenemos varios grosores disponibles. ¿Necesitas ayuda para elegir el grosor adecuado?`,
        confidence: 90,
      });
    }

    // Detectar si menciona cantidad
    if (lowerInput.includes("cantidad") || lowerInput.match(/\d+\s*(unidad|pieza)/)) {
      newSuggestions.push({
        id: "quantity-discount",
        type: "upsell",
        title: "Descuento por volumen",
        description: "A partir de 10 unidades podemos ofrecer un descuento del 10-15%",
        confidence: 85,
      });
    }

    // ===== ANÁLISIS DEL PRESUPUESTO ACTUAL =====

    if (budgetData.items.length > 0) {
      // Calcular total
      const total = budgetData.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Sugerencia de margen si el ticket es bajo
      if (total < 50 && total > 0) {
        newSuggestions.push({
          id: "low-ticket-warning",
          type: "margin",
          title: "Ticket mínimo recomendado",
          description: `El total actual (${total.toFixed(2)}€) está por debajo del mínimo recomendado de 50€. Considera añadir servicios adicionales.`,
          confidence: 80,
        });
      }

      // Detectar si solo hay corte láser sin diseño
      const hasDesign = budgetData.items.some((item) =>
        item.concept.toLowerCase().includes("diseño") ||
        item.concept.toLowerCase().includes("cad")
      );

      const hasCutting = budgetData.items.some((item) =>
        item.concept.toLowerCase().includes("corte")
      );

      if (hasCutting && !hasDesign && !dismissed.has("suggest-design")) {
        newSuggestions.push({
          id: "suggest-design",
          type: "upsell",
          title: "¿Diseño CAD necesario?",
          description: "¿El cliente tiene archivo .dxf o necesita servicio de diseño (25€)?",
          action: "Añade diseño CAD",
          confidence: 75,
        });
      }

      // Detectar si tiene corte pero no material
      const hasMaterial = budgetData.items.some((item) =>
        ["dm", "metacrilato", "contrachapado", "material"].some((mat) =>
          item.concept.toLowerCase().includes(mat)
        )
      );

      if (hasCutting && !hasMaterial && !dismissed.has("suggest-material")) {
        newSuggestions.push({
          id: "suggest-material",
          type: "upsell",
          title: "¿Suministro de material?",
          description: "¿El cliente trae su propio material o lo suministramos nosotros?",
          action: "Pregunta sobre material",
          confidence: 85,
        });
      }

      // Sugerencia de optimización si hay muchas líneas similares
      if (budgetData.items.length > 3) {
        newSuggestions.push({
          id: "consolidate-lines",
          type: "optimization",
          title: "Optimizar líneas de presupuesto",
          description: "Considera consolidar conceptos similares para simplificar el presupuesto",
          confidence: 60,
        });
      }
    }

    // ===== SUGERENCIAS CONTEXTUALES =====

    // Si pregunta por tiempo de entrega
    if (lowerInput.includes("plazo") || lowerInput.includes("entrega") || lowerInput.includes("cuando")) {
      newSuggestions.push({
        id: "delivery-time",
        type: "timing",
        title: "Plazos de entrega",
        description: "Entrega estándar: 3-5 días laborables. Servicio express disponible con recargo del 20%",
        confidence: 95,
      });
    }

    // Si pregunta por ubicación
    if (lowerInput.includes("madrid") || lowerInput.includes("barcelona") || lowerInput.includes("donde")) {
      newSuggestions.push({
        id: "location-info",
        type: "optimization",
        title: "Ubicaciones disponibles",
        description: "Madrid (C. de las Hileras, 18) y Barcelona (Carrer de la ciutat d'asunción, 16)",
        confidence: 90,
      });
    }

    // Filtrar sugerencias ya descartadas
    const filteredSuggestions = newSuggestions.filter(
      (s) => !dismissed.has(s.id)
    );

    // Ordenar por confianza
    filteredSuggestions.sort((a, b) => b.confidence - a.confidence);

    // Limitar a las 3 mejores sugerencias
    setSuggestions(filteredSuggestions.slice(0, 3));
  }, [input, budgetData, dismissed]);

  // ========== MANEJADORES ==========

  const handleDismiss = (suggestionId: string) => {
    setDismissed(new Set(dismissed).add(suggestionId));
    if (onDismiss) {
      onDismiss(suggestionId);
    }
  };

  const handleApply = (suggestion: Suggestion) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
    handleDismiss(suggestion.id);
  };

  // ========== ICONOS POR TIPO ==========

  const getIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "price":
        return DollarSign;
      case "material":
        return Package;
      case "optimization":
        return Target;
      case "upsell":
        return TrendingUp;
      case "timing":
        return Clock;
      case "margin":
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  const getColor = (type: Suggestion["type"]) => {
    switch (type) {
      case "price":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "material":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "optimization":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "upsell":
        return "text-green-600 bg-green-50 border-green-200";
      case "timing":
        return "text-cyan-600 bg-cyan-50 border-cyan-200";
      case "margin":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-neutral-600 bg-neutral-50 border-neutral-200";
    }
  };

  // ========== RENDER ==========

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
        <span className="text-xs font-medium text-neutral-600">
          Sugerencias inteligentes
        </span>
      </div>

      {suggestions.map((suggestion) => {
        const Icon = getIcon(suggestion.type);
        const colorClass = getColor(suggestion.type);

        return (
          <Card
            key={suggestion.id}
            className={`border ${colorClass} transition-all hover:shadow-md`}
          >
            <div className="p-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-md ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-neutral-950 mb-1">
                        {suggestion.title}
                      </div>
                      <div className="text-[11px] text-neutral-600 leading-relaxed">
                        {suggestion.description}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDismiss(suggestion.id)}
                      className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {suggestion.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApply(suggestion)}
                      className="mt-2 h-6 text-[10px] px-2"
                    >
                      {suggestion.action}
                    </Button>
                  )}

                  {/* Barra de confianza */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          suggestion.confidence >= 80
                            ? "bg-green-500"
                            : suggestion.confidence >= 60
                            ? "bg-orange-500"
                            : "bg-neutral-400"
                        }`}
                        style={{ width: `${suggestion.confidence}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-neutral-400 font-mono">
                      {suggestion.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
