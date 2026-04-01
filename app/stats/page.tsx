import Link from 'next/link'
import { AggregateStats, FeaturedSignalData, Signal, StatsData, fmt, getStatsData } from '@/lib/stats'

const CARD_DISCLAIMER = 'Discovery candidates for research purposes only. Not investment advice.'

function fmtInteger(value: number | null | undefined): string {
  if (value == null) return '—'
  return fmt(value).replace(/\.0$/, '')
}

function fmtPrice(value: number | null | undefined): string {
  if (value == null) return '—'
  return '$' + fmt(value)
}

function fmtPercent(value: number | null | undefined): string {
  if (value == null) return '—'
  return fmt(value, '%')
}

function fmtDays(value: number | null | undefined): string {
  if (value == null) return '—'
  return fmtInteger(value) + 'd'
}

function fmtDate(value: string | null | undefined): string {
  if (!value) return '—'
  return value.slice(0, 10)
}

function statusText(status: Signal['status']): string {
  if (status === 'ACTIVE') return 'Active'
  if (status === 'RESOLVED') return 'Resolved'
  if (status === 'EXITED') return 'Exited'
  if (status === 'INVALIDATED') return 'Invalidated'
  return status
}

function SignalStatusBadge({ label }: { label: Signal['signal_status_label'] }) {
  if (!label) {
    return (
      <span className="rounded border border-[#1a1a1a] px-2 py-1 text-xs font-mono text-[#555]">
        No status label
      </span>
    )
  }

  let badgeClass = 'text-[#555]'
  if (label === 'HOLDING') badgeClass = 'text-[#00ff88]'
  if (label === 'DEGRADING') badgeClass = 'text-[#f5c451]'
  if (label === 'BROKEN') badgeClass = 'text-[#ff5c5c]'

  return (
    <span className={'rounded border border-[#1a1a1a] px-2 py-1 text-xs font-mono ' + badgeClass}>
      {label}
    </span>
  )
}

function CardDisclaimer() {
  return (
    <p className="mt-4 border-t border-[#1a1a1a] pt-3 text-xs font-mono leading-relaxed text-[#444]">
      {CARD_DISCLAIMER}
    </p>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xs font-mono uppercase tracking-[0.24em] text-[#555]">
      {children}
    </h2>
  )
}

export default function StatsPage() {
  let data: StatsData | null = null
  let loadError: string | null = null

  try {
    data = getStatsData()
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Unable to load local pipeline stats data.'
  }

  if (!data || loadError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-12 font-mono text-[#ededed]">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="mb-8 inline-block text-sm text-[#666] hover:text-[#ededed]">
            ← Back
          </Link>
          <div className="rounded border border-[#1a1a1a] bg-[#111111] p-5 sm:p-6">
            <h1 className="mb-3 text-2xl font-bold sm:text-3xl">Stats unavailable</h1>
            <p className="text-sm text-[#999]">
              Failed to load local pipeline export data from data/pipeline/public.json.
            </p>
            <p className="mt-3 text-sm text-[#ff5c5c]">{loadError ?? 'Unknown data error.'}</p>
          </div>
        </div>
      </div>
    )
  }

  const featuredData: FeaturedSignalData = data.featured_signal
  const activeSignals: Signal[] = data.active_signals.slice(0, 5)
  const pastSignals: Signal[] = data.past_signals
  const signalLedger: Signal[] = data.signal_ledger
  const stats: AggregateStats = data.stats

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-12 font-mono text-[#ededed]">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="mb-8 inline-block text-sm text-[#666] hover:text-[#ededed]">
          ← Back
        </Link>

        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl">The Quiet Before</h1>
          <p className="text-sm text-[#999] sm:text-base">
            Small-cap discovery intelligence from the local pipeline export.
          </p>
        </header>

        <section className="mb-12">
          <SectionTitle>Featured Signal</SectionTitle>
          {!featuredData.has_featured_signal || !featuredData.signal ? (
            <div className="rounded border border-[#1a1a1a] bg-[#111111] p-5 text-sm text-[#666]">
              No featured signal available in this export.
            </div>
          ) : (
            <article className="rounded border border-[#1a1a1a] bg-[#111111] p-5 sm:p-6">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#555]">Featured</p>
                  <h3 className="text-3xl font-bold">{featuredData.signal.ticker}</h3>
                </div>
                <SignalStatusBadge label={featuredData.signal.signal_status_label} />
              </div>

              <div className="space-y-2 text-sm text-[#999]">
                <p>Trigger: {featuredData.signal.trigger_label ?? '—'}</p>
                <p>Detected: {fmtDate(featuredData.signal.detection_date)}</p>
                <p>Detection Price: {fmtPrice(featuredData.signal.detection_price)}</p>
                <p>Current Price: {fmtPrice(featuredData.signal.current_price)}</p>
                <p>
                  Opportunity Window: {fmtPercent(featuredData.signal.opportunity_window_gain)} in{' '}
                  {fmtDays(featuredData.signal.opportunity_window_days)}
                </p>
                <p className={featuredData.signal.return_pct != null && featuredData.signal.return_pct > 0 ? 'text-[#00ff88]' : 'text-[#999]'}>
                  Return: {fmtPercent(featuredData.signal.return_pct)}
                </p>
              </div>

              <CardDisclaimer />
            </article>
          )}
        </section>

        <section className="mb-12">
          <SectionTitle>Active Signals</SectionTitle>
          {activeSignals.length === 0 ? (
            <p className="text-sm text-[#666]">No active signals in this export.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeSignals.map((signal) => (
                <article
                  key={signal.ticker + '-' + signal.detection_date}
                  className="rounded border border-[#1a1a1a] bg-[#111111] p-5"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="text-2xl font-bold">{signal.ticker}</h3>
                    <SignalStatusBadge label={signal.signal_status_label} />
                  </div>

                  <div className="space-y-1 text-sm text-[#999]">
                    <p>Trigger: {signal.trigger_label ?? '—'}</p>
                    <p>Detected: {fmtDate(signal.detection_date)}</p>
                    <p>Detection Price: {fmtPrice(signal.detection_price)}</p>
                    <p>Current Price: {fmtPrice(signal.current_price)}</p>
                    <p>Days Active: {fmtDays(signal.days_active)}</p>
                  </div>

                  <CardDisclaimer />
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <SectionTitle>Past Signals</SectionTitle>
          {pastSignals.length === 0 ? (
            <p className="text-sm text-[#666]">No past signals in this export.</p>
          ) : (
            <div className="space-y-3">
              {pastSignals.map((signal) => (
                <article
                  key={signal.ticker + '-' + signal.detection_date + '-' + signal.status}
                  className="rounded border border-[#1a1a1a] bg-[#111111] p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-bold text-[#ededed]">{signal.ticker}</span>
                    <span className="text-[#666]">{statusText(signal.status)}</span>
                  </div>
                  <div className="space-y-1 text-xs text-[#999]">
                    <p>Detected: {fmtDate(signal.detection_date)}</p>
                    <p>Return: {fmtPercent(signal.return_pct)}</p>
                    <p>Opportunity Window Days: {fmtDays(signal.opportunity_window_days)}</p>
                  </div>
                  <CardDisclaimer />
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mb-12">
          <SectionTitle>Signal Ledger</SectionTitle>
          {signalLedger.length === 0 ? (
            <p className="text-sm text-[#666]">No ledger records in this export.</p>
          ) : (
            <div className="overflow-x-auto rounded border border-[#1a1a1a] bg-[#111111]">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1a1a1a] text-xs uppercase tracking-[0.16em] text-[#555]">
                    <th className="px-3 py-3 font-normal">Ticker</th>
                    <th className="px-3 py-3 font-normal">Status</th>
                    <th className="px-3 py-3 font-normal">Detection Date</th>
                    <th className="px-3 py-3 font-normal">Return</th>
                    <th className="px-3 py-3 font-normal">Days Active</th>
                    <th className="px-3 py-3 font-normal">Pipeline Version</th>
                  </tr>
                </thead>
                <tbody>
                  {signalLedger.map((signal) => (
                    <tr
                      key={signal.ticker + '-' + signal.detection_date + '-' + signal.status + '-' + signal.pipeline_version}
                      className="border-b border-[#151515] text-[#999] last:border-b-0"
                    >
                      <td className="px-3 py-3 font-bold text-[#ededed]">{signal.ticker}</td>
                      <td className="px-3 py-3">{statusText(signal.status)}</td>
                      <td className="px-3 py-3">{fmtDate(signal.detection_date)}</td>
                      <td className={signal.return_pct != null && signal.return_pct > 0 ? 'px-3 py-3 text-[#00ff88]' : 'px-3 py-3'}>
                        {fmtPercent(signal.return_pct)}
                      </td>
                      <td className="px-3 py-3">{fmtDays(signal.days_active)}</td>
                      <td className="px-3 py-3">{signal.pipeline_version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mb-12">
          <SectionTitle>Stats</SectionTitle>
          <div className="mb-4 rounded border border-[#1a1a1a] bg-[#111111] p-5">
            <p className="mb-1 text-xs uppercase tracking-[0.24em] text-[#555]">Confidence</p>
            <p className="text-2xl font-bold text-[#00ff88]">{stats.confidence_label}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded border border-[#1a1a1a] bg-[#111111] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#555]">Signal Sample Size</p>
              <p className="text-lg">{fmtInteger(stats.signal_sample_size)}</p>
            </div>
            <div className="rounded border border-[#1a1a1a] bg-[#111111] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#555]">Mean Return</p>
              <p className="text-lg">{fmtPercent(stats.mean_return)}</p>
            </div>
            <div className="rounded border border-[#1a1a1a] bg-[#111111] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#555]">Median Return</p>
              <p className="text-lg">{fmtPercent(stats.median_return)}</p>
            </div>
            <div className="rounded border border-[#1a1a1a] bg-[#111111] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#555]">Pct Reaching 20</p>
              <p className="text-lg">{fmtPercent(stats.pct_reaching_20)}</p>
            </div>
            <div className="rounded border border-[#1a1a1a] bg-[#111111] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#555]">Pct Reaching 30</p>
              <p className="text-lg">{fmtPercent(stats.pct_reaching_30)}</p>
            </div>
            <div className="rounded border border-[#1a1a1a] bg-[#111111] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#555]">Pct Reaching 50</p>
              <p className="text-lg">{fmtPercent(stats.pct_reaching_50)}</p>
            </div>
            <div className="rounded border border-[#1a1a1a] bg-[#111111] p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#555]">Avg Days To Peak</p>
              <p className="text-lg">{fmtDays(stats.avg_days_to_peak)}</p>
            </div>
            <div className="rounded border border-[#1a1a1a] bg-[#111111] p-4 sm:col-span-2 lg:col-span-2">
              <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#555]">Avg Time To Opportunity</p>
              <p className="text-lg">{fmtDays(stats.avg_time_to_opportunity)}</p>
            </div>
          </div>

          {(stats.outlier_disclosure || stats.batch_cohort_disclosure) && (
            <div className="mt-4 space-y-2 text-xs text-[#666]">
              {stats.outlier_disclosure && <p>Outlier disclosure: {stats.outlier_disclosure}</p>}
              {stats.batch_cohort_disclosure && <p>Batch cohort disclosure: {stats.batch_cohort_disclosure}</p>}
            </div>
          )}
        </section>

        <footer className="border-t border-[#1a1a1a] pt-6 text-xs text-[#666]">
          <p>Generated At: {data.generated_at}</p>
          <p className="mt-1">Pipeline Version: {data.pipeline_version}</p>
        </footer>
      </div>
    </div>
  )
}
