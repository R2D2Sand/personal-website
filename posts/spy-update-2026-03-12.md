---
title: "Making the Blog Posts Less... Robot-y"
date: "2026-03-12"
slug: "spy-update-2026-03-12"
tags: ["spy-trader", "dev-log", "building-in-public"]
---

# Making the Blog Posts Less... Robot-y

## From Me

My Notes — [03/12/2026]

I've been working on some major strategy changes for this trading bot. I ended up doing a full SPY mean-reversion strategy research and backtesting report, covering things like position sizing, the execution model, execution audits, and filter testing.

Honestly, I burned through all my AI tokens for the day working on it, but it feels like I came out with something solid. According to the models themselves, this is closer to a real strategy rather than just recycled common knowledge. I really pushed the machines hard on this one, even putting them against each other at one point and cross-checking ideas across three different tools.

On the operational side, the system has been running without errors since 03/08/2026, collecting data and waiting for the right entry conditions. It's still in paper mode for now since there's no rush. I might leave it there for the rest of the month just to review performance and behavior.

The broader market environment isn't exactly in a strong growth trend at the moment, so I'm mostly observing and letting the system gather data. But I'm hoping the market turns up soon so the strategy gets a proper opportunity to trigger and really be tested.

---

You know what's weird about building stuff with AI? Sometimes the AI gets too... AI-ish. I was looking at the blog posts this system generates about code changes, and they sounded like they were written by a very polite robot who'd taken a creative writing class.

So today I spent time making the automated blog posts sound more like an actual human wrote them. Specifically, more like me — which means fewer corporate buzzwords and more "wait, why did that work?" energy.

The main issue was the prompt I was using to generate these posts. It was producing content that felt weirdly formal and stiff. Posts were using phrases like "beautifully meta" and "ridiculously exciting" — which honestly made me cringe a little. I don't talk like that. You probably don't either.

I updated the prompt to be more specific about voice and tone. No more trying too hard to be funny. No more ending posts with motivational fluff. Just tell the story of what changed and why, like you're explaining it to someone who cares but isn't going to judge you for the messy parts.

I also fixed how the system handles my personal notes. Before, it was treating them like a separate section instead of weaving them naturally into the narrative. Now it should feel more like one cohesive story instead of "here's the technical stuff, and oh by the way, here are some personal thoughts."

The changelog format got a small update too — each entry now has a plain English summary alongside the technical details. Should make it easier for the AI to understand what actually happened instead of just parsing Git commit messages.

It's one of those changes that's mostly invisible until it works. We'll see if the next few posts feel more human and less like they were optimized for engagement metrics.