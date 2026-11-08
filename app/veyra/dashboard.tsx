'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { VeyraResponse } from '@/lib/veyra-types'

const currency = (value: number | null | undefined) => value == null || !Number.isFinite(value) ? '—' : value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const number = (value: number | null | undefined, digits = 1) => value == null || !Number.isFinite(value) ? '—' : value.toFixed(digits)
const clock = (value: string | null | undefined) => value ? new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', timeZone: 'America/Los_Angeles' }) : '—'
const conditionNames: Record<string, string> = { mixed_movement: 'Mixed movement', trending_up: 'Trending up', trending_down: 'Trending down', quiet: 'Quiet', sudden_move: 'Sudden movement', collecting_history: 'Gathering fresh data' }

function PriceChart({ history, target }: { history: { timestamp: string; price: number }[]; target: number | null }) {
  if (history.length < 2) return <div className="flex h-48 items-center justify-center text-sm text-[#91a49a]">Price history will appear when data arrives.</div>
  const values = history.map(point => point.price)
  const low = Math.min(...values, target ?? Infinity)
  const high = Math.max(...values, target ?? -Infinity)
  const pad = Math.max((high - low) * .15, 1)
  const y = (value: number) => 190 - (value - low + pad) / (high - low + pad * 2) * 170
  const points = history.map((point, index) => `${index / (history.length - 1) * 680},${y(point.price)}`).join(' ')
  return <div className="mt-5">
    <svg viewBox="0 0 680 215" role="img" aria-label="Recorded Bitcoin prices with the Kalshi target shown as a dashed line" className="h-auto w-full overflow-visible">
      {[35, 90, 145, 200].map(line => <line key={line} x1="0" y1={line} x2="680" y2={line} stroke="white" strokeOpacity=".06" />)}
      {target != null && <line x1="0" x2="680" y1={y(target)} y2={y(target)} stroke="#b7c5ba" strokeDasharray="5 6" strokeOpacity=".6" />}
      <polyline points={points} fill="none" stroke="#a8e6bf" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="680" cy={y(values[values.length - 1])} r="4" fill="#a8e6bf" />
    </svg>
    <div className="flex justify-between font-mono text-[11px] text-[#91a49a]"><span>{clock(history[0].timestamp)}</span><span>{clock(history[history.length - 1].timestamp)} Pacific</span></div>
  </div>
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-white/[.08] bg-[#101719] p-5"><p className="text-xs text-[#9aada1]">{label}</p><p className="mt-3 font-mono text-base tracking-tight text-[#edf4ef] sm:text-2xl">{value}</p><p className="mt-2 text-xs leading-5 text-[#91a49a]">{detail}</p></div>
}

export default function Dashboard({ initial }: { initial: VeyraResponse }) {
  const [data, setData] = useState(initial)
  const [now, setNow] = useState(0)
  const [disconnected, setDisconnected] = useState(false)
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000)
    const controller = new AbortController()
    const refresh = setInterval(async () => {
      if (document.hidden) return
      try {
        const response = await fetch('/api/veyra', { cache: 'no-store', signal: controller.signal })
        if (!response.ok) throw new Error('Unavailable')
        setData(await response.json()); setDisconnected(false)
      } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) setDisconnected(true) }
    }, 10000)
    return () => { clearInterval(tick); clearInterval(refresh); controller.abort() }
  }, [])
  const s = data.snapshot
  const age = s?.source_asof && now ? Math.max(0, (now - Date.parse(s.source_asof)) / 1000) : null
  const stale = age != null && age > 15
  const left = s?.market?.close_time && now ? Math.max(0, Math.floor((Date.parse(s.market.close_time) - now) / 1000)) : null
  const remaining = left == null ? '—' : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`
  const probability = s?.prediction?.probability_up
  const estimated = s?.prediction?.status === 'estimated' && probability != null
  const distance = s?.reference_price != null && s.market?.target != null ? s.reference_price - s.market.target : null
  const state = disconnected ? 'Connection interrupted' : !s ? 'Waiting for data' : stale ? 'Saved snapshot · older data' : data.connection === 'snapshot' ? 'Local snapshot' : 'Data connected'
  const phase = s?.observation?.phase?.replaceAll('_', ' ') ?? 'Not connected'
  return <main className="min-h-screen bg-[#080c0d] text-[#edf4ef]">
    <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 py-5">
        <Link href="/" className="text-[11px] font-medium uppercase tracking-[.22em] text-[#a9bab0]">AIBitsAndBots <span className="mx-3 text-[#41534a]">/</span> Veyra</Link>
        <div className="flex items-center gap-5"><span className="font-mono text-[10px] uppercase tracking-widest text-[#a8e6bf]">Read only</span></div>
      </header>
      <section className="flex flex-col justify-between gap-5 py-9 sm:flex-row sm:items-end">
        <div><p className="font-mono text-[10px] uppercase tracking-[.25em] text-[#91a49a]">Bitcoin · 15-minute markets</p><h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-5xl">A clearer view<span className="text-[#a8e6bf]">.</span></h1><p className="mt-3 text-sm text-[#9aada1]">What Veyra sees. What it predicts. What happens next.</p></div>
        <div className="text-xs text-[#9aada1]"><p className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${s && !stale && !disconnected ? 'bg-[#a8e6bf]' : 'bg-amber-300'}`} />{state}</p><p className="mt-2 pl-3.5 text-[11px]">As of {clock(s?.source_asof)} Pacific</p></div>
      </section>
      {!s && <div className="mb-6 rounded-xl border border-white/10 bg-white/[.025] p-5 text-sm leading-7 text-[#a9bab0]">Your dashboard is ready. Connect the Veyra data source to see prices and predictions here.</div>}
      <div className="grid gap-5 lg:grid-cols-[1.65fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-[#0e1516] p-5 sm:p-7">
          <div className="flex flex-wrap justify-between gap-4"><div><h2 className="text-xs text-[#9aada1]">Bitcoin reference price</h2><p className="mt-3 font-mono text-3xl tracking-tight sm:text-4xl">{currency(s?.reference_price)}</p></div><div className="text-right"><p className="text-xs text-[#9aada1]">Kalshi target</p><p className="mt-3 font-mono text-lg">{currency(s?.market?.target)}</p><p className="mt-1 text-[11px] text-[#9aada1]">{distance == null ? '—' : `${currency(Math.abs(distance))} ${distance >= 0 ? 'above' : 'below'} target`}</p></div></div>
          <PriceChart history={s?.history ?? []} target={s?.market?.target ?? null} />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[.08] pt-4 text-xs text-[#9aada1]"><span><span className="mr-2 inline-block h-0.5 w-4 bg-[#a8e6bf]" />BRTI reference</span><span><span className="mr-2 inline-block h-0.5 w-4 border-t border-dashed border-[#a9bab0]" />Target</span><span className="font-mono">{remaining} left</span></div>
        </section>
        <section className="flex flex-col rounded-2xl border border-white/10 bg-[#0e1516] p-5 sm:p-7">
          <div className="flex items-center justify-between"><h2 className="text-xs text-[#9aada1]">{stale ? 'Recorded estimate' : 'Latest estimate'}</h2><span className="rounded border border-amber-300/20 px-2 py-1 text-[10px] text-amber-200">Experimental</span></div>
          <p className="mt-7 text-4xl font-medium tracking-tight">{estimated ? s?.prediction?.direction : 'Watching'}</p>
          <p className="mt-3 text-sm leading-6 text-[#a9bab0]">{estimated ? 'A first model estimate, still being checked against actual results.' : 'An estimate appears when fresh data and a supported contract are available.'}</p>
          <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-lg bg-white/[.035] p-4"><p className="text-[11px] text-[#9aada1]">UP</p><p className="mt-2 font-mono text-2xl">{estimated ? number(probability! * 100) + '%' : '—'}</p></div><div className="rounded-lg bg-white/[.035] p-4"><p className="text-[11px] text-[#9aada1]">DOWN</p><p className="mt-2 font-mono text-2xl">{estimated ? number((1 - probability!) * 100) + '%' : '—'}</p></div></div>
          <p className="mt-5 text-xs leading-6 text-[#91a49a]">Recorded {clock(s?.prediction?.timestamp)} Pacific. Prediction accuracy is not established.</p>
          <div className="mt-auto flex justify-between border-t border-white/[.08] pt-4 text-xs"><span className="text-[#9aada1]">Market conditions</span><span>{s?.condition ? conditionNames[s.condition.label] ?? s.condition.label : 'Gathering data'}</span></div>
        </section>
      </div>
      <section className="mt-8"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-medium">The clues behind the market</h2><p className="text-[11px] text-[#91a49a]">1-minute candles · {clock(s?.indicators?.candle_end)} Pacific</p></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="EMA 9 · trend reference" value={currency(s?.indicators?.ema)} detail="A smoother view of recent prices." /><Metric label="RSI 14 · momentum" value={number(s?.indicators?.rsi)} detail="Strength of recent up/down movement." /><Metric label="ATR 14 · movement size" value={currency(s?.indicators?.atr)} detail="Recent range, not a price forecast." /><Metric label="Volume · versus usual" value={s?.indicators?.volume_ratio == null ? '—' : number(s.indicators.volume_ratio, 2) + '×'} detail="Compared with the previous 20 minutes." /></div></section>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-[#0e1516] p-5 sm:p-6"><h2 className="text-sm font-medium">How this estimate works</h2><ol className="mt-5 space-y-4 text-sm text-[#a9bab0]"><li><span className="mr-3 font-mono text-[#a8e6bf]">01</span>Compare Bitcoin with the target.</li><li><span className="mr-3 font-mono text-[#a8e6bf]">02</span>Consider the time left and recent volatility.</li><li><span className="mr-3 font-mono text-[#a8e6bf]">03</span>Record the estimate, then check the outcome.</li></ol><p className="mt-5 text-xs leading-6 text-[#91a49a]">Indicators and conditions are recorded for research. Their effect on predictions has not been learned yet.</p></section>
        <section className="rounded-2xl border border-white/10 bg-[#0e1516] p-5 sm:p-6"><h2 className="text-sm font-medium">Observation run</h2><div className="mt-5 flex items-end justify-between gap-4"><div><p className="text-3xl font-medium">{s?.results ? `${s.results.correct_directions} / ${s.results.settled_rounds}` : '—'}</p><p className="mt-2 text-xs text-[#9aada1]">Correct calls / settled rounds</p></div><p className="text-xs text-[#9aada1]">{s?.results?.pending_rounds ?? '—'} pending</p></div><div className="mt-6 space-y-3 border-t border-white/[.08] pt-4 text-xs"><p className="flex justify-between gap-4"><span className="text-[#9aada1]">Status</span><span className="capitalize">{phase}</span></p><p className="flex justify-between gap-4"><span className="text-[#9aada1]">Recording ends</span><span>{clock(s?.observation?.planned_end)} Pacific</span></p><p className="flex justify-between gap-4"><span className="text-[#9aada1]">Trading</span><span className="text-[#a8e6bf]">Disabled</span></p></div><p className="mt-4 text-xs leading-6 text-[#91a49a]">A small sample checks the system. It does not establish reliability.</p></section>
      </div>
      <footer className="mt-8 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-5 text-[11px] text-[#91a49a]"><span>Veyra · Observation workspace</span><span>Settlement uses the final-minute average.</span></footer>
    </div>
  </main>
}
