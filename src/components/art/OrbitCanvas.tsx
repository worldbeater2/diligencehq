'use client';

/**
 * The site-wide background: one halftone planet on a fixed canvas behind the
 * content. Its position, size, phase and opacity come from `orbit`, which each
 * page's OrbitDirector moves as you scroll; the surface turns slowly on its own.
 */
import { useEffect, useRef } from 'react';
import { orbit, scrollMotion } from '@/lib/orbit';
import { drawHalftoneSphere } from './halftone-core';
import { createTextMask } from './text-mask';

const FRAME_MS = 1000 / 30;

export function OrbitCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let spin = 0.6;
    let drift = 0;
    let previous = '';

    // The canvas takes its size from CSS and is measured whenever that box
    // changes. On phones the first layout can be wider than the screen until
    // the viewport settles, and that change does not always fire a resize.
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      previous = '';
    };

    const draw = () => {
      const short = Math.min(width, height);
      const mobile = width < 768;
      // Narrow screens pull the planet toward the centre and shrink it a little,
      // so its lit edge stays on screen instead of falling past the side.
      const radius = orbit.size * short * (mobile ? 0.82 : 1);
      const x = mobile ? 0.5 + (orbit.x - 0.5) * 0.3 : orbit.x;
      const spacing = Math.max(5, orbit.grid * (mobile ? 0.88 : 1));
      // Text moves with scroll, so the scroll position is part of what is drawn.
      const key = `${Math.round(window.scrollY)}|${x.toFixed(4)}|${orbit.y.toFixed(4)}|${radius.toFixed(2)}|${orbit.theta.toFixed(4)}|${orbit.opacity.toFixed(3)}|${spin.toFixed(4)}|${spacing.toFixed(2)}`;
      if (key === previous) return;
      previous = key;
      drawHalftoneSphere(ctx, {
        width,
        height,
        cx: x * width,
        cy: orbit.y * height,
        radius,
        spacing,
        theta: orbit.theta,
        spin,
        opacity: orbit.opacity * (mobile ? 0.42 : 1),
        // Dots thin out beneath text so it always reads cleanly.
        mask: orbit.opacity > 0.002 ? textMask.update(width, height) : undefined,
      });
    };

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      if (document.hidden || now - last < FRAME_MS) return;
      const elapsed = last ? now - last : FRAME_MS;
      last = now;
      if (!reduceMotion) {
        // The surface turns slowly on its own and gathers speed while you
        // scroll, easing back once you stop.
        drift += (scrollMotion.velocity * 0.0016 - drift) * 0.08;
        scrollMotion.velocity *= 0.9;
        spin += elapsed * 0.000045 + drift;
      }
      draw();
    };

    const textMask = createTextMask();
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      textMask.dispose();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
