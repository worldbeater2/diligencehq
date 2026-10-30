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
      {/* The grain is the SVG noise filter rendered once into a tile
          (public/media/grain*.webp), so the browser does not regenerate
          full-screen noise and re-blend it on every frame. */}
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[80] mix-blend-multiply" />
    </>
  );
}
