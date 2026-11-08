import test from 'node:test'
import assert from 'node:assert/strict'
import { publicSnapshot } from '../lib/veyra-public.ts'
const time = '2026-11-08T05:00:00Z'
test('public response drops unexpected private fields at every level', () => {
  const input = { schema_version: 1, generated_at: time, source_asof: time, reference_price: 75000,
    api_key: 'PRIVATE-SENTINEL', account_balance: 'PRIVATE-SENTINEL',
    market: { ticker: 'KXBTC15M-TEST', target: 75001, close_time: time, private_key: 'PRIVATE-SENTINEL' },
    prediction: { status: 'estimated', probability_up: 0.4, direction: 'DOWN', timestamp: time, secret: 'PRIVATE-SENTINEL', reason: 'PRIVATE-SENTINEL' },
    history: [{ timestamp: time, price: 75000, private_field: 'PRIVATE-SENTINEL' }],
  }
  const output = publicSnapshot(input)
  assert.equal(output.reference_price, 75000)
  assert.equal(output.prediction.probability_up, 0.4)
  assert.equal(JSON.stringify(output).includes('PRIVATE-SENTINEL'), false)
})
test('invalid values cannot masquerade as market prices or probabilities', () => {
  const output = publicSnapshot({ schema_version: 1, generated_at: time, reference_price: Infinity,
    prediction: { status: 'estimated', probability_up: 4 }, history: [{ timestamp: time, price: NaN }] })
  assert.equal(output.reference_price, null)
  assert.equal(output.prediction.probability_up, null)
  assert.deepEqual(output.history, [])
  assert.throws(() => publicSnapshot({ schema_version: 2, generated_at: time, history: [] }))
})
