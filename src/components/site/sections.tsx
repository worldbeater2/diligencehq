/**
 * Story sections shared by the home and about pages, set in the copy's own
 * words. Each takes its section id, label number and planet state.
 */
import { FadeUp, ScrubText, SplitWords } from '@/components/motion/reveal';
import { Container, Label } from '@/components/site/ui';

const body = 'text-[17px] leading-[1.7] text-ink-2';
const offset = 'xl:pl-[220px]';

export function ComplexWork({ id = 'complex-work', index, orbit: orbitState }: { id?: string; index: string; orbit: string }) {
  return (
  <section id={id} data-orbit={orbitState} className="py-32 md:py-44">
    <Container className={offset}>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-10">
          <Label index={index}>Approach</Label>
          <SplitWords text="We build for complex work." className="display mt-8 text-[clamp(40px,5.6vw,84px)] leading-[1]" />
          <ScrubText
            text="Important work rarely happens in isolation. It happens across documents, conversations, rules, decisions and workflows, often with more context than any one person can hold at once."
            className="display mt-12 max-w-[28ch] text-[clamp(26px,3vw,44px)] leading-[1.18] tracking-[-0.03em] text-ink"
          />
        </div>
        <FadeUp className="lg:col-span-6 lg:col-start-6">
          <p className={body}>
            We build AI products that bring the right intelligence closer to the work itself, helping people identify what matters, understand the context around it and make better informed decisions.
          </p>
          <p className="mt-6 text-[17px] font-medium text-ink">Our first product is DARA.</p>
        </FadeUp>
      </div>
    </Container>
  </section>
  );
}

export function WhyDiligence({ id = 'why', index, orbit: orbitState }: { id?: string; index: string; orbit: string }) {
  return (
  <section id={id} data-orbit={orbitState} className="py-32 md:py-44">
    <Container className={offset}>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8 lg:col-start-5">
          <Label index={index}>Why Diligence?</Label>
          <SplitWords text="The next generation of software should understand the work around you." className="display mt-8 text-[clamp(36px,4.4vw,66px)] leading-[1.04]" />
          <FadeUp className="mt-12 space-y-5">
            <p className={body}>AI is becoming increasingly capable. Intelligence alone does not solve every professional problem.</p>
            <p className={body}>
              People still need to know what to ask, which information matters, what governs the decision and when somebody else needs to become involved.
            </p>
            <p className="text-[17px] font-medium text-ink">We build the product layer around that intelligence.</p>
          </FadeUp>

          <ul className="mt-14 border-t border-line">
            {[
              'Systems that understand context.',
              'Systems that work where people already work.',
              'Systems that know when something deserves attention.',
              'Systems designed around the professionals and organisations that depend on them.',
            ].map((line, i) => (
              <li key={line} className="border-b border-line">
                <FadeUp delay={i * 0.06} className="flex gap-6 py-6">
                  <span className="pt-2 font-mono text-[11px] text-faint">0{i + 1}</span>
                  <span className="text-[clamp(20px,2vw,28px)] leading-[1.3] tracking-[-0.02em] text-ink">{line}</span>
                </FadeUp>
              </li>
            ))}
          </ul>
          <FadeUp className="mt-10">
            <p className="text-[17px] font-medium text-ink">That is what we are building at Diligence.</p>
          </FadeUp>
        </div>
      </div>
    </Container>
  </section>
  );
}

export function FirstChapter({ id = 'chapter', index, orbit: orbitState }: { id?: string; index: string; orbit: string }) {
  return (
  <section id={id} data-orbit={orbitState} className="py-32 md:py-44">
    <Container className={offset}>
      <Label index={index}>Our first chapter</Label>
      <SplitWords text="Our first chapter is DARA." className="display mt-8 text-[clamp(40px,5.2vw,78px)] leading-[1]" />
      <ol className="mt-20 grid gap-y-12 md:grid-cols-3">
        {[
          {
            when: 'Began with lawyers',
            text: 'DARA began with lawyers. The current product provides a verification layer across completed legal work before it leaves the lawyer’s desk.',
          },
          {
            when: 'Into the organisation',
            text: 'The next step takes that same principle into the organisation, bringing legal checking into ordinary business work, including moments when the person doing the work does not realise there is a legal question to ask.',
          },
          {
            when: 'Over time',
            text: 'Over time, we intend to build more intelligent products for complex professional and organisational work.',
          },
        ].map((step, i) => (
          <li key={step.when}>
            <FadeUp delay={i * 0.08} className="h-full border-l border-line pl-5 pr-6">
              <p className="font-mono text-[11px] text-faint">0{i + 1}</p>
              <p className="mt-3 text-[17px] font-medium tracking-[-0.01em] text-ink">{step.when}</p>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-ink-2">{step.text}</p>
            </FadeUp>
          </li>
        ))}
      </ol>
      <FadeUp className="mt-24 flex flex-col gap-1 border-t border-line pt-8 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-[15px] text-ink">Diligence AI Technologies</p>
        <p className="text-[15px] text-mute">AI for work that matters.</p>
      </FadeUp>
    </Container>
  </section>
  );
}
