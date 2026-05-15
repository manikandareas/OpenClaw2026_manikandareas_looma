export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8">
      <div className="w-full max-w-[400px] shrink-0">{children}</div>
    </div>
  );
}
