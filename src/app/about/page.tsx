import type { Metadata } from 'next';
import { OrbitDirector } from '@/components/motion/OrbitDirector';
import { FadeUp, SplitWords } from '@/components/motion/reveal';
import { DARA_URL } from '@/components/site/brand';
import { SectionIndex } from '@/components/site/SectionIndex';
import { ComplexWork, FirstChapter, WhyDiligence } from '@/components/site/sections';
import { ButtonLink, Container, Label } from '@/components/site/ui';

export const metadata: Metadata = {
  title: 'About',
  description: 'Diligence AI Technologies is the company behind DARA. We build AI products for complex professional and organisational work.',
};

const offset = 'xl:pl-[220px]';

const index = [
  { id: 'about', label: 'About' },
  { id: 'complex-work', label: 'Complex work' },
  { id: 'why', label: 'Why Diligence' },
  { id: 'chapter', label: 'First chapter' },
  { id: 'company', label: 'Company' },
];

const details = [
  ['Company', 'Diligence AI Technologies Ltd'],
  ['Registered in', 'England and Wales'],
  ['Company No.', '17441022'],
  ['Registered Office', '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom'],
] as const;

export default function AboutPage() {
  return (
    <div data-page>
      <OrbitDirector />
      <SectionIndex items={index} />

      <section id="about" data-orbit="x:.87 y:.54 size:.34 theta:-1.7 opacity:.9 grid:9" className="flex min-h-[88svh] items-center pt-[72px]">
        <Container className={`py-24 ${offset}`}>
          <Label>About Diligence</Label>
          <SplitWords as="h1" text="AI for work that matters." className="display mt-8 max-w-[11ch] text-[clamp(48px,7.6vw,116px)] leading-[0.96]" />
          <FadeUp delay={0.35} className="mt-8 max-w-[540px] space-y-4">
            <p className="text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-ink-2">
              We build intelligent products for professionals and organisations working where accuracy, context and judgment matter.
            </p>
            <p className="text-[15px] text-mute">Diligence AI Technologies is the company behind DARA.</p>
          </FadeUp>
        </Container>
      </section>

      <ComplexWork index="01" orbit="x:.06 y:.56 size:.34 theta:1.05 opacity:.34 grid:11" />
      <WhyDiligence index="02" orbit="x:.84 y:.48 size:.42 theta:1.7 opacity:.6 grid:8" />
      <FirstChapter index="03" orbit="x:.18 y:.72 size:.26 theta:-1.2 opacity:.55 grid:7" />

      <section id="company" data-orbit="x:.82 y:.5 size:.3 theta:.3 opacity:.85 grid:6" className="pb-32 md:pb-44">
        <Container className={offset}>
          <Label index="04">Company</Label>
          <dl className="mt-10 max-w-[760px] border-t border-line">
            {details.map(([term, detail]) => (
              <FadeUp key={term} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[200px_1fr] sm:gap-8">
                <dt className="text-[14px] text-mute">{term}</dt>
                <dd className="text-[16px] text-ink">{detail}</dd>
              </FadeUp>
            ))}
          </dl>
          <FadeUp className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href={DARA_URL} external>Explore DARA</ButtonLink>
            <ButtonLink href="/contact" variant="quiet">Contact</ButtonLink>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
