import svgPaths from "./svg-ytfiyu21gc";
import imgImage350 from "figma:asset/7401d766ff14f077069e810c6eb9b53a09ed3cbd.png";

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

export default function Button() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[6px] items-center justify-center overflow-clip px-[8px] py-[4px] relative size-full">
          <div className="relative shrink-0 size-[14px]" data-name="image 350">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage350} />
          </div>
          <p className="font-['Geist:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">Add to Holded</p>
          <Icon />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}