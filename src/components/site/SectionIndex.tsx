'use client';

/**
 * The quiet index at the left of each page: section names, with a short dash
 * beside the one you are reading. Clicking scrolls there smoothly.
 */
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { scrollToTarget } from '@/components/motion/SmoothScroll';

export type IndexItem = { id: string; label: string };

export function SectionIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const { id } of items) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="pointer-events-none fixed inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 xl:block">
      <div className="mx-auto max-w-[1320px] px-10">
        <ol className="pointer-events-auto w-fit space-y-2.5">
          {items.map((item) => {
            const current = item.id === active;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToTarget(`#${item.id}`)}
                  className={cn(
                    'relative flex items-center text-[14px] transition-colors duration-500',
                    current ? 'text-ink' : 'text-faint hover:text-mute',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn('absolute -left-4 h-px bg-ink transition-[width,opacity] duration-500', current ? 'w-2.5 opacity-100' : 'w-0 opacity-0')}
                  />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
