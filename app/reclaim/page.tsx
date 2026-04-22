import Link from 'next/link'

export default function ReclaimPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12 font-mono text-[#ededed]">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#666] hover:text-[#ededed]">
          ← Back
        </Link>

        <header className="mb-8 rounded border border-[#1a1a1a] bg-[#111111] p-6 sm:p-8">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#555]">Execution System</p>
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">RECLAIM</h1>
          <p className="text-sm text-[#999] sm:text-base">Market Pattern Detection Engine</p>
          <span className="mt-5 inline-flex rounded border border-amber-500/30 bg-amber-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Paper
          </span>
        </header>

        <section className="rounded border border-[#1a1a1a] bg-[#111111] p-6 text-sm leading-7 text-[#bdbdbd] sm:p-8 sm:text-base">
          <p>
            RECLAIM is a rule-based trading signal pipeline built to detect a specific market pattern: liquidity sweep → reclaim or market structure shift confirmation → fair value gap → scored setup.
          </p>

          <p className="mt-6">
            It is not a machine-learning system. In this phase, RECLAIM is a detection and validation engine — not a full trading bot.
          </p>

          <p className="mt-6">
            The core detection flow uses 5-minute bars as the primary timeframe and 15-minute bars for trend context. The system detects swing highs and lows, identifies a sweep of that level, confirms the sweep with a reclaim or MSS, then looks for a fair value gap. Each result is classified as FORMED or EXPIRED and scored based on trend alignment, session timing, displacement strength, and structure quality.
          </p>

          <p className="mt-6">
            Every detected setup is written to SQLite along with a full event trail. Validation tooling can rerun replay over any recent window and export CSV reports. The system supports both live mode and replay mode.
          </p>

          <p className="mt-6">
            Phase 1 covers: deterministic signal detection, scoring, persistence, replay, live orchestration, CLI dispatch, and validation. Execution, brokerage actions, and performance tracking are reserved for later phases.
          </p>

          <p className="mt-8 text-sm text-[#666]">Visuals and live data coming soon.</p>
        </section>

        <footer className="mt-8 border-t border-[#1a1a1a] pt-6 text-sm text-[#999]">
          Questions or feedback —{' '}
          <a href="mailto:luis.sandoval@aibitsandbots.com" className="text-[#ededed] underline-offset-2 hover:underline">
            luis.sandoval@aibitsandbots.com
          </a>
        </footer>
      </div>
    </div>
  )
}
