/**
 * The page's blueprint frame: two hairlines running the height of the page at
 * the content edges, with small square ticks where the header rule meets them,
 * and a fine grain over everything.
 */
export function Frame() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] hidden md:block">
        <div className="relative mx-auto h-full w-full max-w-[1320px] border-x border-line/80">
          <span className="absolute -left-[3.5px] top-[71px] h-[7px] w-[7px] border border-line bg-paper" />
          <span className="absolute -right-[3.5px] top-[71px] h-[7px] w-[7px] border border-line bg-paper" />
        </div>
      </div>
      <svg aria-hidden className="pointer-events-none fixed inset-0 z-[80] h-full w-full opacity-[0.32] mix-blend-multiply">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.16" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </>
  );
}
