import svgPaths from "./svg-cgoxqakjl5";
import img from "figma:asset/a8b52980fc79bf5bb2d45096d4fcb29741a9a7f1.png";

function Frame4() {
  return (
    <div className="bg-[#d9d9d9] box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-bl-[2px] rounded-tl-[2px] shrink-0">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">Agent</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-br-[2px] rounded-tr-[2px] shrink-0">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">Forms</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-neutral-200 box-border content-stretch flex gap-[2px] h-[28px] items-center p-[2px] relative rounded-[4px] shrink-0">
      <Frame4 />
      <Frame5 />
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

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame3 />
      <Action />
    </div>
  );
}

function Content() {
  return (
    <div className="relative rounded-[10px] shrink-0 w-full" data-name="content">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-center px-[16px] py-[12px] relative w-full">
          <p className="font-['Geist:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 w-full">This is some message content.</p>
        </div>
      </div>
    </div>
  );
}

function MessageAvatar() {
  return (
    <div className="content-stretch flex gap-[8px] items-end justify-end relative shrink-0 w-full" data-name="Message + Avatar">
      <div className="basis-0 flex flex-row grow items-end self-stretch shrink-0">
        <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="MessageContent">
          <div className="flex flex-col items-end justify-end size-full">
            <div className="box-border content-stretch flex flex-col items-end justify-end pl-[64px] pr-0 py-0 relative size-full">
              <Content />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-neutral-100 relative rounded-[9999px] shrink-0 size-[40px]" data-name="MessageAvatar">
        <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-[40px]">
          <div className="flex flex-col font-['Geist:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-neutral-500 text-nowrap">
            <p className="leading-[24px] whitespace-pre">IH</p>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[9999px]" />
      </div>
    </div>
  );
}

function TooltipContent() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Tooltip</p>
    </div>
  );
}

function TooltipArrow() {
  return (
    <div className="h-[9.499px] relative shrink-0 w-[9.5px]" data-name="Tooltip.Arrow">
      <div className="absolute bottom-[0.01%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none rotate-[44.996deg] size-[6.716px]">
          <div className="bg-neutral-950 rounded-br-[1.9px] size-full" data-name="transform" />
        </div>
      </div>
    </div>
  );
}

function ArrowPadding() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.6px] h-[4.75px] items-center justify-end px-[7.6px] py-0 relative shrink-0" data-name="arrowPadding">
      <TooltipArrow />
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[4.16%_4.17%_4.17%_4.16%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <path d={svgPaths.p20acca00} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TooltipContent1() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Tooltip</p>
    </div>
  );
}

function TooltipArrow1() {
  return (
    <div className="h-[9.499px] relative shrink-0 w-[9.5px]" data-name="Tooltip.Arrow">
      <div className="absolute bottom-[0.01%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none rotate-[44.996deg] size-[6.716px]">
          <div className="bg-neutral-950 rounded-br-[1.9px] size-full" data-name="transform" />
        </div>
      </div>
    </div>
  );
}

function ArrowPadding1() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.6px] h-[4.75px] items-center justify-end px-[7.6px] py-0 relative shrink-0" data-name="arrowPadding">
      <TooltipArrow1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[4.17%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <path d={svgPaths.p172d0500} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvatarSpacer() {
  return <div className="h-0 shrink-0 w-[40px]" data-name="_avatar-spacer" />;
}

function Actions() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-full" data-name="actions">
      <div className="box-border content-stretch flex gap-[8px] items-end justify-end pb-0 pt-[8px] px-0 relative shrink-0" data-name="Actions">
        <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
          <div className="absolute bottom-[23.85px] box-border content-stretch flex flex-col items-center left-[calc(50%-0.1px)] opacity-0 shadow-[0px_1.9px_3.8px_-2px_rgba(0,0,0,0.1),0px_3.8px_5.7px_-1px_rgba(0,0,0,0.1)] translate-x-[-50%] z-[2]" data-name="Tooltip">
            <TooltipContent />
            <ArrowPadding />
          </div>
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
            <Icon />
          </div>
        </div>
        <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
          <div className="absolute bottom-[23.85px] box-border content-stretch flex flex-col items-center left-[calc(50%-0.1px)] opacity-0 shadow-[0px_1.9px_3.8px_-2px_rgba(0,0,0,0.1),0px_3.8px_5.7px_-1px_rgba(0,0,0,0.1)] translate-x-[-50%] z-[2]" data-name="Tooltip">
            <TooltipContent1 />
            <ArrowPadding1 />
          </div>
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
            <Icon1 />
          </div>
        </div>
      </div>
      <AvatarSpacer />
    </div>
  );
}

function Src() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="src">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img} />
    </div>
  );
}

function ThinkingMessage() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] gap-[3px] items-center leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-500 text-nowrap whitespace-pre" data-name="thinkingMessage">
      <p className="relative shrink-0">Thought for</p>
      <p className="relative shrink-0">4</p>
      <p className="relative shrink-0">seconds</p>
    </div>
  );
}

function ReasoningContent() {
  return (
    <div className="absolute bottom-[16px] h-0 left-0 right-0" data-name="Reasoning Content">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-start pb-[16px] pt-0 px-0 relative size-full">
          <div className="basis-0 font-['Geist:Regular',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic opacity-0 relative shrink-0 text-[14px] text-neutral-500">
            <p className="mb-0">Let me think about this problem step by step.</p>
            <p className="mb-0">First, I need to understand what the user is asking for.</p>
            <p className="mb-0">They want a reasoning component that opens automatically when streaming begins and closes when streaming finishes. The component should be composable and follow existing patterns in the codebase.</p>
            <p>This seems like a collapsible component with state management would be the right approach.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function P() {
  return (
    <div className="content-stretch flex font-['Geist:Medium',sans-serif] gap-[3px] items-center leading-[16px] not-italic relative shrink-0 text-[#1447e6] text-[12px] text-nowrap whitespace-pre" data-name="p">
      <p className="relative shrink-0">Used</p>
      <p className="relative shrink-0">3</p>
      <p className="relative shrink-0">sources</p>
    </div>
  );
}

function CollapsibleTrigger() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative rounded-[8px] shrink-0" data-name="CollapsibleTrigger">
      <P />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<ChevronDownIcon>">
        <div className="absolute inset-[33.33%_20.83%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(20, 71, 230, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
              <path d={svgPaths.pbeb5300} fill="var(--fill-0, #1447E6)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div className="bg-neutral-100 relative rounded-[10px] shrink-0 w-full" data-name="content">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-center px-[16px] py-[12px] relative w-full">
          <p className="font-['Geist:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-neutral-950 w-full">This is some message content.</p>
        </div>
      </div>
    </div>
  );
}

function Message() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Message">
      <div className="box-border content-stretch flex flex-col gap-[16px] h-[36px] items-start pb-[16px] pt-0 px-0 relative shrink-0 w-full" data-name="Reasoning">
        <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="ReasoningTrigger">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<BrainIcon>">
            <div className="absolute inset-[4.17%_4.17%_4.18%_4.17%]" data-name="Vector">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                  <path d={svgPaths.p23dc5080} fill="var(--fill-0, #737373)" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
          <ThinkingMessage />
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
        <ReasoningContent />
      </div>
      <div className="box-border content-stretch flex flex-col gap-[12px] items-start pb-[16px] pt-0 px-0 relative shrink-0 w-full" data-name="Sources">
        <div className="content-stretch flex items-start relative shrink-0" data-name="SourcesTrigger">
          <CollapsibleTrigger />
        </div>
        <div className="absolute content-stretch flex flex-col gap-[8px] h-0 items-start left-0 opacity-0 overflow-clip right-0 top-[20px]" data-name="SourcesContent">
          <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Source">
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<BookIcon>">
              <div className="absolute inset-[4.16%_12.5%_4.17%_12.5%]" data-name="Vector">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(20, 71, 230, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
                    <path d={svgPaths.p26d9bb00} fill="var(--fill-0, #1447E6)" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="basis-0 font-['Geist:Medium',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#1447e6] text-[12px]">Source</p>
          </div>
          <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Source">
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<BookIcon>">
              <div className="absolute inset-[4.16%_12.5%_4.17%_12.5%]" data-name="Vector">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(20, 71, 230, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
                    <path d={svgPaths.p26d9bb00} fill="var(--fill-0, #1447E6)" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="basis-0 font-['Geist:Medium',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#1447e6] text-[12px]">Source</p>
          </div>
          <div className="content-stretch flex gap-[8px] h-[16px] items-center relative shrink-0 w-full" data-name="Source">
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<BookIcon>">
              <div className="absolute inset-[4.16%_12.5%_4.17%_12.5%]" data-name="Vector">
                <div className="absolute inset-0" style={{ "--fill-0": "rgba(20, 71, 230, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
                    <path d={svgPaths.p26d9bb00} fill="var(--fill-0, #1447E6)" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="basis-0 font-['Geist:Medium',sans-serif] grow leading-[16px] min-h-px min-w-px not-italic relative shrink-0 text-[#1447e6] text-[12px]">Source</p>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="MessageContent">
        <div className="flex flex-col justify-end size-full">
          <div className="box-border content-stretch flex flex-col items-start justify-end pl-0 pr-[64px] py-0 relative w-full">
            <Content1 />
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageAvatar1() {
  return (
    <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full" data-name="Message + Avatar">
      <div className="bg-white relative rounded-[9999px] shrink-0 size-[40px]" data-name="MessageAvatar">
        <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[inherit] size-[40px]">
          <Src />
        </div>
        <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[9999px]" />
      </div>
      <Message />
    </div>
  );
}

function AvatarSpacer1() {
  return <div className="h-0 shrink-0 w-[40px]" data-name="_avatar-spacer" />;
}

function TooltipContent2() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Retry</p>
    </div>
  );
}

function TooltipArrow2() {
  return (
    <div className="h-[9.499px] relative shrink-0 w-[9.5px]" data-name="Tooltip.Arrow">
      <div className="absolute bottom-[0.01%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none rotate-[44.996deg] size-[6.716px]">
          <div className="bg-neutral-950 rounded-br-[1.9px] size-full" data-name="transform" />
        </div>
      </div>
    </div>
  );
}

function ArrowPadding2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.6px] h-[4.75px] items-center justify-end px-[7.6px] py-0 relative shrink-0" data-name="arrowPadding">
      <TooltipArrow2 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[8.331%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
              <path d={svgPaths.pc4e9e80} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TooltipContent3() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Like</p>
    </div>
  );
}

function TooltipArrow3() {
  return (
    <div className="h-[9.499px] relative shrink-0 w-[9.5px]" data-name="Tooltip.Arrow">
      <div className="absolute bottom-[0.01%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none rotate-[44.996deg] size-[6.716px]">
          <div className="bg-neutral-950 rounded-br-[1.9px] size-full" data-name="transform" />
        </div>
      </div>
    </div>
  );
}

function ArrowPadding3() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.6px] h-[4.75px] items-center justify-end px-[7.6px] py-0 relative shrink-0" data-name="arrowPadding">
      <TooltipArrow3 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[4.16%_4.88%_4.16%_4.16%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <path d={svgPaths.p3bc93500} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TooltipContent4() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Dislike</p>
    </div>
  );
}

function TooltipArrow4() {
  return (
    <div className="h-[9.499px] relative shrink-0 w-[9.5px]" data-name="Tooltip.Arrow">
      <div className="absolute bottom-[0.01%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none rotate-[44.996deg] size-[6.716px]">
          <div className="bg-neutral-950 rounded-br-[1.9px] size-full" data-name="transform" />
        </div>
      </div>
    </div>
  );
}

function ArrowPadding4() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.6px] h-[4.75px] items-center justify-end px-[7.6px] py-0 relative shrink-0" data-name="arrowPadding">
      <TooltipArrow4 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[4.16%_4.17%_4.17%_4.87%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <path d={svgPaths.p42c840} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TooltipContent5() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Copy to clipboard</p>
    </div>
  );
}

function TooltipArrow5() {
  return (
    <div className="h-[9.499px] relative shrink-0 w-[9.5px]" data-name="Tooltip.Arrow">
      <div className="absolute bottom-[0.01%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none rotate-[44.996deg] size-[6.716px]">
          <div className="bg-neutral-950 rounded-br-[1.9px] size-full" data-name="transform" />
        </div>
      </div>
    </div>
  );
}

function ArrowPadding5() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.6px] h-[4.75px] items-center justify-end px-[7.6px] py-0 relative shrink-0" data-name="arrowPadding">
      <TooltipArrow5 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[4.16%_4.17%_4.17%_4.16%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
              <path d={svgPaths.p20acca00} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TooltipContent6() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Share</p>
    </div>
  );
}

function TooltipArrow6() {
  return (
    <div className="h-[9.499px] relative shrink-0 w-[9.5px]" data-name="Tooltip.Arrow">
      <div className="absolute bottom-[0.01%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none rotate-[44.996deg] size-[6.716px]">
          <div className="bg-neutral-950 rounded-br-[1.9px] size-full" data-name="transform" />
        </div>
      </div>
    </div>
  );
}

function ArrowPadding6() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.6px] h-[4.75px] items-center justify-end px-[7.6px] py-0 relative shrink-0" data-name="arrowPadding">
      <TooltipArrow6 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[4.16%_12.5%_4.17%_12.5%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
              <path d={svgPaths.p394b7e00} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TooltipContent7() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Favorite</p>
    </div>
  );
}

function TooltipArrow7() {
  return (
    <div className="h-[9.499px] relative shrink-0 w-[9.5px]" data-name="Tooltip.Arrow">
      <div className="absolute bottom-[0.01%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none rotate-[44.996deg] size-[6.716px]">
          <div className="bg-neutral-950 rounded-br-[1.9px] size-full" data-name="transform" />
        </div>
      </div>
    </div>
  );
}

function ArrowPadding7() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.6px] h-[4.75px] items-center justify-end px-[7.6px] py-0 relative shrink-0" data-name="arrowPadding">
      <TooltipArrow7 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="svg">
        <div className="absolute inset-[12.44%_4.17%_8.33%_4.16%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 13">
              <path d={svgPaths.p2ae0bd00} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function TooltipContent8() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">More</p>
    </div>
  );
}

function TooltipArrow8() {
  return (
    <div className="h-[9.499px] relative shrink-0 w-[9.5px]" data-name="Tooltip.Arrow">
      <div className="absolute bottom-[0.01%] flex items-center justify-center left-0 right-0 top-0">
        <div className="flex-none rotate-[44.996deg] size-[6.716px]">
          <div className="bg-neutral-950 rounded-br-[1.9px] size-full" data-name="transform" />
        </div>
      </div>
    </div>
  );
}

function ArrowPadding8() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.6px] h-[4.75px] items-center justify-end px-[7.6px] py-0 relative shrink-0" data-name="arrowPadding">
      <TooltipArrow8 />
    </div>
  );
}

function Icon8() {
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

function Actions1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="actions">
      <AvatarSpacer1 />
      <div className="box-border content-stretch flex gap-[8px] items-end pb-0 pt-[8px] px-0 relative shrink-0" data-name="Actions">
        <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
          <div className="absolute bottom-[23.85px] box-border content-stretch flex flex-col items-center left-[calc(50%-0.1px)] opacity-0 shadow-[0px_1.9px_3.8px_-2px_rgba(0,0,0,0.1),0px_3.8px_5.7px_-1px_rgba(0,0,0,0.1)] translate-x-[-50%] z-[2]" data-name="Tooltip">
            <TooltipContent2 />
            <ArrowPadding2 />
          </div>
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
            <Icon2 />
          </div>
        </div>
        <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
          <div className="absolute bottom-[23.85px] box-border content-stretch flex flex-col items-center left-[calc(50%-0.1px)] opacity-0 shadow-[0px_1.9px_3.8px_-2px_rgba(0,0,0,0.1),0px_3.8px_5.7px_-1px_rgba(0,0,0,0.1)] translate-x-[-50%] z-[2]" data-name="Tooltip">
            <TooltipContent3 />
            <ArrowPadding3 />
          </div>
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
            <Icon3 />
          </div>
        </div>
        <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
          <div className="absolute bottom-[23.85px] box-border content-stretch flex flex-col items-center left-[calc(50%-0.1px)] opacity-0 shadow-[0px_1.9px_3.8px_-2px_rgba(0,0,0,0.1),0px_3.8px_5.7px_-1px_rgba(0,0,0,0.1)] translate-x-[-50%] z-[2]" data-name="Tooltip">
            <TooltipContent4 />
            <ArrowPadding4 />
          </div>
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
            <Icon4 />
          </div>
        </div>
        <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
          <div className="absolute bottom-[23.85px] box-border content-stretch flex flex-col items-center left-[calc(50%-0.1px)] opacity-0 shadow-[0px_1.9px_3.8px_-2px_rgba(0,0,0,0.1),0px_3.8px_5.7px_-1px_rgba(0,0,0,0.1)] translate-x-[-50%] z-[2]" data-name="Tooltip">
            <TooltipContent5 />
            <ArrowPadding5 />
          </div>
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
            <Icon5 />
          </div>
        </div>
        <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
          <div className="absolute bottom-[23.85px] box-border content-stretch flex flex-col items-center left-[calc(50%-0.1px)] opacity-0 shadow-[0px_1.9px_3.8px_-2px_rgba(0,0,0,0.1),0px_3.8px_5.7px_-1px_rgba(0,0,0,0.1)] translate-x-[-50%] z-[2]" data-name="Tooltip">
            <TooltipContent6 />
            <ArrowPadding6 />
          </div>
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
            <Icon6 />
          </div>
        </div>
        <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
          <div className="absolute bottom-[23.85px] box-border content-stretch flex flex-col items-center left-[calc(50%-0.1px)] opacity-0 shadow-[0px_1.9px_3.8px_-2px_rgba(0,0,0,0.1),0px_3.8px_5.7px_-1px_rgba(0,0,0,0.1)] translate-x-[-50%] z-[2]" data-name="Tooltip">
            <TooltipContent7 />
            <ArrowPadding7 />
          </div>
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
            <Icon7 />
          </div>
        </div>
        <div className="content-stretch flex isolate items-center justify-center relative shrink-0" data-name="Action">
          <div className="absolute bottom-[23.85px] box-border content-stretch flex flex-col items-center left-[calc(50%-0.1px)] opacity-0 shadow-[0px_1.9px_3.8px_-2px_rgba(0,0,0,0.1),0px_3.8px_5.7px_-1px_rgba(0,0,0,0.1)] translate-x-[-50%] z-[2]" data-name="Tooltip">
            <TooltipContent8 />
            <ArrowPadding8 />
          </div>
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex gap-[6px] items-center justify-center min-w-[32px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 size-[32px] z-[1]" data-name="Button">
            <Icon8 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[30px] grow items-center min-h-px min-w-px relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-end justify-end relative shrink-0 w-full" data-name="Message (User)">
        <MessageAvatar />
        <Actions />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-start justify-end relative shrink-0 w-full" data-name="Message (Assistant)">
        <MessageAvatar1 />
        <Actions1 />
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

function Icon9() {
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

function Icon10() {
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
              <Icon9 />
            </div>
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-bl-[12px] rounded-br-[8px] rounded-tl-[8px] rounded-tr-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
          </div>
        </button>
        <div className="content-stretch flex items-start relative shrink-0" data-name="PromptInputButton">
          <div className="bg-white min-w-[32px] relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
            <div className="box-border content-stretch flex gap-[6px] items-center justify-center min-w-inherit overflow-clip px-[10px] py-[8px] relative rounded-[inherit] size-[32px]">
              <Icon10 />
            </div>
            <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon11() {
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
      <Icon11 />
    </div>
  );
}

function Icon12() {
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
            <Icon12 />
          </div>
        </button>
      </div>
    </div>
  );
}

function Frame1() {
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

export default function Frame7() {
  return (
    <div className="relative size-full">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[20px] items-center p-[20px] relative size-full">
          <Frame6 />
          <Frame2 />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}