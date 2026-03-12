---
title: "Making the Blog Posts Sound Less Like a Robot Wrote Them"
date: "2026-03-12"
slug: "spy-update-2026-03-12"
tags: ["spy-trader", "dev-log", "building-in-public"]
---

## From Me

I've been working on some major strategy changes for this trading bot. I ended up doing a full SPY mean-reversion strategy research and backtesting report, covering things like position sizing, the execution model, execution audits, and filter testing.

Honestly, I burned through all my AI tokens for the day working on it, but it feels like I came out with something solid. According to the models themselves, this is closer to a real strategy rather than just recycled common knowledge. I really pushed the machines hard on this one, even putting them against each other at one point and cross-checking ideas across three different tools.

On the operational side, the system has been running without errors since 03/08/2026, collecting data and waiting for the right entry conditions. It's still in paper mode for now since there's no rush. I might leave it there for the rest of the month just to review performance and behavior.

The broader market environment isn't exactly in a strong growth trend at the moment, so I'm mostly observing and letting the system gather data. But I'm hoping the market turns up soon so the strategy gets a proper opportunity to trigger and really be tested.

Had one of those days where I spent more time fixing the thing that talks about the thing than actually working on the thing itself.

You know how I've been letting GitHub automatically generate these blog posts from my changelog? Well, turns out having an AI write about what an AI-assisted human did creates this weird feedback loop where everything starts sounding way too... corporate.

The posts were coming out with phrases like "beautifully meta" and "ridiculously excited" — stuff I would never actually say. Plus they kept duplicating the title and treating my personal notes like some formal section instead of just blending them in naturally.

So I spent the morning tweaking the prompt. Told it to chill on the jokes, stop using AI-sounding buzzwords, and actually write like a human who codes with Copilot instead of a marketing department.

Also updated the changelog format to include plain English summaries of each change. Turns out "MODIFIED | [REDACTED]" doesn't give the AI much to work with when trying to explain what actually happened.

The whole automated blog pipeline is getting smoother. It's weird watching code write about code, but at least now it sounds more like me and less like ChatGPT had too much coffee.

Next up: actually getting back to that strategy research instead of endlessly polishing the tools that document the tools.