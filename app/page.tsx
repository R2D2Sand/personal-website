
import Image from "next/image";
import Link from "next/link";

const discoverySystem = {
  name: "The Quiet Before",
  description:
    "Small-cap discovery engine detecting early signals before market attention",
  status: "Active",
  image: "/images/the-quiet-before.PNG",
};

const executionSystems = [
  {
    name: "PRISM",
    description:
      "Spec-locked crypto trading bot running on paper mode. Closed-candle system with strict risk gates, veto checks, and state-machine controls. Built to collect high-quality evidence before any real-money deployment.",
    status: "Live Testing",
    image: null,
    href: "/prism",
  },
  {
    name: "RECLAIM",
    description:
      "Rule-based market pattern detection engine. Identifies liquidity sweeps, reclaim or MSS confirmation, and fair value gaps — then scores and persists every setup. Detection and validation engine, not yet an execution system.",
    status: "Paper",
    image: null,
    href: "/reclaim",
  },
  {
    name: "AXIS",
    description:
      "Adaptive crypto system selecting and executing the highest-probability setups",
    status: "Paper",
    image: null,
    href: null,
  },
] as const;

function StatusBadge({ status }: { status: "Active" | "Live Testing" | "Paper" }) {
  const badgeClass =
    status === "Live Testing"
      ? "border border-yellow-500/70 bg-yellow-500 text-black"
      : status === "Active"
        ? "border border-emerald-500/30 bg-emerald-500/12 text-emerald-300"
      : "border border-amber-500/30 bg-amber-500/12 text-amber-300";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeClass}`}
    >
      {status}
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-8 border-b border-white/10 pb-8">
          <nav className="flex flex-col items-center justify-between gap-5 text-sm uppercase tracking-[0.22em] text-zinc-400 sm:flex-row">
            <Link
              href="/"
              className="flex items-center gap-3 text-zinc-100 transition hover:text-white"
            >
              <Image
                src="/images/logo.png"
                alt="AIBitsAndBots logo"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border border-white/10"
              />
              <span className="text-base font-semibold tracking-[0.28em]">
                AIBitsAndBots
              </span>
            </Link>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/blog" className="transition hover:text-white">
                Devlog
              </Link>
              <Link href="/about" className="transition hover:text-white">
                Behind the Bots
              </Link>
            </div>
          </nav>

          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 pt-6 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-zinc-500">
              Detect first. Execute with discipline.
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              AIBitsAndBots
            </h1>
            <p className="max-w-2xl text-base text-zinc-400 sm:text-lg">
              Systems that observe, decide, and execute
            </p>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-12 py-12 sm:py-16">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500">
              Discovery Engine
            </p>

            <Link
              href="https://www.aibitsandbots.com/the-quiet-before"
              className="grid cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-200 hover:scale-[1.01] hover:border-white/25 md:grid-cols-[1.25fr_0.9fr]"
            >
              <div className="flex min-h-[320px] flex-col justify-between gap-8 p-8 sm:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">
                      Signal Detection
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      {discoverySystem.name}
                    </h2>
                  </div>
                  <StatusBadge status="Active" />
                </div>

                <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                  {discoverySystem.description}
                </p>
              </div>

              <div className="relative min-h-[260px] border-t border-white/10 bg-zinc-900/80 md:min-h-full md:border-l md:border-t-0">
                <Image
                  src={discoverySystem.image}
                  alt={discoverySystem.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 35vw, 100vw"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500">
              Execution Systems
            </p>

            <div className="grid gap-5 lg:grid-cols-3">
              {executionSystems.map((system) => {
                const content = (
                  <>
                    {system.image ? (
                      <div className="relative h-44 border-b border-white/10 bg-zinc-900/80">
                        <Image
                          src={system.image}
                          alt={system.name}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                        />
                      </div>
                    ) : (
                      <div className="h-44 border-b border-white/10 bg-zinc-900/80" />
                    )}

                    <div className="flex flex-1 flex-col justify-between gap-8 p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-2xl font-semibold tracking-tight text-white">
                            {system.name}
                          </h3>
                          <StatusBadge status={system.status} />
                        </div>

                        <p className="text-sm leading-7 text-zinc-300">
                          {system.description}
                        </p>
                      </div>
                    </div>
                  </>
                );

                if (system.href) {
                  return (
                    <Link
                      key={system.name}
                      href={system.href}
                      className="flex min-h-[280px] cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-200 hover:scale-[1.01] hover:border-white/25"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <article
                    key={system.name}
                    className="flex min-h-[280px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
                  >
                    {content}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}