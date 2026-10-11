'use client';

/**
 * Smooth scrolling for the whole site (Lenis), driven by GSAP's ticker so
 * ScrollTrigger and Lenis stay in step. Lives in the root layout, so it
 * persists across navigations.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
import { scrollMotion } from '@/lib/orbit';

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

/** Smoothly scrolls to an element or offset; falls back to native scrolling. */
export function scrollToTarget(target: string | HTMLElement | number, offset = -80) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.3 });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'smooth' });
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    instance = lenis;
    lenis.on('scroll', (event: Lenis) => {
      ScrollTrigger.update();
      scrollMotion.velocity = event.velocity;
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
