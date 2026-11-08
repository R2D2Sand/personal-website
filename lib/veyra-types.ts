export type VeyraSnapshot = {
  schema_version: 1
  generated_at: string
  source_asof: string | null
  reference_price: number | null
  market: { ticker: string; target: number | null; close_time: string | null } | null
  condition: { label: string; ready: boolean } | null
  prediction: { direction: string | null; probability_up: number | null; status: string; reason: string; timestamp: string | null } | null
  indicators: { ema: number | null; rsi: number | null; atr: number | null; volume_ratio: number | null; candle_end: string | null } | null
  observation: { phase: string; planned_end: string | null } | null
  results: { settled_rounds: number; correct_directions: number; pending_rounds: number } | null
  history: { timestamp: string; price: number }[]
}
export type VeyraResponse = { snapshot: VeyraSnapshot | null; connection: 'snapshot' | 'remote' | 'unavailable' }
