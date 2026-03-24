import fs from 'fs'
import path from 'path'

export type Signal = {
  ticker: string
  pipeline_version: string
  detection_date: string
  detection_price: number | null
  opportunity_window_low: number | null
  opportunity_window_high: number | null
  peak_price: number | null
  days_to_peak: number | null
  pct_gain_detection_to_peak: number | null
  days_to_10pct: number | null
  days_to_20pct: number | null
  status: string
  mode: string
  missed_vs_actionable: string
  disclaimer: string
}

export type Aggregate = {
  total_signals: number
  avg_move_pct: number | null
  median_move_pct: number | null
  pct_reaching_20: number | null
  pct_reaching_30: number | null
  pct_reaching_50: number | null
  avg_days_to_peak: number | null
  avg_days_to_10pct: number | null
  avg_days_to_20pct: number | null
}

export type StatsData = {
  generated_at: string
  pipeline_version: string
  aggregate: Aggregate
  signals: Signal[]
}

export function getStatsData(): StatsData {
  // public.json is synced here by GitHub Actions workflow on each pipeline export
  const filePath = path.join(process.cwd(), 'data', 'pipeline', 'public.json')

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const parsed = JSON.parse(fileContent)

  if (
    !parsed.generated_at ||
    !parsed.pipeline_version ||
    !parsed.aggregate ||
    !parsed.signals
  ) {
    throw new Error(
      'public.json is malformed or missing required fields'
    )
  }

  return parsed as StatsData
}

export function fmt(value: number | null, suffix?: string): string {
  if (value === null) {
    return '—'
  }
  return value.toFixed(1) + (suffix ?? '')
}
