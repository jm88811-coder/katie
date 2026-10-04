export function SectionHead({ no, eyebrow, title, desc }: { no: string; eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="mb-8 sm:mb-10">
      <p className="flex items-center gap-3 text-sm font-semibold tracking-wider text-red-600 dark:text-red-400">
        <span className="text-2xl font-black tabular-nums">{no}</span>
        <span className="h-px w-8 bg-current opacity-40" />
        {eyebrow}
      </p>
      <h2 className="mt-2 break-keep text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {desc && <p className="mt-2 max-w-2xl break-keep text-foreground/60">{desc}</p>}
    </div>
  );
}

export function Section({
  id,
  tinted,
  children,
}: {
  id: string;
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-28 py-16 sm:py-20 ${tinted ? "bg-black/[0.03] dark:bg-white/[0.03]" : ""}`}>
      <div className="mx-auto max-w-6xl px-4">{children}</div>
    </section>
  );
}
