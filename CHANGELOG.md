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
