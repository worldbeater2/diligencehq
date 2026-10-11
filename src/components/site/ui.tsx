import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** The page frame's inner width, shared by every section. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('relative mx-auto w-full max-w-[1320px] px-6 md:px-10', className)}>{children}</div>;
}

const base =
  'group inline-flex h-12 items-center justify-center gap-2.5 px-7 text-[14.5px] font-medium transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.99]';

const variants = {
  primary: 'bg-ink text-paper hover:bg-[#262624]',
  quiet: 'bg-[#e4e4e0] text-ink hover:bg-[#d9d9d4]',
  line: 'border border-ink/80 text-ink hover:bg-ink hover:text-paper',
} as const;

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  external?: boolean;
  className?: string;
}) {
  const content = (
    <>
      {children}
      {external && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(base, variants[variant], className)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {content}
    </Link>
  );
}

/** Small mono label used above sections: "01 — DARA". */
export function Label({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn('eyebrow flex items-center gap-3', className)}>
      {index && <span className="text-ink">{index}</span>}
      {index && <span aria-hidden className="h-px w-6 bg-line" />}
      <span>{children}</span>
    </p>
  );
}
