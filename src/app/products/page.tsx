import type { Metadata } from 'next';
import { VideoBackground } from '@/components/art/VideoBackground';
import { OrbitDirector } from '@/components/motion/OrbitDirector';
import { FadeUp, ScrubText, SplitWords } from '@/components/motion/reveal';
import { BeforeSequence } from '@/components/site/BeforeSequence';
import { DARA_URL } from '@/components/site/brand';
import { ContextLayers } from '@/components/site/ContextLayers';
import { DaraShowcase } from '@/components/site/DaraShowcase';
import { SectionIndex } from '@/components/site/SectionIndex';
import { ButtonLink, Container, Label } from '@/components/site/ui';

export const metadata: Metadata = {
  title: 'Products',
  description: 'DARA is our legal AI platform. DARA for Lawyers is available now; DARA Enterprise is coming soon.',
};

const body = 'text-[17px] leading-[1.7] text-ink-2';
const offset = 'xl:pl-[220px]';

const index = [
  { id: 'products', label: 'Products' },
  { id: 'lawyers', label: 'DARA for Lawyers' },
  { id: 'enterprise', label: 'DARA Enterprise' },
  { id: 'context', label: 'Context' },
];

export default function ProductsPage() {
  return (
    <div data-page>
      <OrbitDirector />
      <SectionIndex items={index} />

      <section id="products" data-orbit="x:.8 y:.5 size:.4 theta:1.6 opacity:0 grid:8" className="relative flex min-h-[88svh] items-center overflow-hidden pt-[72px]">
        <VideoBackground />
        <Container className={`relative py-24 ${offset}`}>
          <Label>Products</Label>
          <SplitWords as="h1" text="Our first product is DARA." className="display mt-8 max-w-[12ch] text-[clamp(48px,7.6vw,116px)] leading-[0.96]" />
          <FadeUp delay={0.35} className="mt-8 max-w-[520px]">
            <p className="text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-ink-2">
              DARA is our legal AI platform. We are building DARA around a simple idea: legal problems should be identified as close as possible to the point where the work happens.
            </p>
          </FadeUp>
        </Container>
      </section>

      <section id="lawyers" data-orbit="x:.9 y:.16 size:.18 theta:.4 opacity:.3 grid:6" className="py-28 md:py-40">
        <Container className={offset}>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Label index="01">Available now</Label>
              <SplitWords text="DARA for Lawyers" className="display mt-8 text-[clamp(40px,5.2vw,78px)] leading-[1]" />
              <p className="mt-5 text-[19px] text-mute">Legal AI that checks the work.</p>
            </div>
            <FadeUp className="space-y-5 lg:col-span-5 lg:col-start-8 lg:pt-16">
              <p className={body}>
                Today, DARA helps lawyers verify completed legal work before it leaves their desk. It reviews work against the client brief, applicable law, authorities and supporting materials to identify potential conflicts, inconsistencies and omissions.
              </p>
              <p className="text-[17px] font-medium text-ink">DARA for Lawyers is available now.</p>
              <div className="pt-3">
                <ButtonLink href={DARA_URL} external>Explore DARA for Lawyers</ButtonLink>
              </div>
            </FadeUp>
          </div>
          <FadeUp className="mt-20">
            <DaraShowcase />
          </FadeUp>
        </Container>
      </section>

      <section id="enterprise" data-orbit="x:.5 y:1.34 size:.74 theta:.05 opacity:.26 grid:13" className="pt-28 md:pt-40">
        <Container className={offset}>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Label index="02">Coming Soon</Label>
              <SplitWords text="DARA Enterprise" className="display mt-8 text-[clamp(40px,5.2vw,78px)] leading-[1]" />
              <p className="mt-5 max-w-[24ch] text-[19px] leading-[1.45] text-mute">What if Legal could sit beside everyone while they work?</p>
            </div>
            <FadeUp className="space-y-5 lg:col-span-5 lg:pt-16">
              <p className={body}>Legal problems often begin before anyone thinks to call Legal.</p>
              <p className={body}>
                An employee sends an email. Sales makes a commitment to a customer. HR communicates a decision. Someone reviews an agreement or receives a document for signature.
              </p>
              <p className={body}>To the person doing the work, it may feel completely ordinary.</p>
              <p className="text-[17px] font-medium text-ink">
                The problem is that an employee cannot ask a legal question they do not know they need to ask.
              </p>
            </FadeUp>
          </div>
          <FadeUp className="mt-16 grid gap-6 border-t border-line pt-10 lg:grid-cols-12">
            <p className={`${body} lg:col-span-5`}>DARA Enterprise is being built to bring the legal check closer to those moments.</p>
            <p className={`${body} lg:col-span-6 lg:col-start-7`}>
              DARA works alongside people in the tools where work already happens. When it identifies a potential legal or company issue, it can flag what matters, explain why, help the employee respond and bring in a manager, internal lawyer or external counsel when human judgment is required.
            </p>
          </FadeUp>
          <BeforeSequence />
          <div className="pb-28 md:pb-40">
            <span className="inline-flex h-12 cursor-default items-center border border-line px-7 text-[14.5px] font-medium text-mute">Coming Soon</span>
          </div>
        </Container>
      </section>

      <section id="context" data-orbit="x:.86 y:.3 size:.28 theta:-.7 opacity:.6 grid:7" className="pb-32 pt-8 md:pb-44">
        <Container className={offset}>
          <Label index="03">Context</Label>
          <SplitWords text="Intelligence that understands context." className="display mt-8 max-w-[16ch] text-[clamp(40px,5.2vw,78px)] leading-[1]" />
          <FadeUp className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-6">
              <p className="text-[19px] leading-[1.6] text-ink">The same words can mean different things in different situations.</p>
              <p className={body}>
                Something may be permitted by law but prohibited by company policy. It may comply with company policy but fall outside an employee&apos;s authority. It may be acceptable under one customer agreement and inconsistent with another.
              </p>
            </div>
            <p className={`${body} lg:col-span-5 lg:col-start-8`}>
              DARA is being designed to understand the information surrounding the work: applicable law, company knowledge, the person doing the work, the matter they are working on and, over time, how similar issues have previously been resolved.
            </p>
          </FadeUp>
          <ContextLayers className="mt-24" />
          <ScrubText
            text="The objective is simple: bring the right intelligence to the point where a decision is being made."
            className="display mt-32 max-w-[24ch] text-[clamp(30px,3.8vw,58px)] leading-[1.1] tracking-[-0.035em]"
          />
        </Container>
      </section>
    </div>
  );
}
