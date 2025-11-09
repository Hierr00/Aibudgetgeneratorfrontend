import svgPaths from "./svg-94od4mt7e9";

function Frame1() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[4px] relative w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<ChevronLeftIcon>">
        <div className="absolute inset-[20.83%_33.33%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 10">
            <path d={svgPaths.p3d754b00} fill="var(--fill-0, #737373)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[30px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[6px] h-[30px] items-center justify-center px-[8px] py-[4px] relative w-full">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<PlusIcon>">
            <div className="absolute inset-[16.66%_16.66%_16.67%_16.67%]" data-name="Vector">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(10, 10, 10, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
                  <path d={svgPaths.p3b193470} fill="var(--fill-0, #0A0A0A)" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <div className="flex items-center justify-center relative shrink-0 w-full">
        <div className="flex-none rotate-[180deg] w-full">
          <Frame1 />
        </div>
      </div>
      <Button />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[30px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[6px] h-[30px] items-center justify-center px-[8px] py-[4px] relative w-full">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<FileIcon>">
            <div className="absolute inset-[4.17%_12.5%]" data-name="Vector">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 15">
                <path d={svgPaths.p2d4faa80} fill="var(--fill-0, black)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<MinusIcon>">
        <div className="absolute inset-[45.83%_16.67%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 2">
            <path d={svgPaths.p871f300} fill="var(--fill-0, #0A0A0A)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[4px] relative shrink-0 w-full">
      <Frame5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[4px] relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<PlusIcon>">
        <div className="absolute inset-[16.66%_16.66%_16.67%_16.67%]" data-name="Vector">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(115, 115, 115, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
              <path d={svgPaths.p3b193470} fill="var(--fill-0, #737373)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
      <Frame4 />
      {[...Array(4).keys()].map((_, i) => (
        <Frame6 key={i} />
      ))}
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-full">
      <Button1 />
      <Frame7 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full">
      <Frame3 />
      <Frame8 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[30px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[6px] h-[30px] items-center justify-center px-[8px] py-[4px] relative w-full">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="<InfoIcon>">
            <div className="absolute inset-[4.167%]" data-name="Vector">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                <path d={svgPaths.p80a6480} fill="var(--fill-0, black)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-neutral-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 w-full">
      <Button2 />
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="bg-[#f3f3f3] relative size-full">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-neutral-200 border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-between px-[10px] py-[20px] relative size-full">
          <Frame9 />
          <Frame />
        </div>
      </div>
    </div>
  );
}