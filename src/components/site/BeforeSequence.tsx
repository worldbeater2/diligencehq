'use client';

/**
 * DARA Enterprise's three moments, held on screen while the page scrolls:
 * each line comes into focus in turn and settles back as the next arrives,
 * ending on the line that ties them together.
 */
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';

const MOMENTS = ['Before the email is sent.', 'Before the document is accepted.', 'Before the agreement is signed.'] as const;
const CLOSING = 'DARA brings Legal to sit beside people while they work.';

function Moment({ text, index, progress }: { text: string; index: number; progress: MotionValue<number> }) {
  // Scroll offsets must stay within 0..1 and increase, or the animation engine rejects them.
  const start = 0.1 + index * 0.22;
  const enter = Math.max(0, start - 0.1);
  const opacity = useTransform(progress, [enter, start, start + 0.2, 0.86], [0.12, 1, 0.42, 0.28]);
  const y = useTransform(progress, [enter, start], [24, 0]);
  const blur = useTransform(progress, [enter, start], ['blur(6px)', 'blur(0px)']);
  return (
    <motion.p style={{ opacity, y, filter: blur }} className="display text-[clamp(34px,5.6vw,84px)] leading-[1.02]">
      {text}
    </motion.p>
  );
}

export function BeforeSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const closingOpacity = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);
  const closingY = useTransform(scrollYProgress, [0.78, 0.92], [18, 0]);
  const rule = useTransform(scrollYProgress, [0, 0.92], ['0%', '100%']);

  if (reduce) {
    return (
      <div className="space-y-4 py-24">
        {MOMENTS.map((text) => (
          <p key={text} className="display text-[clamp(34px,5.6vw,84px)] leading-[1.02]">{text}</p>
        ))}
        <p className="pt-8 text-[clamp(18px,1.6vw,22px)] text-ink-2">{CLOSING}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center">
        <div className="space-y-3">
          {MOMENTS.map((text, index) => (
            <Moment key={text} text={text} index={index} progress={scrollYProgress} />
          ))}
        </div>
        <div className="mt-14 max-w-[640px]">
          <div className="relative h-px w-full bg-line">
            <motion.span style={{ width: rule }} className="absolute inset-y-0 left-0 bg-ink" />
          </div>
          <motion.p style={{ opacity: closingOpacity, y: closingY }} className="mt-6 text-[clamp(18px,1.6vw,22px)] leading-[1.5] text-ink-2">
            {CLOSING}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
