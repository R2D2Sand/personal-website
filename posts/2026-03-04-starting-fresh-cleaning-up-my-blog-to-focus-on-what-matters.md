---
title: "Starting Fresh: Cleaning Up My Blog to Focus on What Matters"
date: "2026-03-04"
slug: "starting-fresh-cleaning-up-my-blog-to-focus-on-what-matters"
tags: ["trading", "ai", "database"]
---

I just did something that felt both necessary and slightly painful — I deleted all my previous blog posts and started with a clean slate.

Looking at this git diff, you can see I removed five posts that were... well, let's just say they were more about the meta-process of blogging than about actually building a trading bot. I had posts about accidentally restoring other posts, posts about writing posts with Claude, posts about TypeScript errors, and even a post about writing a post about accidentally restoring a post. It was getting ridiculous.

## Why I Hit the Reset Button

Here's the thing: I started this blog to document building a trading bot, not to document documenting building a trading bot. Somewhere along the way, I got caught up in the mechanics of the blog itself instead of the actual project.

The breaking point was when I realized I had more posts about git mistakes and AI-generated content than about the actual trading bot infrastructure I'd built. That's not serving anyone — not me as a learning exercise, not anyone who might want to follow along.

## What I'm Keeping (And Starting Over)

I did create a new empty post file for what will become my actual Day 1 post: `2026-03-03-day-one-trading-bot-infrastructure.md`. This time, I want to focus on the substance:

- The RSI strategy with trend filtering I implemented
- The risk management guardrails that actually work
- The position state machine (FLAT → ENTERING → IN_POSITION → EXITING → HALTED)
- The SQLite logging system for full audit trails
- The market hours validation and graceful shutdown handling

All the infrastructure work was real and worth documenting properly. I just got distracted by the blog platform instead of the actual building.

## The Lesson in Letting Go

Deleting content you've written is hard, even when you know it's the right call. I kept second-guessing myself — "But what about all that work writing those posts?" But that's exactly the problem. I was optimizing for content volume instead of content quality and focus.

I used Claude to help me think through this decision, and it reminded me that the goal isn't to have a lot of posts — it's to have useful posts that actually help someone learn about building trading systems.

## What's Next

I'm going to rewrite that Day 1 post, but this time I'll focus entirely on the technical work: what I built, why I made those architectural decisions, and what someone else could learn from following the same path. No meta-commentary about the blog itself, no recursive posts about post-writing.

Just the work, the learning, and the honest challenges of building something real.

The trading bot infrastructure is solid. Now the documentation needs to match that focus and quality. Time to get back to what actually matters: building systems that work and sharing what I learn along the way.