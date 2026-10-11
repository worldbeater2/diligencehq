/**
 * The background planet's state, shared between the canvas that draws it and
 * the scroll choreography that moves it. A plain mutable object: GSAP tweens
 * its fields directly and the canvas reads them every frame, so nothing
 * re-renders React.
 */
export type OrbitState = {
  /** Centre, as a fraction of the viewport width. */
  x: number;
  /** Centre, as a fraction of the viewport height. */
  y: number;
  /** Radius, as a fraction of the smaller viewport side. */
  size: number;
  /** Light angle: ±0 full face, ±1.57 half, beyond that a crescent. */
  theta: number;
  opacity: number;
  /** Dot spacing in CSS pixels: the planet's resolution. */
  grid: number;
};

export const orbit: OrbitState = { x: 0.72, y: 0.5, size: 0.44, theta: 1.78, opacity: 1, grid: 8 };

/** Latest smoothed scroll velocity (px per frame), written by SmoothScroll. */
export const scrollMotion = { velocity: 0 };

/** Parses a section's `data-orbit` attribute, e.g. "x:.7 y:.5 size:.4 theta:1.7 opacity:1". */
export function parseOrbit(value: string | null | undefined): Partial<OrbitState> {
  const out: Partial<OrbitState> = {};
  if (!value) return out;
  for (const part of value.split(/\s+/)) {
    const [key, raw] = part.split(':');
    const number = Number(raw);
    if (key && raw && Number.isFinite(number) && key in orbit) out[key as keyof OrbitState] = number;
  }
  return out;
}
