export function WorkflowDiagram() {
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
