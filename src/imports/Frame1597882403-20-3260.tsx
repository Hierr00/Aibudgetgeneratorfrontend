import svgPaths from "./svg-dmergg9k2x";

function Frame8() {
  return (
    <div className="bg-[#d9d9d9] box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-bl-[2px] rounded-tl-[2px] shrink-0">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">Agent</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-br-[2px] rounded-tr-[2px] shrink-0">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">Forms</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-neutral-200 box-border content-stretch flex gap-[2px] h-[28px] items-center p-[2px] relative rounded-[4px] shrink-0">
      <Frame8 />
      <Frame9 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<ChevronDownIcon>">
        <div className="absolute inset-[33.33%_20.83%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
              <path d={svgPaths.pbeb5300} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Action() {
  return (
    <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
      <Button />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame7 />
      <Action />
    </div>
  );
}

function Frame2() {
  return <div className="h-[16px] shrink-0 w-0" />;
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-between relative w-full">
        <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">Template</p>
        <Frame2 />
        <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">Corte Láser</p>
      </div>
    </div>
  );
}

function ContextContentHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="ContextContentHeader">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] items-start p-[12px] relative w-full">
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[3px] items-center justify-center leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
      <p className="font-['Geist:Regular','Noto_Sans_Symbols2:Regular',sans-serif] relative shrink-0">{`∙ `}</p>
      <p className="font-['Geist:Regular',sans-serif] relative shrink-0">0.80€</p>
    </div>
  );
}

function TokensWithCost() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="TokensWithCost">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">€/min</p>
      <Frame3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[3px] items-center justify-center leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">
      <p className="font-['Geist:Regular','Noto_Sans_Symbols2:Regular',sans-serif] relative shrink-0">{`∙ `}</p>
      <p className="font-['Geist:Regular',sans-serif] relative shrink-0">25€</p>
    </div>
  );
}

function TokensWithCost1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="TokensWithCost">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">.dxf</p>
      <Frame4 />
    </div>
  );
}

function TokensWithCost2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="TokensWithCost">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">–</p>
    </div>
  );
}

function TokensWithCost3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="TokensWithCost">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">–</p>
    </div>
  );
}

function ContextContentBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="ContextContentBody">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-[12px] pt-[13px] px-[12px] relative w-full">
          <div className="h-[16px] relative shrink-0 w-full" data-name="InputUsage">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-center justify-between relative w-full">
              <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">Servicio</p>
              <TokensWithCost />
            </div>
          </div>
          <div className="h-[16px] relative shrink-0 w-full" data-name="OutputUsage">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-center justify-between relative w-full">
              <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">Diseño CAD</p>
              <TokensWithCost1 />
            </div>
          </div>
          <div className="h-[16px] relative shrink-0 w-full" data-name="ReasoningUsage">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-center justify-between relative w-full">
              <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">Material</p>
              <TokensWithCost2 />
            </div>
          </div>
          <div className="h-[16px] relative shrink-0 w-full" data-name="CacheUsage">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[16px] items-center justify-between relative w-full">
              <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">Entrega</p>
              <TokensWithCost3 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative" data-name="icon">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center relative">
        <div className="overflow-clip relative shrink-0 size-[12px]" data-name="<ArrowUpIcon>">
          <div className="absolute inset-[16.67%]" data-name="Vector">
            <div className="absolute inset-0" style={{ "--fill-0": "rgba(10, 10, 10, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                <path d={svgPaths.p2fcb6240} fill="var(--fill-0, #0A0A0A)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContextContentFooter() {
  return (
    <div className="bg-neutral-100 relative shrink-0 w-full" data-name="ContextContentFooter">
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] items-center pb-[12px] pt-[13px] px-[12px] relative w-full">
          <p className="basis-0 font-['Geist:Regular',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-neutral-500">Usar Plantilla</p>
          <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "12", "--transform-inner-height": "12" } as React.CSSProperties}>
            <div className="flex-none rotate-[90deg]">
              <Icon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[20.83%_33.33%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
              <path d={svgPaths.p2b677780} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function BranchPage() {
  return (
    <div className="content-stretch flex font-['Geist:Medium',sans-serif] gap-[2.5px] items-center justify-center leading-[normal] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre" data-name="BranchPage">
      <p className="relative shrink-0">1</p>
      <p className="relative shrink-0">of</p>
      <p className="relative shrink-0">3</p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[20.83%_33.33%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
              <path d={svgPaths.p2fed9780} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0">
      <div className="bg-white min-w-[240px] relative rounded-[10px] shrink-0 w-[256px]" data-name="ContextContent">
        <div className="box-border content-stretch flex flex-col items-start min-w-inherit overflow-clip p-px relative rounded-[inherit] w-[256px]">
          <ContextContentHeader />
          <ContextContentBody />
          <ContextContentFooter />
        </div>
        <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      </div>
      <div className="box-border content-stretch flex gap-[8px] items-center justify-end px-[40px] py-0 relative shrink-0" data-name="BranchSelector">
        <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[10px] py-0 relative rounded-[9999px] shrink-0 size-[28px]" data-name="BranchPrevious">
          <Icon1 />
        </div>
        <BranchPage />
        <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[10px] py-0 relative rounded-[9999px] shrink-0 size-[28px]" data-name="BranchNext">
          <Icon2 />
        </div>
      </div>
    </div>
  );
}

function Textarea() {
  return (
    <div className="h-[72px] max-h-[192px] min-h-[64px] relative shrink-0 w-full" data-name="Textarea">
      <div className="max-h-inherit min-h-inherit size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[72px] items-start max-h-inherit min-h-inherit p-[12px] relative w-full">
          <p className="basis-0 font-['Geist:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-neutral-500">Reply to Claude</p>
        </div>
      </div>
    </div>
  );
}

function PromptInputBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="PromptInputBody">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Textarea />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="icon">
        <div className="absolute inset-[16.66%_16.66%_16.67%_16.67%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(10, 10, 10, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
              <path d={svgPaths.p3b193470} fill="var(--fill-0, #0A0A0A)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="icon">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(10, 10, 10, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
              <path d={svgPaths.p2d83ea00} fill="var(--fill-0, #0A0A0A)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptInputTools() {
  return (
    <div className="relative shrink-0" data-name="PromptInputTools">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
        <button className="box-border content-stretch cursor-pointer flex gap-[8px] items-center overflow-visible p-0 relative shrink-0" data-name="PromptInputActionMenu">
          <div className="bg-white min-w-[32px] relative rounded-bl-[12px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[8px] shrink-0 size-[32px]" data-name="PromptInputActionMenuTrigger">
            <div className="box-border content-stretch flex gap-[6px] items-center justify-center min-w-inherit overflow-clip px-[10px] py-[8px] relative rounded-[inherit] size-[32px]">
              <Icon3 />
            </div>
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-bl-[12px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
          </div>
        </button>
        <div className="content-stretch flex items-start relative shrink-0" data-name="PromptInputButton">
          <div className="bg-white min-w-[32px] relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
            <div className="box-border content-stretch flex gap-[6px] items-center justify-center min-w-inherit overflow-clip px-[10px] py-[8px] relative rounded-[inherit] size-[32px]">
              <Icon4 />
            </div>
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center opacity-50 relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<ChevronDownIcon>">
        <div className="absolute inset-[33.33%_20.83%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
              <path d={svgPaths.pbeb5300} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptInputModelSelectTrigger() {
  return (
    <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[4px] h-[32px] items-center overflow-clip px-[10px] py-[8px] relative rounded-[8px] shrink-0" data-name="PromptInputModelSelectTrigger">
      <p className="font-['Geist:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-500 text-nowrap whitespace-pre">Claude 3 Opus</p>
      <Icon5 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="icon">
        <div className="absolute inset-[16.67%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(239, 246, 255, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
              <path d={svgPaths.p30dfba00} fill="var(--fill-0, #EFF6FF)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center relative">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="PromptInputModelSelect">
          <PromptInputModelSelectTrigger />
        </div>
        <button className="box-border content-stretch cursor-pointer flex items-start overflow-visible p-0 relative shrink-0" data-name="PromptInputSubmit">
          <div className="bg-[#c96442] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] opacity-50 overflow-clip px-[10px] py-[8px] relative rounded-[10px] shrink-0 size-[32px]" data-name="Button">
            <Icon6 />
          </div>
        </button>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <div className="bg-white box-border content-stretch flex flex-col items-start p-px relative rounded-[16px] shrink-0 w-full" data-name="PromptInput">
        <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[16px]" />
        <PromptInputBody />
        <div className="relative rounded-bl-[10px] rounded-br-[10px] shrink-0 w-full" data-name="<PromptInputToolbar>">
          <div className="size-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start justify-between pb-[12px] pt-0 px-[12px] relative w-full">
              <PromptInputTools />
              <Frame />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Frame11() {
  return (
    <div className="bg-[#f3f3f3] relative size-full">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-between p-[20px] relative size-full">
          <Frame10 />
          <Frame6 />
          <Frame5 />
        </div>
      </div>
    </div>
  );
}