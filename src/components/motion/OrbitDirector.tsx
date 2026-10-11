'use client';

/**
 * Moves the background planet through a page. Every section with a
 * `data-orbit` attribute declares where the planet should be while that
 * section is in view; the planet glides from one state to the next as the
 * section scrolls in. On arrival from another page it travels to the first
 * section's state instead of jumping.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { orbit, parseOrbit } from '@/lib/orbit';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function OrbitDirector() {
  const marker = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const root = marker.current?.closest('[data-page]') ?? document;
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-orbit]'));
    if (sections.length === 0) return;

    const first = parseOrbit(sections[0].dataset.orbit);
    gsap.to(orbit, { ...first, duration: 1.4, ease: 'power3.inOut', overwrite: 'auto' });

    sections.slice(1).forEach((section) => {
      gsap.to(orbit, {
        ...parseOrbit(section.dataset.orbit),
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: section, start: 'top 92%', end: 'top 30%', scrub: 1.1 },
      });
    });

    ScrollTrigger.refresh();
  });

  return <span ref={marker} hidden />;
}
