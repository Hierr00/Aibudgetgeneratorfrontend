import { Button } from "../ui/button";
import { Calculator, Package, FileText, MapPin } from "lucide-react";

interface QuickActionsProps {
  onAction: (prompt: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      icon: Calculator,
      label: "Estimar corte",
      prompt: "¿Puedes ayudarme a estimar el tiempo y coste de corte?",
    },
    {
      icon: Package,
      label: "Recomendar material",
      prompt: "¿Qué material me recomiendas para mi proyecto?",
    },
    {
      icon: FileText,
      label: "Nuevo presupuesto",
      prompt: "Quiero crear un nuevo presupuesto",
    },
    {
      icon: MapPin,
      label: "Ver ubicaciones",
      prompt: "¿Dónde están las ubicaciones de Arkcutt?",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 w-full max-w-md">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto py-3 flex flex-col items-start gap-1.5 text-left"
          onClick={() => onAction(action.prompt)}
        >
          <action.icon className="w-4 h-4 text-neutral-500" />
          <span className="text-xs">{action.label}</span>
        </Button>
      ))}
    </div>
  );
}
