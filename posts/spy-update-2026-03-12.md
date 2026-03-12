---
title: "Making The Bot Write Its Own Blog Posts"
date: "2026-03-12"
slug: "spy-update-2026-03-12"
tags: ["spy-trader", "dev-log", "building-in-public"]
---

# Making The Bot Write Its Own Blog Posts

## From Me

My Notes — [03/12/2026]

I've been working on some major strategy changes for this trading bot. I ended up doing a full SPY mean-reversion strategy research and backtesting report, covering things like position sizing, the execution model, execution audits, and filter testing.

Honestly, I burned through all my AI tokens for the day working on it, but it feels like I came out with something solid. According to the models themselves, this is closer to a real strategy rather than just recycled common knowledge. I really pushed the machines hard on this one, even putting them against each other at one point and cross-checking ideas across three different tools.

On the operational side, the system has been running without errors since 03/08/2026, collecting data and waiting for the right entry conditions. It's still in paper mode for now since there's no rush. I might leave it there for the rest of the month just to review performance and behavior.

The broader market environment isn't exactly in a strong growth trend at the moment, so I'm mostly observing and letting the system gather data. But I'm hoping the market turns up soon so the strategy gets a proper opportunity to trigger and really be tested.

Okay so I did something probably ridiculous today. You know how I've been manually writing these blog posts every time I update the bot? Well, my brain did what it always does — how can we make this more complicated?

I taught the bot to write its own blog posts.

Here's what happened: I was looking at my changelog format and realized it was already tracking everything I did. So why not just... feed that to Claude and have it generate a blog post in my voice? About four hours of "coding" — heavily assisted by GitHub Copilot, let's be honest — and now every time I push changes, a GitHub Action automatically generates a blog post draft.

The tricky part was getting the voice right. I had to write these ridiculously detailed instructions about how I actually talk, complete with examples of my terrible jokes and self-aware commentary. Then I set up this whole pipeline where the changelog gets processed, combined with my manual notes, and turned into something that hopefully doesn't sound like corporate AI nonsense.

I'm genuinely curious if you can tell this post was written by Claude. The plan is to still review and edit everything before it goes live, but having a solid first draft generated automatically? That's going to save me so much time.

Plus there's something beautifully meta about a trading bot that writes blog posts about itself. We're getting close to full automation here, and I'm not sure if that's amazing or terrifying.

We'll see if this actually works or if I just spent a day building an elaborate way to make my writing worse.