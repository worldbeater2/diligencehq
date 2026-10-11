'use client';

/**
 * The generated halftone loop (scripts/render-media.mjs) as a section
 * background. It fades into the paper at its edges, pauses when the page is
 * hidden (Next keeps hidden pages mounted, and display:none does not stop
 * playback) and shows the still poster when motion is reduced.
 */
import { useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export function VideoBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    video.play().catch(() => {});
    return () => video.pause();
  }, [reduce]);

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {reduce ? (
        <img src="/media/orbit-poster.jpg" alt="" className="h-full w-full object-cover object-right" />
      ) : (
        <video ref={ref} muted loop playsInline preload="metadata" poster="/media/orbit-poster.jpg" className="h-full w-full object-cover object-right">
          <source src="/media/orbit-loop.webm" type="video/webm" />
          <source src="/media/orbit-loop.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#f3f3f1_0%,rgba(243,243,241,0.92)_32%,rgba(243,243,241,0)_62%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#f3f3f1,rgba(243,243,241,0))]" />
    </div>
  );
}
