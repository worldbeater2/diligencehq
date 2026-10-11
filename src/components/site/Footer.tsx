import Link from 'next/link';
import { CONTACT_EMAIL, DARA_URL, Wordmark } from './brand';
import { Container } from './ui';

const linkClass = 'text-[14px] text-ink-2 transition-colors duration-300 hover:text-ink';

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line/80 bg-paper">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <Wordmark className="text-ink" />
            <p className="mt-5 text-[14px] text-ink-2">Diligence AI Technologies Ltd</p>
            <p className="mt-1 text-[14px] text-mute">AI for work that matters.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-8">
            <Column title="Products">
              <li>
                <a href={DARA_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  DARA for Lawyers
                </a>
              </li>
              <li>
                <Link href="/products#enterprise" className={linkClass}>
                  DARA Enterprise <span className="text-faint">Coming Soon</span>
                </Link>
              </li>
            </Column>
            <Column title="Company">
              <li><Link href="/about" className={linkClass}>About</Link></li>
              <li><Link href="/contact" className={linkClass}>Contact</Link></li>
            </Column>
            <Column title="Contact">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a>
              </li>
            </Column>
            <Column title="Legal">
              <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={linkClass}>Terms of Use</Link></li>
            </Column>
          </div>
        </div>

        <div className="grid gap-6 border-t border-line/80 py-8 text-[12.5px] leading-[1.7] text-mute md:grid-cols-12">
          <p className="md:col-span-6">
            Diligence AI Technologies Ltd is a private limited company registered in England and Wales. Company No. 17441022
          </p>
          <p className="md:col-span-4">
            Registered Office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom
          </p>
          <p className="md:col-span-2 md:text-right">© 2026 Diligence AI Technologies Ltd. All rights reserved.</p>
        </div>
      </Container>

      <div aria-hidden className="overflow-hidden">
        <p className="halftone-text display -mb-[0.2em] select-none text-center text-[23vw] leading-[0.8] tracking-[-0.06em]">
          Diligence
        </p>
      </div>
    </footer>
  );
}
