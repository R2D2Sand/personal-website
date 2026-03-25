import { getStatsData, Signal } from '@/lib/stats'
import Link from 'next/link'

// Extended Signal — adds fields present in newer pipeline versions
type ExtendedSignal = Signal & {
  current_price?: number | null
  trigger_label?: string | null
  days_active?: number | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function liveReturn(s: ExtendedSignal): number | null {
  if (s.current_price != null && s.detection_price != null) {
    return ((s.current_price - s.detection_price) / s.detection_price) * 100
  }
  return null
}

function fmtPrice(v: number | null | undefined): string {
  if (v == null) return '—'
  return '$' + v.toFixed(2)
}

function fmtGain(v: number | null | undefined): string {
  if (v == null) return '—'
  const prefix = v >= 0 ? '+' : ''
  return prefix + v.toFixed(1) + '%'
}

function fmtDays(v: number | null | undefined): string {
  if (v == null) return '—'
  return Math.round(v) + 'd'
}

// Days ago relative to server render date, UTC-safe
function daysAgo(detectionDate: string): string {
  const now = new Date()
  const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const [y, m, d] = detectionDate.split('-').map(Number)
  const detectedUTC = Date.UTC(y, m - 1, d)
  const diff = Math.round((nowUTC - detectedUTC) / 86_400_000)
  if (diff <= 0) return 'today'
  return `${diff} days ago`
}

// trigger_label takes priority; falls back to mode → plain English
function signalLabel(s: ExtendedSignal): string {
  if (s.trigger_label) return s.trigger_label
  switch (s.mode) {
    case 'SQUEEZE':      return 'Short pressure building'
    case 'BREAKOUT':     return 'Unusual buying interest'
    case 'TURNAROUND':   return 'Recovery setup forming'
    case 'UNCLASSIFIED': return 'Emerging signal'
    default:             return 'Signal detected'
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusText({ status }: { status: string }) {
  if (status === 'ACTIVE') {
    return <span className="text-[#00ff88] font-mono text-xs">Active</span>
  }
  if (status === 'RESOLVED') {
    return <span className="text-[#555] font-mono text-xs">Resolved</span>
  }
  if (status === 'EXITED') {
    return <span className="text-[#555] font-mono text-xs">Exited</span>
  }
  return <span className="text-[#555] font-mono text-xs">{status}</span>
}

function FeaturedCard({ signal, lr }: { signal: ExtendedSignal; lr: number | null }) {
  const isActive = signal.status === 'ACTIVE'

  let outcomeLine: string
  if (!isActive) {
    const entry = fmtPrice(signal.detection_price)
    const peak  = fmtPrice(signal.peak_price)
    const gain  = fmtGain(signal.pct_gain_detection_to_peak)
    const days  = fmtDays(signal.days_to_peak)
    outcomeLine = `${entry} → ${peak} (${gain}) in ${days}`
  } else if (signal.current_price != null) {
    const entry = fmtPrice(signal.detection_price)
    const now   = fmtPrice(signal.current_price)
    const gain  = lr != null ? fmtGain(lr) : '—'
    outcomeLine = `${entry} detected → ${now} now (${gain} so far)`
  } else {
    outcomeLine = `${fmtPrice(signal.detection_price)} detected — tracking in progress`
  }

  return (
    <div className="bg-[#111111] border border-[#1a1a1a] rounded p-8">
      <div className="text-xs font-mono text-[#555] uppercase tracking-widest mb-4">
        Featured Discovery
      </div>
      <div className="text-5xl font-mono font-bold mb-4 tracking-tight">
        {signal.ticker}
      </div>
      <div className="text-[#ededed] font-mono text-lg mb-2">{outcomeLine}</div>
      <div className="text-[#666] font-mono text-sm mb-1">
        Detected {signal.detection_date} — {daysAgo(signal.detection_date)}
      </div>
      <div className="text-[#555] font-mono text-sm mb-4">{signalLabel(signal)}</div>
      <StatusText status={signal.status} />
      <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
        <p className="text-[#444] text-xs leading-relaxed">
          Discovery candidates for research purposes only. Not investment advice.
        </p>
      </div>
    </div>
  )
}

function ActiveCard({ signal, lr }: { signal: ExtendedSignal; lr: number | null }) {
  let priceLine: string
  if (signal.current_price != null) {
    const entry = fmtPrice(signal.detection_price)
    const now   = fmtPrice(signal.current_price)
    const gain  = lr != null ? fmtGain(lr) : '—'
    priceLine = `${entry} → ${now} (${gain} so far)`
  } else {
    priceLine = `${fmtPrice(signal.detection_price)} detected — tracking in progress`
  }

  const daysActive = signal.days_active ?? null

  return (
    <div className="bg-[#111111] border border-[#1a1a1a] rounded p-6">
      <div className="text-2xl font-mono font-bold mb-3">{signal.ticker}</div>
      <div className="text-[#ededed] font-mono text-sm mb-2">{priceLine}</div>
      <div className="text-[#666] font-mono text-xs mb-1">
        Detected {daysAgo(signal.detection_date)}
      </div>
      {daysActive != null && (
        <div className="text-[#555] font-mono text-xs mb-2">
          Day {Math.round(daysActive)} — still developing
        </div>
      )}
      <div className="text-[#555] font-mono text-xs mb-3">{signalLabel(signal)}</div>
      <StatusText status={signal.status} />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const data = getStatsData()
  const signals = data.signals as ExtendedSignal[]

  const resolvedExited = signals.filter(
    (s) => s.status === 'RESOLVED' || s.status === 'EXITED'
  )
  const activeAll = signals.filter((s) => s.status === 'ACTIVE')

  // Featured: best RESOLVED/EXITED by pct_gain, else best ACTIVE by liveReturn, else first
  let featured: ExtendedSignal | null = null
  if (resolvedExited.length > 0) {
    featured = resolvedExited.reduce((best, s) => {
      const bv = best.pct_gain_detection_to_peak ?? -Infinity
      const sv = s.pct_gain_detection_to_peak ?? -Infinity
      return sv > bv ? s : best
    })
  } else if (activeAll.length > 0) {
    featured = activeAll.reduce((best, s) => {
      const bv = liveReturn(best) ?? -Infinity
      const sv = liveReturn(s) ?? -Infinity
      return sv > bv ? s : best
    })
  } else if (signals.length > 0) {
    featured = signals[0]
  }

  const featuredKey = featured
    ? `${featured.ticker}-${featured.detection_date}`
    : null

  // Active signals excluding featured, sorted by liveReturn DESC then days_active DESC
  const activeSignals = activeAll
    .filter((s) => `${s.ticker}-${s.detection_date}` !== featuredKey)
    .sort((a, b) => {
      const ra = liveReturn(a) ?? -Infinity
      const rb = liveReturn(b) ?? -Infinity
      if (rb !== ra) return rb - ra
      return (b.days_active ?? 0) - (a.days_active ?? 0)
    })

  const persistent  = activeSignals.filter((s) => (s.days_active ?? 0) >= 5)
  const newThisWeek = activeSignals.filter((s) => (s.days_active ?? 0) < 5)

  // Past discoveries: all RESOLVED + EXITED sorted by detection_date DESC
  const past = [...resolvedExited].sort((a, b) =>
    b.detection_date.localeCompare(a.detection_date)
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] px-4 py-12">
      <div className="max-w-6xl mx-auto">

        <Link
          href="/"
          className="text-[#666] hover:text-[#ededed] mb-8 inline-block text-sm font-mono"
        >
          ← Back
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">The Quiet Before</h1>
          <p className="text-[#999] text-lg">
            Small-cap discovery intelligence. Detecting the moment a stock
            transitions from ignored to investable.
          </p>
        </div>

        {/* Section 1 — Featured Signal */}
        <section className="mb-16">
          {featured ? (
            <FeaturedCard signal={featured} lr={liveReturn(featured)} />
          ) : (
            <p className="text-[#555] font-mono text-sm">
              No featured signal available yet
            </p>
          )}
        </section>

        {/* Section 2 — Active Signals */}
        {activeSignals.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xs font-mono text-[#555] uppercase tracking-widest mb-8">
              Active Signals
            </h2>

            {persistent.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xs font-mono text-[#444] uppercase tracking-widest mb-4">
                  Persistent
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {persistent.map((s) => (
                    <ActiveCard
                      key={`${s.ticker}-${s.detection_date}`}
                      signal={s}
                      lr={liveReturn(s)}
                    />
                  ))}
                </div>
              </div>
            )}

            {newThisWeek.length > 0 && (
              <div>
                <h3 className="text-xs font-mono text-[#444] uppercase tracking-widest mb-4">
                  New This Week
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newThisWeek.map((s) => (
                    <ActiveCard
                      key={`${s.ticker}-${s.detection_date}`}
                      signal={s}
                      lr={liveReturn(s)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Section 3 — Past Discoveries */}
        <section className="mb-16">
          <h2 className="text-xs font-mono text-[#555] uppercase tracking-widest mb-6">
            Past Discoveries
          </h2>
          {past.length === 0 ? (
            <p className="text-[#555] font-mono text-sm">No resolved signals yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono border-collapse">
                <thead>
                  <tr className="text-left text-[#444] text-xs">
                    <th className="pb-3 pr-6 font-normal">Ticker</th>
                    <th className="pb-3 pr-6 font-normal">Detected</th>
                    <th className="pb-3 pr-6 font-normal">Entry</th>
                    <th className="pb-3 pr-6 font-normal">Peak</th>
                    <th className="pb-3 pr-6 font-normal">Gain</th>
                    <th className="pb-3 pr-6 font-normal">Days</th>
                    <th className="pb-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {past.map((s) => (
                    <tr
                      key={`${s.ticker}-${s.detection_date}`}
                      className="border-t border-[#1a1a1a]"
                    >
                      <td className="py-3 pr-6 font-bold">{s.ticker}</td>
                      <td className="py-3 pr-6 text-[#666]">{s.detection_date}</td>
                      <td className="py-3 pr-6">{fmtPrice(s.detection_price)}</td>
                      <td className="py-3 pr-6">{fmtPrice(s.peak_price)}</td>
                      <td
                        className={`py-3 pr-6 ${
                          s.pct_gain_detection_to_peak != null &&
                          s.pct_gain_detection_to_peak > 0
                            ? 'text-[#00ff88]'
                            : ''
                        }`}
                      >
                        {fmtGain(s.pct_gain_detection_to_peak)}
                      </td>
                      <td className="py-3 pr-6 text-[#666]">
                        {fmtDays(s.days_to_peak)}
                      </td>
                      <td className="py-3">
                        <StatusText status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Footer */}
        <div className="border-t border-[#1a1a1a] pt-8">
          <p className="text-[#555] font-mono text-sm mb-2">
            {data.aggregate.total_signals} signals tracked
          </p>
          <p className="text-[#444] text-xs leading-relaxed max-w-2xl">
            Signals are generated by an automated pipeline scanning U.S.
            small-cap stocks for liquidity regime changes, catalyst events, and
            supply pressure shifts. Detection does not constitute a buy signal
            or investment advice.
          </p>
        </div>

      </div>
    </div>
  )
}
