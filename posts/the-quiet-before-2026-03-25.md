---
title: "Fixed the messy parts, now the real work begins"
date: "2026-03-25"
slug: "the-quiet-before-2026-03-25"
tags: ["the-quiet-before", "dev-log", "building-in-public"]
---

I spent yesterday cleaning up The Quiet Before pipeline, and honestly? It feels good to finally tackle the annoying bugs that have been sitting there for weeks.

The biggest win was killing the duplicate ticker problem once and for all. I was seeing the same stocks show up multiple times in the ranked list, which made everything look sloppy. Fixed it at two levels — cleaned up the database queries and tightened the input validation. No more duplicates.

Had to do something I hate doing: wiped the entire database and rebuilt it clean. The old one was missing a column and honestly, trying to patch it felt like putting a band-aid on a broken pipe. Fresh start, fresh data.

The signal improvements in v1.2.0 are where things get interesting. That "contract_named" signal I had? Turns out I completely mislabeled it. It's actually tracking institutional footprint, so I renamed it properly. Also added an S-3 penalty — when companies are actively raising money through stock offerings, their score drops by 20%. Tested it on FF and AP, and they dropped from 60 to 48. Working as intended.

Best part: I fixed how the system handles missing data. Before, it was treating "we don't know" as "this is bad," which is just wrong. Now unknown actually means unknown.

Current state after the latest run: 503 tickers scanned, 21 passed screening, 2 got disqualified. No duplicates. Pipeline running clean on version 1.2.0. The scores are finally starting to spread out at the bottom instead of everything clustering around the same numbers.

But there's still work to do. Mode classification isn't working — everything shows "UNCLASSIFIED" instead of the actual signal types. Catalyst scores are still bunched up around 60 because 13F data is dominating everything else. And the explanations still say "SYSTEM_INFERRED" instead of showing real signal names.

The good news? System is stable now. No more chasing down weird bugs or duplicate entries. Next step is making the signals smarter, not fixing broken pipes.