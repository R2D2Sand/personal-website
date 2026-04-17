Session: [2026-03-11]
[2026-03-11 20:12] | scripts/generate-blog-post.py | MODIFIED | Replaced git diff reader with 24hr CHANGELOG parser and redirected output to personal-website/posts/ for cross-repo blog pipeline
[2026-03-11 20:25] | scripts/generate-blog-post.py | MODIFIED | Added redaction filter to strip secrets and strategy thresholds before sending changelog data to Claude API

Session: [2026-03-23]
[2026-03-23] | lib/stats.ts | ADDED | Defined Signal, Aggregate, StatsData types; getStatsData() reads public.json from sibling the-quiet-before repo; fmt() null-safe formatter
[2026-03-23] | app/stats/page.tsx | ADDED | /stats server component — header, aggregate stats bar, signal cards grid, methodology note; dark theme, monospace numbers, badge components for mode/status/actionable
[2026-03-23] | .github/workflows/sync-pipeline-data.yml | FIXED | Removed PowerShell heredoc wrapper (@"..."@) stored as literal file content; removed backtick escape artifacts from ${{ secrets.* }} expressions

Session: [2026-03-24]
[2026-03-24] | app/stats/page.tsx | REBUILT | Full rebuild: ExtendedSignal type for current_price/trigger_label/days_active; liveReturn() helper uses detection→current for ACTIVE only; featured selection prefers RESOLVED/EXITED by pct_gain_detection_to_peak then ACTIVE by liveReturn; active sort by liveReturn DESC then days_active DESC; Persistent/New This Week subsections; Past Discoveries minimal table RESOLVED+EXITED only; plain StatusText (no badges); all null values render as em-dash; daysAgo() UTC-safe; mode→plain-English mapping; empty states for all sections; aggregate stats bar removed; total_signals count footer; no hardcoded dates

Session: [2026-03-25]
[2026-03-25] | app/page.tsx | MODIFIED | Changed The Quiet Before nav link target from /stats to /the-quiet-before
[2026-03-25] | .github/workflows/sync-pipeline-data.yml | FIXED | Removed trailing whitespace after curl line-continuation backslash in Authorization header line to prevent command breakage
[2026-03-25] | .github/workflows/sync-pipeline-data.yml | FIXED | Replaced multiline curl in Fetch step with exact single-line command to resolve YAML/shell parsing issues

Session: [2026-03-31]
[2026-03-31] | lib/stats.ts | REBUILT | Replaced legacy aggregate/signals schema with featured_signal, active_signals, past_signals, signal_ledger, stats, generated_at, pipeline_version; added new Signal/FeaturedSignal/AggregateStats types; getStatsData() now validates required top-level keys and throws explicit missing-key errors
[2026-03-31] | app/stats/page.tsx | REBUILT | Migrated /stats to new schema sources (featured_signal, active_signals, past_signals, signal_ledger, stats); replaced legacy gain/day fields with return_pct and opportunity_window_*; added active signal_status_label badges, signal ledger section, and expanded aggregate stats metrics while preserving dark mono mobile-first design and per-card disclaimer
[2026-04-07 00:00] | PROMPT 3 of 5 / PHASE 2 lib/stats.ts, app/stats/page.tsx | MODIFIED | Claude: AggregateStats type missing new pipeline proof-strip fields and page lacked a top-level significance summary
Copilot: added pct_positive, pct_reaching_5, median_days_to_peak, median_time_to_opportunity to AggregateStats and added a null-safe System Performance proof strip above Featured Signal
Impact: page now leads with signal quality and distribution context before individual names
[2026-04-07 00:00] | PROMPT 4 of 5 / PHASE 2 app/stats/page.tsx | MODIFIED | Claude: active signal cards showed status badge but no plain-English interpretation of signal behavior
Copilot: added inline significance label below ticker row on active signal cards using priority-ordered rule against signal_status_label and pct_gain_detection_to_peak; null-safe; display only
Impact: users can immediately read what a signal's current behavior means without interpreting raw status codes
[2026-04-07 00:00] | lib/stats.ts, app/stats/page.tsx | MODIFIED | Added pct_gain_detection_to_peak to Signal type and removed active-card inline cast by reading signal.pct_gain_detection_to_peak directly
[2026-04-07 00:00] | PROMPT 5 of 5 / PHASE 2 app/stats/page.tsx | MODIFIED | Claude: Past Signals and Signal Ledger sections overlapped in purpose and presented raw logs without enough interpretation
Copilot: replaced both sections with a single Signal History section bucketed by outcome using signalLedger as the only source; bucket logic computed as pure local consts; null-safe; responsive historical rows
Impact: historical signal performance is now readable at a glance and outcome distribution is clearer without duplicated sections

Session: [2026-04-16]
[2026-04-16] | app/the-quiet-before/page.tsx | CREATED | Added /the-quiet-before route by re-exporting stats page
[2026-04-16] | app/stats/page.tsx | MODIFIED | Removed disclaimer from signal cards and rendered a single instance at page bottom
[2026-04-17 00:18] | app/stats/page.tsx | MODIFIED | Added plain English descriptions under Invalidated and Exited status labels
[2026-04-17 00:33] | app/the-quiet-before/page.tsx | CREATED | Created /the-quiet-before route as a re-export of the stats page component.
Plain English: The Quiet Before engine now has its own URL at /the-quiet-before.

[2026-04-17 00:33] | app/page.tsx | MODIFIED | Wrapped The Quiet Before homepage reference in a Link pointing to /the-quiet-before.
Plain English: Clicking The Quiet Before on the homepage now navigates to the correct page.

[2026-04-17 00:33] | app/stats/page.tsx | MODIFIED | Replaced pct_gain_detection_to_peak with return_pct in all Signal History filters and card render logic.
Plain English: Signal History buckets now read the correct field name from public.json and will populate correctly.
[2026-04-17 01:21] | app/stats/page.tsx | MODIFIED | Added collapsible AI Research Note section to signal cards using ai_evaluation data
