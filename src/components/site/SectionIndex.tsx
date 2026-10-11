'use client';

/**
 * The quiet index at the left of each page: a few numbered entries, with a
 * short dash beside the one you are reading. An entry can cover several
 * sections, so the index stays short on long pages, and can be nested under
 * the entry before it. Clicking scrolls to the
 * entry's first section.
 */
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { scrollToTarget } from '@/components/motion/SmoothScroll';

/** `sub` entries sit indented under the entry before them, without a number. */
export type IndexItem = { label: string; ids: string[]; sub?: boolean };

export function SectionIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const owner = new Map<string, number>();
    items.forEach((item, index) => item.ids.forEach((id) => owner.set(id, index)));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const index = visible[0] && owner.get(visible[0].target.id);
        if (index !== undefined) setActive(index);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const id of owner.keys()) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" data-text-mask className="pointer-events-none fixed inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 xl:block">
      <div className="mx-auto max-w-[1320px] px-10">
        <ol className="pointer-events-auto w-fit space-y-1">
          {items.map((item, index) => {
            const current = index === active;
            const number = items.slice(0, index + 1).filter((entry) => !entry.sub).length;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => scrollToTarget(`#${item.ids[0]}`)}
                  aria-current={current ? 'true' : undefined}
                  className={cn(
                    'relative flex items-baseline gap-3 py-1 tracking-[-0.005em] transition-colors duration-500',
                    item.sub ? 'items-center pl-[30px] text-[12.5px]' : 'text-[13px]',
                    current ? 'text-ink' : 'text-faint hover:text-mute',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'absolute -left-4 top-1/2 h-px bg-ink transition-[width,opacity] duration-500',
                      current ? 'w-2.5 opacity-100' : 'w-0 opacity-0',
                    )}
                  />
                  {item.sub ? (
                    <span aria-hidden className="h-px w-2.5 bg-line" />
                  ) : (
                    <span className="font-mono text-[10px] tabular-nums">{String(number).padStart(2, '0')}</span>
                  )}
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
