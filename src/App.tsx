import { useState, useRef, useEffect } from "react";
import svgPaths from "./imports/svg-c1vzaky0zk";
import svgPathsChat from "./imports/svg-cgoxqakjl5";
import imgE250266ClientesVarios11 from "figma:asset/bf1d863e07619b4e2f4ea4f07cecb7611ffa6802.png";
import imgAvatar from "figma:asset/a8b52980fc79bf5bb2d45096d4fcb29741a9a7f1.png";

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

// AI Agent responses
const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("corte") || lowerMessage.includes("láser") || lowerMessage.includes("laser")) {
    return "Entendido. Para el servicio de Corte Láser, necesito algunos detalles:\n\n• ¿Qué material deseas cortar? (Acero, madera, acrílico, etc.)\n• ¿Cuál es el grosor del material?\n• ¿Tienes el archivo .dxf del diseño o necesitas ayuda con el diseño?\n• ¿Cuántas piezas necesitas?\n\nEl costo estimado es de 0.80€/min de corte más 25€ si necesitas diseño CAD.";
  }
  
  if (lowerMessage.includes("impresión") || lowerMessage.includes("3d") || lowerMessage.includes("imprimir")) {
    return "Perfecto, para Impresión 3D te puedo ayudar con:\n\n• Material: PLA, ABS, PETG, TPU\n• Resolución de capa: 0.1mm a 0.3mm\n• Relleno: 10% a 100%\n• Tiempo de entrega: 5-7 días\n\nEl precio es de 0.50€/g de material + 30€ si necesitas diseño en formato .stl. ¿Tienes el archivo 3D listo o necesitas que lo creemos?";
  }
  
  if (lowerMessage.includes("fresado") || lowerMessage.includes("cnc") || lowerMessage.includes("mecanizado")) {
    return "Excelente elección para Fresado CNC. Este servicio es ideal para piezas de alta precisión:\n\n• Materiales disponibles: Aluminio, acero, plásticos técnicos\n• Tolerancias: ±0.05mm\n• Tamaño máximo: 600x400x200mm\n• Costo: 45€/hora de mecanizado\n\nSi necesitas el diseño en formato .step, agregamos 50€. Entrega en 3-5 días. ¿Qué dimensiones necesitas?";
  }
  
  if (lowerMessage.includes("precio") || lowerMessage.includes("costo") || lowerMessage.includes("presupuesto")) {
    return "Para darte un presupuesto preciso necesito:\n\n1. Tipo de servicio (Corte Láser, Impresión 3D, o Fresado CNC)\n2. Material y especificaciones\n3. Cantidad de piezas\n4. Si tienes archivos de diseño o necesitas nuestro servicio de diseño CAD\n\n¿Con cuál servicio te gustaría empezar?";
  }
  
  if (lowerMessage.includes("material") || lowerMessage.includes("materiales")) {
    return "Estos son los materiales disponibles por servicio:\n\n**Corte Láser:**\n• Acero, acero inoxidable (hasta 10mm)\n• Madera, MDF (hasta 20mm)\n• Acrílico, metacrilato (hasta 15mm)\n\n**Impresión 3D:**\n• PLA (biodegradable, fácil impresión)\n• ABS (resistente, temperaturas altas)\n• PETG (flexible, resistente)\n• TPU (elástico)\n\n**Fresado CNC:**\n• Aluminio 6061, 7075\n• Acero inoxidable\n• Plásticos: Nylon, Delrin, HDPE";
  }
  
  if (lowerMessage.includes("diseño") || lowerMessage.includes("cad") || lowerMessage.includes("archivo")) {
    return "Ofrecemos servicios de diseño CAD profesional:\n\n• **Corte Láser**: Archivos .dxf - 25€\n• **Impresión 3D**: Archivos .stl - 30€\n• **Fresado CNC**: Archivos .step - 50€\n\nSi ya tienes tu archivo, solo envíalo y verificaremos que esté listo para producción. Si necesitas que lo creemos desde cero, cuéntame tu idea y te ayudamos con el diseño.";
  }
  
  if (lowerMessage.includes("tiempo") || lowerMessage.includes("entrega") || lowerMessage.includes("plazo")) {
    return "Los tiempos de entrega estimados son:\n\n• **Corte Láser**: 1-3 días (express disponible)\n• **Impresión 3D**: 5-7 días (según tamaño)\n• **Fresado CNC**: 3-5 días\n\n*Los tiempos pueden variar según complejidad y cantidad. Para pedidos urgentes, contáctanos para evaluar opciones express.*";
  }
  
  if (lowerMessage.includes("hola") || lowerMessage.includes("hi") || lowerMessage.includes("buenos") || lowerMessage.includes("ayuda")) {
    return "¡Hola! 👋 Soy tu asistente de presupuestos. Puedo ayudarte a crear presupuestos personalizados para:\n\n• **Corte Láser** - Corte preciso en diversos materiales\n• **Impresión 3D** - Prototipado y producción de piezas\n• **Fresado CNC** - Mecanizado de alta precisión\n\n¿Qué tipo de proyecto tienes en mente?";
  }
  
  // Default response
  return "Entiendo tu consulta. Puedo ayudarte con presupuestos para Corte Láser, Impresión 3D y Fresado CNC. \n\nPara crear un presupuesto preciso, necesito algunos detalles sobre tu proyecto:\n\n• ¿Qué tipo de servicio necesitas?\n• ¿Qué material?\n• ¿Cantidad de piezas?\n• ¿Tienes archivos de diseño?\n\n¿Puedes darme más información sobre tu proyecto?";
};

function Icon() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="icon">
        <div className="absolute inset-[41.67%_12.5%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 3">
              <g id="Vector">
                <path d={svgPaths.p18d1efb2} fill="var(--fill-0, #737373)" />
                <path d={svgPaths.p2d963500} fill="var(--fill-0, #737373)" />
                <path d={svgPaths.p31beb840} fill="var(--fill-0, #737373)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="<PlusIcon>">
        <div className="absolute inset-[16.66%_16.66%_16.67%_16.67%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
              <path d={svgPaths.p9086fb0} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-end justify-end relative shrink-0 w-full" data-name="Message (User)">
      <div className="content-stretch flex gap-[8px] items-end justify-end relative shrink-0 w-full" data-name="Message + Avatar">
        <div className="basis-0 flex flex-row grow items-end self-stretch shrink-0">
          <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="MessageContent">
            <div className="flex flex-col items-end justify-end size-full">
              <div className="box-border content-stretch flex flex-col items-end justify-end pl-[64px] pr-0 py-0 relative size-full">
                <div className="relative rounded-[10px] shrink-0 w-full" data-name="content">
                  <div className="flex flex-col items-center size-full">
                    <div className="box-border content-stretch flex flex-col gap-[8px] items-center px-[16px] py-[12px] relative w-full">
                      <p className="font-['Geist:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 w-full">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-neutral-100 relative rounded-[9999px] shrink-0 size-[40px]" data-name="MessageAvatar">
          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-[40px]">
            <div className="flex flex-col font-['Geist:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-neutral-500 text-nowrap">
              <p className="leading-[24px] whitespace-pre">TU</p>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[9999px]" />
        </div>
      </div>
      <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-full" data-name="actions">
        <div className="box-border content-stretch flex gap-[8px] items-end justify-end pb-0 pt-[8px] px-0 relative shrink-0" data-name="Actions">
          <button 
            onClick={handleCopy}
            className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors"
          >
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[4.16%_4.17%_4.17%_4.16%]">
                <div className="absolute inset-0" style={{ "--fill-0": copied ? "rgba(20, 71, 230, 1)" : "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                    <path d={svgPathsChat.p20acca00} fill="var(--fill-0, #737373)" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[4.17%]">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                    <path d={svgPathsChat.p172d0500} fill="var(--fill-0, #737373)" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>
        <div className="h-0 shrink-0 w-[40px]" data-name="_avatar-spacer" />
      </div>
    </div>
  );
}

function AssistantMessage({ message }: { message: Message }) {
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
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-end relative shrink-0 w-full" data-name="Message (Assistant)">
      <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full" data-name="Message + Avatar">
        <div className="bg-white relative rounded-[9999px] shrink-0 size-[40px]" data-name="MessageAvatar">
          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-[40px]">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgAvatar} />
          </div>
          <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[9999px]" />
        </div>
        <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Message">
          <div className="relative shrink-0 w-full" data-name="MessageContent">
            <div className="flex flex-col justify-end size-full">
              <div className="box-border content-stretch flex flex-col items-start justify-end pl-0 pr-[64px] py-0 relative w-full">
                <div className="bg-neutral-100 relative rounded-[10px] shrink-0 w-full" data-name="content">
                  <div className="flex flex-col items-center size-full">
                    <div className="box-border content-stretch flex flex-col gap-[8px] items-center px-[16px] py-[12px] relative w-full">
                      <p className="font-['Geist:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 w-full whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="actions">
        <div className="h-0 shrink-0 w-[40px]" data-name="_avatar-spacer" />
        <div className="box-border content-stretch flex gap-[8px] items-end pb-0 pt-[8px] px-0 relative shrink-0" data-name="Actions">
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[8.331%]">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                    <path d={svgPathsChat.pc4e9e80} fill="var(--fill-0, #737373)" />
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
                <div className="absolute inset-0" style={{ "--fill-0": liked ? "rgba(20, 71, 230, 1)" : "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                    <path d={svgPathsChat.p3bc93500} fill="var(--fill-0, #737373)" />
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
                <div className="absolute inset-0" style={{ "--fill-0": disliked ? "rgba(20, 71, 230, 1)" : "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                    <path d={svgPathsChat.p42c840} fill="var(--fill-0, #737373)" />
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
                <div className="absolute inset-0" style={{ "--fill-0": copied ? "rgba(20, 71, 230, 1)" : "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                    <path d={svgPathsChat.p20acca00} fill="var(--fill-0, #737373)" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[4.16%_12.5%_4.17%_12.5%]">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
                    <path d={svgPathsChat.p394b7e00} fill="var(--fill-0, #737373)" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[12.44%_4.17%_8.33%_4.16%]">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
                    <path d={svgPathsChat.p2ae0bd00} fill="var(--fill-0, #737373)" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
          <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors">
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[41.67%_12.5%]">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 3">
                    <g>
                      <path d={svgPaths.p18d1efb2} fill="var(--fill-0, #737373)" />
                      <path d={svgPaths.p2d963500} fill="var(--fill-0, #737373)" />
                      <path d={svgPaths.p31beb840} fill="var(--fill-0, #737373)" />
                    </g>
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

export default function App() {
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: "001", name: "Presupuesto #001" },
    { id: "002", name: "Presupuesto · 002" },
    { id: "003", name: "Presupuesto · 003" },
  ]);
  const [selectedBudget, setSelectedBudget] = useState("001");
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview");
  const [agentMode, setAgentMode] = useState<"agent" | "forms">("agent");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    "001": [
      {
        id: "1",
        role: "assistant",
        content: "¡Hola! 👋 Soy tu asistente de presupuestos. Puedo ayudarte a crear presupuestos personalizados para:\n\n• Corte Láser\n• Impresión 3D\n• Fresado CNC\n\n¿Qué tipo de proyecto tienes en mente?",
        timestamp: new Date(),
      }
    ],
    "002": [],
    "003": [],
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentTemplate = templates[templateIndex];
  const currentChat = chatHistory[selectedBudget] || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat, isTyping]);

  const handleNewBudget = () => {
    const newId = String(budgets.length + 1).padStart(3, "0");
    const newBudget = {
      id: newId,
      name: `Presupuesto · ${newId}`,
    };
    setBudgets([...budgets, newBudget]);
    setChatHistory(prev => ({
      ...prev,
      [newId]: [
        {
          id: `${newId}-1`,
          role: "assistant",
          content: "¡Hola! 👋 Soy tu asistente de presupuestos. Puedo ayudarte a crear presupuestos personalizados para:\n\n• Corte Láser\n• Impresión 3D\n• Fresado CNC\n\n¿Qué tipo de proyecto tienes en mente?",
          timestamp: new Date(),
        }
      ]
    }));
    setSelectedBudget(newId);
  };

  const handlePreviousTemplate = () => {
    setTemplateIndex((prev) => (prev > 0 ? prev - 1 : templates.length - 1));
  };

  const handleNextTemplate = () => {
    setTemplateIndex((prev) => (prev < templates.length - 1 ? prev + 1 : 0));
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    };

    // Add user message
    setChatHistory(prev => ({
      ...prev,
      [selectedBudget]: [...(prev[selectedBudget] || []), userMessage],
    }));

    setMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Get AI response
    const aiResponse: Message = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content: getAIResponse(userMessage.content),
      timestamp: new Date(),
    };

    setChatHistory(prev => ({
      ...prev,
      [selectedBudget]: [...(prev[selectedBudget] || []), aiResponse],
    }));

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-[#f3f3f3] content-stretch flex items-start relative size-full" data-name="Desktop - 9">
      {/* Left Sidebar */}
      <div className="bg-[#f3f3f3] box-border content-stretch flex flex-col gap-[40px] h-full items-start p-[20px] relative shrink-0 w-[269px]">
        <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none" />
        
        {/* Active Budget Section */}
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <div className="box-border content-stretch flex gap-[8px] items-center justify-between px-0 py-[4px] relative shrink-0 w-full">
            <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">
              {budgets.find(b => b.id === selectedBudget)?.name || "Presupuesto #001"}
            </p>
            <Icon />
          </div>
          
          {/* New Budget Button */}
          <div className="bg-neutral-200 h-[28px] relative rounded-[4px] shrink-0 w-full">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="box-border content-stretch flex gap-[2px] h-[28px] items-center justify-center px-[4px] py-[2px] relative w-full">
                <button 
                  onClick={handleNewBudget}
                  className="box-border content-stretch flex gap-[8px] h-full items-center justify-center px-[8px] py-0 relative rounded-br-[2px] rounded-tr-[2px] shrink-0 hover:bg-neutral-300 transition-colors cursor-pointer"
                >
                  <Icon1 />
                  <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">New Budget</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">Historial</p>
          <div className="flex flex-col gap-0 w-full">
            {budgets.slice(1).map((budget) => (
              <button
                key={budget.id}
                onClick={() => setSelectedBudget(budget.id)}
                className={`box-border content-stretch flex items-center justify-between px-0 py-[4px] relative w-full hover:bg-neutral-200 rounded transition-colors cursor-pointer ${
                  selectedBudget === budget.id ? 'bg-neutral-200' : ''
                }`}
              >
                <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
                  {budget.name}
                </p>
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Panel */}
      <div className="bg-white box-border content-stretch flex flex-col gap-[10px] h-full items-center px-[20px] py-[15px] relative shrink-0 w-[691px]">
        <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none" />
        
        {/* Preview/Edit Toggle */}
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div className="bg-neutral-200 box-border content-stretch flex gap-[2px] h-[28px] items-center p-[2px] relative rounded-[4px] shrink-0">
            <button
              onClick={() => setViewMode("preview")}
              className={`box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-bl-[2px] rounded-tl-[2px] shrink-0 transition-colors ${
                viewMode === "preview" ? "bg-[#d9d9d9]" : ""
              }`}
            >
              <p className={`font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
                viewMode === "preview" ? "text-neutral-950" : "text-neutral-500"
              }`}>Preview</p>
            </button>
            <button
              onClick={() => setViewMode("edit")}
              className={`box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-br-[2px] rounded-tr-[2px] shrink-0 transition-colors ${
                viewMode === "edit" ? "bg-[#d9d9d9]" : ""
              }`}
            >
              <p className={`font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
                viewMode === "edit" ? "text-neutral-950" : "text-neutral-500"
              }`}>Edit</p>
            </button>
          </div>
          
          {/* More Button */}
          <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
            <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1] hover:bg-neutral-100 transition-colors cursor-pointer" data-name="Button">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="icon">
                  <div className="absolute inset-[41.67%_12.5%]" data-name="Vector">
                    <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 3">
                        <g id="Vector">
                          <path d={svgPaths.p18d1efb2} fill="var(--fill-0, #737373)" />
                          <path d={svgPaths.p2d963500} fill="var(--fill-0, #737373)" />
                          <path d={svgPaths.p31beb840} fill="var(--fill-0, #737373)" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Preview */}
        <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="E250266 clientes varios-1 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[107.05%] left-0 max-w-none top-[-0.8%] w-full" src={imgE250266ClientesVarios11} />
          </div>
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="box-border content-stretch flex flex-col h-full items-center p-[20px] relative shrink-0 w-[480px]">
        {/* Agent/Forms Toggle */}
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <div className="bg-neutral-200 box-border content-stretch flex gap-[2px] h-[28px] items-center p-[2px] relative rounded-[4px] shrink-0">
            <button
              onClick={() => setAgentMode("agent")}
              className={`box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-bl-[2px] rounded-tl-[2px] shrink-0 transition-colors ${
                agentMode === "agent" ? "bg-[#d9d9d9]" : ""
              }`}
            >
              <p className={`font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
                agentMode === "agent" ? "text-neutral-950" : "text-neutral-500"
              }`}>Agent</p>
            </button>
            <button
              onClick={() => setAgentMode("forms")}
              className={`box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-br-[2px] rounded-tr-[2px] shrink-0 transition-colors ${
                agentMode === "forms" ? "bg-[#d9d9d9]" : ""
              }`}
            >
              <p className={`font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
                agentMode === "forms" ? "text-neutral-950" : "text-neutral-500"
              }`}>Forms</p>
            </button>
          </div>
          
          {/* Dropdown Button */}
          <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
            <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1] hover:bg-neutral-100 transition-colors cursor-pointer" data-name="Button">
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<ChevronDownIcon>">
                <div className="absolute inset-[33.33%_20.83%]" data-name="Vector">
                  <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
                      <path d={svgPathsChat.pbeb5300} fill="var(--fill-0, #737373)" id="Vector" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div 
          ref={chatContainerRef}
          className="basis-0 content-stretch flex flex-col gap-[30px] grow items-center min-h-px min-w-px relative shrink-0 w-full overflow-y-auto py-[20px]"
        >
          {currentChat.map((msg) => (
            msg.role === "user" ? (
              <UserMessage key={msg.id} message={msg} />
            ) : (
              <AssistantMessage key={msg.id} message={msg} />
            )
          ))}
          
          {isTyping && (
            <div className="content-stretch flex flex-col gap-[8px] items-start justify-end relative shrink-0 w-full">
              <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full">
                <div className="bg-white relative rounded-[9999px] shrink-0 size-[40px]">
                  <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-[40px]">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgAvatar} />
                  </div>
                  <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[9999px]" />
                </div>
                <div className="bg-neutral-100 rounded-[12px] px-[16px] py-[12px]">
                  <div className="flex gap-[4px]">
                    <div className="w-[8px] h-[8px] bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-[8px] h-[8px] bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-[8px] h-[8px] bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <div className="bg-white box-border content-stretch flex flex-col items-start p-px relative rounded-[16px] shrink-0 w-full" data-name="PromptInput">
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[16px]" />
            <div className="relative shrink-0 w-full" data-name="PromptInputBody">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
                <div className="h-[72px] max-h-[192px] min-h-[64px] relative shrink-0 w-full" data-name="Textarea">
                  <div className="max-h-inherit min-h-inherit size-full">
                    <div className="box-border content-stretch flex gap-[8px] h-[72px] items-start max-h-inherit min-h-inherit p-[12px] relative w-full">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Reply to Claude"
                        className="basis-0 font-['Geist:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-neutral-950 placeholder:text-neutral-500 bg-transparent border-none outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-bl-[10px] rounded-br-[10px] shrink-0 w-full" data-name="<PromptInputToolbar>">
              <div className="size-full">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start justify-between pb-[12px] pt-0 px-[12px] relative w-full">
                  <div className="relative shrink-0" data-name="PromptInputTools">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
                      <button className="box-border content-stretch cursor-pointer flex gap-[8px] items-center overflow-visible p-0 relative shrink-0" data-name="PromptInputActionMenu">
                        <div className="bg-white min-w-[32px] relative rounded-bl-[12px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors" data-name="PromptInputActionMenuTrigger">
                          <div className="box-border content-stretch flex gap-[6px] items-center justify-center min-w-inherit overflow-clip px-[10px] py-[8px] relative rounded-[inherit] size-[32px]">
                            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
                              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="icon">
                                <div className="absolute inset-[16.66%_16.66%_16.67%_16.67%]" data-name="Vector">
                                  <div className="absolute inset-0" style={{ "--fill-0": "rgba(10, 10, 10, 1)" } as React.CSSProperties}>
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
                                      <path d={svgPathsChat.p3b193470} fill="var(--fill-0, #0A0A0A)" id="Vector" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-bl-[12px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
                        </div>
                      </button>
                      <div className="content-stretch flex items-start relative shrink-0" data-name="PromptInputButton">
                        <button className="bg-white min-w-[32px] relative rounded-[8px] shrink-0 size-[32px] hover:bg-neutral-100 transition-colors" data-name="Button">
                          <div className="box-border content-stretch flex gap-[6px] items-center justify-center min-w-inherit overflow-clip px-[10px] py-[8px] relative rounded-[inherit] size-[32px]">
                            <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
                              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="icon">
                                <div className="absolute inset-[12.5%]" data-name="Vector">
                                  <div className="absolute inset-0" style={{ "--fill-0": "rgba(10, 10, 10, 1)" } as React.CSSProperties}>
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                                      <path d={svgPathsChat.p2d83ea00} fill="var(--fill-0, #0A0A0A)" id="Vector" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center relative">
                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="PromptInputModelSelect">
                        <button className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[4px] h-[32px] items-center overflow-clip px-[10px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-neutral-100 transition-colors" data-name="PromptInputModelSelectTrigger">
                          <p className="font-['Geist:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-500 text-nowrap whitespace-pre">Claude 3 Opus</p>
                          <div className="content-stretch flex gap-[8px] items-center opacity-50 relative shrink-0" data-name="icon">
                            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<ChevronDownIcon>">
                              <div className="absolute inset-[33.33%_20.83%]" data-name="Vector">
                                <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
                                    <path d={svgPathsChat.pbeb5300} fill="var(--fill-0, #737373)" id="Vector" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                      <button 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="box-border content-stretch cursor-pointer flex items-start overflow-visible p-0 relative shrink-0" 
                        data-name="PromptInputSubmit"
                      >
                        <div className={`bg-[#c96442] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip px-[10px] py-[8px] relative rounded-[10px] shrink-0 size-[32px] transition-opacity ${
                          message.trim() ? 'opacity-100 hover:opacity-90 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                        }`} data-name="Button">
                          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
                            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="icon">
                              <div className="absolute inset-[16.67%]" data-name="Vector">
                                <div className="absolute inset-0" style={{ "--fill-0": "rgba(239, 246, 255, 1)" } as React.CSSProperties}>
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
                                    <path d={svgPathsChat.p30dfba00} fill="var(--fill-0, #EFF6FF)" id="Vector" />
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
        </div>
      </div>
    </div>
  );
}
