'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DARA_URL, Wordmark } from './brand';

const links = [
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menu on navigation.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500',
        scrolled || open ? 'border-line/80 bg-paper/85 backdrop-blur-md' : 'border-line/80 bg-paper/0',
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-6 md:px-10">
        <Link href="/" aria-label="Diligence home" className="text-ink">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-12 md:flex">
          {links.map((link, index) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn('group flex items-baseline gap-2 text-[14.5px] transition-colors duration-300', active ? 'text-ink' : 'text-mute hover:text-ink')}
              >
                <span className="font-mono text-[10px] text-faint transition-colors group-hover:text-ink">{index + 1}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={DARA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden h-10 items-center gap-2 bg-[#e4e4e0] px-5 text-[14px] font-medium text-ink transition-colors duration-300 hover:bg-[#d9d9d4] md:inline-flex"
          >
            Explore DARA
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="h-10 px-1 text-[14px] font-medium text-ink md:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line/80 md:hidden"
          >
            <div className="flex flex-col px-6 pb-8 pt-4">
              {links.map((link, index) => (
                <Link key={link.href} href={link.href} className="flex items-baseline gap-3 border-b border-line/70 py-4 text-[26px] tracking-[-0.03em] text-ink">
                  <span className="font-mono text-[11px] text-faint">{index + 1}</span>
                  {link.label}
                </Link>
              ))}
              <a href={DARA_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex h-12 items-center justify-center gap-2 bg-ink text-[15px] font-medium text-paper">
                Explore DARA <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
