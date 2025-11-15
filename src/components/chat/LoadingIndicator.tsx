import { Loader2 } from "lucide-react";

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 text-neutral-500 text-xs">
      <Loader2 className="w-3 h-3 animate-spin" />
      <span>Pensando...</span>
    </div>
  );
}
