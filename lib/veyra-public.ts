import type { VeyraSnapshot } from './veyra-types'

type RecordValue = Record<string, unknown>
const object = (value: unknown): RecordValue => value && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : {}
const number = (value: unknown): number | null => typeof value === 'number' && Number.isFinite(value) ? value : null
const stamp = (value: unknown): string | null => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null
const nonnegative = (value: unknown): number | null => { const n = number(value); return n != null && n >= 0 ? n : null }
const count = (value: unknown): number => { const n = nonnegative(value); return n != null && Number.isSafeInteger(n) ? n : 0 }

/** Explicit projection: additional upstream fields never reach a visitor. */
export function publicSnapshot(value: unknown): VeyraSnapshot {
  const data = object(value)
  const generated = stamp(data.generated_at)
  if (data.schema_version !== 1 || !generated || !Array.isArray(data.history) || data.history.length > 500) throw new Error('Unsupported snapshot')
  const market = object(data.market), condition = object(data.condition), prediction = object(data.prediction)
  const indicators = object(data.indicators), observation = object(data.observation), results = object(data.results)
  const conditions = new Set(['mixed_movement', 'trending_up', 'trending_down', 'quiet', 'sudden_move', 'collecting_history'])
  const phases = new Set(['starting', 'recording', 'waiting_for_results', 'completed', 'stopped', 'failed', 'result_check_failed', 'finished_with_pending_results', 'finished_with_capture_errors', 'finished_without_predictions'])
  const probability = number(prediction.probability_up)
  const settled = count(results.settled_rounds)
  return {
    schema_version: 1, generated_at: generated, source_asof: stamp(data.source_asof),
    reference_price: nonnegative(data.reference_price),
    market: typeof market.ticker === 'string' && /^KXBTC15M-[A-Z0-9-]{1,80}$/.test(market.ticker) ? {
      ticker: market.ticker, target: nonnegative(market.target), close_time: stamp(market.close_time),
    } : null,
    condition: typeof condition.label === 'string' && conditions.has(condition.label) ? { label: condition.label, ready: condition.ready === true } : null,
    prediction: prediction.status === 'estimated' || prediction.status === 'waiting' ? {
      direction: ['UP', 'DOWN', 'EVEN'].includes(String(prediction.direction)) ? String(prediction.direction) : null,
      probability_up: probability != null && probability >= 0 && probability <= 1 ? probability : null,
      status: prediction.status, reason: '', timestamp: stamp(prediction.timestamp),
    } : null,
    indicators: data.indicators ? { ema: nonnegative(indicators.ema), rsi: number(indicators.rsi), atr: nonnegative(indicators.atr), volume_ratio: nonnegative(indicators.volume_ratio), candle_end: stamp(indicators.candle_end) } : null,
    observation: typeof observation.phase === 'string' && phases.has(observation.phase) ? { phase: observation.phase, planned_end: stamp(observation.planned_end) } : null,
    results: data.results ? { settled_rounds: settled, correct_directions: Math.min(count(results.correct_directions), settled), pending_rounds: count(results.pending_rounds) } : null,
    history: data.history.slice(-151).flatMap(item => {
      const point = object(item), time = stamp(point.timestamp), price = nonnegative(point.price)
      return time && price != null ? [{ timestamp: time, price }] : []
    }),
  }
}
