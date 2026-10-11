import Link from 'next/link';
import { OrbitDirector } from '@/components/motion/OrbitDirector';
import { FadeUp, ScrubText, SplitWords } from '@/components/motion/reveal';
import { BeforeSequence } from '@/components/site/BeforeSequence';
import { CONTACT_EMAIL, DARA_URL } from '@/components/site/brand';
import { ContextLayers } from '@/components/site/ContextLayers';
import { DaraShowcase } from '@/components/site/DaraShowcase';
import { SectionIndex } from '@/components/site/SectionIndex';
import { ComplexWork, FirstChapter, WhyDiligence } from '@/components/site/sections';
import { ButtonLink, Container, Label } from '@/components/site/ui';

const index = [
  { id: 'overview', label: 'Overview' },
  { id: 'complex-work', label: 'Complex work' },
  { id: 'dara', label: 'DARA' },
  { id: 'enterprise', label: 'DARA Enterprise' },
  { id: 'context', label: 'Context' },
  { id: 'why', label: 'Why Diligence' },
  { id: 'chapter', label: 'First chapter' },
  { id: 'contact', label: 'Contact' },
];

const body = 'text-[17px] leading-[1.7] text-ink-2';
const offset = 'xl:pl-[220px]';

export default function Home() {
  return (
    <div data-page>
      <OrbitDirector />
      <SectionIndex items={index} />

      {/* Overview */}
      <section id="overview" data-orbit="x:.74 y:.5 size:.46 theta:1.82 opacity:1 grid:8" className="relative flex min-h-[100svh] flex-col pt-[72px]">
        <Container className={`flex flex-1 flex-col justify-center py-20 ${offset}`}>
          <SplitWords as="h1" text="AI for work that matters." className="display max-w-[11ch] text-[clamp(52px,8.4vw,128px)] leading-[0.95]" />
          <FadeUp delay={0.35} className="mt-8 max-w-[560px]">
            <p className="text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-ink-2">
              We build intelligent products for professionals and organisations working where accuracy, context and judgment matter.
            </p>
            <p className="mt-4 text-[15px] text-mute">Diligence AI Technologies is the company behind DARA.</p>
          </FadeUp>
          <FadeUp delay={0.5} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={DARA_URL} external>Explore DARA</ButtonLink>
            <ButtonLink href="/about" variant="quiet">About Diligence</ButtonLink>
          </FadeUp>
        </Container>

        <Container className={`pb-14 ${offset}`}>
          <ol className="grid gap-y-8 sm:grid-cols-3">
            {[
              { href: '#dara', title: 'Legal AI that checks the work.', note: 'DARA for Lawyers. Available now.' },
              { href: '#enterprise', title: 'What if Legal could sit beside everyone while they work?', note: 'DARA Enterprise. Coming soon.' },
              { href: '#context', title: 'Intelligence that understands context.', note: 'That is why context matters.' },
            ].map((item, i) => (
              <li key={item.href}>
                <FadeUp delay={0.6 + i * 0.08} className="h-full border-l border-line pl-5 pr-6">
                  <img src={`/media/orb-${i + 1}.png`} alt="" width={44} height={44} className="h-11 w-11" />
                  <Link href={item.href} className="group mt-5 block">
                    <span className="block text-[17px] tracking-[-0.015em] text-ink transition-opacity group-hover:opacity-70">{item.title}</span>
                    <span className="mt-1 block text-[14px] text-mute">{item.note}</span>
                  </Link>
                </FadeUp>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <ComplexWork index="01" orbit="x:.06 y:.56 size:.34 theta:1.05 opacity:.34 grid:11" />

      {/* DARA */}
      <section id="dara" data-orbit="x:.9 y:.16 size:.2 theta:.4 opacity:.32 grid:6" className="py-32 md:py-44">
        <Container className={offset}>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Label index="02">DARA</Label>
              <SplitWords text="Legal AI that checks the work." className="display mt-8 text-[clamp(40px,5.2vw,78px)] leading-[1]" />
            </div>
            <FadeUp className="space-y-5 lg:col-span-5 lg:col-start-8 lg:pt-16">
              <p className={body}>DARA is our legal AI platform.</p>
              <p className={body}>
                We are building DARA around a simple idea: legal problems should be identified as close as possible to the point where the work happens.
              </p>
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

      {/* DARA Enterprise */}
      <section id="enterprise" data-orbit="x:.5 y:1.34 size:.74 theta:.05 opacity:.26 grid:13" className="pt-32 md:pt-44">
        <Container className={offset}>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Label index="03">Coming Soon · DARA Enterprise</Label>
              <SplitWords text="What if Legal could sit beside everyone while they work?" className="display mt-8 text-[clamp(38px,5vw,76px)] leading-[1.02]" />
            </div>
            <FadeUp className="space-y-5 lg:col-span-5 lg:pt-16">
              <p className={body}>Legal problems often begin before anyone thinks to call Legal.</p>
              <p className={body}>
                An employee sends an email. Sales makes a commitment to a customer. HR communicates a decision. Someone reviews an agreement or receives a document for signature.
              </p>
              <p className={body}>To the person doing the work, it may feel completely ordinary.</p>
            </FadeUp>
          </div>

          <FadeUp className="mt-20 border-y border-line py-12">
            <p className="display max-w-[30ch] text-[clamp(24px,2.6vw,38px)] leading-[1.2] tracking-[-0.03em]">
              The problem is that an employee cannot ask a legal question they do not know they need to ask.
            </p>
          </FadeUp>

          <FadeUp className="mt-16 grid gap-6 lg:grid-cols-12">
            <p className={`${body} lg:col-span-5`}>DARA Enterprise is being built to bring the legal check closer to those moments.</p>
            <p className={`${body} lg:col-span-6 lg:col-start-7`}>
              DARA works alongside people in the tools where work already happens. When it identifies a potential legal or company issue, it can flag what matters, explain why, help the employee respond and bring in a manager, internal lawyer or external counsel when human judgment is required.
            </p>
          </FadeUp>

          <BeforeSequence />

          <div className="pb-32 md:pb-44">
            <span className="inline-flex h-12 cursor-default items-center border border-line px-7 text-[14.5px] font-medium text-mute">Coming Soon</span>
          </div>
        </Container>
      </section>

      {/* Context */}
      <section id="context" data-orbit="x:.86 y:.3 size:.28 theta:-.7 opacity:.6 grid:7" className="py-32 md:py-44">
        <Container className={offset}>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Label index="04">Context</Label>
              <SplitWords text="Intelligence that understands context." className="display mt-8 text-[clamp(40px,5.2vw,78px)] leading-[1]" />
            </div>
          </div>
          <div className="mt-14 grid gap-12 lg:grid-cols-12">
            <FadeUp className="space-y-5 lg:col-span-6">
              <p className="text-[19px] leading-[1.6] text-ink">The same words can mean different things in different situations.</p>
              <p className={body}>
                Something may be permitted by law but prohibited by company policy. It may comply with company policy but fall outside an employee&apos;s authority. It may be acceptable under one customer agreement and inconsistent with another.
              </p>
              <p className="text-[17px] font-medium text-ink">That is why context matters.</p>
            </FadeUp>
            <FadeUp className="lg:col-span-5 lg:col-start-8">
              <p className={body}>
                DARA is being designed to understand the information surrounding the work: applicable law, company knowledge, the person doing the work, the matter they are working on and, over time, how similar issues have previously been resolved.
              </p>
            </FadeUp>
          </div>

          <ContextLayers className="mt-24" />

          <ScrubText
            text="The objective is simple: bring the right intelligence to the point where a decision is being made."
            className="display mt-32 max-w-[24ch] text-[clamp(30px,3.8vw,58px)] leading-[1.1] tracking-[-0.035em]"
          />
        </Container>
      </section>

      <WhyDiligence index="05" orbit="x:.16 y:.5 size:.44 theta:-1.82 opacity:.62 grid:8" />

      <FirstChapter index="06" orbit="x:.84 y:.74 size:.24 theta:-1.15 opacity:.55 grid:7" />

      {/* Contact */}
      <section id="contact" data-orbit="x:.74 y:.5 size:.4 theta:.3 opacity:1 grid:6" className="flex min-h-[90svh] items-center py-32">
        <Container className={offset}>
          <Label index="07">Contact</Label>
          <SplitWords text="Build with us." className="display mt-8 text-[clamp(52px,8vw,124px)] leading-[0.95]" />
          <FadeUp className="mt-10 max-w-[520px] space-y-4">
            <p className={body}>We are building Diligence for people and organisations working on difficult problems.</p>
            <p className="text-[15px] text-mute">For product enquiries, partnerships, early access or general enquiries:</p>
          </FadeUp>
          <FadeUp className="mt-8">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="display group inline-flex items-baseline gap-3 text-[clamp(26px,3.2vw,44px)] leading-none tracking-[-0.03em] text-ink"
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-[length:100%_1px]">
                {CONTACT_EMAIL}
              </span>
            </a>
          </FadeUp>
        </Container>
      </section>
    </div>
  );
}
