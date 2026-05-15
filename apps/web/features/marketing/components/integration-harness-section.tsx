"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TechnicalCrosshairFrame } from "@/features/marketing/components/technical-crosshair-frame";

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

export function IntegrationHarnessSection() {
  const reduce = useReducedMotion();

  return (
    <section className="w-full bg-[#FDFCFC] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-5">
          <motion.p
            className="text-sm font-normal leading-snug text-[#1C1917] sm:text-base sm:leading-snug"
            initial={reduce ? false : { opacity: 0, x: -28, rotate: -0.35 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          >
            Works with agent harnesses and developer tools
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 36, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.06 }}
            whileHover={reduce ? undefined : { scale: 1.02 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
          >
            <Button
              asChild
              variant="outline"
              className="h-10 w-fit shrink-0 rounded-full border-[#E0DFDD] bg-white px-5 text-sm text-black shadow-[0_2px_10px_rgb(0_0_0/0.05)] hover:bg-[#F5F3F1] sm:h-11 sm:px-6 sm:text-base"
            >
              <Link href="#workflow">View integrations</Link>
            </Button>
          </motion.div>
        </div>

        <div className="relative -mx-4 mt-10 w-[calc(100%+2rem)] overflow-visible sm:-mx-6 sm:mt-12 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:mt-14 lg:w-[calc(100%+4rem)]">
          <TechnicalCrosshairFrame>
            <div className="grid w-full grid-cols-2 justify-items-center gap-x-4 gap-y-7 sm:gap-x-10 sm:gap-y-9 md:grid-cols-3 md:gap-x-10 md:gap-y-10 lg:gap-x-12">
              {integrations.map((integration, index) => {
                const col = index % 3;
                const row = Math.floor(index / 3);
                const drift = (col - 1) * 6 + (row % 2 === 0 ? -4 : 4);
                const spin = index % 2 === 0 ? -2.5 : 2.5;

                return (
                  <motion.div
                    key={integration.name}
                    className="group flex min-h-10 w-fit max-w-full min-w-0 items-center justify-center gap-3 sm:gap-3.5"
                    initial={
                      reduce
                        ? false
                        : {
                            opacity: 0,
                            y: 24 + row * 8,
                            x: drift,
                            rotate: spin * 0.15,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      x: 0,
                      rotate: 0,
                    }}
                    viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
                    transition={{
                      type: "spring",
                      stiffness: 280 + (index % 4) * 18,
                      damping: 20 + (index % 3),
                      mass: 0.72,
                      delay: index * 0.035,
                    }}
                    whileHover={
                      reduce
                        ? undefined
                        : {
                            y: -3,
                            transition: { type: "spring", stiffness: 400, damping: 18 },
                          }
                    }
                  >
                    <motion.div
                      className="flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10"
                      whileHover={
                        reduce
                          ? undefined
                          : { rotate: index % 2 === 0 ? -6 : 6, scale: 1.06 }
                      }
                      transition={{ type: "spring", stiffness: 420, damping: 16 }}
                    >
                      <Image
                        src={integration.logo}
                        alt=""
                        width={40}
                        height={40}
                        className="h-7 w-7 object-contain opacity-55 grayscale transition-[opacity,filter] duration-200 group-hover:opacity-100 group-hover:grayscale-0 sm:h-8 sm:w-8"
                      />
                    </motion.div>
                    <span className="min-w-0 text-left text-sm font-medium leading-snug tracking-normal text-[#78716C] opacity-90 transition-[color,opacity] duration-200 group-hover:text-[#1C1917] group-hover:opacity-100 sm:text-[15px]">
                      {integration.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </TechnicalCrosshairFrame>
        </div>
      </div>
    </section>
  );
}
