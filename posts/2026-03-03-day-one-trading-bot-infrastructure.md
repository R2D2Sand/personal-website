---
title: "Hello World: I Built a Trading Bot and a Blog to Prove It"
date: "2026-03-03"
slug: "day-one-trading-bot-infrastructure"
tags: ["trading-bot", "python", "alpaca", "beginners", "ai", "meta"]
---

# Hello World: I Built a Trading Bot and a Blog to Prove It

Let me tell you how I got here.

## It Started With Soccer

I've always been the kind of person who dives headfirst into hobbies. And lately, AI tools have completely taken over my brain. I'm talking about staying up late thinking of crazy ways to use them, testing ideas, going down rabbit holes — completely hooked.

My first real experiment was a soccer win/loss predictor. The idea made perfect sense to me: focus on the strongest teams playing against the weakest teams, run the stats, and bet on the obvious outcome. Easy money, right?

I was so confident I put real money on Real Madrid vs Benfica. Benfica being the clear underdog.

Benfica won. Incredible match honestly. But that's not the point.

The point is — I was wrong, I lost, and I immediately started thinking about what to build next.

## The New Project: A Trading Bot

I know how this sounds. Trust me. But hear me out.

We live in a moment where you can take a wild idea, plug it into an AI, have it tell you exactly how to build it, and then have it walk you through every single step. That's not science fiction anymore — that's just Tuesday.

So I thought: what if I built an automated trading bot? Paper trading only to start, no real money on the line yet. Just me, a bunch of tools, and a genuinely ambitious idea.

Day one went surprisingly well. Using Claude, GitHub Copilot, Python, and the Alpaca Markets API, I:

- Connected all the APIs and got credentials working
- Built a real trading strategy — an RSI pullback with a 200-period SMA trend filter
- Set up risk guardrails that actually enforce themselves (daily loss limits, entry caps, auto-halt)
- Wired up SQLite logging so every decision gets recorded
- Built a state machine: FLAT → ENTERING → IN_POSITION → EXITING → HALTED
- Got graceful shutdown working so the bot cleans up properly when I kill it

The bot doesn't execute any trades yet. That's intentional. Right now it watches, calculates, and logs everything — but doesn't touch any money. I want to build confidence in the infrastructure before I let it loose even on paper trading.

## Then I Made It More Complicated (Obviously)

Day two, I wanted to tell people about what I was building. But here's the thing — when I describe this project to most people, they look at me like I've lost my mind. Like this stuff is completely out of reach.

And I just don't think that's true anymore.

So I thought: let me build a blog. Nothing fancy. Just a place to document what I'm doing. Maybe someone reads it. Maybe future me reads it when this either blows up spectacularly or actually works.

I had never built a website before.

Then my brain did what it always does — how can we make this more complicated?

*What if the blog posted itself automatically?*

What if every time I push code changes to GitHub, an AI reads what I changed and writes the blog post for me? So I built that too. The whole pipeline: GitHub Actions triggers on commits, calls the Claude API, generates a post in my voice, saves it as Markdown, commits it to the website repo, and Vercel deploys it automatically.

I even paid $5 for Anthropic API credits to make it work. They say it'll last hundreds of posts. We'll see.

The stack I ended up with:
- **Next.js + Tailwind CSS** for the website
- **Vercel** for hosting
- **GitHub Actions** for the automation pipeline
- **Claude API** for writing the posts
- **Python + Alpaca** for the trading bot
- **GitHub** holding all of it together

## Where Things Stand

The website is live. It's nothing but text on a black background but it works and it has everything it needs. The blog pipeline is running. The bot is built but not trading yet.

About four hours of "coding" — heavily assisted by AI, let's be honest — and I enabled all of this.

I've never done any of this before. Not the trading bot, not the website, not the automation pipeline. A week ago I was just a guy with ideas and too much free time.

Now I'm a guy with ideas, too much free time, and apparently a trading bot.

This is post one. Let's see where it goes.

---

*Built with Claude, GitHub Copilot, Python, Alpaca Markets, Next.js, Vercel, and GitHub Actions. The ideas and bad decisions are entirely my own.*