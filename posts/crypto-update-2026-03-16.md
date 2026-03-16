---
title: "Fixed the Thing That Was Pretending to Work"
date: "2026-03-16"
slug: "crypto-update-2026-03-16"
tags: ["cryptobot", "dev-log", "building-in-public"]
---

You know that feeling when something looks like it's running but actually isn't doing anything? Yeah, that was my bot for the past few days.

Turns out main.py was still looking for field names from like three versions ago of my scanner. So every time it tried to evaluate a stock signal, it would just... fail silently and move on. The logs looked fine. The scanner was running. Everything seemed normal.

Except nothing was actually happening.

After I fixed those field references, suddenly the bot started working again. And immediately I could see what was going on — every stock was coming back as "waiting_for_pullback." Which makes sense. The market's been running hot, with most assets sitting 2-3% above their short-term moving averages and momentum indicators in the 70+ range.

So the strategy was doing its job, just avoiding the chase. But then I noticed something else.

My RSI entry band was set to 40-60, which sounds reasonable until you realize that's incredibly narrow for a pullback strategy. I was basically asking for the perfect Goldilocks setup — not too hot, not too cold, just right. In a trending market, that's like waiting for a unicorn.

I bumped it up to 40-65. Not rocket science, just aligning with what actually works in trend-following systems.

Now the bot is deployed on a VPS, running v2 in paper trading mode, with all 95 tests passing. The scanner is producing rankings on schedule, and the signal evaluation is actually evaluating signals instead of pretending to.

We're basically waiting for that first pullback-and-continuation setup to see if this thing can actually make a trade. Which honestly feels like the scariest and most exciting part of this whole project.