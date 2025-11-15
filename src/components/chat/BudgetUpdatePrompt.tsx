import { FileText, Check } from 'lucide-react';

interface BudgetUpdatePromptProps {
  onApply: () => void;
  summary: string;
}

export function BudgetUpdatePrompt({ onApply, summary }: BudgetUpdatePromptProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-[10px] p-[12px] w-full mt-[8px]">
      <div className="flex items-start gap-[12px]">
        <div className="bg-blue-50 rounded-[8px] p-[8px] shrink-0">
          <FileText className="w-[16px] h-[16px] text-blue-600" />
        </div>
        <div className="flex-1 flex flex-col gap-[8px]">
          <div>
            <p className="font-['Geist:Medium',sans-serif] text-[12px] text-neutral-950 mb-[4px]">
              Actualización de presupuesto lista
            </p>
            <p className="font-['Geist:Regular',sans-serif] text-[11px] text-neutral-600 leading-[16px]">
              {summary}
            </p>
          </div>
          <button
            onClick={onApply}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] px-[12px] py-[6px] flex items-center gap-[6px] transition-colors self-start"
          >
            <Check className="w-[14px] h-[14px]" />
            <span className="font-['Geist:Medium',sans-serif] text-[12px]">
              Aplicar al presupuesto
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
