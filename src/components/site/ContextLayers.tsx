import { FadeUp } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

/** The information DARA is designed to understand around the work, as named in the copy. */
const LAYERS = [
  'Applicable law',
  'Company knowledge',
  'The person doing the work',
  'The matter they are working on',
  'How similar issues have previously been resolved',
] as const;

export function ContextLayers({ className }: { className?: string }) {
  return (
    <ol className={cn('grid gap-y-10 sm:grid-cols-2 lg:grid-cols-5', className)}>
      {LAYERS.map((label, index) => (
        <li key={label}>
          <FadeUp delay={index * 0.08} className="h-full border-l border-line pl-5 pr-4">
            {/* Generated halftone planets, one per layer (scripts/render-media.mjs). */}
            <img src={`/media/orb-${index + 1}.png`} alt="" width={64} height={64} className="h-16 w-16" />
            <p className="mt-6 font-mono text-[11px] text-faint">0{index + 1}</p>
            <p className="mt-2 text-[16px] leading-[1.4] tracking-[-0.01em] text-ink">{label}</p>
          </FadeUp>
        </li>
      ))}
    </ol>
  );
}
