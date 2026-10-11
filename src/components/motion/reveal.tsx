'use client';

/**
 * Text motion, kept quiet: words rise out of a mask once, blocks fade up once,
 * and long statements brighten word by word as they scroll through view.
 */
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

/** Headline whose words rise into place when it enters the viewport. */
export function SplitWords({
  text,
  as: Tag = 'h2',
  className,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={index} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '105%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.9, ease, delay: delay + index * 0.045 }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}

/** A block that fades up once. */
export function FadeUp({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function ScrubWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

/** A statement whose words brighten in reading order as it scrolls through view. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={cn(className)} aria-label={text}>
      <span aria-hidden>
        {words.map((word, index) => (
          <ScrubWord key={index} word={word} progress={scrollYProgress} range={[index / words.length, (index + 1) / words.length]} />
        ))}
      </span>
    </p>
  );
}
