/**
 * The Diligence mark: a small halftone crescent drawn as SVG dots, computed
 * once at module load from the same lighting idea as the background planet.
 */

type Dot = { x: number; y: number; r: number };

function crescentDots(): Dot[] {
  const dots: Dot[] = [];
  const size = 24;
  const c = size / 2;
  const radius = 10.5;
  const spacing = 2.3;
  const rowH = spacing * 0.866;
  const theta = 1.95;
  const lx = Math.sin(theta);
  const lz = Math.cos(theta);
  for (let row = -6; row <= 6; row++) {
    const y = c + row * rowH;
    const offset = row % 2 === 0 ? 0 : spacing / 2;
    for (let col = -6; col <= 6; col++) {
      const x = c + col * spacing + offset;
      const dx = (x - c) / radius;
      const dy = (c - y) / radius;
      const d2 = dx * dx + dy * dy;
      if (d2 > 1) continue;
      const nz = Math.sqrt(1 - d2);
      const lit = Math.max(0, (dx * lx + nz * lz + 0.25) / 1.25);
      const rim = Math.pow(1 - nz, 2) * Math.max(0, dx) * 0.9;
      const v = Math.min(1, lit * lit + rim);
      if (v > 0.06) dots.push({ x, y, r: 0.25 + 0.9 * Math.pow(v, 0.8) });
    }
  }
  return dots;
}

const DOTS = crescentDots();

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {DOTS.map((dot, index) => (
        <circle key={index} cx={dot.x.toFixed(2)} cy={dot.y.toFixed(2)} r={dot.r.toFixed(2)} fill="currentColor" />
      ))}
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="flex items-center gap-2.5">
        <Mark className="h-[22px] w-[22px]" />
        <span className="display text-[19px] font-medium leading-none tracking-[-0.04em]">Diligence</span>
      </span>
    </span>
  );
}

export const DARA_URL = 'https://getdaralegal.com';
export const CONTACT_EMAIL = 'team@daralegal.co';
