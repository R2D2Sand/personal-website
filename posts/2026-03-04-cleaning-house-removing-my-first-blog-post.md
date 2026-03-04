---
title: "Day 1: From Zero to Trading Bot Infrastructure (And a Website to Prove It)"
date: "2025-03-03"
slug: "day-one-trading-bot-infrastructure"
tags: ["trading-bot", "python", "alpaca", "beginners", "infrastructure", "meta"]
---

# Day 1: From Zero to Trading Bot Infrastructure (And a Website to Prove It)

I built a trading bot today. Not a working one — but that's kind of the point.

Let me explain.

## How This Started

I came into today with one goal: build an AI-powered trading bot the right way. Not the "hack something together over a weekend and pray" way. The production-grade, security-first, actually-survives-contact-with-reality way.

I'm a beginner developer. That matters because a lot of trading bot tutorials out there are written by people who already know what they're doing, and they skip over all the parts that trip you up. I want this blog to be the opposite of that. Every mistake, every "wait, what does that mean," every late-night realization — I'm writing it down.

So: day one. Here's what I built, what I learned, and why this blog even exists.

## What I Actually Built Today

### The Bot (No Trades Yet — Intentionally)

After about a day of work, I have what I'd call an infrastructure-complete trading bot. It doesn't place any trades yet. That's on purpose.

Here's what it does do:

**A real trading strategy (RSI pullback with trend filter)**
- Only runs during market hours — 9:30 AM to 3:59 PM ET. No after-hours noise.
- Uses a 200-period SMA to confirm the market is in an uptrend before doing anything
- Watches for RSI dipping below 35 as a pullback signal within that uptrend
- Logs every single indicator calculation so I can actually debug what it's thinking

**Risk guardrails that actually enforce themselves**
- Tracks daily equity drawdown in real time
- Halts all activity automatically if loss limits are hit
- Caps the number of entries and orders per day
- This isn't optional logic — it runs first, every single loop

**Solid plumbing underneath everything**
- Alpaca Markets API integration (paper trading only for now)
- SQLite logging for every decision, order, and trade — full audit trail
- A state machine: FLAT → ENTERING → IN_POSITION → EXITING → HALTED
- Dual logging: console output and timestamped files
- Graceful shutdown — when I kill the process, it cleans up properly
- Settings validation on startup — if a credential is missing or wrong, it fails loudly immediately instead of silently misbehaving later

**A main loop that keeps running even when things go wrong**

Every N seconds it checks: daily loss limits first, then market clock, positions, fresh market data, strategy signals. If the heartbeat itself errors, it logs the error and keeps going. The bot doesn't crash because of a bad data response.

### The "Observe and Validate" Phase

Right now the bot logs everything but executes nothing. The execution stubs are there — they just don't fire yet. This is intentional. I want to:

- Run it on paper trading and watch how the signals behave in real market conditions
- Confirm the risk limits actually catch what they're supposed to catch
- Build genuine confidence in the infrastructure before I wire up real order execution

The next steps from here are clear: wire up the execution logic, backtest the strategy on historical data, then eventually — way down the road — consider live trading.

### Then I Built a Website

Later that night I started thinking: how do I actually track my progress on this? How do I stay accountable? And how do I share it in a way that might help someone else who's starting from zero?

The answer was a personal website with a blog. So I built that too.

Nothing fancy. A homepage, an about me section, and this blog. Clean, simple, functional.

Then I thought — if the whole point of this project is automation and AI, why am I going to manually write blog posts? So I built an automated blog pipeline:

- When I push code changes to GitHub, a GitHub Action triggers
- It reads the git diff and any performance logs
- It calls the Claude API, which writes a post summarizing what changed, in my voice
- The post gets saved as Markdown, committed to the website repo
- Vercel picks it up and deploys it automatically

To make the Claude API calls work, I put $5 of credits into Anthropic. That's the only money I've spent so far (besides the time). Worth it.

---

## A Human Moment

Honestly? I'm nervous. Not about the code — that feels solid. I'm nervous about the discipline it's going to take to keep shipping, keep testing, and not cut corners once the trades start flowing. But that's also why I'm writing this publicly. Accountability matters.

---

## Why I'm Doing This Publicly

A few reasons:

**Accountability.** It's easy to abandon a project when no one knows you started it.

**Clarity.** Writing about what I built forces me to actually understand it.

**For people like me.** When I was trying to figure this stuff out, I kept hitting tutorials that assumed too much. I want this to be the resource I wished existed.

I'm not an expert. I'm learning in public. Some of what I build will be wrong, and I'll write about that too.

## What's Next

- Wire up actual order execution (the exciting part)
- Run the bot in paper trading mode and observe real signals
- Start backtesting the RSI strategy on historical data
- Keep shipping, keep writing

If you're building something similar, follow along. And if you spot something I'm doing wrong — please tell me. That's the whole point.

---

*This post was written by me, with assistance from the automated Claude API blog pipeline I built as part of this project. The words, decisions, and mistakes are all mine.*