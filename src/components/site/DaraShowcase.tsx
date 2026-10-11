'use client';

/**
 * DARA in use: the add-in's four scripted scenes inside Word, presented as a
 * product plate on the paper background, with captions that follow them.
 */
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { HowItWorksScene } from '@/components/dara/how-it-works-scenes';
import { cn } from '@/lib/utils';

const CHAPTERS = [
  { label: 'Open a matter', text: 'DARA opens beside the draft in Word.' },
  { label: 'Connect sources', text: 'The client brief, the law and supporting materials.' },
  { label: 'Run the review', text: 'Conflicts, inconsistencies and omissions, found.' },
  { label: 'Resolve in place', text: 'Each finding shows its source and a fix.' },
] as const;

export function DaraShowcase({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-15% 0px -15% 0px' });
  const reduce = useReducedMotion();
  const [chapter, setChapter] = useState(0);
  const [visible, setVisible] = useState(true);
  const advance = () => setChapter((current) => (current + 1) % CHAPTERS.length);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!reduce || !inView) return;
    const timer = window.setTimeout(advance, 6500);
    return () => window.clearTimeout(timer);
  }, [chapter, reduce, inView]);

  return (
    <div ref={ref} className={className}>
      <div className="relative border border-line bg-paper-2/80 p-3 backdrop-blur-[2px] sm:p-6 lg:p-10">
        <span aria-hidden className="absolute -left-[4px] -top-[4px] h-[7px] w-[7px] border border-line bg-paper" />
        <span aria-hidden className="absolute -right-[4px] -top-[4px] h-[7px] w-[7px] border border-line bg-paper" />
        <span aria-hidden className="absolute -bottom-[4px] -left-[4px] h-[7px] w-[7px] border border-line bg-paper" />
        <span aria-hidden className="absolute -bottom-[4px] -right-[4px] h-[7px] w-[7px] border border-line bg-paper" />
        <div aria-hidden className="shadow-[0_40px_80px_-40px_rgba(13,13,13,0.35)]">
          <HowItWorksScene chapter={chapter} playing={inView && visible && !reduce} onDone={advance} />
        </div>
      </div>

      <div className="grid grid-cols-2 border-x border-b border-line lg:grid-cols-4" role="tablist" aria-label="DARA in Word">
        {CHAPTERS.map((item, index) => {
          const active = chapter === index;
          return (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setChapter(index)}
              className={cn(
                'relative px-5 py-5 text-left transition-colors duration-500',
                index > 0 && 'border-l border-line',
                index === 2 && 'border-l-0 lg:border-l',
                index > 1 && 'border-t border-line lg:border-t-0',
              )}
            >
              <span className={cn('font-mono text-[11px] transition-colors duration-500', active ? 'text-ink' : 'text-faint')}>0{index + 1}</span>
              <span className={cn('mt-2 block text-[14.5px] font-medium tracking-[-0.01em] transition-colors duration-500', active ? 'text-ink' : 'text-mute')}>
                {item.label}
              </span>
              <span className={cn('mt-1 block text-[13px] leading-[1.55] transition-colors duration-500', active ? 'text-mute' : 'text-faint')}>{item.text}</span>
              {active && (
                <motion.span layoutId="dara-showcase-bar" className="absolute inset-x-0 top-0 h-px bg-ink" transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
