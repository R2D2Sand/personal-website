---
title: "Finally Fixed the Duplicate Problem (And Other Pipeline Cleanup)"
date: "2026-04-17"
slug: "the-quiet-before-2026-04-17"
tags: ["the-quiet-before", "dev-log", "building-in-public"]
---

You know that annoying bug where the same stock would show up twice in the ranked list? The one that's been driving me crazy for weeks? 

It's dead.

I attacked it at two levels yesterday — cleaned up the input data AND fixed how the database handles duplicates. Turns out I was being too gentle the first time around. Sometimes you just need to be more aggressive with the fix.

While I was in there, I discovered my old database was missing a column. Classic. So I wiped everything clean and rebuilt it from scratch. Fresh start, no legacy weirdness.

The pipeline was also pulling stale results from who-knows-when, so I forced a complete run for the latest data. Now everything's actually current.

## Signal Improvements (v1.2.0)

I renamed one of my signals because it was completely mislabeled. What I was calling "contract_named" was actually tracking institutional footprint. No idea how I missed that for so long.

Added a new penalty for stocks with active S-3 offerings — they get dinged 20% now. Makes sense, right? If a company is actively diluting shares, that should hurt their score. It's working too. FF and AP dropped from 60 to 48, which feels about right.

Fixed a data handling bug where missing information was getting treated as negative signals. That was... not great. Now "unknown" actually means unknown instead of "probably bad."

The current run shows 503 tickers scanned, 21 passed, 2 disqualified. No duplicates. Clean pipeline on version 1.2.0.

## What's Still Broken

Mode classification is completely busted — everything shows as "UNCLASSIFIED." 

Catalyst scores are still bunched up around 60 because 13F filings dominate everything else. 

The explanations all say "SYSTEM_INFERRED" instead of showing actual signal names, which defeats the whole point.

And there's some weird encoding issue with the markdown output that I'll deal with later.

But here's the thing — the system is stable now. No more chasing bugs. Next phase is making the signals actually useful instead of just making sure they don't crash.

Progress feels good when it's not two steps forward, one step back.