import fs from 'fs'
import path from 'path'

export type SignalStatus = 'ACTIVE' | 'RESOLVED' | 'EXITED' | 'INVALIDATED'

export type SignalStatusLabel = 'HOLDING' | 'DEGRADING' | 'BROKEN'

export type Signal = {
  ticker: string
  status: SignalStatus
  detection_date: string
  detection_price: number | null
  promotion_date: string | null
  peak_price: number | null
  pct_gain_detection_to_peak: number | null
  return_pct: number | null
  days_active: number | null
  opportunity_window_gain: number | null
  opportunity_window_days: number | null
  signal_status_label: SignalStatusLabel | null
  cluster_id: string | null
  pipeline_version: string
  detection_label: string | null
  trigger_label: string | null
  current_price: number | null
  candidate_score: number | null
  mode: string | null
}

export type FeaturedSignal = Signal & {
  opportunity_start: string | null
  opportunity_end: string | null
  time_to_opportunity: number | null
}

export type FeaturedSignalData = {
  has_featured_signal: boolean
  signal: FeaturedSignal | null
}

export type AggregateStats = {
  signal_sample_size: number
  pct_positive: number | null
  confidence_label: 'Low' | 'Moderate' | 'High'
  mean_return: number | null
  median_return: number | null
  pct_reaching_5: number | null
  pct_reaching_10: number | null
  pct_reaching_20: number | null
  pct_reaching_30: number | null
  pct_reaching_50: number | null
  avg_days_to_peak: number | null
  median_days_to_peak: number | null
  avg_time_to_opportunity: number | null
  median_time_to_opportunity: number | null
  outlier_disclosure: string | null
  batch_cohort_disclosure: string | null
  pipeline_versions_in_sample: string[]
  clustered_signals_present: boolean
}

export type StatsData = {
  featured_signal: FeaturedSignalData
  active_signals: Signal[]
  past_signals: Signal[]
  signal_ledger: Signal[]
  stats: AggregateStats
  generated_at: string
  pipeline_version: string
}

const REQUIRED_TOP_LEVEL_KEYS = [
  'featured_signal',
  'active_signals',
  'past_signals',
  'signal_ledger',
  'stats',
  'generated_at',
  'pipeline_version',
] as const

function assertRequiredTopLevelKeys(
  parsed: Record<string, unknown>
): asserts parsed is StatsData {
  const missingKeys = REQUIRED_TOP_LEVEL_KEYS.filter(
    (key) => !(key in parsed)
  )

  if (missingKeys.length > 0) {
    throw new Error(
      `public.json is missing required top-level keys: ${missingKeys.join(', ')}`
    )
  }
}

export function getStatsData(): StatsData {
  // public.json is synced here by GitHub Actions workflow on each pipeline export
  const filePath = path.join(process.cwd(), 'data', 'pipeline', 'public.json')

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(fileContent) as Record<string, unknown>

  assertRequiredTopLevelKeys(parsed)

  return parsed as StatsData
}

export function fmt(value: number | null, suffix?: string): string {
  if (value === null) {
    return '—'
  }
  return value.toFixed(1) + (suffix ?? '')
}
