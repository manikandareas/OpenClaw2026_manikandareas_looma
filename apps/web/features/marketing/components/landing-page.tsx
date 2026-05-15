import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileText,
  Flag,
  GitBranch,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LandingDemoSessionPreview } from "@/features/marketing/components/landing-demo-session-preview";

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

const featureCards = [
  {
    icon: Clock3,
    title: "Timeline",
    body: "Every command, file read, edit, and checkpoint sits on one scrubber.",
  },
  {
    icon: Flag,
    title: "Needs Review",
    body: "Risk markers surface the exact moments a human should inspect.",
  },
  {
    icon: ListChecks,
    title: "Chapters",
    body: "Long agent runs become digestible phases instead of raw logs.",
  },
  {
    icon: FileText,
    title: "AI session notes",
    body: "Share what changed, why it changed, and what still needs attention.",
  },
];

const workflow = [
  {
    title: "record_start",
    body: "The agent session opens with a durable capture id.",
  },
  {
    title: "capture hooks",
    body: "Commands, edits, tests, and tool events stream into Looma.",
  },
  {
    title: "record_stop",
    body: "The run closes with status, timing, and review metadata.",
  },
  {
    title: "replay artifact",
    body: "A shareable replay is ready for async review.",
  },
];

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
            <Link className="transition-colors hover:text-black" href="#features">
              Features
            </Link>
            <Link className="transition-colors hover:text-black" href="#workflow">
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
                  Agent sessions become one shareable replay of terminal output, diffs, and
                  tests, with flags for anything that needs a human. Async review without raw
                  logs.
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
                Watch the terminal, diffs, tests, chapters, and review markers from an
                autonomous coding-agent run in one shareable artifact. Replace raw
                transcripts with a workspace people can inspect.
              </p>
            </div>
          </div>
          <DemoFeatureGrid />
        </div>
      </section>

      <section id="features" className="w-full">
        <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 pb-24 pt-16 sm:grid-cols-2 sm:px-6 sm:pb-28 sm:pt-20 lg:grid-cols-4 lg:px-8 lg:pb-32 lg:pt-24">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-lg border border-black/[0.06] bg-white p-5"
              >
                <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-md bg-[#F5F3F1] text-black">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold text-black">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#57534E]">{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="workflow" className="w-full border-y border-black/[0.06] bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 max-w-2xl">
            <p className="text-sm font-medium text-[#0A59D2]">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-black sm:text-4xl">
              From agent runtime to review artifact.
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {workflow.map((step, index) => (
              <article
                key={step.title}
                className="rounded-lg border border-black/[0.06] bg-[#FDFCFC] p-5"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#57534E]">
                    Step {index + 1}
                  </span>
                  <CircleDot className="h-4 w-4 text-[#0447FF]" />
                </div>
                <h3 className="font-mono text-sm font-semibold text-black">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#57534E]">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid gap-8 rounded-lg border border-black/[0.06] bg-[#F5F3F1] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-medium text-[#57534E]">Built for async review</p>
              <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-normal text-black sm:text-4xl">
                Replace giant terminal transcripts with replay links people can
                actually review.
              </h2>
            </div>
            <Button
              asChild
              className="h-11 w-fit rounded-full bg-black px-5 text-white shadow-none hover:bg-black/85"
            >
              <Link href="/auth/sign-up">
                Start recording
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-black/[0.06]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-12 text-sm text-[#57534E] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="font-semibold text-black">Looma</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/auth/login" className="hover:text-black">
              Login
            </Link>
            <Link href="/auth/sign-up" className="hover:text-black">
              Sign up
            </Link>
            <Link href="/session/demo" className="hover:text-black">
              Demo replay
            </Link>
          </div>
        </div>
      </footer>
    </main>
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
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-10 pb-7 pt-6 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-11 sm:pb-9 sm:pt-7 lg:gap-x-20 lg:gap-y-12 lg:pb-10 lg:pt-8">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex min-h-10 items-center justify-center text-center"
              title={integration.name}
            >
              <Image
                src={integration.logo}
                alt={integration.name}
                width={132}
                height={44}
                className="h-9 w-auto max-w-[8.25rem] opacity-65 grayscale sm:h-10"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoFeatureGrid() {
  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-4">
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
              Open the pinned diff, replay the terminal, and confirm the behavior
              before merge.
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
