import svgPaths from "./svg-pl0s22qjao";
import imgImage350 from "figma:asset/7401d766ff14f077069e810c6eb9b53a09ed3cbd.png";
import imgLightModeArkcuttLogo2 from "figma:asset/a8b52980fc79bf5bb2d45096d4fcb29741a9a7f1.png";

function Frame2() {
  return (
    <div className="bg-[#d9d9d9] box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-bl-[2px] rounded-tl-[2px] shrink-0">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">Preview</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[2px] h-full items-center justify-center px-[8px] py-0 relative rounded-br-[2px] rounded-tr-[2px] shrink-0">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-neutral-500 text-nowrap whitespace-pre">Edit</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-neutral-200 box-border content-stretch flex gap-[2px] h-[28px] items-center p-[2px] relative rounded-[4px] shrink-0">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="<ChevronDownIcon>">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="<ChevronDownIcon>">
          <path d={svgPaths.p1e450100} fill="var(--fill-0, #0A0A0A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <ChevronDownIcon />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0" data-name="Button">
      <div className="box-border content-stretch flex gap-[6px] items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[inherit]">
        <div className="relative shrink-0 size-[14px]" data-name="image 350">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage350} />
        </div>
        <p className="font-['Geist:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">Add to Holded</p>
        <Icon />
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function OpenInTrigger() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="OpenInTrigger">
      <Button />
    </div>
  );
}

function TooltipContent() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Share</p>
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

function Icon1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <Svg />
    </div>
  );
}

function TooltipContent1() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">Favorite</p>
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

function Icon2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <Svg1 />
    </div>
  );
}

function TooltipContent2() {
  return (
    <div className="bg-neutral-950 box-border content-stretch flex gap-[7.6px] items-center justify-center px-[11.4px] py-[5.7px] relative rounded-[7.6px] shrink-0" data-name="Tooltip.Content">
      <p className="font-['Geist:Regular',sans-serif] leading-[15.2px] max-w-[228px] not-italic relative shrink-0 text-[11.4px] text-nowrap text-white whitespace-pre">More</p>
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

function Icon3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="icon">
      <Icon4 />
    </div>
  );
}

/**
 * @figmaAssetKey d9752dbca2f3cf05b7c9598d0a77d05b32238be9
 */
/**
 * @figmaAssetKey 22cefdc77a9ed39a0fda0d19784d073df691dabe
 */
/**
 * @figmaAssetKey d9752dbca2f3cf05b7c9598d0a77d05b32238be9
 */
/**
 * @figmaAssetKey 22cefdc77a9ed39a0fda0d19784d073df691dabe
 */
/**
 * @figmaAssetKey d9752dbca2f3cf05b7c9598d0a77d05b32238be9
 */
/**
 * @figmaAssetKey 22cefdc77a9ed39a0fda0d19784d073df691dabe
 */
function OpenIn() {
  return (
    <div className="content-stretch flex h-[28px] items-center relative shrink-0" data-name="OpenIn">
      <OpenInTrigger />
      <Action />
      <Action1 />
      <Action2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame1 />
      <OpenIn />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col font-['Geist:Regular',sans-serif] items-end not-italic relative shrink-0 text-[11px] text-neutral-500 text-right">
      <p className="leading-[11px] relative shrink-0 text-nowrap whitespace-pre">Asociación Junior Empresa MAKOSITE</p>
      <p className="leading-[11px] relative shrink-0 text-nowrap whitespace-pre">G72660145</p>
      <div className="leading-[11px] relative shrink-0 w-[193px]">
        <p className="mb-0">Carrer Ciutat d’Asunción, 16</p>
        <p>Barcelona (08030), Barcelona, España</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[553px]">
      <div className="flex flex-row items-center self-stretch">
        <div className="aspect-[800/800] h-full relative shrink-0" data-name="[LIGHT MODE] ARKCUTT LOGO 2">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLightModeArkcuttLogo2} />
        </div>
      </div>
      <Frame5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col font-['Geist:Regular',sans-serif] gap-[2px] items-end leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 text-right w-[193px]">
      <p className="relative shrink-0 w-full">Fecha: 03/11/2025</p>
      <p className="relative shrink-0 w-full">Vencimiento: 18/11/2025</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Presupuesto · 001</p>
      <Frame8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[81px]">
      <p className="leading-[12px] relative shrink-0 text-[12px] text-neutral-950 w-full">Clientes varios</p>
      <p className="leading-[11px] relative shrink-0 text-[11px] text-neutral-500 w-full">España</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between not-italic relative shrink-0 w-full">
      <Frame9 />
      <p className="leading-[16px] relative shrink-0 text-[20px] text-neutral-950 text-nowrap whitespace-pre">Total 41,05€</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[35px] items-start relative shrink-0 w-[553px]">
      <Frame7 />
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[16px] not-italic relative shrink-0 text-[14px] text-center text-neutral-950 w-[345px]">
      <p className="relative shrink-0 text-nowrap whitespace-pre">Precio</p>
      <p className="relative shrink-0 text-nowrap whitespace-pre">Unidades</p>
      <p className="relative shrink-0 text-nowrap whitespace-pre">Subtotal</p>
      <p className="relative shrink-0 w-[20px]">Iva</p>
      <p className="relative shrink-0 w-[38px]">Total</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[145px] items-center relative shrink-0 w-full">
      <p className="font-['Geist:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">Concepto</p>
      <Frame12 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-col font-['Geist:Regular',sans-serif] gap-[2px] items-start not-italic relative shrink-0 text-nowrap w-[81px] whitespace-pre">
      <p className="leading-[12px] relative shrink-0 text-[12px] text-neutral-950">Servicio Corte Láser</p>
      <p className="leading-[11px] relative shrink-0 text-[11px] text-neutral-500">Precio €/min de corte</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 w-[345px]">
      <p className="relative shrink-0 text-right w-[41px]">0,66€</p>
      <p className="relative shrink-0 text-right w-[60px]">37,44</p>
      <p className="relative shrink-0 text-right w-[55px]">24,75€</p>
      <p className="relative shrink-0 w-[20px]">21%</p>
      <p className="relative shrink-0 text-nowrap text-right whitespace-pre">29,95€</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame23 />
      <Frame14 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col font-['Geist:Regular',sans-serif] gap-[2px] items-start not-italic relative shrink-0 text-nowrap whitespace-pre">
      <p className="leading-[12px] relative shrink-0 text-[12px] text-neutral-950">Tablero DM · 100x80cm</p>
      <p className="leading-[11px] relative shrink-0 text-[11px] text-neutral-500">Grosor · 3mm</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[11px] not-italic relative shrink-0 text-[11px] text-neutral-500 w-[345px]">
      <p className="relative shrink-0 text-right w-[41px]">9,17€</p>
      <p className="relative shrink-0 text-right w-[60px]">1</p>
      <p className="relative shrink-0 text-right w-[55px]">9,17€</p>
      <p className="relative shrink-0 w-[20px]">21%</p>
      <p className="relative shrink-0 text-nowrap text-right whitespace-pre">11,10€</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame24 />
      <Frame25 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
      <Frame13 />
      <Frame15 />
      <Frame16 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[16px] not-italic relative shrink-0 text-center text-neutral-950 text-nowrap w-full whitespace-pre">
      <p className="relative shrink-0 text-[14px]">Base Imponible</p>
      <p className="relative shrink-0 text-[11px]">33,92€</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[16px] not-italic relative shrink-0 text-neutral-950 w-full">
      <p className="relative shrink-0 text-[14px] text-right w-[99px]">Iva 21%</p>
      <p className="relative shrink-0 text-[11px] text-center text-nowrap whitespace-pre">7,13€</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex font-['Geist:Regular',sans-serif] items-center justify-between leading-[16px] not-italic relative shrink-0 text-neutral-950 w-full">
      <p className="relative shrink-0 text-[14px] text-right w-[99px]">Total</p>
      <p className="relative shrink-0 text-[11px] text-center text-nowrap whitespace-pre">41,05€</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[175px]">
      <Frame26 />
      <Frame18 />
      <Frame19 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-end relative shrink-0 w-[553px]">
      <Frame17 />
      <Frame20 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[20px] h-[842px] items-start p-[40px] relative shrink-0">
      <Frame6 />
      <div className="h-0 relative shrink-0 w-[553px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(229, 229, 229, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 553 1">
            <line id="Line 96" stroke="var(--stroke-0, #E5E5E5)" x2="553" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame11 />
      <div className="h-0 relative shrink-0 w-[553px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(229, 229, 229, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 553 1">
            <line id="Line 96" stroke="var(--stroke-0, #E5E5E5)" x2="553" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame21 />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] items-center px-[20px] py-[15px] relative size-full">
          <Frame4 />
          <Frame22 />
        </div>
      </div>
    </div>
  );
}