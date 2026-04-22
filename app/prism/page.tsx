import Link from 'next/link'

export default function PrismPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12 font-mono text-[#ededed]">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#666] hover:text-[#ededed]">
          ← Back
        </Link>

        <header className="mb-8 rounded border border-[#1a1a1a] bg-[#111111] p-6 sm:p-8">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#555]">Execution System</p>
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">PRISM</h1>
          <p className="text-sm text-[#999] sm:text-base">Spec-Locked Crypto Trading Bot</p>
          <span className="mt-5 inline-flex rounded border border-yellow-500/70 bg-yellow-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">
            Live Testing — Paper Mode
          </span>
        </header>

        <section className="rounded border border-[#1a1a1a] bg-[#111111] p-6 text-sm leading-7 text-[#bdbdbd] sm:p-8 sm:text-base">
          <p>
            PRISM is a paper-trading, closed-candle crypto trading bot focused on learning and validation first. It only acts after candles close, and every decision passes through strict risk gates, veto checks, and a state-machine control layer before anything is simulated.
          </p>

          <p className="mt-6">
            The active strategies are Trap/Reclaim and Continuation. All other strategies are intentionally stubbed and blocked until validation thresholds are met.
          </p>

          <p className="mt-6">
            The full pipeline covers: market data ingest via WebSocket and REST, indicator and structure detection, scoring, routing, risk gating, simulated execution, and export. The system is config-driven — thresholds and behavior live in a central config file, not hardcoded.
          </p>

          <p className="mt-6">
            PRISM now runs on Bybit endpoints and is in Phase 6 validation: outcome tracking, stop and expiry logic, deduplication guards, and structured logging so every failure is visible. All setups and trades are persisted to SQLite with full lifecycle tracking.
          </p>

          <p className="mt-6">
            The goal: collect high-quality evidence, enforce strict safety rules, and iterate systematically before any real-money deployment.
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
