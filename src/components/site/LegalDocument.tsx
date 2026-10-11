import type { ReactNode } from 'react';
import { OrbitDirector } from '@/components/motion/OrbitDirector';
import { FadeUp, SplitWords } from '@/components/motion/reveal';
import { Container, Label } from './ui';

export type LegalSection = { title: string; body: ReactNode };

/** A quiet document page: title, date, and numbered sections in one column. */
export function LegalDocument({ label, title, updated, intro, sections }: {
  label: string;
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div data-page>
      <OrbitDirector />
      <section data-orbit="x:.9 y:.2 size:.18 theta:1.7 opacity:.35 grid:6" className="pt-[72px]">
        <Container className="py-24 xl:pl-[220px]">
          <Label>{label}</Label>
          <SplitWords as="h1" text={title} className="display mt-8 text-[clamp(44px,6.4vw,96px)] leading-[0.98]" />
          <FadeUp delay={0.3} className="mt-8 max-w-[640px] space-y-4">
            <p className="text-[13px] text-mute">Last updated {updated}</p>
            <div className="text-[17px] leading-[1.7] text-ink-2">{intro}</div>
          </FadeUp>
        </Container>
      </section>
      <section className="pb-32 md:pb-44">
        <Container className="xl:pl-[220px]">
          <ol className="max-w-[720px] border-t border-line">
            {sections.map((section, index) => (
              <li key={section.title} className="border-b border-line py-10">
                <FadeUp>
                  <h2 className="flex items-baseline gap-4 text-[20px] font-medium tracking-[-0.02em] text-ink">
                    <span className="font-mono text-[11px] text-faint">{String(index + 1).padStart(2, '0')}</span>
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-[15.5px] leading-[1.75] text-ink-2 sm:pl-9 [&_a]:underline [&_a]:decoration-ink/25 [&_a]:underline-offset-4 hover:[&_a]:decoration-ink [&_li]:pl-1 [&_ul]:list-['–__'] [&_ul]:space-y-2 [&_ul]:pl-5">
                    {section.body}
                  </div>
                </FadeUp>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </div>
  );
}
