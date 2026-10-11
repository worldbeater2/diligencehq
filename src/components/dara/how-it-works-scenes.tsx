'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DaraPane, DocPage, ScaledStage, WordWindow } from './word-kit';

/*
 * Four short, scripted scenes that show the add-in being used: a cursor drives
 * the Dara pane while the Word document reacts. Each scene plays through a list
 * of beats, holds on the outcome, then tells the parent it is done.
 */

const ease = [0.22, 0.61, 0.36, 1] as const;
const CANVAS = { width: 980, height: 600 };

/** Advance through beats at the given offsets (ms); calls onDone after `hold`. */
function useBeats(offsets: number[], playing: boolean, hold: number, onDone?: () => void) {
  const reduceMotion = useReducedMotion();
  const last = offsets.length - 1;
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (reduceMotion || !playing) return;
    const timers = offsets.slice(1).map((at, index) => window.setTimeout(() => setBeat(index + 1), at));
    const done = window.setTimeout(() => onDone?.(), offsets[last] + hold);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
    // offsets are module constants per scene
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, reduceMotion]);

  return reduceMotion ? last : beat;
}

/* ─── Shared pieces ───────────────────────────────────────────────── */

function Cursor({ x, y, pressed = false }: { x: number; y: number; pressed?: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-40"
      initial={false}
      animate={{ x, y }}
      transition={{ duration: 0.75, ease }}
    >
      <AnimatePresence>
        {pressed && (
          <motion.span
            key={`${x}-${y}`}
            className="absolute -left-[9px] -top-[9px] h-[22px] w-[22px] rounded-full border border-[#034239]/40 dark:border-[#7fe0c5]/50"
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.6, ease }}
          />
        )}
      </AnimatePresence>
      <motion.svg width="18" height="22" viewBox="0 0 18 22" animate={{ scale: pressed ? 0.88 : 1 }} transition={{ duration: 0.15 }} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)]">
        <path d="M1.5 1.5v16.2l4.3-4.1 2.8 6.4 2.9-1.3-2.8-6.3 6-.4L1.5 1.5z" fill="#0b1714" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  );
}

/** Dara's dot-matrix loader: a 5×5 grid with a diagonal sweep, as in the product. */
function DaraLoader({ size = 14 }: { size?: number }) {
  const reduceMotion = useReducedMotion();
  const dot = Math.max(1.25, size * 0.11);
  return (
    <span aria-hidden className="grid shrink-0 grid-cols-5 text-[#0d6b58] dark:text-[#7fe0c5]" style={{ width: size, height: size, gap: (size - dot * 5) / 4 }}>
      {Array.from({ length: 25 }, (_, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        const slice = row + (4 - col);
        return (
          <motion.span
            key={index}
            className="rounded-full bg-current"
            style={{ width: dot, height: dot }}
            animate={reduceMotion ? { opacity: slice % 2 ? 0.25 : 0.95 } : { opacity: [0.25, 1, 0.25] }}
            transition={reduceMotion ? undefined : { duration: 1.1, repeat: Infinity, delay: slice * 0.09, ease: 'easeInOut' }}
          />
        );
      })}
    </span>
  );
}

function Panel({ className, children, active = false }: { className?: string; children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-[11px] border bg-white transition-[border-color,box-shadow] duration-300 dark:bg-[#131a17]',
        active ? 'border-[#a9cfc2] shadow-[0_0_0_3px_rgba(15,91,78,0.07)] dark:border-[#2f6b5b]' : 'border-[#ebebe8] dark:border-[#1f2a26]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-[10.5px] font-medium text-[#6b6b66] dark:text-[#a3a39f]', className)}>{children}</p>;
}

function PrimaryButton({ children, pressed = false, className }: { children: React.ReactNode; pressed?: boolean; className?: string }) {
  return (
    <div className={cn('flex h-[32px] items-center justify-center gap-1.5 rounded-[9px] text-[11.5px] font-medium text-white shadow-[0_1px_2px_rgba(4,35,30,0.12)] transition-[background-color,transform] duration-150 dark:text-[#06150f]', pressed ? 'scale-[0.985] bg-[#04463c] dark:bg-[#7fe0c5]' : 'bg-[#034239] dark:bg-[#5fd4b2]', className)}>
      {children}
    </div>
  );
}

function Dot({ tone }: { tone: 'hard' | 'soft' | 'omission' }) {
  const color = tone === 'hard' ? 'bg-[#c24b40]' : tone === 'soft' ? 'bg-[#c98f2e]' : 'bg-[#82827d]';
  return <span aria-hidden className={cn('h-[6px] w-[6px] shrink-0 rounded-full', color)} />;
}

/** The sources card at the top of the Review tab. */
function SourcesCard({ count, children, active = false }: { count: number; children?: React.ReactNode; active?: boolean }) {
  return (
    <Panel active={active} className="overflow-hidden">
      <div className="flex items-start justify-between gap-2 px-3 pb-2.5 pt-3">
        <div className="min-w-0">
          <Label>Review sources</Label>
          <p className="mt-0.5 text-[12.5px] font-semibold text-[#071411] dark:text-white">Clearwater Payments</p>
          <p className="mt-0.5 text-[10.5px] text-[#6b6b66] dark:text-[#a3a39f]">
            {count === 0 ? 'No sources attached yet' : `${count} source${count === 1 ? '' : 's'} will be used in this review`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5 text-[10.5px] font-medium">
          <span className="text-[#0d6b58] dark:text-[#7fe0c5]">Switch</span>
          <span className="flex items-center gap-0.5 text-[#52524d] dark:text-[#a3a39f]">Manage <ArrowRight className="h-2.5 w-2.5" /></span>
        </div>
      </div>
      {children && <div className="border-t border-[#f1f1ef] px-3 py-2.5 dark:border-[#1f2a26]">{children}</div>}
    </Panel>
  );
}

function DropZone({ hot = false }: { hot?: boolean }) {
  return (
    <div className={cn('flex h-[42px] items-center gap-2 rounded-[9px] border border-dashed px-2.5 transition-colors duration-300',
      hot ? 'border-[#5fbfa6] bg-[#f6faf8] dark:border-[#2f8a74] dark:bg-[#12291f]' : 'border-[#e2e2df] bg-[#fafaf9] dark:border-[#26332e] dark:bg-[#0f1412]')}>
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-medium text-[#393936] dark:text-[#dfe8e4]">{hot ? 'Release to add' : 'Drop files to add sources'}</p>
        <p className="text-[9px] text-[#82827d]">PDF · DOCX · TXT</p>
      </div>
      <span className="flex h-[22px] items-center rounded-[7px] border border-[#e2e2df] bg-white px-2 text-[10px] font-medium text-[#393936] dark:border-[#1f2a26] dark:bg-[#131a17] dark:text-[#dfe8e4]">Browse files</span>
    </div>
  );
}

/* ─── The document ────────────────────────────────────────────────── */

type DocState = 'plain' | 'flagged' | 'selected' | 'revised';

function LegalDocument({ state, offset = 0 }: { state: DocState; offset?: number }) {
  const clauseTone = {
    plain: '',
    flagged: 'bg-[#fbefed] shadow-[inset_0_-1.5px_0_#c24b40]',
    selected: 'bg-[#fff200]',
    revised: '',
  }[state];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-6 w-[440px] -translate-x-1/2"
        animate={{ y: -offset }}
        transition={{ duration: 0.9, ease }}
      >
        <DocPage className="px-[46px] pb-12 pt-10 text-[9.6px] leading-[1.62]">
          <p className="text-[10px] font-bold">GHANA</p>
          <p className="mt-2 font-bold">II.&nbsp;&nbsp;&nbsp;Overview</p>
          <ol className="mt-2 space-y-2.5">
            <li className="grid grid-cols-[22px_1fr]">
              <span>4.</span>
              <span>Payment systems and services in Ghana are regulated by the Bank of Ghana (the &ldquo;<b>BoG</b>&rdquo;) primarily through the Payment Systems and Services Act, 2019 (Act 987) (the &ldquo;<b>PSS Act</b>&rdquo;).</span>
            </li>
            <li className="grid grid-cols-[22px_1fr]">
              <span>5.</span>
              <span>The PSS Act, which regulates institutions engaged in the payment services and electronic money business, requires electronic money issuers and payment service providers to apply for licences from the BoG prior to the commencement of operations in Ghana.</span>
            </li>
            <li className="grid grid-cols-[22px_1fr]">
              <span>6.</span>
              <span>
                <span className="italic underline">Definition of Payment System</span>
                <span className="mt-1 block">
                  {state === 'revised' ? (
                    <>
                      A payment system is defined under the PSS Act as &ldquo;the procedures, rules, instruments, institutions, and infrastructure{' '}
                      <span className="rounded-[2px] bg-[#fbefed] text-[#9a3a32] line-through decoration-[#c24b40]/60">that do not facilitate the transfer of funds but help money flow</span>{' '}
                      <motion.span
                        className="rounded-[2px] bg-[#e4f0eb] text-[#034239] underline decoration-[#034239]/40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        that facilitate the transfer of funds
                      </motion.span>
                      &rdquo;.
                    </>
                  ) : (
                    <span className={cn('box-decoration-clone rounded-[1px] transition-[background-color,box-shadow] duration-500', clauseTone)}>
                      A payment system is defined under the PSS Act as &ldquo;the procedures, rules, instruments, institutions, and infrastructure that do not facilitate the transfer of funds but help money flow&rdquo;.
                    </span>
                  )}
                </span>
              </span>
            </li>
            <li className="grid grid-cols-[22px_1fr]">
              <span>7.</span>
              <span>
                <span className="italic underline">Definition of Payment Service</span>
                <span className="mt-1 block">A payment service is defined under the PSS Act as &ldquo;provision of a service to facilitate the transfer of funds from a payer to a payee using various forms of payment instruments or electronic money&rdquo;.</span>
              </span>
            </li>
            <li className="grid grid-cols-[22px_1fr]">
              <span>8.</span>
              <span>
                <span className="italic underline">Definition of Electronic Money</span>
                <span className="mt-1 block">Electronic money means monetary value represented by a claim on the issuer, stored electronically and accepted as a means of payment by persons other than the issuer.</span>
              </span>
            </li>
          </ol>
          <div className="mt-7 w-[120px] border-t border-black/40" />
          <p className="mt-2 text-[7.5px] leading-[1.5] text-black/70">¹ Section 102 of the Payment Systems and Services Act, 2019 (Act 987).</p>
          <p className="text-[7.5px] leading-[1.5] text-black/70">² Section 3(1) of the Payment Systems and Services Act, 2019 (Act 987).</p>
        </DocPage>
      </motion.div>

    </div>
  );
}

/* ─── Scene frame ─────────────────────────────────────────────────── */

function SceneWindow({ doc, children }: { doc: React.ReactNode; children: React.ReactNode }) {
  return (
    <ScaledStage width={CANVAS.width} height={CANVAS.height} minScale={0.5} anchor="right">
      <div style={{ width: CANVAS.width, height: CANVAS.height }}>
        <WordWindow
          title="Advice re acquisition of a PSP Licence.docx"
          ribbon="tabs"
          statusText="Page 2 of 9   3,204 words   English (United Kingdom)"
          paneWidth={350}
          documentArea={doc}
          pane={
            <DaraPane activeTab="review" bodyClassName="bg-[#fafaf9] dark:bg-[#0b0f0d]">
              <div className="absolute inset-0 p-3">{children}</div>
            </DaraPane>
          }
        />
      </div>
    </ScaledStage>
  );
}

const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.28, ease },
};

/* ─── 1 · Open or create a matter ─────────────────────────────────── */

const MATTERS = [
  { name: 'Clearwater Payments', detail: 'PSP licence advice · Ghana' },
  { name: 'Harbor Bank licensing', detail: 'Regulatory · Ghana' },
  { name: 'Volta Energy PPA', detail: 'Transaction review' },
  { name: 'Kofi Holdings employment', detail: 'Employment' },
];

function ChoiceIcon({ kind }: { kind: 'matter' | 'quick' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="h-[16px] w-[16px] shrink-0 text-[#52524d] dark:text-[#a3a39f]" aria-hidden>
      {kind === 'matter' ? (
        <>
          <path d="M2.25 4.6c0-.6.45-1.05 1.05-1.05h2.9l1.45 1.5h5.05c.6 0 1.05.45 1.05 1.05v6.3c0 .6-.45 1.05-1.05 1.05H3.3c-.6 0-1.05-.45-1.05-1.05Z" />
          <path d="M2.25 7.25h11.5" />
        </>
      ) : (
        <>
          <path d="M3.25 2.75c0-.55.45-1 1-1h5.1l3.4 3.4v8.1c0 .55-.45 1-1 1h-7.5c-.55 0-1-.45-1-1Z" />
          <path d="M9.25 1.85v2.4c0 .5.4.9.9.9h2.5" />
          <path d="m5.6 9.35 1.55 1.5 3.25-3.2" />
        </>
      )}
    </svg>
  );
}

function OpenMatterScene({ playing, onDone }: { playing: boolean; onDone?: () => void }) {
  const beat = useBeats([0, 900, 1700, 2500, 3700, 4500], playing, 2400, onDone);
  const typed = useTyped('Clear', beat >= 3);
  const visible = MATTERS.filter((matter) => matter.name.toLowerCase().startsWith(typed.toLowerCase()));

  const cursor =
    beat === 0 ? { x: 250, y: 300 } :
    beat <= 2 ? { x: 150, y: 110 } :
    beat === 3 ? { x: 180, y: 30 } :
    { x: 130, y: 98 };

  return (
    <SceneWindow doc={<LegalDocument state="plain" />}>
      <AnimatePresence mode="wait" initial={false}>
        {beat < 2 && (
          <motion.div key="choose" {...swap} className="pt-3">
            <div className="px-1 text-center">
              <p className="text-[14px] font-semibold tracking-[-0.01em] text-[#071411] dark:text-white">Where should this review live?</p>
              <p className="mx-auto mt-1 max-w-[250px] text-[10.5px] leading-[1.5] text-[#6b6b66] dark:text-[#a3a39f]">Use a matter for saved sources and history, or review the document on its own.</p>
            </div>
            <Panel className="mt-3.5 overflow-hidden">
              {[
                { kind: 'matter' as const, title: 'Start with a matter', body: 'Saved sources, instructions and review history.' },
                { kind: 'quick' as const, title: 'Quick review', body: 'Add sources and review without a matter.' },
              ].map((row, index) => (
                <div key={row.kind} className={cn('flex items-center gap-3 px-3 py-3 transition-colors duration-200', index > 0 && 'border-t border-[#f1f1ef] dark:border-[#1f2a26]', beat === 1 && index === 0 && 'bg-[#f9f9f8] dark:bg-[#18211d]')}>
                  <ChoiceIcon kind={row.kind} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-[#071411] dark:text-white">{row.title}</p>
                    <p className="mt-0.5 text-[10.5px] text-[#6b6b66] dark:text-[#a3a39f]">{row.body}</p>
                  </div>
                  <ArrowRight className="h-3 w-3 text-[#a3a39f]" />
                </div>
              ))}
            </Panel>
          </motion.div>
        )}

        {beat >= 2 && beat < 5 && (
          <motion.div key="pick" {...swap} className="space-y-2.5">
            <div className="flex h-[32px] items-center gap-2 rounded-[9px] border border-[#a9cfc2] bg-white px-2.5 text-[11.5px] shadow-[0_0_0_3px_rgba(15,91,78,0.07)] dark:border-[#2f6b5b] dark:bg-[#131a17]">
              <Search className="h-3.5 w-3.5 text-[#82827d]" strokeWidth={2} />
              <span className="text-[#071411] dark:text-white">{typed}</span>
              <span className="-ml-1.5 h-3.5 w-px animate-pulse bg-[#071411] dark:bg-white" />
              {!typed && <span className="text-[#a3a39f]">Search matters</span>}
            </div>
            <Label className="px-1">Your matters</Label>
            <Panel className="overflow-hidden">
              <AnimatePresence initial={false}>
                {visible.map((matter, index) => (
                  <motion.div
                    key={matter.name}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease }}
                    className={cn('flex items-center gap-2.5 px-3 py-2.5', index > 0 && 'border-t border-[#f1f1ef] dark:border-[#1f2a26]', beat === 4 && index === 0 && 'bg-[#f9f9f8] dark:bg-[#18211d]')}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e4f0eb] text-[10.5px] font-semibold text-[#034239] dark:bg-[#17302a] dark:text-[#bdeee0]">{matter.name.charAt(0)}</span>
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] font-medium text-[#071411] dark:text-white">{matter.name}</p>
                      <p className="truncate text-[10px] text-[#6b6b66] dark:text-[#a3a39f]">{matter.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Panel>
            <div className="flex items-center gap-1.5 px-1 text-[11px] font-medium text-[#0d6b58] dark:text-[#7fe0c5]">
              <Plus className="h-3.5 w-3.5" strokeWidth={2} /> New matter
            </div>
          </motion.div>
        )}

        {beat >= 5 && (
          <motion.div key="opened" {...swap} className="space-y-2.5">
            <SourcesCard count={0}>
              <DropZone />
            </SourcesCard>
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.3, ease }} className="flex items-center gap-2 px-1 text-[10.5px] text-[#52524d] dark:text-[#a3a39f]">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#e4f0eb] text-[#034239] dark:bg-[#17302a] dark:text-[#7fe0c5]"><Check className="h-2.5 w-2.5" strokeWidth={3} /></span>
              Matter opened for this document
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Cursor {...cursor} pressed={beat === 2 || beat === 5} />
    </SceneWindow>
  );
}

function useTyped(text: string, active: boolean) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || reduceMotion) return;
    if (count >= text.length) return;
    const timer = window.setTimeout(() => setCount((value) => value + 1), 150);
    return () => window.clearTimeout(timer);
  }, [active, count, reduceMotion, text.length]);
  if (!active) return '';
  return reduceMotion ? text : text.slice(0, count);
}

/* ─── 2 · Connect your sources ────────────────────────────────────── */

const SOURCES = [
  { name: 'Client brief – Clearwater.pdf', type: 'Client brief' },
  { name: 'Payment Systems and Services Act 2019', type: 'Legislation' },
  { name: 'Firm precedent – PSP licence advice', type: 'Reference' },
];

function ConnectSourcesScene({ playing, onDone }: { playing: boolean; onDone?: () => void }) {
  const beat = useBeats([0, 700, 1700, 2900, 3600, 4200], playing, 2400, onDone);
  const shown = beat >= 5 ? 3 : beat >= 4 ? 2 : beat >= 3 ? 1 : 0;

  return (
    <SceneWindow doc={<LegalDocument state="plain" />}>
      <div className="space-y-2.5">
        <SourcesCard count={shown} active={beat === 1}>
          <DropZone hot={beat === 1} />
          <AnimatePresence initial={false}>
            {beat === 2 && (
              <motion.div key="upload" {...swap} className="mt-2 flex items-center gap-2.5 rounded-[9px] border border-[#ebebe8] bg-white px-2.5 py-2 dark:border-[#1f2a26] dark:bg-[#131a17]">
                <DaraLoader size={15} />
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-[#071411] dark:text-white">Client brief – Clearwater.pdf</p>
                  <p className="text-[9.5px] text-[#6b6b66] dark:text-[#a3a39f]">Reading and identifying the document type</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {shown > 0 && (
            <div className="mt-2 overflow-hidden rounded-[9px] border border-[#ebebe8] bg-white dark:border-[#1f2a26] dark:bg-[#131a17]">
              <AnimatePresence initial={false}>
                {SOURCES.slice(0, shown).map((source, index) => (
                  <motion.div
                    key={source.name}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3, ease }}
                    className={cn('flex items-center gap-2 px-2.5 py-1.5', index > 0 && 'border-t border-[#f1f1ef] dark:border-[#1f2a26]')}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium text-[#071411] dark:text-white">{source.name}</p>
                      <p className="text-[9.5px] text-[#6b6b66] dark:text-[#a3a39f]">{source.type}</p>
                    </div>
                    <X className="h-3 w-3 text-[#c4c4c0]" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </SourcesCard>
        <AnimatePresence>
          {beat >= 5 && (
            <motion.p {...swap} className="px-1 text-[10.5px] leading-[1.5] text-[#6b6b66] dark:text-[#a3a39f]">
              Dara recognised each document&rsquo;s type. Sources stay with this matter for every future review.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* The file being dragged in from the desktop. */}
      <AnimatePresence>
        {beat < 2 && (
          <motion.div
            key="drag"
            className="absolute z-30 flex items-center gap-2 rounded-[9px] border border-[#ebebe8] bg-white px-3 py-2 text-[11px] font-medium text-[#071411] shadow-[0_14px_32px_-14px_rgba(1,24,20,0.45)] dark:border-[#1f2a26] dark:bg-[#131a17] dark:text-white"
            initial={{ x: 20, y: 400, opacity: 0, rotate: -4 }}
            animate={beat === 0 ? { x: 30, y: 330, opacity: 1, rotate: -4 } : { x: 60, y: 92, opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="flex h-4 w-3.5 items-center justify-center rounded-[2px] bg-[#c24b40] text-[6px] font-bold text-white">PDF</span>
            Client brief – Clearwater.pdf
          </motion.div>
        )}
      </AnimatePresence>
      <Cursor x={beat === 0 ? 170 : beat === 1 ? 200 : 260} y={beat === 0 ? 355 : beat === 1 ? 116 : 300} pressed={beat === 2} />
    </SceneWindow>
  );
}

/* ─── 3 · Run the review ──────────────────────────────────────────── */

const STAGES = [
  { active: 'Reading the document', done: 'Read 3,204 words' },
  { active: 'Checking against 3 sources', done: 'Checks complete' },
  { active: 'Validating every finding', done: 'Results ready' },
];
const GRADES = ['A', 'B', 'C', 'D', 'E', 'NR'];
const RESULT_ROWS: Array<{ tone: 'hard' | 'soft' | 'omission'; label: string; count: number }> = [
  { tone: 'hard', label: 'Hard Conflicts', count: 1 },
  { tone: 'omission', label: 'Omissions', count: 1 },
  { tone: 'soft', label: 'Soft Conflicts', count: 1 },
];

function RunReviewScene({ playing, onDone }: { playing: boolean; onDone?: () => void }) {
  const beat = useBeats([0, 800, 1300, 2300, 3300, 4300], playing, 2800, onDone);
  const stageIndex = Math.min(2, Math.max(0, beat - 2));

  return (
    <SceneWindow doc={<LegalDocument state={beat >= 5 ? 'flagged' : 'plain'} />}>
      <AnimatePresence mode="wait" initial={false}>
        {beat < 2 && (
          <motion.div key="ready" {...swap} className="space-y-2.5">
            <SourcesCard count={3} />
            <Panel className="px-3 py-3">
              <p className="text-[12px] font-semibold text-[#071411] dark:text-white">Ready to review</p>
              <p className="mt-0.5 text-[10.5px] text-[#6b6b66] dark:text-[#a3a39f]">3 sources will be checked.</p>
              <PrimaryButton pressed={beat === 1} className="mt-2.5">Review document</PrimaryButton>
            </Panel>
          </motion.div>
        )}

        {beat >= 2 && beat < 5 && (
          <motion.div key="running" {...swap}>
            <Panel className="px-3 py-3">
              <div className="flex items-center justify-between gap-3 border-b border-[#f1f1ef] pb-2.5 dark:border-[#1f2a26]">
                <div className="flex items-center gap-2.5">
                  <DaraLoader size={18} />
                  <div>
                    <p className="text-[12px] font-semibold text-[#071411] dark:text-white">Review in progress</p>
                    <p className="text-[10px] text-[#82827d]">Dara is checking the current document.</p>
                  </div>
                </div>
                <span className="rounded-[6px] bg-[#f6f6f4] px-1.5 py-0.5 text-[9.5px] tabular-nums text-[#6b6b66] dark:bg-[#18211d]">{(beat - 1) * 4}s</span>
              </div>
              <ol className="mt-2.5 space-y-2">
                {STAGES.map((stage, index) => {
                  const done = index < stageIndex;
                  const current = index === stageIndex;
                  return (
                    <li key={stage.active} className="flex items-center gap-2.5">
                      <span className={cn('flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold tabular-nums',
                        current ? 'border-[#034239] bg-[#034239] text-white dark:border-[#7fe0c5] dark:bg-[#7fe0c5] dark:text-[#06150f]' :
                        done ? 'border-[#cfe3da] bg-[#e4f0eb] text-[#0d6b58] dark:border-[#1f3d35] dark:bg-[#12291f] dark:text-[#5fd4b2]' :
                        'border-[#e2e2df] bg-white text-[#a3a39f] dark:border-[#1f2a26] dark:bg-[#0f1412]')}>
                        {done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : index + 1}
                      </span>
                      <span className={cn('text-[11px]', current ? 'font-medium text-[#071411] dark:text-white' : done ? 'text-[#6b6b66] dark:text-[#a3a39f]' : 'text-[#a3a39f]')}>
                        {done ? stage.done : stage.active}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Panel>
          </motion.div>
        )}

        {beat >= 5 && (
          <motion.div key="result" {...swap}>
            <Panel className="overflow-hidden">
              <div className="px-3 pb-3 pt-2.5">
                <div className="flex items-center justify-between">
                  <Label>Consistency Grade</Label>
                  <span className="flex items-center gap-0.5 text-[9.5px] text-[#82827d]">How grades work <ArrowUpRight className="h-2.5 w-2.5" /></span>
                </div>
                <div className="mt-2 flex items-start gap-3">
                  <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="w-[36px] text-[34px] font-semibold leading-[0.95] tracking-[-0.05em] text-[#071411] dark:text-white">C</motion.p>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#071411] dark:text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#c98f2e]" />Material revisions required</p>
                    <p className="mt-0.5 text-[10px] leading-[1.45] text-[#6b6b66] dark:text-[#a3a39f]">Fix the findings below before the advice is relied on.</p>
                  </div>
                </div>
                <div className="mt-2.5 grid grid-cols-6 gap-1">
                  {GRADES.map((grade) => (
                    <div key={grade}>
                      <div className={cn('h-[3px] rounded-full', grade === 'C' ? 'bg-[#071411] dark:bg-white' : 'bg-[#efefed] dark:bg-[#1f2a26]')} />
                      <p className={cn('mt-0.5 text-[8.5px]', grade === 'C' ? 'font-semibold text-[#071411] dark:text-white' : 'text-[#a3a39f]')}>{grade}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#f1f1ef] px-3 pb-3 pt-2.5 dark:border-[#1f2a26]">
                <div className="flex items-baseline justify-between">
                  <p className="text-[11.5px] font-semibold text-[#071411] dark:text-white">3 to resolve</p>
                  <p className="text-[9.5px] tabular-nums text-[#82827d]">0 of 3 done</p>
                </div>
                <ul className="mt-1.5">
                  {RESULT_ROWS.map((row, index) => (
                    <motion.li key={row.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + index * 0.08 }} className={cn('flex items-center gap-2 py-1.5', index > 0 && 'border-t border-[#f4f4f2] dark:border-[#1f2a26]')}>
                      <Dot tone={row.tone} />
                      <span className="flex-1 text-[11px] text-[#393936] dark:text-[#dfe8e4]">{row.label}</span>
                      <span className="text-[11px] font-medium tabular-nums text-[#071411] dark:text-white">{row.count}</span>
                      <ChevronRight className="h-3 w-3 text-[#c4c4c0]" />
                    </motion.li>
                  ))}
                </ul>
                <PrimaryButton className="mt-2 justify-between px-3">Review findings <ArrowRight className="h-3 w-3" /></PrimaryButton>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>
      <Cursor x={beat === 0 ? 220 : 175} y={beat === 0 ? 300 : 196} pressed={beat === 2} />
    </SceneWindow>
  );
}

/* ─── 4 · Open a finding ──────────────────────────────────────────── */

const FINDINGS: Array<{ tone: 'hard' | 'soft' | 'omission'; label: string; title: string; text: string }> = [
  { tone: 'hard', label: 'Hard Conflict', title: 'Definition contradicts the Act', text: 'The advice says a payment system does not facilitate transfers. Section 102 says it does.' },
  { tone: 'soft', label: 'Soft Conflict', title: 'Timeline differs from the brief', text: 'The licensing timeline is shorter than the client asked for.' },
  { tone: 'omission', label: 'Omission', title: 'Float safeguarding not addressed', text: 'The advice does not cover how e-money float must be held.' },
];

function OpenFindingScene({ playing, onDone }: { playing: boolean; onDone?: () => void }) {
  const beat = useBeats([0, 800, 1500, 3000, 4000, 4700], playing, 2600, onDone);
  const docState: DocState = beat >= 5 ? 'revised' : beat >= 2 ? 'selected' : 'flagged';

  return (
    <SceneWindow doc={<LegalDocument state={docState} offset={beat >= 2 ? 60 : 0} />}>
      <AnimatePresence mode="wait" initial={false}>
        {beat < 2 && (
          <motion.div key="list" {...swap} className="space-y-2.5">
            <div className="flex gap-3.5 border-b border-[#ebebe8] px-1 dark:border-[#1f2a26]">
              <span className="-mb-px border-b-2 border-[#034239] pb-1.5 text-[11px] font-medium text-[#071411] dark:border-[#5fd4b2] dark:text-white">Open <span className="text-[#a3a39f]">3</span></span>
              <span className="pb-1.5 text-[11px] font-medium text-[#82827d]">Resolved <span className="text-[#c4c4c0]">0</span></span>
            </div>
            <div className="flex gap-1">
              {['All 3', 'Hard 1', 'Omissions 1', 'Soft 1'].map((chip, index) => (
                <span key={chip} className={cn('rounded-full px-2 py-[3px] text-[10px] font-medium', index === 0 ? 'bg-[#034239] text-white dark:bg-[#5fd4b2] dark:text-[#06150f]' : 'text-[#6b6b66]')}>{chip}</span>
              ))}
            </div>
            <Panel className="overflow-hidden">
              {FINDINGS.map((finding, index) => (
                <div key={finding.title} className={cn('flex items-start gap-2 px-3 py-2.5 transition-colors duration-200', index > 0 && 'border-t border-[#f1f1ef] dark:border-[#1f2a26]', beat === 1 && index === 0 && 'bg-[#f9f9f8] dark:bg-[#18211d]')}>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[10px] font-medium text-[#52524d] dark:text-[#a3a39f]"><Dot tone={finding.tone} />{finding.label}</p>
                    <p className="mt-1 text-[11.5px] font-medium leading-[1.35] text-[#071411] dark:text-white">{finding.title}</p>
                    <p className="mt-0.5 text-[10.5px] leading-[1.45] text-[#6b6b66] dark:text-[#a3a39f]">{finding.text}</p>
                  </div>
                  <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-[#c4c4c0]" />
                </div>
              ))}
            </Panel>
          </motion.div>
        )}

        {beat >= 2 && (
          <motion.div key="detail" {...swap}>
            <Panel className="overflow-hidden">
              <div className="px-3 pb-2 pt-2">
                <p className="flex items-center gap-1.5 text-[10px] font-medium text-[#52524d] dark:text-[#a3a39f]"><Dot tone="hard" />Hard Conflict</p>
                <p className="mt-1 text-[12.5px] font-semibold text-[#071411] dark:text-white">Definition contradicts the Act</p>
              </div>
              <div className="space-y-2 border-t border-[#f1f1ef] px-3 py-2 dark:border-[#1f2a26]" style={{ fontFamily: serifStack }}>
                <div>
                  <Label className="font-sans">In your draft</Label>
                  <p className="mt-1 rounded-[8px] border border-[#e2e2df] bg-white px-2.5 py-1.5 text-[11px] leading-[1.45] text-[#1d1d1b] dark:border-[#26332e] dark:bg-[#131a17] dark:text-[#ecece9]">
                    …infrastructure that <del className="rounded-[2px] bg-[#fbefed] px-0.5 text-[#9a3a32] decoration-[#c24b40]/60">do not</del> facilitate the transfer of funds <del className="rounded-[2px] bg-[#fbefed] px-0.5 text-[#9a3a32] decoration-[#c24b40]/60">but help money flow</del>
                  </p>
                </div>
                <div>
                  <Label className="font-sans">What the source says</Label>
                  <div className="mt-1 rounded-[8px] bg-[#f6f6f4] px-2.5 py-1.5 dark:bg-[#18211d]">
                    <p className="font-sans text-[10px] font-semibold text-[#071411] dark:text-white">Payment Systems and Services Act 2019</p>
                    <p className="mt-0.5 text-[11px] leading-[1.45] text-[#1d1d1b] dark:text-[#ecece9]">…infrastructure that facilitate the transfer of funds. <span className="font-sans text-[9.5px] text-[#6b6b66]">s.102</span></p>
                  </div>
                </div>
                <div>
                  <Label className="font-sans text-[#0d6b58] dark:text-[#7fe0c5]">Suggested wording</Label>
                  <p className="mt-1 rounded-[8px] border border-[#d6e9e0] bg-[#f5faf7] px-2.5 py-1.5 text-[11px] leading-[1.45] text-[#1d1d1b] dark:border-[#1f3d35] dark:bg-[#12291f] dark:text-[#ecece9]">
                    …infrastructure that facilitate the transfer of funds
                  </p>
                </div>
              </div>
              <div className="border-t border-[#f1f1ef] px-3 py-2 dark:border-[#1f2a26]">
                <AnimatePresence mode="wait" initial={false}>
                  {beat < 5 ? (
                    <motion.div key="apply" {...swap}>
                      <PrimaryButton pressed={beat === 4}>Apply suggested fix</PrimaryButton>
                    </motion.div>
                  ) : (
                    <motion.div key="applied" {...swap} className="flex h-[32px] items-center justify-center gap-1.5 rounded-[9px] bg-[#f6f6f4] text-[11px] font-medium text-[#034239] dark:bg-[#12291f] dark:text-[#7fe0c5]">
                      <Check className="h-3 w-3" strokeWidth={2.6} /> Applied as a tracked change
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>
      <Cursor x={beat === 0 ? 240 : beat < 3 ? 160 : 165} y={beat === 0 ? 320 : beat < 3 ? 116 : 340} pressed={beat === 2 || beat === 5} />
    </SceneWindow>
  );
}

const serifStack = '"Iowan Old Style", "Charter", Georgia, serif';

/* ─── Public ──────────────────────────────────────────────────────── */

export function HowItWorksScene({ chapter, playing, onDone }: { chapter: number; playing: boolean; onDone?: () => void }) {
  // The Word window is identical in every scene, so scenes swap in place and
  // only the pane content and document state animate between chapters.
  const props = { playing, onDone };
  if (chapter === 1) return <ConnectSourcesScene key={chapter} {...props} />;
  if (chapter === 2) return <RunReviewScene key={chapter} {...props} />;
  if (chapter === 3) return <OpenFindingScene key={chapter} {...props} />;
  return <OpenMatterScene key={chapter} {...props} />;
}
