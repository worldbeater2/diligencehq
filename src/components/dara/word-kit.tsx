import { useEffect, useRef, useState } from 'react';
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowDownAZ, Baseline, Bold, ChevronDown,
  ClipboardPaste, Copy, Ellipsis, Highlighter, House, Italic, LayoutGrid, List, ListOrdered,
  MessageSquare, Mic, Paintbrush, Pencil, Pilcrow, Printer, Redo2, Save,
  Scissors, Search, Share, Strikethrough, Subscript, Superscript, Underline, Undo2, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/*
 * High-fidelity product mockup kit.
 * Mirrors the real Dara add-in running inside Word for Mac (see /public/assets/*.png),
 * so every illustration on the homepage reads as the actual product.
 */

/* ─── Scaled stage: render at native size, scale to fit ─────────────── */
export function ScaledStage({
  width,
  height,
  minScale = 0,
  anchor = 'center',
  className,
  children,
}: {
  width: number;
  height: number;
  minScale?: number;
  anchor?: 'center' | 'right';
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ scale: number; offset: number; cropped: boolean } | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const available = element.clientWidth;
      const scale = Math.min(1, Math.max(available / width, minScale));
      const scaledWidth = width * scale;
      const offset = anchor === 'right' && scaledWidth > available ? available - scaledWidth : (available - scaledWidth) / 2;
      setBox({ scale, offset, cropped: scaledWidth > available + 1 });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [anchor, minScale, width]);

  const scale = box?.scale ?? 1;

  return (
    <div
      ref={ref}
      className={cn('relative w-full', box?.cropped && 'overflow-hidden', className)}
      style={{
        height: box ? height * scale : undefined,
        aspectRatio: box ? undefined : `${width} / ${height}`,
        maskImage: box?.cropped ? 'linear-gradient(90deg, transparent 0, #000 18%)' : undefined,
        WebkitMaskImage: box?.cropped ? 'linear-gradient(90deg, transparent 0, #000 18%)' : undefined,
      }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left transition-opacity duration-300"
        style={{
          width,
          height,
          transform: `translateX(${box?.offset ?? 0}px) scale(${scale})`,
          opacity: box ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── macOS window chrome ───────────────────────────────────────────── */
export function TrafficLights({ className = '' }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-[7px]', className)} aria-hidden>
      <span className="h-[11px] w-[11px] rounded-full border border-[#e0443e]/60 bg-[#ff5f57]" />
      <span className="h-[11px] w-[11px] rounded-full border border-[#dea123]/60 bg-[#febc2e]" />
      <span className="h-[11px] w-[11px] rounded-full border border-[#1aab29]/60 bg-[#28c840]" />
    </div>
  );
}

export function WordAppIcon({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] bg-[linear-gradient(135deg,#2b7cd3,#185abd_55%,#103f91)] text-[8.5px] font-bold leading-none text-white shadow-[0_1px_1px_rgba(0,0,0,0.18)]',
        className,
      )}
    >
      W
    </span>
  );
}

/** Generic window frame used for real product screenshots. */
export function MacWindowFrame({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[12px] border border-black/[0.12] bg-[#f6f6f6] shadow-[0_0_0_0.5px_rgba(0,0,0,0.06),0_34px_90px_-18px_rgba(3,40,34,0.32),0_12px_30px_-12px_rgba(3,40,34,0.18)] dark:border-white/[0.12] dark:bg-[#232323] dark:shadow-[0_34px_90px_-18px_rgba(0,0,0,0.75)]',
        className,
      )}
    >
      <div className="relative flex h-[34px] items-center border-b border-black/[0.08] bg-[linear-gradient(180deg,#f7f7f7,#ececec)] px-3.5 dark:border-white/[0.06] dark:bg-[linear-gradient(180deg,#323232,#2a2a2a)]">
        <TrafficLights />
        <div className="absolute inset-x-24 flex items-center justify-center gap-1.5 text-[12px] font-medium text-black/62 dark:text-white/62">
          <WordAppIcon />
          <span className="truncate">{title}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── Word for Mac chrome ───────────────────────────────────────────── */
const ribbonTabs = ['Home', 'Insert', 'Draw', 'Design', 'Layout', 'References', 'Mailings', 'Review', 'View'];

function RibbonIcon({ icon: Icon, className = '' }: { icon: typeof Bold; className?: string }) {
  return (
    <span className={cn('inline-flex h-[22px] w-[22px] items-center justify-center rounded-[4px] text-[#3b3b3b] dark:text-[#d6d6d6]', className)}>
      <Icon className="h-[14px] w-[14px]" strokeWidth={1.7} />
    </span>
  );
}

function RibbonDivider() {
  return <span aria-hidden className="mx-1.5 h-[46px] w-px self-center bg-black/[0.09] dark:bg-white/[0.09]" />;
}

function WordRibbonTools({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-[66px] items-center gap-1 overflow-hidden px-3 select-none">
      <div className="flex shrink-0 flex-col items-center gap-0.5 px-1">
        <ClipboardPaste className="h-[24px] w-[24px] text-[#3b3b3b] dark:text-[#d6d6d6]" strokeWidth={1.4} />
        <span className="text-[10px] text-[#3b3b3b] dark:text-[#d6d6d6]">Paste</span>
      </div>
      <div className="flex shrink-0 flex-col">
        <RibbonIcon icon={Scissors} />
        <RibbonIcon icon={Copy} />
        <RibbonIcon icon={Paintbrush} />
      </div>
      <RibbonDivider />
      <div className="flex shrink-0 flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="flex h-[22px] w-[112px] items-center justify-between rounded-[5px] border border-black/[0.14] bg-white px-2 text-[11px] text-[#222] dark:border-white/[0.14] dark:bg-[#1b1b1b] dark:text-[#ddd]">
            Arial <ChevronDown className="h-3 w-3 opacity-60" />
          </span>
          <span className="flex h-[22px] w-[44px] items-center justify-between rounded-[5px] border border-black/[0.14] bg-white px-2 text-[11px] text-[#222] dark:border-white/[0.14] dark:bg-[#1b1b1b] dark:text-[#ddd]">
            11 <ChevronDown className="h-3 w-3 opacity-60" />
          </span>
        </div>
        <div className="flex items-center">
          <RibbonIcon icon={Bold} />
          <RibbonIcon icon={Italic} />
          <RibbonIcon icon={Underline} />
          <RibbonIcon icon={Strikethrough} />
          <RibbonIcon icon={Subscript} />
          <RibbonIcon icon={Superscript} />
          <span className="relative">
            <RibbonIcon icon={Highlighter} />
            <span className="absolute bottom-[2px] left-[5px] h-[2.5px] w-[12px] rounded-[1px] bg-[#fff200]" />
          </span>
          <span className="relative">
            <RibbonIcon icon={Baseline} />
            <span className="absolute bottom-[2px] left-[5px] h-[2.5px] w-[12px] rounded-[1px] bg-[#c00000]" />
          </span>
        </div>
      </div>
      <RibbonDivider />
      <div className="flex shrink-0 flex-col gap-1.5">
        <div className="flex items-center">
          <RibbonIcon icon={List} />
          <RibbonIcon icon={ListOrdered} className="bg-black/[0.07] dark:bg-white/[0.1]" />
          <RibbonIcon icon={ArrowDownAZ} />
          <RibbonIcon icon={Pilcrow} />
        </div>
        <div className="flex items-center">
          <RibbonIcon icon={AlignLeft} />
          <RibbonIcon icon={AlignCenter} />
          <RibbonIcon icon={AlignRight} />
          <RibbonIcon icon={AlignJustify} className="bg-black/[0.07] dark:bg-white/[0.1]" />
        </div>
      </div>
      {!compact && (
        <>
          <RibbonDivider />
          <div className="flex shrink-0 items-stretch gap-1 rounded-[6px] border border-black/[0.1] bg-white/80 p-1 dark:border-white/[0.1] dark:bg-white/[0.03]">
            {['Heading 1', 'Body Text', 'Normal'].map((style, index) => (
              <span
                key={style}
                className={cn(
                  'flex w-[70px] flex-col items-center justify-center gap-1 rounded-[4px] px-1 py-1',
                  index === 2 ? 'border border-[#2b7cd3]/55 bg-[#eaf2fc] dark:bg-[#1d2b3d]' : 'border border-transparent',
                )}
              >
                <span className={cn('text-[11px] leading-none text-[#222] dark:text-[#ddd]', index === 0 && 'font-semibold text-[#1f4e79] dark:text-[#8fb8e8]')}>AaBbCcDd</span>
                <span className="text-[9px] leading-none text-black/55 dark:text-white/50">{style}</span>
              </span>
            ))}
          </div>
          <RibbonDivider />
          <div className="flex shrink-0 items-end gap-3 px-1">
            <div className="flex flex-col items-center gap-1">
              <Mic className="h-[22px] w-[22px] text-[#2b7cd3]" strokeWidth={1.5} />
              <span className="text-[10px] text-[#3b3b3b] dark:text-[#d6d6d6]">Dictate</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <LayoutGrid className="h-[22px] w-[22px] text-[#d24726]" strokeWidth={1.5} />
              <span className="text-[10px] text-[#3b3b3b] dark:text-[#d6d6d6]">Add-ins</span>
            </div>
          </div>
        </>
      )}
      <RibbonDivider />
      <div className="flex shrink-0 flex-col items-center gap-1 rounded-[6px] bg-[#034239]/[0.07] px-2.5 py-1.5 dark:bg-[#34d399]/[0.1]">
        <img src="/dara/mark.png" alt="" className="h-[22px] w-[22px] rounded-full" />
        <span className="text-[10px] font-semibold text-[#034239] dark:text-[#7fe0c5]">Dara</span>
      </div>
    </div>
  );
}

export function WordWindow({
  title,
  ribbon = 'full',
  showRuler = true,
  showStatusBar = true,
  statusText = 'Page 3 of 14   4,812 words   English (United Kingdom)',
  className,
  documentArea,
  pane,
  paneWidth = 340,
  collapseDocumentOnMobile = false,
}: {
  title: string;
  ribbon?: 'full' | 'compact' | 'tabs';
  showRuler?: boolean;
  showStatusBar?: boolean;
  statusText?: string;
  className?: string;
  documentArea: React.ReactNode;
  pane?: React.ReactNode;
  paneWidth?: number;
  collapseDocumentOnMobile?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-black/[0.13] bg-[#f3f3f3] font-sans text-left shadow-[0_0_0_0.5px_rgba(0,0,0,0.05),0_40px_100px_-24px_rgba(3,40,34,0.36),0_14px_36px_-14px_rgba(3,40,34,0.22)] dark:border-white/[0.13] dark:bg-[#252525] dark:shadow-[0_40px_100px_-24px_rgba(0,0,0,0.8)]',
        className,
      )}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}
    >
      {/* Title bar */}
      <div className="relative flex h-[38px] shrink-0 items-center gap-3 border-b border-black/[0.06] bg-[#f3f3f3] px-3.5 select-none dark:border-white/[0.05] dark:bg-[#2b2b2b]">
        <TrafficLights />
        {ribbon === 'tabs' ? (
          <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 pr-10 text-[12px] font-medium text-[#2b2b2b] dark:text-[#e2e2e2]">
            <WordAppIcon />
            <span className="truncate">{title}</span>
          </span>
        ) : (
          <>
            <div className="ml-2 flex items-center gap-0.5 text-[#4a4a4a] dark:text-[#cfcfcf]">
              <RibbonIcon icon={House} />
              <RibbonIcon icon={Save} />
              <RibbonIcon icon={Undo2} />
              <RibbonIcon icon={Redo2} className="opacity-40" />
              {ribbon === 'full' && <RibbonIcon icon={Printer} />}
              <RibbonIcon icon={Ellipsis} />
            </div>
            <div className="pointer-events-none absolute inset-x-0 flex justify-center">
              <span className="flex max-w-[44%] items-center gap-1.5 truncate text-[12.5px] font-medium text-[#2b2b2b] dark:text-[#e2e2e2]">
                <WordAppIcon />
                <span className="truncate">{title}</span>
                <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
              </span>
            </div>
          </>
        )}
        {ribbon !== 'tabs' && (
          <div className="ml-auto flex h-[24px] w-[210px] items-center gap-1.5 rounded-[6px] border border-black/[0.08] bg-white/80 px-2 text-[11px] text-black/45 dark:border-white/[0.08] dark:bg-white/[0.06] dark:text-white/40">
            <Search className="h-3 w-3" strokeWidth={2} />
            Search (Cmd + Ctrl + U)
          </div>
        )}
      </div>

      {/* Ribbon tabs */}
      <div className="flex h-[34px] shrink-0 items-center gap-0.5 bg-[#f3f3f3] px-3 select-none dark:bg-[#2b2b2b]">
        {ribbonTabs.slice(0, ribbon === 'tabs' ? 4 : ribbonTabs.length).map((tab, index) => (
          <span
            key={tab}
            className={cn(
              'relative px-2.5 py-1 text-[12px]',
              index === 0 ? 'font-semibold text-[#1b1b1b] dark:text-white' : 'text-[#3e3e3e] dark:text-[#cdcdcd]',
            )}
          >
            {tab}
            {index === 0 && <span className="absolute inset-x-2.5 -bottom-[3px] h-[3px] rounded-full bg-[#185abd] dark:bg-[#4d9bf0]" />}
          </span>
        ))}
        <span className="relative flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium text-[#034239] dark:text-[#7fe0c5]">
          Dara
        </span>
        {ribbon === 'full' && (
          <div className="ml-auto flex items-center gap-2">
            <span className="flex h-[24px] items-center gap-1.5 rounded-[6px] border border-black/[0.12] bg-white px-2.5 text-[11px] text-[#2b2b2b] dark:border-white/[0.12] dark:bg-white/[0.05] dark:text-[#ddd]">
              <MessageSquare className="h-3 w-3" strokeWidth={1.8} /> Comments
            </span>
            <span className="flex h-[24px] items-center gap-1.5 rounded-[6px] border border-black/[0.12] bg-white px-2.5 text-[11px] text-[#2b2b2b] dark:border-white/[0.12] dark:bg-white/[0.05] dark:text-[#ddd]">
              <Pencil className="h-3 w-3" strokeWidth={1.8} /> Editing <ChevronDown className="h-3 w-3 opacity-60" />
            </span>
            <span className="flex h-[24px] items-center gap-1.5 rounded-[6px] bg-[#185abd] px-2.5 text-[11px] font-medium text-white">
              <Share className="h-3 w-3" strokeWidth={2} /> Share
            </span>
          </div>
        )}
      </div>

      {/* Ribbon tools */}
      {ribbon !== 'tabs' && (
        <div className="shrink-0 border-y border-black/[0.07] bg-[#fbfbfb] dark:border-white/[0.06] dark:bg-[#303030]">
          <WordRibbonTools compact={ribbon === 'compact'} />
        </div>
      )}

      {/* Body */}
      <div className="relative flex min-h-0 flex-1">
        <div className={cn('relative min-w-0 flex-1 flex-col bg-[#e7e7e7] dark:bg-[#1c1c1c]', collapseDocumentOnMobile ? 'hidden sm:flex' : 'flex')}>
          {showRuler && <WordRuler />}
          <div className="relative min-h-0 flex-1 overflow-hidden">{documentArea}</div>
        </div>
        {pane && (
          <div
            className={cn(
              'relative shrink-0 border-black/[0.1] dark:border-white/[0.08]',
              collapseDocumentOnMobile ? 'w-full sm:w-[var(--pane-width)] sm:border-l' : 'w-[var(--pane-width)] border-l',
            )}
            style={{ '--pane-width': `${paneWidth}px` } as React.CSSProperties}
          >
            {pane}
          </div>
        )}
      </div>

      {showStatusBar && (
        <div className="flex h-[24px] shrink-0 items-center justify-between border-t border-black/[0.08] bg-[#f3f3f3] px-3 text-[10.5px] text-black/55 select-none dark:border-white/[0.06] dark:bg-[#2b2b2b] dark:text-white/45">
          <span className="whitespace-pre">{statusText}</span>
          <span className="flex items-center gap-2">
            <span>Focus</span>
            <span className="h-[3px] w-[70px] rounded-full bg-black/15 dark:bg-white/15">
              <span className="block h-full w-1/2 rounded-full bg-black/35 dark:bg-white/35" />
            </span>
            <span>120%</span>
          </span>
        </div>
      )}
    </div>
  );
}

export function WordRuler() {
  return (
    <div aria-hidden className="relative h-[18px] shrink-0 overflow-hidden border-b border-black/[0.07] bg-[#f8f8f8] dark:border-white/[0.05] dark:bg-[#262626]">
      <div className="absolute inset-y-[3px] left-1/2 w-[min(84%,560px)] -translate-x-1/2 rounded-[1px] bg-white dark:bg-[#333]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.28)_0_1px,transparent_1px_9.5px)] [mask-image:linear-gradient(180deg,transparent_55%,#000_55%)] dark:bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.3)_0_1px,transparent_1px_9.5px)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.4)_0_1px,transparent_1px_38px)] [mask-image:linear-gradient(180deg,transparent_25%,#000_25%)] dark:bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.4)_0_1px,transparent_1px_38px)]" />
        <span className="absolute left-[9%] top-0 h-0 w-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-[#777]" />
        <span className="absolute right-[9%] top-0 h-0 w-0 border-x-[4px] border-t-[5px] border-x-transparent border-t-[#777]" />
      </div>
    </div>
  );
}

/* ─── Document page ─────────────────────────────────────────────────── */
export function DocPage({
  className,
  children,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        'relative bg-white text-[#141414] shadow-[0_0_0_0.5px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.08),0_12px_28px_-8px_rgba(0,0,0,0.12)] dark:bg-[#f7f7f5] dark:text-[#141414]',
        className,
      )}
      style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif', ...style }}
    >
      {children}
    </div>
  );
}

/** Word's real yellow highlight with the issue words in red, as Dara marks findings. */
export function WordHighlight({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        'box-decoration-clone transition-colors duration-700',
        active ? 'bg-[#fff200]' : 'bg-transparent',
      )}
    >
      {children}
    </span>
  );
}

/* ─── Dara task pane ────────────────────────────────────────────────── */
export type DaraPaneTab = 'review' | 'chat' | 'library' | 'settings';

/** The add-in's own tab icons: 16px grid, 1.4px stroke, soft fill when active. */
function PaneTabIcon({ name, active }: { name: DaraPaneTab; active: boolean }) {
  const fill = active ? 'currentColor' : 'none';
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="h-[16px] w-[16px]" aria-hidden>
      {name === 'review' && (
        <>
          <path d="M3.25 2.75c0-.55.45-1 1-1h5.1l3.4 3.4v8.1c0 .55-.45 1-1 1h-7.5c-.55 0-1-.45-1-1Z" fill={fill} fillOpacity={0.14} />
          <path d="M9.25 1.85v2.4c0 .5.4.9.9.9h2.5" />
          <path d="m5.6 9.35 1.55 1.5 3.25-3.2" />
        </>
      )}
      {name === 'chat' && (
        <>
          <path d="M2.25 4.1c0-.9.7-1.6 1.6-1.6h8.3c.9 0 1.6.7 1.6 1.6v5.3c0 .9-.7 1.6-1.6 1.6H7.1l-2.85 2.35V11H3.85c-.9 0-1.6-.7-1.6-1.6Z" fill={fill} fillOpacity={0.14} />
          <path d="M5.25 6.25h5.5M5.25 8.25h3.25" />
        </>
      )}
      {name === 'library' && (
        <>
          <path d="M2.25 4.6c0-.6.45-1.05 1.05-1.05h2.9l1.45 1.5h5.05c.6 0 1.05.45 1.05 1.05v6.3c0 .6-.45 1.05-1.05 1.05H3.3c-.6 0-1.05-.45-1.05-1.05Z" fill={fill} fillOpacity={0.14} />
          <path d="M2.25 7.25h11.5" />
        </>
      )}
      {name === 'settings' && (
        <>
          <path d="M2.25 4.75h6M11.75 4.75h2M2.25 11.25h2M7.75 11.25h6" />
          <circle cx="10" cy="4.75" r="1.75" />
          <circle cx="6" cy="11.25" r="1.75" />
        </>
      )}
    </svg>
  );
}

const paneTabs: Array<{ key: DaraPaneTab; label: string }> = [
  { key: 'review', label: 'Review' },
  { key: 'chat', label: 'Chat' },
  { key: 'library', label: 'Manage' },
  { key: 'settings', label: 'Settings' },
];

export function DaraPane({
  activeTab = 'review',
  showTitleBar = true,
  className,
  bodyClassName,
  bodyRef,
  footer,
  children,
}: {
  activeTab?: DaraPaneTab;
  showTitleBar?: boolean;
  className?: string;
  bodyClassName?: string;
  bodyRef?: React.Ref<HTMLDivElement>;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn('flex h-full w-full flex-col overflow-hidden bg-[#fafaf9] text-left dark:bg-[#0f1412]', className)}
      style={{ fontFamily: 'var(--font-sans), -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {showTitleBar && (
        <div className="flex h-[34px] shrink-0 items-center justify-between border-b border-black/[0.06] bg-[#f3f3f3] px-3.5 select-none dark:border-white/[0.06] dark:bg-[#2b2b2b]">
          <span className="truncate text-[12.5px] font-semibold text-[#1f1f1f] dark:text-[#e6e6e6]">Dara Drafting Assistant</span>
          <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#5f5f5f] text-white dark:bg-[#9a9a9a] dark:text-[#1f1f1f]">
            <X className="h-[9px] w-[9px]" strokeWidth={3} />
          </span>
        </div>
      )}

      <div className="relative flex h-[44px] shrink-0 items-center justify-between border-b border-[#ebebe8] bg-white px-3.5 select-none dark:border-[#1f2a26] dark:bg-[#0f1412]">
        <img src="/dara/wordmark.svg" alt="Dara" className="h-[13px] w-auto dark:hidden" />
        <img src="/dara/wordmark-white.svg" alt="Dara" className="hidden h-[13px] w-auto dark:block" />
        <span className="flex items-center gap-1">
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#034239] text-[9.5px] font-semibold text-white dark:bg-[#5fd4b2] dark:text-[#06150f]">K</span>
          <ChevronDown className="h-3 w-3 text-[#82827d]" />
        </span>
      </div>

      <div ref={bodyRef} className={cn('relative min-h-0 flex-1 overflow-hidden', bodyClassName)}>
        {children}
      </div>

      {footer}

      <div className="grid h-[52px] shrink-0 grid-cols-4 border-t border-[#ebebe8] bg-white px-2 select-none dark:border-[#1f2a26] dark:bg-[#0f1412]">
        {paneTabs.map(({ key, label }) => {
          const isActive = key === activeTab;
          return (
            <span
              key={key}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-[9.5px]',
                isActive ? 'font-semibold text-[#034239] dark:text-[#bdeee0]' : 'font-medium text-[#82827d]',
              )}
            >
              <PaneTabIcon name={key} active={isActive} />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Pane building blocks ──────────────────────────────────────────── */
export function PaneCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-[12px] border border-[#ebebe8] bg-white shadow-[0_1px_2px_rgba(12,33,27,0.04)] dark:border-[#1f2a26] dark:bg-[#131a17] dark:shadow-none',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PaneEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-[10.5px] font-medium text-[#6b6b66] dark:text-[#a3a39f]', className)}>{children}</p>;
}

export type PaneSeverity = 'hard' | 'soft' | 'omission' | 'resolved' | 'accepted';

export function SeverityPill({ tone, children, className }: { tone: PaneSeverity; children: React.ReactNode; className?: string }) {
  const tones: Record<PaneSeverity, { text: string; dot: string }> = {
    hard: { text: 'text-[#52524d] dark:text-[#cfcfcc]', dot: 'bg-[#c24b40] dark:bg-[#f0a49d]' },
    soft: { text: 'text-[#52524d] dark:text-[#cfcfcc]', dot: 'bg-[#c98f2e] dark:bg-[#e6c27a]' },
    omission: { text: 'text-[#52524d] dark:text-[#cfcfcc]', dot: 'bg-[#82827d] dark:bg-[#a3a39f]' },
    resolved: { text: 'text-[#0d6b58] dark:text-[#7fe0c5]', dot: 'bg-[#0d6b58] dark:bg-[#7fe0c5]' },
    accepted: { text: 'text-[#52524d] dark:text-[#cfcfcc]', dot: 'bg-[#c98f2e] dark:bg-[#e6c27a]' },
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap text-[10.5px] font-medium leading-none', tones[tone].text, className)}>
      <span className={cn('h-[6px] w-[6px] rounded-full', tones[tone].dot)} />
      {children}
    </span>
  );
}

export function ScoreBar({ label, value, tone = 'good' }: { label: string; value: number | null; tone?: 'good' | 'bad' }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="text-[#33413c] dark:text-[#cdcdcb]">{label}</span>
        <span className={cn('tabular-nums', value === null ? 'text-black/30 dark:text-white/30' : 'text-[#071411] dark:text-[#f5f5f4]')}>
          {value === null ? '—' : `${value}%`}
        </span>
      </div>
      <div className="mt-1.5 h-[4px] overflow-hidden rounded-full bg-[#f1f1ef] dark:bg-white/[0.08]">
        <div
          className={cn('h-full rounded-full transition-[width] duration-1000 ease-out', tone === 'bad' ? 'bg-[#c24b40]' : 'bg-[#034239] dark:bg-[#5fd4b2]')}
          style={{ width: `${value ?? 0}%` }}
        />
      </div>
    </div>
  );
}

export function GradeBadge({ grade, tone = 'bad', size = 'md' }: { grade: string; tone?: 'bad' | 'mid' | 'good'; size?: 'sm' | 'md' }) {
  const tones = {
    bad: 'border-[#ebebe8] text-[#071411] dark:border-[#1f2a26] dark:text-[#f5f5f4]',
    mid: 'border-[#ebebe8] text-[#071411] dark:border-[#1f2a26] dark:text-[#f5f5f4]',
    good: 'border-[#ebebe8] text-[#071411] dark:border-[#1f2a26] dark:text-[#f5f5f4]',
  };
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[12px] border bg-white font-semibold tracking-[-0.04em] dark:bg-[#131a17]',
        size === 'md' ? 'h-[54px] min-w-[62px] px-3 text-[34px]' : 'h-[40px] min-w-[44px] px-2 text-[24px]',
        tones[tone],
      )}
    >
      {grade}
    </span>
  );
}

export function PanePrimaryButton({
  children,
  className,
  buttonRef,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { buttonRef?: React.Ref<HTMLButtonElement> }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        'flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[9px] bg-[#034239] text-[12px] font-medium text-white shadow-[0_1px_2px_rgba(4,35,30,0.12)] transition-transform dark:bg-[#5fd4b2] dark:text-[#06150f]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function PaneSecondaryButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[9px] border border-[#e2e2df] bg-white text-[11.5px] font-medium text-[#393936] dark:border-[#1f2a26] dark:bg-[#131a17] dark:text-[#e4e4e2]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
