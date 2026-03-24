import { getStatsData, fmt } from '@/lib/stats'
import Link from 'next/link'

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes} UTC`
}

function ModeBadge({ mode }: { mode: string }) {
  const bgColor = mode === 'SQUEEZE' ? 'bg-[#001a11]' : 'bg-[#1a1a1a]'
  const textColor = mode === 'SQUEEZE' ? 'text-[#00ff88]' : 'text-[#666]'
  const borderColor =
    mode === 'SQUEEZE' ? 'border-[#00ff88]' : 'border-[#444]'

  return (
    <div
      className={`inline-block px-2 py-1 text-xs border rounded ${bgColor} ${textColor} ${borderColor}`}
    >
      {mode}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  let bgColor = 'bg-[#1a1a1a]'
  let textColor = 'text-[#666]'
  let borderColor = 'border-[#444]'

  if (status === 'RESOLVED') {
    bgColor = 'bg-[#1a1a1a]'
    textColor = 'text-[#666]'
    borderColor = 'border-[#444]'
  } else if (status === 'ACTIVE') {
    bgColor = 'bg-[#001a11]'
    textColor = 'text-[#00ff88]'
    borderColor = 'border-[#00ff88]'
  } else if (status === 'INVALIDATED') {
    bgColor = 'bg-[#1a0505]'
    textColor = 'text-[#ff4444]'
    borderColor = 'border-[#ff4444]'
  }

  return (
    <div
      className={`inline-block px-2 py-1 text-xs border rounded ${bgColor} ${textColor} ${borderColor}`}
    >
      {status}
    </div>
  )
}

function MissedVsActionableBadge({
  value,
}: {
  value: string
}) {
  const bgColor =
    value === 'ACTIONABLE' ? 'bg-[#001a11]' : 'bg-[#1a1a1a]'
  const textColor =
    value === 'ACTIONABLE' ? 'text-[#00ff88]' : 'text-[#555]'
  const borderColor =
    value === 'ACTIONABLE' ? 'border-[#00ff88]' : 'border-[#444]'

  return (
    <div
      className={`inline-block px-2 py-1 text-xs border rounded ${bgColor} ${textColor} ${borderColor}`}
    >
      {value}
    </div>
  )
}

export default function StatsPage() {
  const data = getStatsData()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link href="/" className="text-[#666] hover:text-[#ededed] mb-8 inline-block">
          ← Back
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">The Quiet Before</h1>
          <p className="text-[#999] text-lg mb-6">
            Small-cap discovery intelligence. Detecting the moment a stock
            transitions from ignored to investable.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="inline-block px-3 py-1 bg-[#1a1a1a] border border-[#444] rounded text-sm font-mono">
              {data.pipeline_version}
            </div>
            <div className="text-sm text-[#666]">
              Last updated: {formatTimestamp(data.generated_at)}
            </div>
          </div>
        </div>

        {/* Aggregate stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
            <div className="text-[#999] text-xs font-mono mb-2">
              TOTAL SIGNALS
            </div>
            <div className="text-2xl font-mono font-bold">
              {data.aggregate.total_signals}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
            <div className="text-[#999] text-xs font-mono mb-2">
              AVG MOVE
            </div>
            <div className="text-2xl font-mono font-bold">
              {fmt(data.aggregate.avg_move_pct, '%')}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
            <div className="text-[#999] text-xs font-mono mb-2">
              REACH +20%
            </div>
            <div className="text-2xl font-mono font-bold">
              {fmt(data.aggregate.pct_reaching_20, '%')}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
            <div className="text-[#999] text-xs font-mono mb-2">
              AVG DAYS TO PEAK
            </div>
            <div className="text-2xl font-mono font-bold">
              {fmt(data.aggregate.avg_days_to_peak, 'd')}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
            <div className="text-[#999] text-xs font-mono mb-2">
              AVG DAYS TO +10%
            </div>
            <div className="text-2xl font-mono font-bold">
              {fmt(data.aggregate.avg_days_to_10pct, 'd')}
            </div>
          </div>
        </div>

        {/* Signal cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {data.signals.map((signal) => (
            <div
              key={`${signal.ticker}-${signal.detection_date}`}
              className="bg-[#111111] border border-[#1a1a1a] rounded p-6"
            >
              {/* Ticker */}
              <div className="text-3xl font-mono font-bold mb-4">
                {signal.ticker}
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <ModeBadge mode={signal.mode} />
                <StatusBadge status={signal.status} />
                <MissedVsActionableBadge value={signal.missed_vs_actionable} />
              </div>

              {/* Core metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-[#666] text-xs font-mono mb-1">
                    DETECTION DATE
                  </div>
                  <div className="font-mono">{signal.detection_date}</div>
                </div>

                <div>
                  <div className="text-[#666] text-xs font-mono mb-1">
                    DETECTION PRICE
                  </div>
                  <div className="font-mono">
                    ${fmt(signal.detection_price, '')}
                  </div>
                </div>

                <div>
                  <div className="text-[#666] text-xs font-mono mb-1">
                    PEAK PRICE
                  </div>
                  <div className="font-mono">
                    ${fmt(signal.peak_price, '')}
                  </div>
                </div>

                <div>
                  <div className="text-[#666] text-xs font-mono mb-1">
                    DAYS TO PEAK
                  </div>
                  <div className="font-mono">
                    {fmt(signal.days_to_peak, 'd')}
                  </div>
                </div>
              </div>

              {/* Gain */}
              <div className="mb-4">
                <div className="text-[#666] text-xs font-mono mb-1">
                  % GAIN
                </div>
                <div
                  className={`text-xl font-mono font-bold ${
                    signal.pct_gain_detection_to_peak &&
                    signal.pct_gain_detection_to_peak > 0
                      ? 'text-[#00ff88]'
                      : 'text-[#ededed]'
                  }`}
                >
                  {fmt(signal.pct_gain_detection_to_peak, '%')}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[#1a1a1a] pt-3 text-xs">
                <div className="text-[#555] font-mono mb-1">
                  {signal.pipeline_version}
                </div>
                <div className="text-[#444] text-[10px]">
                  {signal.disclaimer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology note */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded p-6 max-w-3xl">
          <p className="text-sm text-[#999] leading-relaxed">
            Signals are generated by an automated discovery pipeline scanning
            U.S. small-cap stocks for liquidity regime changes, catalyst
            events, and supply pressure shifts. Detection does not constitute a
            buy signal or investment advice. All outcomes shown are historical.
          </p>
        </div>
      </div>
    </div>
  )
}
