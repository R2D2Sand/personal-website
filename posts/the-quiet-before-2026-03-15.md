---
title: "Turns Out My Discovery Pipeline Wasn't Broken, Just Really Picky"
date: "2026-03-15"
slug: "the-quiet-before-2026-03-15"
tags: ["the-quiet-before", "dev-log", "building-in-public"]
---

Spent most of today staring at logs wondering why my stock discovery pipeline was producing absolutely nothing. Zero results. Hundreds of tickers going in, silence coming out.

My first thought was obviously "I broke something fundamental." So I started debugging from the beginning — universe fetch, ticker validation, the basic disqualifiers. Everything looked fine. Hundreds of stocks were making it through those early stages without issues.

Then I found the real culprit: liquidity regime detection.

I had set up this filter that requires recent trading volume to spike at least 3x compared to the historical baseline. Seemed reasonable when I was coding it. But when I actually looked at the data, nothing in the current market was hitting that threshold. The highest volume ratios I saw were around 2.9, and most were sitting at 0.5 to 1.1 — basically normal trading activity.

So my pipeline wasn't broken. It was just being incredibly selective about what counted as "unusual volume activity." Every single stock was getting filtered out before the discovery logic could even run.

Lowered the threshold and reran everything. Suddenly the system came alive — 354 tickers evaluated, 21 discovery candidates identified, and the first actual ranked results with trigger explanations.

The whole infrastructure is working now: screener pulls data, universe gets filtered, liquidity detection passes candidates through, scoring engine ranks them, output gets generated. End to end, finally.

Of course, all the current candidates are labeled UNCLASSIFIED and every catalyst score is identical because I haven't refined that logic yet. But seeing actual results come out the other end feels like progress.

This is the thing about building systems from scratch — sometimes your biggest problem isn't bugs, it's accidentally making your filters so strict that they reject reality. Today was about turning a completely blocked pipeline into something that actually produces output.

Now I get to work on making that output actually useful.