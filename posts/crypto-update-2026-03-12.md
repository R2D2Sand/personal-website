---
title: "Finally automated the crypto bot devlogs"
date: "2026-03-12"
slug: "crypto-update-2026-03-12"
tags: ["cryptobot", "dev-log", "building-in-public"]
---

I've been running a crypto bot in paper trading mode for a while now, and manually writing updates was getting old fast. So today I built something I probably should have done weeks ago — automated devlogs.

Here's the thing: this crypto bot is way more research-heavy than my usual stuff. Getting to this version took some real work. I had three different AI systems basically debating the design with each other — what features to keep, what to scrap, how to structure everything. Sounds ridiculous but it actually worked. We landed on something solid.

The bot generates changelog entries as it runs, and now there's a script that reads those entries, filters out anything sensitive (API keys, exact positions, that kind of thing), and automatically pushes blog posts to my website. About four hours of coding — heavily assisted by AI, let's be honest.

I did run into some data capture issues along the way. There are probably more lurking that I haven't found yet, but I wanted to get this devlog system running first. Now when I fix stuff, it'll automatically show up on the site instead of me forgetting to write about it three days later.

The bot is still in paper trading mode. Plan is to let it run through the end of March to collect enough data — ideally around 100 hours of testing before I make any real decisions about going live with actual money. More data is always better when you're dealing with something that could lose your money.

That said, I'll probably get curious and check the interim results before March ends. Just to see if anything needs adjusting. The whole point of paper trading is to catch the weird edge cases before they cost you anything.

Next up: fixing those remaining data issues and maybe tweaking the redaction filters. The system works, but there's always room to make it work better.