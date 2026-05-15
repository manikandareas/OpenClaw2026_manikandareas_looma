import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Clock3,
  Flag,
  GitBranch,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LandingDemoSessionPreview } from "@/features/marketing/components/landing-demo-session-preview";
import { cn } from "@/lib/utils";

const integrations = [
  { name: "Claude Code", logo: "/integrations/claude-code.svg" },
  { name: "Gemini CLI", logo: "/integrations/gemini-cli.svg" },
  { name: "GitHub Copilot", logo: "/integrations/github-copilot.svg" },
  { name: "Cursor", logo: "/integrations/cursor.svg" },
  { name: "Windsurf", logo: "/integrations/windsurf.svg" },
  { name: "Cline", logo: "/integrations/cline.svg" },
  { name: "CrewAI", logo: "/integrations/crewai.svg" },
  { name: "LangGraph", logo: "/integrations/langgraph.svg" },
  { name: "Pydantic AI", logo: "/integrations/pydantic-ai.svg" },
] as const;

const demoFeatureTiles = [
  {
    icon: Clock3,
    title: "Timeline",
    body: "Scrub through every command, file read, edit, and checkpoint.",
  },
  {
    icon: GitBranch,
    title: "Diffs",
    body: "See the exact files and hunks changed during the agent run.",
  },
  {
    icon: CheckCircle2,
    title: "Tests",
    body: "Keep verification output next to the moment it happened.",
  },
  {
    icon: Flag,
    title: "Review markers",
    body: "Pin risky moments so reviewers know where to focus first.",
  },
];

const footerColumns = [
  {
    heading: "Looma Review",
    links: [
      "Session replay",
      "Terminal timeline",
      "Diff review",
      "Test chapters",
      "Review markers",
      "AI session notes",
      "Behavior summary",
      "Public session link",
      "Import transcript",
      "Dashboard",
      "Replay workspace",
    ],
  },
  {
    heading: "Agent Runtime",
    links: [
      "Claude Code",
      "Gemini CLI",
      "Cursor",
      "Windsurf",
      "Cline",
      "CrewAI",
      "LangGraph",
      "Pydantic AI",
      "GitHub Copilot",
      "Custom harness",
    ],
  },
  {
    heading: "Platform",
    links: [
      "API Reference",
      "MCP Server",
      "record_start",
      "record_event",
      "record_stop",
      "Session API",
      "Replay API",
      "API Key",
    ],
  },
] as const;

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFC] text-black">
      <header className="sticky top-0 z-30 bg-[#FDFCFC]/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-semibold tracking-normal">
            Looma
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-[#57534E] md:flex">
            <Link className="transition-colors hover:text-black" href="#demo">
              Demo
            </Link>
            <Link
              className="transition-colors hover:text-black"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="transition-colors hover:text-black"
              href="#workflow"
            >
              How it works
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 rounded-full px-4 text-[#57534E] hover:bg-[#F5F3F1] hover:text-black"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-9 rounded-full bg-black px-4 text-white shadow-none hover:bg-black/85"
            >
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-40">
          <div className="space-y-6 sm:space-y-8">
            <p className="text-[15px] leading-snug text-[#57534E] sm:text-base">
              Replay-native reviews
            </p>
            <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:items-start lg:gap-x-14 xl:gap-x-20">
              <div className="min-w-0 max-w-xl lg:max-w-none">
                <h1 className="font-display max-w-[20rem] text-[2.75rem] font-normal leading-[1.08] tracking-[-0.02em] text-black sm:max-w-[22rem] sm:text-5xl sm:leading-[1.06] lg:max-w-[min(100%,26rem)] lg:text-[3.25rem] lg:leading-[1.05] xl:text-[3.5rem]">
                  Turn agent runs into shareable replays
                </h1>
                <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
                  <Button
                    asChild
                    className="h-14 rounded-full bg-black px-7 text-base text-white shadow-none hover:bg-black/85"
                  >
                    <Link href="/auth/sign-up">Get started free</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-14 rounded-full border-black/[0.08] bg-white px-7 text-base text-black shadow-[0_1px_8px_rgb(0_0_0/0.06)] hover:bg-[#F5F3F1]"
                  >
                    <Link href="#demo">Watch the demo</Link>
                  </Button>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-pretty text-lg leading-snug text-[#44403C] sm:text-xl sm:leading-snug lg:max-w-[26rem]">
                  Agent sessions become one shareable replay of terminal output,
                  diffs, and tests, with flags for anything that needs a human.
                  Async review without raw logs.
                </p>
              </div>
            </div>
          </div>

          <HeroReplayShowcase />
        </div>
      </section>

      <IntegrationHarnessSection />

      <section
        id="demo"
        className="w-full bg-[#FDFCFC] py-20 sm:py-24 lg:py-28"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid gap-10 sm:mb-14 sm:gap-12 lg:grid-cols-2 lg:items-start lg:gap-x-14 xl:gap-x-20">
            <div className="min-w-0 max-w-xl lg:max-w-none">
              <p className="text-[15px] leading-snug text-[#57534E] sm:text-base">
                Video replay
              </p>
              <h2 className="font-display mt-3 max-w-[min(100%,30rem)] text-[2.75rem] font-normal leading-[1.08] tracking-[-0.02em] text-black sm:mt-4 sm:text-5xl sm:leading-[1.06] lg:text-[3.25rem] lg:leading-[1.05] xl:max-w-[min(100%,34rem)] xl:text-[3.5rem]">
                Review agent sessions in one replay workspace
              </h2>
              <div className="mt-8 sm:mt-10">
                <Button
                  asChild
                  className="h-14 rounded-full bg-black px-7 text-base text-white shadow-none hover:bg-black/85"
                >
                  <Link href="/auth/sign-up">Learn more</Link>
                </Button>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-pretty text-lg leading-snug text-[#44403C] sm:text-xl sm:leading-snug lg:max-w-[26rem]">
                Watch the terminal, diffs, tests, chapters, and review markers
                from an autonomous coding-agent run in one shareable artifact.
                Replace raw transcripts with a workspace people can inspect.
              </p>
            </div>
          </div>
          <DemoFeatureGrid />
        </div>
      </section>

      <WorkflowSection />

      <BottomCtaSection />
      <LandingFooter />
    </main>
  );
}

const TECHNICAL_FRAME_LINE_OUT = 48;
const TECHNICAL_FRAME_LINE_COLOR = "bg-[#E8E8E6]";

/** Garis horizontal di dalam frame: selebar konten + overflow kiri/kanan; titik di persimpangan dengan garis vertikal frame. */
function TechnicalFrameHorizontalRule() {
  const o = TECHNICAL_FRAME_LINE_OUT;

  return (
    <div
      className="relative shrink-0"
      style={{
        width: `calc(100% + ${o * 2}px)`,
        marginLeft: -o,
        marginRight: -o,
      }}
    >
      <div
        aria-hidden
        className={cn("h-px w-full", TECHNICAL_FRAME_LINE_COLOR)}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 z-[1] size-[3px] -translate-x-1/2 -translate-y-1/2 bg-black"
        style={{ left: o }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 z-[1] size-[3px] translate-x-1/2 -translate-y-1/2 bg-black"
        style={{ right: o }}
      />
    </div>
  );
}

function TechnicalCrosshairFrame({
  children,
  contentClassName,
}: {
  children: ReactNode;
  contentClassName?: string;
}) {
  const lineOut = TECHNICAL_FRAME_LINE_OUT;
  const lineColor = TECHNICAL_FRAME_LINE_COLOR;
  const hLineInset = { left: -lineOut, right: -lineOut };
  const vLineInset = { top: -lineOut, bottom: -lineOut };

  return (
    <div className="relative isolate w-full py-10 sm:py-12 lg:py-14">
      <span
        aria-hidden
        className={`pointer-events-none absolute top-0 z-0 h-px ${lineColor}`}
        style={hLineInset}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-0 z-0 h-px ${lineColor}`}
        style={hLineInset}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute left-0 z-0 w-px ${lineColor}`}
        style={vLineInset}
      />
      <span
        aria-hidden
        className={`pointer-events-none absolute right-0 z-0 w-px ${lineColor}`}
        style={vLineInset}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 size-[3px] -translate-x-1/2 -translate-y-1/2 bg-black"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-0 size-[3px] translate-x-1/2 -translate-y-1/2 bg-black"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-0 size-[3px] -translate-x-1/2 translate-y-1/2 bg-black"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 z-0 size-[3px] translate-x-1/2 translate-y-1/2 bg-black"
      />
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}

function BottomCtaSection() {
  return (
    <section className="w-full bg-[#FDFCFC] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mx-4 w-[calc(100%+2rem)] overflow-visible sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
          <TechnicalCrosshairFrame contentClassName="px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-x-14 xl:gap-x-20">
              <div className="min-w-0 space-y-4 sm:space-y-5">
                <p className="text-[15px] leading-snug text-[#57534E] sm:text-base">
                  Get started
                </p>
                <h2 className="font-display max-w-[min(100%,38rem)] text-[2.75rem] font-normal leading-[1.08] tracking-[-0.02em] text-black sm:text-5xl sm:leading-[1.06] lg:text-[3.25rem] lg:leading-[1.05] xl:max-w-[min(100%,40rem)] xl:text-[3.5rem]">
                  The replay layer for autonomous coding agents
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Button
                  asChild
                  variant="outline"
                  className="h-14 shrink-0 rounded-full border-[#E0DFDD] bg-white px-7 text-base font-medium text-black shadow-[0_2px_10px_rgb(0_0_0/0.05)] hover:bg-[#F5F3F1]"
                >
                  <Link href="/auth/login">Talk to sales</Link>
                </Button>
                <Button
                  asChild
                  className="h-14 shrink-0 rounded-full bg-black px-7 text-base font-medium text-white shadow-none hover:bg-black/85"
                >
                  <Link href="/auth/sign-up">Create a replay</Link>
                </Button>
              </div>
            </div>
          </TechnicalCrosshairFrame>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="w-full bg-[#FDFCFC]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-0 xl:gap-x-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-block text-xl font-semibold tracking-normal text-black"
            >
              Looma
            </Link>
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading} className="min-w-0">
              <h3 className="text-sm font-medium leading-snug text-[#57534E]">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                {column.links.map((label) => (
                  <li key={label}>
                    <Link
                      href={footerHrefFor(label)}
                      className="text-sm leading-snug text-[#44403C] transition-colors hover:text-black"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

function footerHrefFor(label: string) {
  if (label === "Dashboard") {
    return "/dashboard";
  }

  if (label === "Import transcript") {
    return "/import";
  }

  if (label === "Public session link" || label === "Replay workspace") {
    return "/session/demo";
  }

  if (label.includes("API") || label.startsWith("record_") || label === "MCP Server") {
    return "#workflow";
  }

  return "#features";
}

function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="w-full scroll-mt-[72px] bg-[#FDFCFC] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:py-5">
          <div className="min-w-0 max-w-2xl lg:max-w-[min(100%,40rem)]">
            <p className="text-[15px] leading-snug text-[#57534E] sm:text-base">
              How it works
            </p>
            <h2 className="font-display mt-3 max-w-[min(100%,34rem)] text-[2.75rem] font-normal leading-[1.08] tracking-[-0.02em] text-black sm:mt-4 sm:text-5xl sm:leading-[1.06] lg:text-[3.25rem] lg:leading-[1.05] xl:text-[3.5rem]">
              Build replay review into any agent runtime
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-10 w-fit shrink-0 rounded-full border-[#E0DFDD] bg-white px-5 text-sm text-black shadow-[0_2px_10px_rgb(0_0_0/0.05)] hover:bg-[#F5F3F1] sm:h-11 sm:px-6 sm:text-base"
          >
            <Link href="/import">Explore docs</Link>
          </Button>
        </div>

        <div className="relative -mx-4 mt-10 w-[calc(100%+2rem)] overflow-visible sm:-mx-6 sm:mt-12 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:mt-14 lg:w-[calc(100%+4rem)]">
          <TechnicalCrosshairFrame contentClassName="">
            <>
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 pb-10 pt-8 sm:pb-12 sm:pt-10 lg:grid-cols-2 lg:items-start lg:gap-x-14 lg:gap-y-0 lg:pb-14 lg:pt-12 xl:gap-x-20">
                  <WorkflowCopyBlock
                    title="Session Capture API"
                    body="Create a durable capture id before the agent starts. Looma keeps the session owner, branch, commit, and runtime metadata connected to the replay."
                    items={[
                      ["record_start", "Open a session with context"],
                      ["record_event", "Stream commands and edits"],
                      ["record_stop", "Close with status and timing"],
                    ]}
                  />
                  <CodePanel
                    lines={[
                      <>
                        <span className="text-[#F05252]">import</span>{" "}
                        {"{ createLoomaClient }"}{" "}
                        <span className="text-[#F05252]">from</span>{" "}
                        <span className="text-[#315BA8]">&quot;@looma/sdk&quot;</span>;
                      </>,
                      <>
                        <span className="text-[#F05252]">const</span>{" "}
                        <span className="text-[#315BA8]">client</span> ={" "}
                        <span className="text-[#F05252]">createLoomaClient</span>(
                        {"{"}
                        apiKey:{" "}
                        <span className="text-[#315BA8]">
                          &quot;LOOMA_API_KEY&quot;
                        </span>{" "}
                        {"}"});
                      </>,
                      <>
                        <span className="text-[#F05252]">const</span>{" "}
                        <span className="text-[#315BA8]">session</span> ={" "}
                        <span className="text-[#F05252]">await</span>{" "}
                        client.recordStart({"{"}
                      </>,
                      <>
                        {"  "}title:{" "}
                        <span className="text-[#315BA8]">
                          &quot;Fix auth fallback&quot;
                        </span>
                        ,
                      </>,
                      <>
                        {"  "}branch:{" "}
                        <span className="text-[#315BA8]">
                          &quot;feat/session-refresh&quot;
                        </span>
                        ,
                      </>,
                      <>{"}"});</>,
                    ]}
                  />
                </div>
              </div>

              <TechnicalFrameHorizontalRule />

              <div className="px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-2 lg:items-start lg:gap-x-14 lg:gap-y-0 lg:py-14 xl:gap-x-20">
                  <WorkflowCopyBlock
                    title="Event Stream API"
                    body="Send terminal output, file reads, diffs, test results, and human checkpoints as structured events. The replay stays inspectable instead of becoming a raw transcript."
                    items={[
                      ["Terminal events", "Commands and verification"],
                      ["Editor events", "Files, hunks, and diffs"],
                      ["Review markers", "Risk moments for humans"],
                    ]}
                  />
                  <WorkflowDiagram />
                </div>
              </div>

              <TechnicalFrameHorizontalRule />

              <div className="px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 pb-8 pt-10 sm:pb-10 sm:pt-12 lg:grid-cols-2 lg:items-start lg:gap-x-14 lg:gap-y-0 lg:pb-12 lg:pt-14 xl:gap-x-20">
                  <WorkflowCopyBlock
                    title="Replay Artifact API"
                    body="Publish one review link with chapters, behavior summary, and the exact evidence a teammate needs before merge."
                    items={[
                      ["Public session", "A canonical /session link"],
                      ["AI notes", "Summary and remaining risk"],
                      ["Review state", "Share, inspect, approve"],
                    ]}
                  />
                  <CodePanel
                    lines={[
                      <>
                        <span className="text-[#F05252]">await</span>{" "}
                        client.recordStop(session.id, {"{"}
                      </>,
                      <>
                        {"  "}status:{" "}
                        <span className="text-[#315BA8]">&quot;passed&quot;</span>,
                      </>,
                      <>
                        {"  "}summary:{" "}
                        <span className="text-[#315BA8]">
                          &quot;Auth fallback fixed and verified&quot;
                        </span>
                        ,
                      </>,
                      <>
                        {"  "}markers: [
                        <span className="text-[#315BA8]">
                          &quot;needs_review&quot;
                        </span>
                        ],
                      </>,
                      <>{"}"});</>,
                      <>
                        <span className="text-[#F05252]">const</span> replay ={" "}
                        <span className="text-[#F05252]">await</span>{" "}
                        client.publishReplay(session.id);
                      </>,
                    ]}
                  />
                </div>
              </div>
            </>
          </TechnicalCrosshairFrame>
        </div>
      </div>
    </section>
  );
}

function WorkflowCopyBlock({
  title,
  body,
  items,
}: {
  title: string;
  body: string;
  items: [string, string][];
}) {
  return (
    <article className="min-w-0">
      <h3 className="font-display text-xl font-normal leading-tight tracking-[-0.02em] text-black sm:text-2xl">
        {title}
      </h3>
      <p className="mt-3 max-w-[31rem] text-pretty text-base leading-snug text-[#44403C] sm:mt-4 sm:text-lg sm:leading-snug">
        {body}
      </p>
      <div className="mt-8 grid gap-x-8 gap-y-6 sm:mt-10 sm:grid-cols-2">
        {items.map(([label, description]) => (
          <div key={label}>
            <p className="text-sm font-medium leading-snug text-[#1C1917] sm:text-[15px]">
              {label}
            </p>
            <p className="mt-1 text-sm leading-snug text-[#57534E] sm:text-[15px] sm:leading-snug">
              {description}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function CodePanel({ lines }: { lines: ReactNode[] }) {
  return (
    <div className="min-w-0">
      <div className="min-h-[16rem] rounded-2xl border border-[#E0DFDD] bg-white p-6 shadow-[0_2px_12px_rgb(0_0_0/0.05)] sm:min-h-[18rem] sm:p-8">
        <pre className="overflow-x-auto font-mono text-[13px] leading-[1.85] text-[#292524] sm:text-sm sm:leading-[1.9]">
          <code>
            {lines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function WorkflowDiagram() {
  return (
    <div className="relative min-h-[17rem] overflow-hidden rounded-2xl border border-[#E0DFDD] bg-[#F5F3F1] sm:min-h-[19.75rem]">
      <div className="absolute inset-0 bg-[linear-gradient(32deg,transparent_49.75%,#E7E3DE_50%,transparent_50.25%),linear-gradient(148deg,transparent_49.75%,#E7E3DE_50%,transparent_50.25%)]" />
      <div className="absolute left-1/2 top-1/2 h-16 w-[32rem] -translate-x-1/2 -translate-y-1/2 -rotate-[31deg] rounded-full border border-[#E7E3DE] bg-white shadow-[0_1px_10px_rgb(0_0_0/0.04)]" />
      <div className="absolute left-1/2 top-1/2 h-9 w-[20rem] -translate-x-1/2 -translate-y-[42%] -rotate-[31deg] rounded-full bg-[#F0EFED] text-center text-[0.8rem] font-medium leading-9 text-[#A49E98]">
        raw transcript
      </div>
      <div className="absolute left-1/2 top-1/2 h-9 w-[21rem] -translate-x-[42%] translate-y-[28%] -rotate-[31deg] rounded-full bg-[#F0EFED] text-center text-[0.8rem] font-medium leading-9 text-[#A49E98]">
        terminal logs
      </div>
      <div className="absolute left-1/2 top-1/2 h-10 w-44 -translate-x-[38%] -translate-y-[155%] -rotate-[31deg] rounded-full border border-[#E0DDD8] bg-white text-center text-[0.82rem] font-semibold leading-10 text-[#292524] shadow-[0_1px_10px_rgb(0_0_0/0.05)]">
        Looma replay
      </div>
    </div>
  );
}

function HeroReplayShowcase() {
  return (
    <div className="mt-24 w-full overflow-hidden rounded-[18px] border border-[#E0DFDD] bg-[#F5F3F1] shadow-[0_18px_60px_rgb(0_0_0/0.05)] sm:mt-28">
      <div className="aspect-video w-full p-2 sm:p-3">
        <LandingDemoSessionPreview
          variant="hero"
          className="h-full min-h-0 rounded-[12px] sm:rounded-[14px]"
        />
      </div>
    </div>
  );
}

function IntegrationHarnessSection() {
  return (
    <section className="w-full bg-[#FDFCFC] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-5">
          <p className="text-sm font-normal leading-snug text-[#1C1917] sm:text-base sm:leading-snug">
            Works with agent harnesses and developer tools
          </p>
          <Button
            asChild
            variant="outline"
            className="h-10 w-fit shrink-0 rounded-full border-[#E0DFDD] bg-white px-5 text-sm text-black shadow-[0_2px_10px_rgb(0_0_0/0.05)] hover:bg-[#F5F3F1] sm:h-11 sm:px-6 sm:text-base"
          >
            <Link href="#workflow">View integrations</Link>
          </Button>
        </div>

        {/* Breakout horizontal: selebar inner max-w-7xl (melewati px-4/6/8) supaya frame tidak sempit menabrak baris judul + CTA */}
        <div className="relative -mx-4 mt-10 w-[calc(100%+2rem)] overflow-visible sm:-mx-6 sm:mt-12 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:mt-14 lg:w-[calc(100%+4rem)]">
          <TechnicalCrosshairFrame>
            <div className="grid w-full grid-cols-2 justify-items-center gap-x-4 gap-y-7 sm:gap-x-10 sm:gap-y-9 md:grid-cols-3 md:gap-x-10 md:gap-y-10 lg:gap-x-12">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="group flex min-h-10 w-fit max-w-full min-w-0 items-center justify-center gap-3 sm:gap-3.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
                    <Image
                      src={integration.logo}
                      alt=""
                      width={40}
                      height={40}
                      className="h-7 w-7 object-contain opacity-55 grayscale transition-[opacity,filter] duration-200 group-hover:opacity-100 group-hover:grayscale-0 sm:h-8 sm:w-8"
                    />
                  </div>
                  <span className="min-w-0 text-left text-sm font-medium leading-snug tracking-normal text-[#78716C] opacity-90 transition-[color,opacity] duration-200 group-hover:text-[#1C1917] group-hover:opacity-100 sm:text-[15px]">
                    {integration.name}
                  </span>
                </div>
              ))}
            </div>
          </TechnicalCrosshairFrame>
        </div>
      </div>
    </section>
  );
}

function DemoFeatureGrid() {
  return (
    <div id="features" className="grid gap-3 sm:gap-4 lg:grid-cols-4">
      <article className="relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-[#E0DFDD] bg-[#F5F3F1] p-5 sm:min-h-[440px] sm:p-6 lg:col-span-2">
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-[radial-gradient(circle_at_20%_15%,#FFAF73_0%,#F41A2F_30%,transparent_58%),radial-gradient(circle_at_64%_54%,#2B7FFF_0%,#6EA4E8_42%,transparent_72%)] opacity-85" />
        <div className="absolute bottom-8 left-0 h-48 w-48 rounded-full bg-[#F41A2F]/20 blur-3xl sm:h-56 sm:w-56" />
        <div className="relative z-10 max-w-[min(100%,520px)] rounded-xl border border-[#E0DFDD] bg-white/92 shadow-[0_12px_28px_rgb(0_0_0/0.07)] backdrop-blur">
          <div className="grid min-h-[180px] grid-cols-[1fr_0.38fr] border-b border-[#E9E6E2] sm:min-h-[200px]">
            <div className="space-y-3 p-5 text-sm leading-relaxed text-[#44403C] sm:text-base sm:leading-snug">
              <p>
                The agent inspected auth routes, reproduced a failing test, and
                changed the fallback path.
              </p>
              <p className="text-xs leading-relaxed text-[#57534E] sm:text-sm sm:leading-snug">
                Looma keeps the why, where, and verification path attached to
                the replay.
              </p>
            </div>
            <div className="border-l border-[#E9E6E2] p-4 sm:p-5">
              <div className="h-full min-h-[120px] rounded-lg bg-[linear-gradient(145deg,#E9F2FF,#FFF1EB_62%,#FFD3C4)] sm:min-h-[140px]" />
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <div className="mb-3 flex w-fit items-center gap-0.5 rounded-xl border-2 border-black bg-white p-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-11 rounded-lg bg-[linear-gradient(135deg,#0A59D2,#FFD5BB_55%,#F41A2F)] sm:h-9 sm:w-12 sm:rounded-[10px]"
                />
              ))}
            </div>
            <div className="grid grid-cols-[1fr_72px] gap-2 sm:grid-cols-[1fr_76px] sm:gap-3">
              <div className="truncate rounded-lg border border-[#E0DFDD] bg-white px-3 py-2 text-xs leading-snug text-[#57534E] shadow-[0_2px_8px_rgb(0_0_0/0.05)] sm:px-4 sm:py-2.5 sm:text-sm">
                auth fallback changed at 08:11 ...
              </div>
              <div className="flex items-center justify-center rounded-lg border border-[#E0DFDD] bg-white text-[#57534E] shadow-[0_2px_8px_rgb(0_0_0/0.05)]">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-auto pt-8 text-white sm:pt-10">
          <h3 className="font-display text-xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-2xl">
            All-in-one replay editor
          </h3>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-snug text-white/90 sm:mt-4 sm:text-base sm:leading-snug">
            Review terminal output, timeline chapters, diffs, and AI notes in a
            workspace built for agent sessions.
          </p>
        </div>
      </article>

      <article className="relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl border border-[#E0DFDD] bg-[#F5F3F1] p-5 sm:min-h-[420px] sm:p-6 lg:col-span-2">
        <div className="mx-auto mt-10 w-full max-w-[560px] rounded-xl bg-white p-5 shadow-[0_12px_28px_rgb(0_0_0/0.06)] sm:mt-12 sm:p-6">
          <p className="text-pretty text-sm leading-snug text-black sm:text-base sm:leading-snug">
            Needs Review: auth fallback changed after the agent fixed a failing
            test.{" "}
            <span className="text-[#57534E]">
              Open the pinned diff, replay the terminal, and confirm the
              behavior before merge.
            </span>
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-4">
            <span className="rounded-full bg-[#F5F3F1] px-3 py-1.5 text-xs text-black sm:px-4 sm:py-2 sm:text-sm">
              08:11 marker
            </span>
            <span className="rounded-full bg-[#F5F3F1] px-3 py-1.5 text-xs text-black sm:px-4 sm:py-2 sm:text-sm">
              Fix auth route
            </span>
            <Button className="ml-auto h-11 rounded-full bg-black px-5 text-sm text-white shadow-none hover:bg-black/85 sm:h-12 sm:px-6 sm:text-base">
              Play
            </Button>
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl font-normal leading-[1.1] tracking-[-0.02em] text-[#57534E] sm:text-2xl">
            Shareable review artifact
          </h3>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-snug text-[#44403C] sm:mt-4 sm:text-base sm:leading-snug">
            Send one replay link with context, proof, and the exact moments that
            need human attention.
          </p>
        </div>
      </article>

      {demoFeatureTiles.map((feature) => {
        const Icon = feature.icon;

        return (
          <article
            key={feature.title}
            className="flex min-h-0 flex-col rounded-2xl border border-[#E0DFDD] bg-[#F5F3F1] p-5 sm:p-6"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E0DFDD] bg-white text-black sm:h-12 sm:w-12">
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-8 flex flex-1 flex-col sm:mt-10">
              <h3 className="font-display text-lg font-normal leading-tight tracking-[-0.02em] text-[#57534E] sm:text-xl">
                {feature.title}
              </h3>
              <p className="mt-3 text-pretty text-sm leading-snug text-[#44403C] sm:mt-4 sm:text-base sm:leading-snug">
                {feature.body}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
