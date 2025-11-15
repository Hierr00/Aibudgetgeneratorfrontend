import { useState } from "react";
import {
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
  ChainOfThoughtSearchResults,
  ChainOfThoughtSearchResult,
} from "../ui/chain-of-thought";
import { Search, Calculator, CheckCircle2, AlertCircle, Lightbulb, FileText } from "lucide-react";
import svgPathsChat from "../../imports/svg-cgoxqakjl5";
import imgAvatar from "figma:asset/a8b52980fc79bf5bb2d45096d4fcb29741a9a7f1.png";

interface Message {
  id: string;
  role: string;
  content: string;
  toolInvocations?: Array<{
    toolName: string;
    state: string;
    args: any;
    result: any;
  }>;
}

interface AssistantMessageWithThoughtProps {
  message: Message;
}

export function AssistantMessageWithThought({ message }: AssistantMessageWithThoughtProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  // Extract tool invocations from message
  const toolInvocations = message.toolInvocations || [];
  const hasToolCalls = toolInvocations.length > 0;

  // Map tool names to icons and labels
  const getToolInfo = (toolName: string) => {
    const toolMap: Record<string, { icon: any; label: string; color: string }> = {
      calculateMargin: { icon: Calculator, label: "Calculando margen", color: "text-blue-600" },
      estimateCuttingTime: { icon: Calculator, label: "Estimando tiempo de corte", color: "text-purple-600" },
      recommendMaterial: { icon: Lightbulb, label: "Recomendando material", color: "text-amber-600" },
      validateBudgetViability: { icon: CheckCircle2, label: "Validando viabilidad", color: "text-green-600" },
      createCompleteBudget: { icon: FileText, label: "Creando presupuesto", color: "text-blue-600" },
      updateBudgetInfo: { icon: FileText, label: "Actualizando información", color: "text-neutral-600" },
      addBudgetItem: { icon: FileText, label: "Añadiendo concepto", color: "text-green-600" },
      updateBudgetItem: { icon: FileText, label: "Modificando concepto", color: "text-amber-600" },
      removeBudgetItem: { icon: AlertCircle, label: "Eliminando concepto", color: "text-red-600" },
      calculateBudget: { icon: Calculator, label: "Calculando total", color: "text-blue-600" },
    };

    return toolMap[toolName] || { icon: Search, label: toolName, color: "text-neutral-600" };
  };

  return (
    <div
      className="content-stretch flex flex-col gap-[12px] items-start justify-end relative shrink-0 w-full"
      data-name="Message (Assistant)"
    >
      {/* Chain of Thought - Only show if there are tool calls */}
      {hasToolCalls && (
        <div className="w-full pl-[48px]">
          <ChainOfThought defaultOpen={false}>
            <ChainOfThoughtHeader>
              Razonamiento del agente
            </ChainOfThoughtHeader>
            <ChainOfThoughtContent>
              <div className="space-y-3">
                {toolInvocations.map((invocation, index) => {
                  const toolInfo = getToolInfo(invocation.toolName);
                  const Icon = toolInfo.icon;
                  const isComplete = invocation.state === 'result';
                  const status = isComplete ? 'complete' : 'active';

                  return (
                    <ChainOfThoughtStep
                      key={index}
                      icon={Icon}
                      label={toolInfo.label}
                      description={
                        invocation.result?.message ||
                        `Procesando ${invocation.toolName}...`
                      }
                      status={status}
                    >
                      {/* Show detailed results if available */}
                      {isComplete && invocation.result && (
                        <div className="mt-2 text-xs text-neutral-600 space-y-1">
                          {invocation.result.marginPercent && (
                            <div className="bg-neutral-100 rounded px-2 py-1">
                              <strong>Margen:</strong> {invocation.result.marginPercent}% ({invocation.result.assessment})
                            </div>
                          )}
                          {invocation.result.totalTime && (
                            <div className="bg-neutral-100 rounded px-2 py-1">
                              <strong>Tiempo:</strong> {invocation.result.totalTime}min ({invocation.result.totalCost}€)
                            </div>
                          )}
                          {invocation.result.material && (
                            <div className="bg-neutral-100 rounded px-2 py-1">
                              <strong>Material:</strong> {invocation.result.material} ({invocation.result.price}€)
                            </div>
                          )}
                          {invocation.result.issues && invocation.result.issues.length > 0 && (
                            <div className="bg-amber-50 rounded px-2 py-1 border border-amber-200">
                              <strong>⚠️ Advertencias:</strong>
                              <ul className="list-disc list-inside mt-1">
                                {invocation.result.issues.map((issue: string, i: number) => (
                                  <li key={i}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {invocation.result.suggestions && invocation.result.suggestions.length > 0 && (
                            <div className="bg-blue-50 rounded px-2 py-1 border border-blue-200">
                              <strong>💡 Sugerencias:</strong>
                              <ul className="list-disc list-inside mt-1">
                                {invocation.result.suggestions.map((suggestion: string, i: number) => (
                                  <li key={i}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </ChainOfThoughtStep>
                  );
                })}
              </div>
            </ChainOfThoughtContent>
          </ChainOfThought>
        </div>
      )}

      {/* Original Message */}
      <div
        className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full"
        data-name="Message + Avatar"
      >
        <div
          className="bg-white relative rounded-[9999px] shrink-0 size-[40px]"
          data-name="MessageAvatar"
        >
          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-[40px]">
            <img
              alt=""
              className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
              src={imgAvatar}
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[9999px]"
          />
        </div>
        <div
          className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0"
          data-name="Message"
        >
          <div
            className="relative shrink-0 w-full"
            data-name="MessageContent"
          >
            <div className="flex flex-col justify-end size-full">
              <div className="box-border content-stretch flex flex-col items-start justify-end pl-0 pr-[64px] py-0 relative w-full">
                <div
                  className="bg-neutral-100 relative rounded-[10px] shrink-0 w-full"
                  data-name="content"
                >
                  <div className="flex flex-col items-center size-full">
                    <div className="box-border content-stretch flex flex-col gap-[8px] items-center px-[16px] py-[12px] relative w-full">
                      <p className="font-['Geist:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 w-full whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full"
        data-name="actions"
      >
        <div
          className="h-0 shrink-0 w-[40px]"
          data-name="_avatar-spacer"
        />
        <div
          className="box-border content-stretch flex gap-[8px] items-end pb-0 pt-[8px] px-0 relative shrink-0"
          data-name="Actions"
        >
          <button
            onClick={handleCopy}
            className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors"
          >
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[4.16%_4.17%_4.17%_4.16%]">
                <div
                  className="absolute inset-0"
                  style={
                    {
                      "--fill-0": copied
                        ? "rgba(20, 71, 230, 1)"
                        : "rgba(115, 115, 115, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 15 15"
                  >
                    <path
                      d={svgPathsChat.p20acca00}
                      fill="var(--fill-0, #737373)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </button>
          <button
            onClick={handleLike}
            className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors"
          >
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[8.331%]">
                <div
                  className="absolute inset-0"
                  style={
                    {
                      "--fill-0": liked
                        ? "rgba(20, 71, 230, 1)"
                        : "rgba(115, 115, 115, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 15 15"
                  >
                    <path
                      d={svgPathsChat.p15a7c500}
                      fill="var(--fill-0, #737373)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </button>
          <button
            onClick={handleDislike}
            className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors"
          >
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[8.331%]">
                <div
                  className="absolute inset-0"
                  style={
                    {
                      "--fill-0": disliked
                        ? "rgba(20, 71, 230, 1)"
                        : "rgba(115, 115, 115, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 15 15"
                  >
                    <path
                      d={svgPathsChat.p172d0500}
                      fill="var(--fill-0, #737373)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
