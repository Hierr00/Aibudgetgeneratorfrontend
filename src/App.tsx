
import { useAIChatV2 } from './hooks/useAIChatV2';
import { AssistantMessageWithThought } from './components/chat/AssistantMessageWithThought';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useAIChat } from "./hooks/useAIChat";
import { APIKeySettings } from "./components/settings/APIKeySettings";
import { BudgetSummaryCard } from "./components/chat/BudgetSummaryCard";
import { QuickActions } from "./components/chat/QuickActions";
import { LoadingIndicator } from "./components/chat/LoadingIndicator";
import { HoldedButton } from "./components/HoldedButton";
import { HoldedDebug } from "./components/HoldedDebug";
import { HoldedKnowledge } from "./components/HoldedKnowledge";
import svgPaths from "./imports/svg-c1vzaky0zk";
import svgPathsChat from "./imports/svg-cgoxqakjl5";
import svgPathsPDF from "./imports/svg-pl0s22qjao";
import svgPathsSidebar from "./imports/svg-telcpgtqu7";
import svgPathsTemplates from "./imports/svg-dmergg9k2x";
import svgPathsEdit from "./imports/svg-7seo6s6u5f";
import svgPathsMinimized from "./imports/svg-94od4mt7e9";
import svgPathsTutorial from "./imports/svg-359etij165";
import imgAvatar from "figma:asset/a8b52980fc79bf5bb2d45096d4fcb29741a9a7f1.png";
import imgLogo from "figma:asset/a8b52980fc79bf5bb2d45096d4fcb29741a9a7f1.png";
import imgHolded from "./imports/svg-pl0s22qjao";
import imgTutorial from "figma:asset/dd28a05c82316a5c0befc78ffe4ce0c583c45d2b.png";
import imgTutorialView from "figma:asset/2c2d70a267e57c00aac36ee8716b0929d4c86dda.png";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button as ShadButton } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import {
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  Share2,
  Heart,
  MoreHorizontal,
  X,
} from "lucide-react";

interface Budget {
  id: string;
  name: string;
}

interface Template {
  name: string;
  service: string;
  serviceCost: string;
  design: string;
  designCost: string;
  material: string;
  delivery: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface BudgetItem {
  id: string;
  concept: string;
  description: string;
  price: number; // Changed from pricePerUnit to price (Holded API format)
  quantity: number;
  ivaRate: number; // 21, 10, 4, 0 (exenta)
}

interface BudgetData {
  budgetNumber: string;
  clientName: string;
  clientLocation: string;
  date: string;
  dueDate: string;
  items: BudgetItem[];
}

const templates: Template[] = [
  {
    name: "Corte Láser",
    service: "€/min",
    serviceCost: "0.80€",
    design: ".dxf",
    designCost: "25€",
    material: "–",
    delivery: "–",
  },
  {
    name: "Impresión 3D",
    service: "€/g",
    serviceCost: "0.50€",
    design: ".stl",
    designCost: "30€",
    material: "PLA",
    delivery: "5-7 días",
  },
  {
    name: "Fresado CNC",
    service: "€/h",
    serviceCost: "45€",
    design: ".step",
    designCost: "50€",
    material: "Aluminio",
    delivery: "3-5 días",
  },
];

function UserMessage({ message }: { message: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="content-stretch flex flex-col gap-[8px] items-end justify-end relative shrink-0 w-full"
      data-name="Message (User)"
    >
      <div
        className="content-stretch flex gap-[8px] items-end justify-end relative shrink-0 w-full"
        data-name="Message + Avatar"
      >
        <div className="basis-0 flex flex-row grow items-end self-stretch shrink-0">
          <div
            className="basis-0 grow h-full min-h-px min-w-px relative shrink-0"
            data-name="MessageContent"
          >
            <div className="flex flex-col items-end justify-end size-full">
              <div className="box-border content-stretch flex flex-col items-end justify-end pl-[64px] pr-0 py-0 relative size-full">
                <div
                  className="bg-blue-50 border border-blue-100 relative rounded-[10px] shrink-0 w-full"
                  data-name="content"
                >
                  <div className="flex flex-col items-center size-full">
                    <div className="box-border content-stretch flex flex-col gap-[8px] items-center px-[16px] py-[12px] relative w-full">
                      <p className="font-['Geist:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 w-full">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-neutral-100 relative rounded-[9999px] shrink-0 size-[40px]"
          data-name="MessageAvatar"
        >
          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-[40px]">
            <div className="flex flex-col font-['Geist:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-neutral-500 text-nowrap">
              <p className="leading-[24px] whitespace-pre">
                TU
              </p>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[9999px]"
          />
        </div>
      </div>
      <div
        className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-full"
        data-name="actions"
      >
        <div
          className="box-border content-stretch flex gap-[8px] items-end justify-end pb-0 pt-[8px] px-0 relative shrink-0"
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
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[4.17%]">
                <div
                  className="absolute inset-0"
                  style={
                    {
                      "--fill-0": "rgba(115, 115, 115, 1)",
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
        <div
          className="h-0 shrink-0 w-[40px]"
          data-name="_avatar-spacer"
        />
      </div>
    </div>
  );
}

function AssistantMessage({ message }: { message: any }) {
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

  return (
    <div
      className="content-stretch flex flex-col gap-[8px] items-start justify-end relative shrink-0 w-full"
      data-name="Message (Assistant)"
    >
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
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[8.331%]">
                <div
                  className="absolute inset-0"
                  style={
                    {
                      "--fill-0": "rgba(115, 115, 115, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      d={svgPathsChat.pc4e9e80}
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
              <div className="absolute inset-[4.16%_4.88%_4.16%_4.16%]">
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
                      d={svgPathsChat.p3bc93500}
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
              <div className="absolute inset-[4.16%_4.17%_4.17%_4.87%]">
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
                      d={svgPathsChat.p42c840}
                      fill="var(--fill-0, #737373)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </button>
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
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <Share2 className="w-[16px] h-[16px] text-neutral-500" />
          </button>
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <Heart className="w-[16px] h-[16px] text-neutral-500" />
          </button>
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <MoreHorizontal className="w-[16px] h-[16px] text-neutral-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateSuggestion({
  template,
  index,
  onSelect,
}: {
  template: Template;
  index: number;
  onSelect: () => void;
}) {
  return (
    <div
      className="bg-white min-w-[240px] relative rounded-[10px] shrink-0 w-[256px]"
      data-name="ContextContent"
    >
      <div className="box-border content-stretch flex flex-col items-start min-w-inherit overflow-clip p-px relative rounded-[inherit] w-[256px]">
        {/* Template Header */}
        <div
          className="relative shrink-0 w-full"
          data-name="ContextContentHeader"
        >
          <div className="size-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] items-start p-[12px] relative w-full">
              <div className="relative shrink-0 w-full">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-between relative w-full">
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">
                    Template
                  </p>
                  <div className="h-[16px] shrink-0 w-0" />
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                    {template.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Body */}
        <div
          className="relative shrink-0 w-full"
          data-name="ContextContentBody"
        >
          <div
            aria-hidden="true"
            className="absolute border-[1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none"
          />
          <div className="size-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-[12px] pt-[13px] px-[12px] relative w-full">
              <div
                className="h-[16px] relative shrink-0 w-full"
                data-name="InputUsage"
              >
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-center justify-between relative w-full">
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                    Servicio
                  </p>
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-name="TokensWithCost"
                  >
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">
                      {template.service}
                    </p>
                    <div className="content-stretch flex gap-[3px] items-center justify-center leading-[16px] relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                      <p
                        className="font-['Geist:Regular','Noto_Sans:Regular',sans-serif] relative shrink-0"
                        style={{
                          fontVariationSettings:
                            "'CTGR' 0, 'wdth' 100, 'wght' 400",
                        }}
                      >{`∙ `}</p>
                      <p className="font-['Geist:Regular',sans-serif] not-italic relative shrink-0">
                        {template.serviceCost}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="h-[16px] relative shrink-0 w-full"
                data-name="OutputUsage"
              >
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-center justify-between relative w-full">
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                    Diseño CAD
                  </p>
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-name="TokensWithCost"
                  >
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">
                      {template.design}
                    </p>
                    <div className="content-stretch flex gap-[3px] items-center justify-center leading-[16px] relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                      <p
                        className="font-['Geist:Regular','Noto_Sans:Regular',sans-serif] relative shrink-0"
                        style={{
                          fontVariationSettings:
                            "'CTGR' 0, 'wdth' 100, 'wght' 400",
                        }}
                      >{`∙ `}</p>
                      <p className="font-['Geist:Regular',sans-serif] not-italic relative shrink-0">
                        {template.designCost}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="h-[16px] relative shrink-0 w-full"
                data-name="ReasoningUsage"
              >
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-center justify-between relative w-full">
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                    Material
                  </p>
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-name="TokensWithCost"
                  >
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">
                      {template.material}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="h-[16px] relative shrink-0 w-full"
                data-name="CacheUsage"
              >
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-center justify-between relative w-full">
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                    Entrega
                  </p>
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-name="TokensWithCost"
                  >
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">
                      {template.delivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Footer */}
        <div
          className="bg-neutral-100 relative shrink-0 w-full"
          data-name="ContextContentFooter"
        >
          <div
            aria-hidden="true"
            className="absolute border-[1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none"
          />
          <div className="flex flex-row items-center size-full">
            <button
              onClick={onSelect}
              className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] items-center pb-[12px] pt-[13px] px-[12px] relative w-full hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <p className="basis-0 font-['Geist:Regular',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-neutral-500">
                Usar Plantilla
              </p>
              <div
                className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                style={
                  {
                    "--transform-inner-width": "12",
                    "--transform-inner-height": "12",
                  } as React.CSSProperties
                }
              >
                <div className="flex-none rotate-[90deg]">
                  <div className="relative" data-name="icon">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center relative">
                      <div
                        className="overflow-clip relative shrink-0 size-[12px]"
                        data-name="<ArrowUpIcon>"
                      >
                        <div
                          className="absolute inset-[16.67%]"
                          data-name="Vector"
                        >
                          <div
                            className="absolute inset-0"
                            style={
                              {
                                "--fill-0":
                                  "rgba(10, 10, 10, 1)",
                              } as React.CSSProperties
                            }
                          >
                            <svg
                              className="block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 8 8"
                            >
                              <path
                                d={svgPathsTemplates.p2fcb6240}
                                fill="var(--fill-0, #0A0A0A)"
                                id="Vector"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[10px]"
      />
    </div>
  );
}

// Tutorial Modal Component
function TutorialModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[10px] w-[600px] max-h-[80vh] overflow-hidden border border-neutral-200 shadow-lg">
        {/* Navigation Bar */}
        <div className="border-b border-neutral-200 p-[8px]">
          <div className="flex items-center gap-[8px]">
            <button className="p-[6px] hover:bg-neutral-100 rounded-[8px] transition-colors">
              <ChevronLeft className="w-[16px] h-[16px] text-neutral-950" />
            </button>
            <button className="p-[6px] hover:bg-neutral-100 rounded-[8px] transition-colors">
              <svg
                className="w-[16px] h-[16px]"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d={svgPathsTutorial.pc4e9e80}
                  fill="currentColor"
                />
              </svg>
            </button>
            <div className="flex-1 bg-white rounded-[8px] border border-neutral-200 px-[13px] py-[5px]">
              <p className="font-['Geist:Regular',sans-serif] text-[14px] text-neutral-950">
                / Send it to your custom ERP
              </p>
            </div>
            <button className="p-[6px] hover:bg-neutral-100 rounded-[8px] transition-colors">
              <svg
                className="w-[16px] h-[16px]"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d={svgPathsTutorial.p31497e00}
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="p-[6px] hover:bg-neutral-100 rounded-[8px] transition-colors">
              <svg
                className="w-[16px] h-[16px]"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d={svgPathsTutorial.p12dcc4b0}
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-[6px] hover:bg-neutral-100 rounded-[8px] transition-colors"
            >
              <X className="w-[16px] h-[16px] text-neutral-950" />
            </button>
          </div>
        </div>

        {/* Video/Image Content */}
        <div className="h-[313px] bg-[#d9d9d9] overflow-hidden">
          <img
            src={imgTutorialView}
            alt="Tutorial"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 bg-[rgba(245,245,245,0.5)] p-[16px]">
          <button className="w-full flex items-center justify-between hover:bg-neutral-100 transition-colors rounded-[8px] px-[16px] py-[10px]">
            <p className="font-['Geist:Regular',sans-serif] text-[14px] text-neutral-950">
              Ver Video
            </p>
            <ChevronRight className="w-[16px] h-[16px] rotate-[270deg] text-neutral-950" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: "001", name: "Presupuesto · 001" },
    { id: "002", name: "Presupuesto · 002" },
    { id: "003", name: "Presupuesto · 003" },
  ]);
  const [selectedBudget, setSelectedBudget] = useState("001");
  const [viewMode, setViewMode] = useState<"preview" | "edit">(
    "preview",
  );
  const [agentMode, setAgentMode] = useState<"agent" | "forms">(
    "agent",
  );
  const [templateIndex, setTemplateIndex] = useState(0);
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAPIKeyDialog, setShowAPIKeyDialog] =
    useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("openai_api_key") || "";
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Chat messages state - separate messages per budget
  const [chatMessages, setChatMessages] = useState<
    Record<string, Message[]>
  >({
    "001": [],
    "002": [],
    "003": [],
  });

  // Budget data state
  const [budgetData, setBudgetData] = useState<
    Record<string, BudgetData>
  >({
    "001": {
      budgetNumber: "001",
      clientName: "Clientes varios",
      clientLocation: "España",
      date: "03/11/2025",
      dueDate: "18/11/2025",
      items: [
        {
          id: "1",
          concept: "Servicio Corte Láser",
          description: "Precio €/min de corte",
          price: 9.66,
          quantity: 37.44,
          ivaRate: 21,
        },
        {
          id: "2",
          concept: "Tablero DM · 100x80cm",
          description: "Grosor · 3mm",
          price: 9.17,
          quantity: 1,
          ivaRate: 21,
        },
      ],
    },
    "002": {
      budgetNumber: "002",
      clientName: "Cliente Ejemplo",
      clientLocation: "España",
      date: new Date().toLocaleDateString("es-ES"),
      dueDate: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("es-ES"),
      items: [],
    },
    "003": {
      budgetNumber: "003",
      clientName: "Cliente Ejemplo",
      clientLocation: "España",
      date: new Date().toLocaleDateString("es-ES"),
      dueDate: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString("es-ES"),
      items: [],
    },
  });

  const currentTemplate = templates[templateIndex];
  const currentBudgetData = budgetData[selectedBudget];
  const currentChatMessages =
    chatMessages[selectedBudget] || [];

  // Handler to update messages for current budget
  const updateChatMessages = useCallback(
    (newMessages: Message[]) => {
      setChatMessages((prev) => ({
        ...prev,
        [selectedBudget]: newMessages,
      }));
    },
    [selectedBudget],
  );

  // Handlers for budget updates
  const handleBudgetUpdate = (updates: Partial<BudgetData>) => {
    setBudgetData((prev) => ({
      ...prev,
      [selectedBudget]: {
        ...prev[selectedBudget],
        ...updates,
      },
    }));
  };

  const handleItemAdd = (item: BudgetItem) => {
    setBudgetData((prev) => ({
      ...prev,
      [selectedBudget]: {
        ...prev[selectedBudget],
        items: [...prev[selectedBudget].items, item],
      },
    }));
  };

  const handleItemUpdate = (
    itemIndex: number,
    updates: Partial<BudgetItem>,
  ) => {
    setBudgetData((prev) => ({
      ...prev,
      [selectedBudget]: {
        ...prev[selectedBudget],
        items: prev[selectedBudget].items.map((item, idx) =>
          idx === itemIndex ? { ...item, ...updates } : item,
        ),
      },
    }));
  };

  const handleItemRemove = (itemIndex: number) => {
    setBudgetData((prev) => ({
      ...prev,
      [selectedBudget]: {
        ...prev[selectedBudget],
        items: prev[selectedBudget].items.filter(
          (_, idx) => idx !== itemIndex,
        ),
      },
    }));
  };

  // AI Chat hook with optimized error handling
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    resetMessages,
  } = useAIChat({
    apiKey,
    budgetData: currentBudgetData,
    onBudgetUpdate: handleBudgetUpdate,
    onItemAdd: handleItemAdd,
    onItemUpdate: handleItemUpdate,
    onItemRemove: handleItemRemove,
    externalMessages: currentChatMessages,
    onMessagesChange: updateChatMessages,
  });

  const hasMessages = messages.length > 0;

  // No automatic welcome messages - user initiates conversation

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleNewBudget = () => {
    const newId = String(budgets.length + 1).padStart(3, "0");
    const newBudget = {
      id: newId,
      name: `Presupuesto · ${newId}`,
    };
    setBudgets([...budgets, newBudget]);
    setBudgetData((prev) => ({
      ...prev,
      [newId]: {
        budgetNumber: newId,
        clientName: "Cliente Ejemplo",
        clientLocation: "España",
        date: new Date().toLocaleDateString("es-ES"),
        dueDate: new Date(
          Date.now() + 15 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString("es-ES"),
        items: [],
      },
    }));
    setChatMessages((prev) => ({
      ...prev,
      [newId]: [],
    }));
    setSelectedBudget(newId);
  };

  const handlePreviousTemplate = () => {
    setTemplateIndex((prev) =>
      prev > 0 ? prev - 1 : templates.length - 1,
    );
  };

  const handleNextTemplate = () => {
    setTemplateIndex((prev) =>
      prev < templates.length - 1 ? prev + 1 : 0,
    );
  };

  const handlePreviousTutorial = () => {
    setTutorialIndex((prev) => (prev > 0 ? prev - 1 : 2));
  };

  const handleNextTutorial = () => {
    setTutorialIndex((prev) => (prev < 2 ? prev + 1 : 0));
  };

  const handleTemplateSelect = () => {
    const templateMessage = `Quiero crear un presupuesto usando la plantilla de ${currentTemplate.name}. Los detalles son: Servicio ${currentTemplate.service} a ${currentTemplate.serviceCost}, diseño CAD ${currentTemplate.design} por ${currentTemplate.designCost}, material ${currentTemplate.material}, entrega ${currentTemplate.delivery}.`;
    append({ role: "user", content: templateMessage });
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e as any);
    }
  };

  const handleSaveAPIKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem("openai_api_key", newApiKey);
  };

  // Show API Key dialog on first load if not configured
  useEffect(() => {
    if (!apiKey) {
      setShowAPIKeyDialog(true);
    }
  }, []);

  // Budget calculation helpers
  const calculateSubtotal = (item: BudgetItem) => {
    return item.price * item.quantity;
  };

  const calculateIVA = (item: BudgetItem) => {
    const subtotal = calculateSubtotal(item);
    return subtotal * (item.ivaRate / 100);
  };

  const calculateItemTotal = (item: BudgetItem) => {
    return calculateSubtotal(item) + calculateIVA(item);
  };

  const calculateBaseImponible = () => {
    return currentBudgetData.items.reduce(
      (sum, item) => sum + calculateSubtotal(item),
      0,
    );
  };

  const calculateTotalIVA = () => {
    return currentBudgetData.items.reduce(
      (sum, item) => sum + calculateIVA(item),
      0,
    );
  };

  const calculateTotal = () => {
    return calculateBaseImponible() + calculateTotalIVA();
  };

  // Budget editing functions
  const updateBudgetField = (
    field: keyof BudgetData,
    value: string,
  ) => {
    setBudgetData((prev) => ({
      ...prev,
      [selectedBudget]: {
        ...prev[selectedBudget],
        [field]: value,
      },
    }));
  };

  const updateBudgetItem = (
    itemId: string,
    field: keyof BudgetItem,
    value: string | number,
  ) => {
    setBudgetData((prev) => ({
      ...prev,
      [selectedBudget]: {
        ...prev[selectedBudget],
        items: prev[selectedBudget].items.map((item) =>
          item.id === itemId
            ? { ...item, [field]: value }
            : item,
        ),
      },
    }));
  };

  const addBudgetItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      concept: "",
      description: "",
      price: 0,
      quantity: 1,
      ivaRate: 21,
    };
    setBudgetData((prev) => ({
      ...prev,
      [selectedBudget]: {
        ...prev[selectedBudget],
        items: [...prev[selectedBudget].items, newItem],
      },
    }));
  };

  const removeBudgetItem = (itemId: string) => {
    setBudgetData((prev) => ({
      ...prev,
      [selectedBudget]: {
        ...prev[selectedBudget],
        items: prev[selectedBudget].items.filter(
          (item) => item.id !== itemId,
        ),
      },
    }));
  };

  // Calculate sidebar and panel widths
  const sidebarWidth = sidebarCollapsed ? 50 : 269;
  const pdfWidth = sidebarCollapsed ? 750 : 691;
  const chatWidth = sidebarCollapsed ? 530 : 480;

  return (
    <div
      className="bg-[#f3f3f3] content-stretch flex items-start relative size-full"
      data-name="Desktop - 9"
    >
      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      {/* API Key Settings Dialog */}
      <APIKeySettings
        isOpen={showAPIKeyDialog}
        onClose={() => setShowAPIKeyDialog(false)}
        currentKey={apiKey}
        onSave={handleSaveAPIKey}
      />

      {/* Left Sidebar */}
      <div
        className="bg-[#f3f3f3] box-border content-stretch flex flex-col h-full items-start p-[20px] relative shrink-0 transition-all duration-300"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div
          aria-hidden="true"
          className="absolute border-[0px_1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none"
        />

        {sidebarCollapsed ? (
          /* Minimized Sidebar */
          <div className="content-stretch flex flex-col items-center justify-between relative size-full">
            <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0">
              {/* Expand button */}
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="box-border content-stretch flex items-center justify-center px-0 py-[4px] relative shrink-0 hover:bg-neutral-200 rounded transition-colors"
              >
                <ChevronRight className="w-[16px] h-[16px] text-neutral-500" />
              </button>

              {/* New Budget Icon */}
              <button
                onClick={handleNewBudget}
                className="bg-white box-border content-stretch flex items-center justify-center p-[6px] relative rounded-[8px] shrink-0 size-[30px] hover:bg-neutral-100 transition-colors border border-neutral-200"
              >
                <Plus className="w-[16px] h-[16px] text-neutral-950" />
              </button>

              {/* Budgets - only show selected */}
              <button className="box-border content-stretch flex items-center justify-center px-0 py-[4px] relative w-full hover:bg-neutral-200 rounded transition-colors">
                <FileText className="w-[16px] h-[16px] text-neutral-950" />
              </button>
            </div>

            {/* Info button at bottom */}
            <button
              onClick={() => setShowTutorial(true)}
              className="bg-white box-border content-stretch flex items-center justify-center p-[6px] relative rounded-[8px] shrink-0 size-[30px] hover:bg-neutral-100 transition-colors border border-neutral-200"
            >
              <Info className="w-[16px] h-[16px] text-neutral-950" />
            </button>
          </div>
        ) : (
          /* Expanded Sidebar */
          <div className="content-stretch flex flex-col items-start justify-between relative size-full">
            <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full">
              {/* Agent Title Section */}
              <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <div className="box-border content-stretch flex items-center justify-between px-0 py-[4px] relative shrink-0 w-full">
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                    Arkcutt's Agent
                  </p>
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="overflow-clip relative shrink-0 size-[16px] hover:bg-neutral-200 rounded transition-colors"
                  >
                    <ChevronLeft className="w-[16px] h-[16px] text-neutral-500" />
                  </button>
                </div>

                {/* New Budget Button */}
                <button
                  onClick={handleNewBudget}
                  className="bg-white h-[28px] relative rounded-[4px] shrink-0 w-full hover:bg-neutral-50 transition-colors"
                >
                  <div
                    aria-hidden="true"
                    className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[4px]"
                  />
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="box-border content-stretch flex gap-[2px] h-[28px] items-center justify-center px-[4px] py-[2px] relative w-full">
                      <div className="box-border content-stretch flex gap-[8px] h-full items-center justify-center px-[8px] py-0 relative rounded-br-[2px] rounded-tr-[2px] shrink-0">
                        <Plus className="w-[12px] h-[12px] text-neutral-950" />
                        <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                          Nuevo Presupuesto
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* History Section */}
              <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                  Historial
                </p>
                <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
                  {budgets.map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() =>
                        setSelectedBudget(budget.id)
                      }
                      className={`box-border content-stretch flex items-center justify-between px-0 py-[4px] relative w-full hover:bg-neutral-200 rounded transition-colors cursor-pointer ${
                        selectedBudget === budget.id ? "" : ""
                      }`}
                    >
                      <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
                        {selectedBudget === budget.id && (
                          <div
                            className="overflow-clip relative shrink-0 size-[16px]"
                            data-name="<MinusIcon>"
                          >
                            <div
                              className="absolute inset-[45.83%_16.67%]"
                              data-name="Vector"
                            >
                              <svg
                                className="block size-full"
                                fill="none"
                                preserveAspectRatio="none"
                                viewBox="0 0 11 2"
                              >
                                <path
                                  d={svgPathsSidebar.p871f300}
                                  fill="var(--fill-0, #0A0A0A)"
                                  id="Vector"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                        <p
                          className={`font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-nowrap whitespace-pre ${
                            selectedBudget === budget.id
                              ? "text-neutral-950"
                              : "text-neutral-500"
                          }`}
                        >
                          {budget.name}
                        </p>
                      </div>
                      <MoreHorizontal className="w-[16px] h-[16px] text-neutral-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tutorial Section at Bottom */}
            <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 w-full">
              <div
                className="bg-white relative rounded-[10px] shrink-0 w-full"
                data-name="ContextContent"
              >
                <div className="box-border content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
                  <div
                    className="relative shrink-0 w-full"
                    data-name="ContextContentHeader"
                  >
                    <div className="size-full">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] items-start p-[12px] relative w-full">
                        <div className="relative shrink-0 w-full">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-between relative w-full">
                            <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">
                              Tutorials
                            </p>
                            <div className="h-[16px] shrink-0 w-0" />
                            <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                              Send it to your ERP
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="h-[139px] relative shrink-0 w-full"
                    data-name="ContextContentBody"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute border-[1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none"
                    />
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[139px] items-start pb-0 pt-px px-0 relative w-full">
                      <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
                        <div
                          aria-hidden="true"
                          className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 pointer-events-none"
                        >
                          <div className="absolute bg-[#d9d9d9] bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0" />
                          <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 overflow-hidden">
                            <img
                              alt=""
                              className="absolute h-[124.1%] left-0 max-w-none top-[-8.3%] w-full"
                              src={imgTutorial}
                            />
                          </div>
                        </div>
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-full" />
                      </div>
                    </div>
                  </div>
                  <div
                    className="bg-neutral-100 relative shrink-0 w-full"
                    data-name="ContextContentFooter"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute border-[1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none"
                    />
                    <div className="flex flex-row items-center size-full">
                      <button
                        onClick={() => setShowTutorial(true)}
                        className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] items-center pb-[12px] pt-[13px] px-[12px] relative w-full hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        <p className="basis-0 font-['Geist:Regular',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-neutral-500">
                          Ver tutorial
                        </p>
                        <div
                          className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                          style={
                            {
                              "--transform-inner-width": "12",
                              "--transform-inner-height": "12",
                            } as React.CSSProperties
                          }
                        >
                          <div className="flex-none rotate-[90deg]">
                            <div
                              className="relative"
                              data-name="icon"
                            >
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center relative">
                                <div
                                  className="overflow-clip relative shrink-0 size-[12px]"
                                  data-name="<ArrowUpIcon>"
                                >
                                  <div
                                    className="absolute inset-[16.67%]"
                                    data-name="Vector"
                                  >
                                    <div
                                      className="absolute inset-0"
                                      style={
                                        {
                                          "--fill-0":
                                            "rgba(10, 10, 10, 1)",
                                        } as React.CSSProperties
                                      }
                                    >
                                      <svg
                                        className="block size-full"
                                        fill="none"
                                        preserveAspectRatio="none"
                                        viewBox="0 0 8 8"
                                      >
                                        <path
                                          d={
                                            svgPathsSidebar.p2fcb6240
                                          }
                                          fill="var(--fill-0, #0A0A0A)"
                                          id="Vector"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[10px]"
                />
              </div>
              <div
                className="box-border content-stretch flex gap-[8px] items-center justify-end px-[40px] py-0 relative shrink-0"
                data-name="BranchSelector"
              >
                <button
                  onClick={handlePreviousTutorial}
                  className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[10px] py-0 relative rounded-[9999px] shrink-0 size-[28px] hover:bg-neutral-200 transition-colors cursor-pointer"
                  data-name="BranchPrevious"
                >
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-name="icon"
                  >
                    <div
                      className="overflow-clip relative shrink-0 size-[16px]"
                      data-name="svg"
                    >
                      <div
                        className="absolute inset-[20.83%_33.33%]"
                        data-name="Vector"
                      >
                        <div
                          className="absolute inset-0"
                          style={
                            {
                              "--fill-0":
                                "rgba(115, 115, 115, 1)",
                            } as React.CSSProperties
                          }
                        >
                          <svg
                            className="block size-full"
                            fill="none"
                            preserveAspectRatio="none"
                            viewBox="0 0 6 10"
                          >
                            <path
                              d={svgPathsSidebar.p2b677780}
                              fill="var(--fill-0, #737373)"
                              id="Vector"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                <div
                  className="content-stretch flex font-['Geist:Medium',sans-serif] gap-[2.5px] items-center justify-center leading-[normal] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre"
                  data-name="BranchPage"
                >
                  <p className="relative shrink-0">
                    {tutorialIndex + 1}
                  </p>
                  <p className="relative shrink-0">of</p>
                  <p className="relative shrink-0">3</p>
                </div>
                <button
                  onClick={handleNextTutorial}
                  className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[10px] py-0 relative rounded-[9999px] shrink-0 size-[28px] hover:bg-neutral-200 transition-colors cursor-pointer"
                  data-name="BranchNext"
                >
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-name="icon"
                  >
                    <div
                      className="overflow-clip relative shrink-0 size-[16px]"
                      data-name="svg"
                    >
                      <div
                        className="absolute inset-[20.83%_33.33%]"
                        data-name="Vector"
                      >
                        <div
                          className="absolute inset-0"
                          style={
                            {
                              "--fill-0":
                                "rgba(115, 115, 115, 1)",
                            } as React.CSSProperties
                          }
                        >
                          <svg
                            className="block size-full"
                            fill="none"
                            preserveAspectRatio="none"
                            viewBox="0 0 6 10"
                          >
                            <path
                              d={svgPathsSidebar.p2fed9780}
                              fill="var(--fill-0, #737373)"
                              id="Vector"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Holded Integration - Debug & Knowledge */}
              {!sidebarCollapsed && (
                <div className="px-[20px] py-[10px] space-y-3">
                  <HoldedDebug />
                  <HoldedKnowledge />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Middle Panel - PDF */}
      <div
        className="bg-white box-border content-stretch flex flex-col gap-[10px] h-full items-center px-[20px] py-[15px] relative shrink-0 transition-all duration-300"
        style={{ width: `${pdfWidth}px` }}
      >
        <div
          aria-hidden="true"
          className="absolute border-[0px_1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none"
        />

        {/* Preview/Edit Toggle and Actions */}
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div className="bg-neutral-200 box-border content-stretch flex gap-[2px] h-[28px] items-center p-[2px] relative rounded-[4px] shrink-0">
            <button
              onClick={() => setViewMode("preview")}
              className={`box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-bl-[2px] rounded-tl-[2px] shrink-0 transition-colors ${
                viewMode === "preview" ? "bg-[#d9d9d9]" : ""
              }`}
            >
              <p
                className={`font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
                  viewMode === "preview"
                    ? "text-neutral-950"
                    : "text-neutral-500"
                }`}
              >
                Preview
              </p>
            </button>
            <button
              onClick={() => setViewMode("edit")}
              className={`box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-br-[2px] rounded-tr-[2px] shrink-0 transition-colors ${
                viewMode === "edit" ? "bg-[#d9d9d9]" : ""
              }`}
            >
              <p
                className={`font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
                  viewMode === "edit"
                    ? "text-neutral-950"
                    : "text-neutral-500"
                }`}
              >
                Edit
              </p>
            </button>
          </div>

          <div
            className="content-stretch flex h-[28px] items-center gap-[8px] relative shrink-0"
            data-name="OpenIn"
          >
            <div
              className="content-stretch flex items-start relative shrink-0"
              data-name="OpenInTrigger"
            >
              <HoldedButton
                budgetData={budgetData[selectedBudget]}
                disabled={
                  budgetData[selectedBudget].items.length === 0
                }
              />
            </div>

            {/* Action Buttons */}
            <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
              <Share2 className="w-[16px] h-[16px] text-neutral-500" />
            </button>
            <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
              <Heart className="w-[16px] h-[16px] text-neutral-500" />
            </button>
            <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
              <MoreHorizontal className="w-[16px] h-[16px] text-neutral-500" />
            </button>
          </div>
        </div>

        {/* PDF Content with custom scrollbar */}
        <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full overflow-y-auto pdf-scrollbar">
          <style>{`
            .pdf-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .pdf-scrollbar::-webkit-scrollbar-track {
              background: #f3f3f3;
              border-radius: 10px;
            }
            .pdf-scrollbar::-webkit-scrollbar-thumb {
              background: #d4d4d4;
              border-radius: 10px;
            }
            .pdf-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #a3a3a3;
            }
          `}</style>

          {viewMode === "preview" ? (
            /* Preview Mode - PDF */
            <div className="bg-white box-border content-stretch flex flex-col gap-[20px] min-h-[842px] items-start p-[40px] relative shrink-0">
              {/* Logo and Company Info */}
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full max-w-[553px]">
                <div className="flex flex-row items-center self-stretch">
                  <div
                    className="aspect-[800/800] h-full relative shrink-0"
                    data-name="[LIGHT MODE] ARKCUTT LOGO 2"
                  >
                    <img
                      alt=""
                      className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                      src={imgLogo}
                    />
                  </div>
                </div>
                <div className="content-stretch flex flex-col font-['Geist:Regular',sans-serif] items-end not-italic relative shrink-0 text-[11px] text-neutral-500 text-right">
                  <p className="leading-[11px] relative shrink-0 text-nowrap whitespace-pre">
                    Asociación Junior Empresa MAKOSITE
                  </p>
                  <p className="leading-[11px] relative shrink-0 text-nowrap whitespace-pre">
                    G72660145
                  </p>
                  <div className="leading-[11px] relative shrink-0 w-[193px]">
                    <p className="mb-0">
                      Carrer Ciutat d'Asunción, 16
                    </p>
                    <p>Barcelona (08030), Barcelona, España</p>
                  </div>
                </div>
              </div>

              <div className="h-0 relative shrink-0 w-full max-w-[553px]">
                <div
                  className="absolute bottom-0 left-0 right-0 top-[-1px]"
                  style={
                    {
                      "--stroke-0": "rgba(229, 229, 229, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 553 1"
                  >
                    <line
                      id="Line 96"
                      stroke="var(--stroke-0, #E5E5E5)"
                      x2="553"
                      y1="0.5"
                      y2="0.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Budget Header */}
              <div className="content-stretch flex flex-col gap-[35px] items-start relative shrink-0 w-full max-w-[553px]">
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                    Presupuesto ·{" "}
                    {currentBudgetData.budgetNumber}
                  </p>
                  <div className="content-stretch flex flex-col font-['Geist:Regular',sans-serif] gap-[2px] items-end leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 text-right w-[193px]">
                    <p className="relative shrink-0 w-full">
                      Fecha: {currentBudgetData.date}
                    </p>
                    <p className="relative shrink-0 w-full">
                      Vencimiento: {currentBudgetData.dueDate}
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between not-italic relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[81px]">
                    <p className="leading-[12px] relative shrink-0 text-[12px] text-neutral-950 w-full">
                      {currentBudgetData.clientName}
                    </p>
                    <p className="leading-[11px] relative shrink-0 text-[11px] text-neutral-500 w-full">
                      {currentBudgetData.clientLocation}
                    </p>
                  </div>
                  <p className="leading-[16px] relative shrink-0 text-[20px] text-neutral-950 text-nowrap whitespace-pre">
                    Total {calculateTotal().toFixed(2)}€
                  </p>
                </div>
              </div>

              <div className="h-0 relative shrink-0 w-full max-w-[553px]">
                <div
                  className="absolute bottom-0 left-0 right-0 top-[-1px]"
                  style={
                    {
                      "--stroke-0": "rgba(229, 229, 229, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 553 1"
                  >
                    <line
                      id="Line 96"
                      stroke="var(--stroke-0, #E5E5E5)"
                      x2="553"
                      y1="0.5"
                      y2="0.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Budget Items */}
              <div className="content-stretch flex flex-col gap-[12px] items-end relative shrink-0 w-full max-w-[553px]">
                <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
                  {/* Table Header */}
                  <div className="content-stretch flex gap-[145px] items-center relative shrink-0 w-full">
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                      Concepto
                    </p>
                    <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[16px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 w-[345px]">
                      <p className="relative shrink-0 text-nowrap whitespace-pre">
                        Precio
                      </p>
                      <p className="relative shrink-0 text-nowrap whitespace-pre">
                        Unidades
                      </p>
                      <p className="relative shrink-0 text-nowrap whitespace-pre">
                        Subtotal
                      </p>
                      <p className="relative shrink-0 w-[20px]">
                        Iva
                      </p>
                      <p className="relative shrink-0 w-[38px]">
                        Total
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  {currentBudgetData.items.map((item) => (
                    <div
                      key={item.id}
                      className="content-stretch flex items-start justify-between relative shrink-0 w-full"
                    >
                      <div className="content-stretch flex flex-col font-['Geist:Regular',sans-serif] gap-[2px] items-start not-italic relative shrink-0 text-nowrap w-[81px] whitespace-pre">
                        <p className="leading-[12px] relative shrink-0 text-[12px] text-neutral-950">
                          {item.concept}
                        </p>
                        <p className="leading-[11px] relative shrink-0 text-[11px] text-neutral-500">
                          {item.description}
                        </p>
                      </div>
                      <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 w-[345px]">
                        <p className="relative shrink-0 text-right w-[41px]">
                          {item.price.toFixed(2)}€
                        </p>
                        <p className="relative shrink-0 text-right w-[60px]">
                          {item.quantity}
                        </p>
                        <p className="relative shrink-0 text-right w-[55px]">
                          {calculateSubtotal(item).toFixed(2)}€
                        </p>
                        <p className="relative shrink-0 w-[20px]">
                          {item.ivaRate}%
                        </p>
                        <p className="relative shrink-0 text-nowrap text-right whitespace-pre">
                          {calculateItemTotal(item).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[175px]">
                  <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[16px] not-italic relative shrink-0 text-center text-neutral-950 text-nowrap w-full whitespace-pre">
                    <p className="relative shrink-0 text-[14px]">
                      Base Imponible
                    </p>
                    <p className="relative shrink-0 text-[11px]">
                      {calculateBaseImponible().toFixed(2)}€
                    </p>
                  </div>
                  <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[16px] not-italic relative shrink-0 text-neutral-950 w-full">
                    <p className="relative shrink-0 text-[14px] text-right w-[99px]">
                      Iva
                    </p>
                    <p className="relative shrink-0 text-[11px] text-center text-nowrap whitespace-pre">
                      {calculateTotalIVA().toFixed(2)}€
                    </p>
                  </div>
                  <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[16px] not-italic relative shrink-0 text-neutral-950 w-full">
                    <p className="relative shrink-0 text-[14px] text-right w-[99px]">
                      Total
                    </p>
                    <p className="relative shrink-0 text-[11px] text-center text-nowrap whitespace-pre">
                      {calculateTotal().toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode - Form */
            <div className="bg-white box-border content-stretch flex flex-col gap-[20px] items-start p-[40px] relative shrink-0">
              {/* Logo and Company Info - Static */}
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full max-w-[553px]">
                <div className="flex flex-row items-center self-stretch">
                  <div
                    className="aspect-[800/800] h-full relative shrink-0"
                    data-name="[LIGHT MODE] ARKCUTT LOGO 2"
                  >
                    <img
                      alt=""
                      className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                      src={imgLogo}
                    />
                  </div>
                </div>
                <div className="content-stretch flex flex-col font-['Geist:Regular',sans-serif] items-end not-italic relative shrink-0 text-[11px] text-neutral-500 text-right">
                  <p className="leading-[11px] relative shrink-0 text-nowrap whitespace-pre">
                    Asociación Junior Empresa MAKOSITE
                  </p>
                  <p className="leading-[11px] relative shrink-0 text-nowrap whitespace-pre">
                    G72660145
                  </p>
                  <div className="leading-[11px] relative shrink-0 w-[193px]">
                    <p className="mb-0">
                      Carrer Ciutat d'Asunción, 16
                    </p>
                    <p>Barcelona (08030), Barcelona, España</p>
                  </div>
                </div>
              </div>

              <div className="h-0 relative shrink-0 w-full max-w-[553px]">
                <div
                  className="absolute bottom-0 left-0 right-0 top-[-1px]"
                  style={
                    {
                      "--stroke-0": "rgba(229, 229, 229, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 553 1"
                  >
                    <line
                      id="Line 96"
                      stroke="var(--stroke-0, #E5E5E5)"
                      x2="553"
                      y1="0.5"
                      y2="0.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Budget Header - Editable */}
              <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full max-w-[553px]">
                <div className="content-stretch flex items-start gap-[62px] relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[7px] items-start relative shrink-0">
                    <p className="font-['Geist:Regular',sans-serif] leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 w-full">
                      Numero Presupuesto
                    </p>
                    <div className="bg-[#f3f3f3] box-border border border-neutral-200 rounded-[6px] px-[10px] py-[4px]">
                      <input
                        type="text"
                        value={currentBudgetData.budgetNumber}
                        onChange={(e) =>
                          updateBudgetField(
                            "budgetNumber",
                            e.target.value,
                          )
                        }
                        className="font-['Geist:Regular',sans-serif] leading-[16px] text-[14px] text-neutral-950 bg-transparent border-none outline-none"
                      />
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[7px] items-start relative shrink-0 w-[118px]">
                    <p className="font-['Geist:Regular',sans-serif] leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 w-full">
                      Fecha
                    </p>
                    <div className="bg-[#f3f3f3] box-border border border-neutral-200 rounded-[6px] px-[10px] py-[4px] w-full">
                      <input
                        type="text"
                        value={currentBudgetData.date}
                        onChange={(e) =>
                          updateBudgetField(
                            "date",
                            e.target.value,
                          )
                        }
                        className="font-['Geist:Regular',sans-serif] leading-[20px] text-[14px] text-slate-950 bg-transparent border-none outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[7px] items-start relative shrink-0 w-[118px]">
                    <p className="font-['Geist:Regular',sans-serif] leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 w-full">
                      Vencimiento
                    </p>
                    <div className="bg-[#f3f3f3] box-border border border-neutral-200 rounded-[6px] px-[10px] py-[4px] w-full">
                      <input
                        type="text"
                        value={currentBudgetData.dueDate}
                        onChange={(e) =>
                          updateBudgetField(
                            "dueDate",
                            e.target.value,
                          )
                        }
                        className="font-['Geist:Regular',sans-serif] leading-[20px] text-[14px] text-slate-950 bg-transparent border-none outline-none w-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[7px] items-start relative shrink-0">
                    <p className="font-['Geist:Regular',sans-serif] leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 w-full">
                      Cliente
                    </p>
                    <div className="bg-[#f3f3f3] box-border border border-neutral-200 rounded-[6px] px-[10px] py-[4px]">
                      <input
                        type="text"
                        value={currentBudgetData.clientName}
                        onChange={(e) =>
                          updateBudgetField(
                            "clientName",
                            e.target.value,
                          )
                        }
                        className="font-['Geist:Regular',sans-serif] leading-[20px] text-[14px] text-slate-950 bg-transparent border-none outline-none"
                      />
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[7px] items-start relative shrink-0 w-[270px]">
                    <p className="font-['Geist:Regular',sans-serif] leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 w-full">
                      Ubicación
                    </p>
                    <div className="bg-[#f3f3f3] box-border border border-neutral-200 rounded-[6px] px-[10px] py-[4px] w-full">
                      <input
                        type="text"
                        value={currentBudgetData.clientLocation}
                        onChange={(e) =>
                          updateBudgetField(
                            "clientLocation",
                            e.target.value,
                          )
                        }
                        className="font-['Geist:Regular',sans-serif] leading-[20px] text-[14px] text-slate-950 bg-transparent border-none outline-none w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-0 relative shrink-0 w-full max-w-[553px]">
                <div
                  className="absolute bottom-0 left-0 right-0 top-[-1px]"
                  style={
                    {
                      "--stroke-0": "rgba(229, 229, 229, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 553 1"
                  >
                    <line
                      id="Line 96"
                      stroke="var(--stroke-0, #E5E5E5)"
                      x2="553"
                      y1="0.5"
                      y2="0.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Budget Items - Editable */}
              <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full max-w-[553px]">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">
                    Concepto
                  </p>
                  <button
                    onClick={addBudgetItem}
                    className="bg-white border border-neutral-200 rounded-[8px] px-[8px] py-[4px] flex items-center gap-[6px] hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="w-[16px] h-[16px] text-neutral-950" />
                    <p className="font-['Geist:Medium',sans-serif] leading-[20px] text-[12px] text-neutral-950">
                      Añadir Fila
                    </p>
                  </button>
                </div>

                {currentBudgetData.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#f3f3f3] border border-neutral-200 rounded-[6px] p-[10px] w-full"
                  >
                    <div className="flex flex-col gap-[10px]">
                      {/* Concept and Delete */}
                      <div className="flex gap-[20px] items-center">
                        <div className="flex-1 flex flex-col gap-[6px]">
                          <p className="font-['Geist:Regular',sans-serif] leading-[11px] text-[11px] text-neutral-500">
                            Concepto
                          </p>
                          <div className="bg-[#f3f3f3] border border-neutral-200 rounded-[6px] px-[10px] py-[4px]">
                            <input
                              type="text"
                              value={item.concept}
                              onChange={(e) =>
                                updateBudgetItem(
                                  item.id,
                                  "concept",
                                  e.target.value,
                                )
                              }
                              className="font-['Geist:Regular',sans-serif] leading-[16px] text-[14px] text-neutral-950 bg-transparent border-none outline-none w-full"
                              placeholder="Ej: Servicio Corte Láser"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            removeBudgetItem(item.id)
                          }
                          className="mt-[20px] rotate-45"
                        >
                          <Plus className="w-[16px] h-[16px] text-neutral-950" />
                        </button>
                      </div>

                      {/* Description */}
                      <div className="flex flex-col gap-[6px]">
                        <p className="font-['Geist:Regular',sans-serif] leading-[11px] text-[11px] text-neutral-500">
                          Descripción
                        </p>
                        <div className="bg-[#f3f3f3] border border-neutral-200 rounded-[6px] px-[10px] py-[4px]">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateBudgetItem(
                                item.id,
                                "description",
                                e.target.value,
                              )
                            }
                            className="font-['Geist:Regular',sans-serif] leading-[16px] text-[14px] text-neutral-950 bg-transparent border-none outline-none w-full"
                            placeholder="Ej: Precio €/min de corte"
                          />
                        </div>
                      </div>

                      {/* Price, Units, IVA, Subtotal */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-[7px]">
                          <p className="font-['Geist:Regular',sans-serif] leading-[11px] text-[11px] text-neutral-500">
                            Precio
                          </p>
                          <div className="bg-[#f3f3f3] border border-neutral-200 rounded-[6px] px-[10px] py-[4px] w-[96px]">
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) =>
                                updateBudgetItem(
                                  item.id,
                                  "price",
                                  parseFloat(e.target.value) ||
                                    0,
                                )
                              }
                              className="font-['Geist:Regular',sans-serif] leading-[16px] text-[14px] text-neutral-950 bg-transparent border-none outline-none w-full"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-[7px]">
                          <p className="font-['Geist:Regular',sans-serif] leading-[11px] text-[11px] text-neutral-500">
                            Unidades
                          </p>
                          <div className="bg-[#f3f3f3] border border-neutral-200 rounded-[6px] px-[10px] py-[4px] w-[91px]">
                            <input
                              type="number"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) =>
                                updateBudgetItem(
                                  item.id,
                                  "quantity",
                                  parseFloat(e.target.value) ||
                                    0,
                                )
                              }
                              className="font-['Geist:Regular',sans-serif] leading-[20px] text-[14px] text-slate-950 bg-transparent border-none outline-none w-full"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-[7px]">
                          <p className="font-['Geist:Regular',sans-serif] leading-[11px] text-[11px] text-neutral-500">
                            IVA
                          </p>
                          <div className="relative w-[94px]">
                            <select
                              value={item.ivaRate}
                              onChange={(e) =>
                                updateBudgetItem(
                                  item.id,
                                  "ivaRate",
                                  parseInt(e.target.value),
                                )
                              }
                              className="bg-[#f3f3f3] border border-neutral-200 rounded-[6px] px-[10px] py-[4px] font-['Geist:Regular',sans-serif] leading-[20px] text-[14px] text-slate-950 w-full appearance-none pr-[30px]"
                            >
                              <option value="21">21%</option>
                              <option value="10">10%</option>
                              <option value="4">4%</option>
                              <option value="0">Exenta</option>
                            </select>
                            <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg
                                className="w-[12px] h-[12px]"
                                fill="none"
                                viewBox="0 0 12 12"
                              >
                                <path
                                  d={svgPathsEdit.p1e450100}
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-[7px]">
                          <p className="font-['Geist:Regular',sans-serif] leading-[11px] text-[11px] text-neutral-500">
                            Subtotal
                          </p>
                          <div className="bg-[#f3f3f3] border border-neutral-200 rounded-[6px] px-[10px] py-[4px] w-[91px]">
                            <p className="font-['Geist:Regular',sans-serif] leading-[20px] text-[14px] text-slate-950">
                              {calculateSubtotal(item).toFixed(
                                2,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Item totals */}
                      <div className="flex flex-col gap-[6px] items-end">
                        <p className="font-['Geist:Regular',sans-serif] leading-[11px] text-[11px] text-neutral-500">
                          Iva: {calculateIVA(item).toFixed(2)}€
                        </p>
                        <p className="font-['Geist:Regular',sans-serif] leading-[16px] text-[14px] text-neutral-950">
                          Total:{" "}
                          {calculateItemTotal(item).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Totals Display */}
                <div className="flex flex-col gap-[24px] items-start w-[175px] self-end">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] text-[14px] text-neutral-950">
                      Base Imponible
                    </p>
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] text-[11px] text-neutral-950">
                      {calculateBaseImponible().toFixed(2)}€
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] text-[14px] text-neutral-950 text-right w-[99px]">
                      Iva 21%
                    </p>
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] text-[11px] text-neutral-950">
                      {calculateTotalIVA().toFixed(2)}€
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] text-[14px] text-neutral-950 text-right w-[99px]">
                      Total
                    </p>
                    <p className="font-['Geist:Regular',sans-serif] leading-[16px] text-[11px] text-neutral-950">
                      {calculateTotal().toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div
        className="box-border content-stretch flex flex-col h-full items-center p-[20px] relative shrink-0 transition-all duration-300"
        style={{ width: `${chatWidth}px` }}
      >
        {/* Agent/Forms Toggle */}
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div className="bg-neutral-200 box-border content-stretch flex gap-[2px] h-[28px] items-center p-[2px] relative rounded-[4px] shrink-0">
            <button
              onClick={() => setAgentMode("agent")}
              className={`box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-bl-[2px] rounded-tl-[2px] shrink-0 transition-colors ${
                agentMode === "agent" ? "bg-[#d9d9d9]" : ""
              }`}
            >
              <p
                className={`font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
                  agentMode === "agent"
                    ? "text-neutral-950"
                    : "text-neutral-500"
                }`}
              >
                Agent
              </p>
            </button>
            <button
              onClick={() => setAgentMode("forms")}
              className={`box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-br-[2px] rounded-tr-[2px] shrink-0 transition-colors ${
                agentMode === "forms" ? "bg-[#d9d9d9]" : ""
              }`}
            >
              <p
                className={`font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
                  agentMode === "forms"
                    ? "text-neutral-950"
                    : "text-neutral-500"
                }`}
              >
                Forms
              </p>
            </button>
          </div>

          {/* API Key & Dropdown Buttons */}
          <div className="content-stretch flex items-center gap-[8px] relative shrink-0">
            {/* API Key Config Button */}
            <button
              onClick={() => setShowAPIKeyDialog(true)}
              className={`box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] transition-colors cursor-pointer ${
                apiKey
                  ? "bg-green-50 hover:bg-green-100"
                  : "bg-amber-50 hover:bg-amber-100 animate-pulse"
              }`}
              title={
                apiKey
                  ? "API Key configurada"
                  : "Configurar API Key"
              }
            >
              <svg
                className="shrink-0 size-[16px]"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 3.5C7.17157 3.5 6.5 4.17157 6.5 5C6.5 5.82843 7.17157 6.5 8 6.5C8.82843 6.5 9.5 5.82843 9.5 5C9.5 4.17157 8.82843 3.5 8 3.5ZM5 5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5C11 6.30622 10.1652 7.41746 9 7.82929V11.5H11.5V13H4.5V11.5H7V7.82929C5.83481 7.41746 5 6.30622 5 5Z"
                  fill={apiKey ? "#10b981" : "#f59e0b"}
                />
              </svg>
            </button>

            <div
              className="content-stretch flex isolate items-center justify-center relative shrink-0"
              data-name="Action"
            >
              <div
                className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1] hover:bg-neutral-100 transition-colors cursor-pointer"
                data-name="Button"
              >
                <div
                  className="overflow-clip relative shrink-0 size-[16px]"
                  data-name="<ChevronDownIcon>"
                >
                  <div
                    className="absolute inset-[33.33%_20.83%]"
                    data-name="Vector"
                  >
                    <div
                      className="absolute inset-0"
                      style={
                        {
                          "--fill-0": "rgba(115, 115, 115, 1)",
                        } as React.CSSProperties
                      }
                    >
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          d={svgPathsTemplates.pbeb5300}
                          fill="var(--fill-0, #737373)"
                          id="Vector"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages Area or Template Suggestions */}
        <div
          ref={chatContainerRef}
          className="basis-0 content-stretch flex flex-col gap-[30px] grow items-center min-h-px min-w-px relative shrink-0 w-full overflow-y-auto py-[20px] pdf-scrollbar"
        >
          {!hasMessages ? (
            /* Show Template Suggestions or API Key Warning */
            !apiKey ? (
              /* API Key Warning */
              <div className="content-stretch flex flex-col gap-[20px] items-center justify-center relative shrink-0 w-full h-full px-[20px]">
                <div className="flex flex-col items-center gap-[12px]">
                  <div className="w-[64px] h-[64px] rounded-full bg-amber-100 flex items-center justify-center">
                    <svg
                      className="w-[32px] h-[32px]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 6C11.1716 6 10.5 6.67157 10.5 7.5C10.5 8.32843 11.1716 9 12 9C12.8284 9 13.5 8.32843 13.5 7.5C13.5 6.67157 12.8284 6 12 6ZM8 7.5C8 5.29086 9.79086 3.5 12 3.5C14.2091 3.5 16 5.29086 16 7.5C16 9.20932 14.8304 10.6261 13.25 11.1207V17.25H16.75V20.5H7.25V17.25H10.75V11.1207C9.16962 10.6261 8 9.20932 8 7.5Z"
                        fill="#f59e0b"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] text-center">
                    <h3 className="text-[16px] font-medium text-neutral-950">
                      Configuración requerida
                    </h3>
                    <p className="text-[14px] text-neutral-600 max-w-[280px]">
                      Para usar el agente de IA conversacional,
                      necesitas configurar tu API Key de OpenAI.
                    </p>
                  </div>
                  <ShadButton
                    onClick={() => setShowAPIKeyDialog(true)}
                    className="bg-[#c96442] hover:bg-[#b85838] text-white mt-[8px]"
                  >
                    Configurar API Key
                  </ShadButton>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-neutral-500 hover:text-neutral-700 underline"
                  >
                    ¿Cómo obtengo una API Key?
                  </a>
                </div>
              </div>
            ) : (
              /* Show Template Suggestions and Quick Actions */
              <div className="content-stretch flex flex-col gap-[20px] items-center justify-center relative shrink-0 w-full h-full">
                <QuickActions
                  onAction={(prompt) => {
                    setInput(prompt);
                    setTimeout(() => {
                      const form =
                        document.querySelector("form");
                      if (form) {
                        form.dispatchEvent(
                          new Event("submit", {
                            cancelable: true,
                            bubbles: true,
                          }),
                        );
                      }
                    }, 100);
                  }}
                />
                <TemplateSuggestion
                  template={currentTemplate}
                  index={templateIndex}
                  onSelect={handleTemplateSelect}
                />
                <div
                  className="box-border content-stretch flex gap-[8px] items-center justify-end px-[40px] py-0 relative shrink-0"
                  data-name="BranchSelector"
                >
                  <button
                    onClick={handlePreviousTemplate}
                    className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[10px] py-0 relative rounded-[9999px] shrink-0 size-[28px] hover:bg-neutral-200 transition-colors cursor-pointer"
                    data-name="BranchPrevious"
                  >
                    <div
                      className="content-stretch flex gap-[8px] items-center relative shrink-0"
                      data-name="icon"
                    >
                      <div
                        className="overflow-clip relative shrink-0 size-[16px]"
                        data-name="svg"
                      >
                        <div
                          className="absolute inset-[20.83%_33.33%]"
                          data-name="Vector"
                        >
                          <div
                            className="absolute inset-0"
                            style={
                              {
                                "--fill-0":
                                  "rgba(115, 115, 115, 1)",
                              } as React.CSSProperties
                            }
                          >
                            <svg
                              className="block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 6 10"
                            >
                              <path
                                d={svgPathsTemplates.p2b677780}
                                fill="var(--fill-0, #737373)"
                                id="Vector"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                  <div
                    className="content-stretch flex font-['Geist:Medium',sans-serif] gap-[2.5px] items-center justify-center leading-[normal] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre"
                    data-name="BranchPage"
                  >
                    <p className="relative shrink-0">
                      {templateIndex + 1}
                    </p>
                    <p className="relative shrink-0">of</p>
                    <p className="relative shrink-0">
                      {templates.length}
                    </p>
                  </div>
                  <button
                    onClick={handleNextTemplate}
                    className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[10px] py-0 relative rounded-[9999px] shrink-0 size-[28px] hover:bg-neutral-200 transition-colors cursor-pointer"
                    data-name="BranchNext"
                  >
                    <div
                      className="content-stretch flex gap-[8px] items-center relative shrink-0"
                      data-name="icon"
                    >
                      <div
                        className="overflow-clip relative shrink-0 size-[16px] rotate-180"
                        data-name="svg"
                      >
                        <div
                          className="absolute inset-[20.83%_33.33%]"
                          data-name="Vector"
                        >
                          <div
                            className="absolute inset-0"
                            style={
                              {
                                "--fill-0":
                                  "rgba(115, 115, 115, 1)",
                              } as React.CSSProperties
                            }
                          >
                            <svg
                              className="block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 6 10"
                            >
                              <path
                                d={svgPathsTemplates.p2b677780}
                                fill="var(--fill-0, #737373)"
                                id="Vector"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Show Chat Messages */
            <>
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <UserMessage key={msg.id} message={msg} />
                ) : (
                  <AssistantMessage
                    key={msg.id}
                    message={msg}
                  />
                ),
              )}

              {isLoading && (
                <div className="content-stretch flex flex-col gap-[8px] items-start justify-end relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full">
                    <div className="bg-white relative rounded-[9999px] shrink-0 size-[40px]">
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
                    <div className="bg-neutral-100 rounded-[12px] px-[16px] py-[12px]">
                      <div className="flex gap-[4px]">
                        <div
                          className="w-[8px] h-[8px] bg-neutral-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-[8px] h-[8px] bg-neutral-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-[8px] h-[8px] bg-neutral-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleChatSubmit}
          className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full"
        >
          <div
            className="bg-white box-border content-stretch flex flex-col items-start p-px relative rounded-[16px] shrink-0 w-full"
            data-name="PromptInput"
          >
            <div
              aria-hidden="true"
              className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[16px]"
            />
            <div
              className="relative shrink-0 w-full"
              data-name="PromptInputBody"
            >
              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
                <div
                  className="h-[72px] max-h-[192px] min-h-[64px] relative shrink-0 w-full"
                  data-name="Textarea"
                >
                  <div className="max-h-inherit min-h-inherit size-full">
                    <div className="box-border content-stretch flex gap-[8px] h-[72px] items-start max-h-inherit min-h-inherit p-[12px] relative w-full">
                      <textarea
                        value={input}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder={
                          apiKey
                            ? "Escribe un mensaje al agente..."
                            : "Configura tu API Key para comenzar..."
                        }
                        disabled={!apiKey}
                        className="basis-0 font-['Geist:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-neutral-950 placeholder:text-neutral-500 bg-transparent border-none outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="relative rounded-bl-[10px] rounded-br-[10px] shrink-0 w-full"
              data-name="<PromptInputToolbar>"
            >
              <div className="size-full">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start justify-between pb-[12px] pt-0 px-[12px] relative w-full">
                  <div
                    className="relative shrink-0"
                    data-name="PromptInputTools"
                  >
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
                      <button
                        className="box-border content-stretch cursor-pointer flex gap-[8px] items-center overflow-visible p-0 relative shrink-0"
                        data-name="PromptInputActionMenu"
                      >
                        <div
                          className="bg-white min-w-[32px] relative rounded-bl-[12px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors"
                          data-name="PromptInputActionMenuTrigger"
                        >
                          <div className="box-border content-stretch flex gap-[6px] items-center justify-center min-w-inherit overflow-clip px-[10px] py-[8px] relative rounded-[inherit] size-[32px]">
                            <div
                              className="content-stretch flex gap-[8px] items-center relative shrink-0"
                              data-name="icon"
                            >
                              <div
                                className="overflow-clip relative shrink-0 size-[16px]"
                                data-name="icon"
                              >
                                <div
                                  className="absolute inset-[16.66%_16.66%_16.67%_16.67%]"
                                  data-name="Vector"
                                >
                                  <div
                                    className="absolute inset-0"
                                    style={
                                      {
                                        "--fill-0":
                                          "rgba(10, 10, 10, 1)",
                                      } as React.CSSProperties
                                    }
                                  >
                                    <svg
                                      className="block size-full"
                                      fill="none"
                                      preserveAspectRatio="none"
                                      viewBox="0 0 11 11"
                                    >
                                      <path
                                        d={
                                          svgPathsTemplates.p3b193470
                                        }
                                        fill="var(--fill-0, #0A0A0A)"
                                        id="Vector"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            aria-hidden="true"
                            className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-bl-[12px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                          />
                        </div>
                      </button>
                      <div
                        className="content-stretch flex items-start relative shrink-0"
                        data-name="PromptInputButton"
                      >
                        <div
                          className="bg-white min-w-[32px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors"
                          data-name="Button"
                        >
                          <div className="box-border content-stretch flex gap-[6px] items-center justify-center min-w-inherit overflow-clip px-[10px] py-[8px] relative rounded-[inherit] size-[32px]">
                            <div
                              className="content-stretch flex gap-[8px] items-center relative shrink-0"
                              data-name="icon"
                            >
                              <div
                                className="overflow-clip relative shrink-0 size-[16px]"
                                data-name="icon"
                              >
                                <div
                                  className="absolute inset-[12.5%]"
                                  data-name="Vector"
                                >
                                  <div
                                    className="absolute inset-0"
                                    style={
                                      {
                                        "--fill-0":
                                          "rgba(10, 10, 10, 1)",
                                      } as React.CSSProperties
                                    }
                                  >
                                    <svg
                                      className="block size-full"
                                      fill="none"
                                      preserveAspectRatio="none"
                                      viewBox="0 0 12 12"
                                    >
                                      <path
                                        d={
                                          svgPathsTemplates.p2d83ea00
                                        }
                                        fill="var(--fill-0, #0A0A0A)"
                                        id="Vector"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            aria-hidden="true"
                            className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center relative">
                      <div
                        className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0"
                        data-name="PromptInputModelSelect"
                      >
                        <button
                          className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[4px] h-[32px] items-center overflow-clip px-[10px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-neutral-100 transition-colors"
                          data-name="PromptInputModelSelectTrigger"
                        >
                          <p className="font-['Geist:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-500 text-nowrap whitespace-pre">
                            Claude 3 Opus
                          </p>
                          <div
                            className="content-stretch flex gap-[8px] items-center opacity-50 relative shrink-0"
                            data-name="icon"
                          >
                            <div
                              className="overflow-clip relative shrink-0 size-[16px]"
                              data-name="<ChevronDownIcon>"
                            >
                              <div
                                className="absolute inset-[33.33%_20.83%]"
                                data-name="Vector"
                              >
                                <div
                                  className="absolute inset-0"
                                  style={
                                    {
                                      "--fill-0":
                                        "rgba(115, 115, 115, 1)",
                                    } as React.CSSProperties
                                  }
                                >
                                  <svg
                                    className="block size-full"
                                    fill="none"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 10 6"
                                  >
                                    <path
                                      d={
                                        svgPathsTemplates.pbeb5300
                                      }
                                      fill="var(--fill-0, #737373)"
                                      id="Vector"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                      <button
                        onClick={handleChatSubmit}
                        disabled={!input.trim() || !apiKey}
                        type="submit"
                        className="box-border content-stretch cursor-pointer flex items-start overflow-visible p-0 relative shrink-0"
                        data-name="PromptInputSubmit"
                      >
                        <div
                          className={`bg-[#c96442] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip px-[10px] py-[8px] relative rounded-[10px] shrink-0 size-[32px] transition-opacity ${
                            input.trim() && apiKey
                              ? "opacity-100 hover:opacity-90 cursor-pointer"
                              : "opacity-50 cursor-not-allowed"
                          }`}
                          data-name="Button"
                        >
                          <div
                            className="content-stretch flex gap-[8px] items-center relative shrink-0"
                            data-name="icon"
                          >
                            <div
                              className="overflow-clip relative shrink-0 size-[16px]"
                              data-name="icon"
                            >
                              <div
                                className="absolute inset-[16.67%]"
                                data-name="Vector"
                              >
                                <div
                                  className="absolute inset-0"
                                  style={
                                    {
                                      "--fill-0":
                                        "rgba(239, 246, 255, 1)",
                                    } as React.CSSProperties
                                  }
                                >
                                  <svg
                                    className="block size-full"
                                    fill="none"
                                    preserveAspectRatio="none"
                                    viewBox="0 0 11 11"
                                  >
                                    <path
                                      d={
                                        svgPathsTemplates.p30dfba00
                                      }
                                      fill="var(--fill-0, #EFF6FF)"
                                      id="Vector"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}