import type { ReactNode } from "react";

export function WorkflowCodePanel({ lines }: { lines: ReactNode[] }) {
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
