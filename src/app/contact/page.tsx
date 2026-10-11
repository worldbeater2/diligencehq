import type { Metadata } from 'next';
import { VideoBackground } from '@/components/art/VideoBackground';
import { OrbitDirector } from '@/components/motion/OrbitDirector';
import { FadeUp, SplitWords } from '@/components/motion/reveal';
import { CONTACT_EMAIL } from '@/components/site/brand';
import { Container, Label } from '@/components/site/ui';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'For product enquiries, partnerships, early access or general enquiries, write to team@daralegal.co.',
};

const offset = 'xl:pl-[220px]';

const enquiries = ['Product enquiries', 'Partnerships', 'Early access', 'General enquiries'] as const;

export default function ContactPage() {
  return (
    <div data-page>
      <OrbitDirector />

      <section data-orbit="x:.8 y:.5 size:.4 theta:1.6 opacity:0 grid:8" className="relative flex min-h-[92svh] items-center overflow-hidden pt-[72px]">
        <VideoBackground />
        <Container className={`relative py-24 ${offset}`}>
          <Label>Contact</Label>
          <SplitWords as="h1" text="Build with us." className="display mt-8 text-[clamp(56px,9vw,140px)] leading-[0.94]" />
          <FadeUp delay={0.35} className="mt-10 max-w-[480px] space-y-4">
            <p className="text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-ink-2">
              We are building Diligence for people and organisations working on difficult problems.
            </p>
            <p className="text-[15px] text-mute">For product enquiries, partnerships, early access or general enquiries:</p>
          </FadeUp>
          <FadeUp delay={0.45} className="mt-8">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="display group inline-flex text-[clamp(26px,3.2vw,44px)] leading-none tracking-[-0.03em] text-ink"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1.5 transition-[background-size] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[length:0%_1px]">
                {CONTACT_EMAIL}
              </span>
            </a>
          </FadeUp>
        </Container>
      </section>

      <section data-orbit="x:.84 y:.62 size:.24 theta:-1.3 opacity:.5 grid:7" className="pb-32 md:pb-44">
        <Container className={offset}>
          <ol className="grid gap-y-8 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {enquiries.map((item, i) => (
              <li key={item}>
                <FadeUp delay={i * 0.06} className="h-full border-l border-line pl-5">
                  <p className="font-mono text-[11px] text-faint">0{i + 1}</p>
                  <p className="mt-3 text-[17px] tracking-[-0.01em] text-ink">{item}</p>
                  <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(item)}`} className="mt-1 inline-block text-[14px] text-mute transition-colors hover:text-ink">
                    Write to us
                  </a>
                </FadeUp>
              </li>
            ))}
          </ol>

          <FadeUp className="mt-24 max-w-[760px]">
            <p className="eyebrow">Company</p>
            <p className="mt-5 text-[15.5px] leading-[1.75] text-ink-2">
              Diligence AI Technologies Ltd is a private limited company registered in England and Wales. Company No. 17441022
            </p>
            <p className="mt-3 text-[15.5px] leading-[1.75] text-ink-2">
              Registered Office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom
            </p>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
