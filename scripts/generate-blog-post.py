import os
import re
from datetime import datetime, timedelta
from anthropic import Anthropic

def get_changelog_entries():
    """Read CHANGELOG.md and return entries from the last 24 hours."""
    changelog_path = "CHANGELOG.md"

    if not os.path.exists(changelog_path):
        return None

    with open(changelog_path, "r") as f:
        lines = f.readlines()

    now = datetime.utcnow()
    cutoff = now - timedelta(hours=24)
    timestamp_pattern = re.compile(r"^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\]")

    recent_entries = []
    for line in lines:
        match = timestamp_pattern.match(line.strip())
        if not match:
            continue

        try:
            entry_time = datetime.strptime(match.group(1), "%Y-%m-%d %H:%M")
        except ValueError:
            continue

        if cutoff <= entry_time <= now:
            recent_entries.append(line.rstrip("\n"))

    return "\n".join(recent_entries) if recent_entries else None

def redact_changelog(changelog: str) -> str:
    """Redact secrets, IPs, strategy thresholds, and sensitive file paths from changelog text."""
    secret_keywords = re.compile(
        r"(API_KEY|SECRET|PASSWORD|TOKEN|PRIVATE_KEY|\.env|credentials)",
        re.IGNORECASE,
    )
    ip_pattern = re.compile(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}")
    strategy_pattern = re.compile(
        r"(?i)(threshold|\bRSI\b|\bSMA\b|\bEMA\b|\bATR\b|\blimit\b|stop_loss|take_profit)"
    )
    numeric_inline = re.compile(r"\b\d+(?:\.\d+)?\b")
    sensitive_path = re.compile(
        r"(\.env|secrets|credentials|keys)",
        re.IGNORECASE,
    )

    redacted_lines = []
    for line in changelog.splitlines():
        # Rule 1 & 4 combined: secrets / sensitive file paths — redact whole value after separator
        if secret_keywords.search(line) or sensitive_path.search(line):
            # Replace the descriptive payload (everything after the last | separator) with [REDACTED]
            if "|" in line:
                parts = line.rsplit("|", 1)
                line = parts[0] + "| [REDACTED]"
            else:
                line = re.sub(r"(:?=\s*|:\s*|\s+)\S+", " [REDACTED]", line)

        # Rule 2: IP addresses
        line = ip_pattern.sub("[REDACTED]", line)

        # Rule 3: strategy thresholds — redact numeric values on matching lines
        if strategy_pattern.search(line):
            line = numeric_inline.sub("[REDACTED]", line)

        redacted_lines.append(line)

    return "\n".join(redacted_lines)

def get_personal_notes():
    """Read personal notes from blog-pipeline/my-notes.md if they exist and have content."""
    notes_path = "blog-pipeline/my-notes.md"

    # If the file doesn't exist at all, skip silently
    if not os.path.exists(notes_path):
        return None

    with open(notes_path, "r") as f:
        content = f.read()

    # Filter out lines that are blank, comments, or just the date header
    lines = [
        l for l in content.splitlines()
        if l.strip()
        and not l.strip().startswith("<!--")
        and not l.strip().startswith("# My Notes")
    ]

    # After removing headers (## lines), check if anything real was written
    real_content = [l for l in lines if not l.startswith("##")]

    if not real_content:
        return None

    return content

def clear_personal_notes():
    """Reset my-notes.md back to the blank template after a successful post."""
    notes_path = "blog-pipeline/my-notes.md"
    blank_template = """# My Notes — [DATE]

## What I worked on today
<!-- Write freely here. What did you build, change, or fix? -->


## Why I made these decisions
<!-- What was your thinking? Were there alternatives you considered? -->


## How I'm feeling about the project
<!-- Honest reflection. Excited? Frustrated? Confused? -->


## Anything I want readers to know
<!-- Shoutouts, warnings, lessons learned, questions you still have -->
"""
    with open(notes_path, "w") as f:
        f.write(blank_template)
    print("📋 my-notes.md cleared and ready for next session.")

def generate_blog_post(changelog, personal_notes=None):
    """Call Claude API to generate a blog post based on changelog entries."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set")
        return None

    client = Anthropic(api_key=api_key)

    system_prompt = """You are writing blog posts for Luis Sandoval — a guy who works in operations and data at a tech hardware company and decided one day to just... build a trading bot. No CS degree. No developer background. Just curiosity, AI tools, and too much free time.

Luis's voice is:
- Casual and conversational — like he's texting a friend who happens to be interested in tech
- Self-aware and funny about how ambitious/crazy his ideas are
- Honest about struggles, mistakes, and "wait why did that work" moments
- Genuinely excited — not fake hype, real enthusiasm from someone who can't believe this stuff is possible
- Never talks down to readers — he IS the beginner, writing for other beginners
- Drops in real context: he started with a soccer win/loss predictor, bet on Real Madrid vs Benfica, Benfica won, moved on
- References the AI tools he uses casually: Claude, GitHub Copilot, Python, Alpaca, Vercel, GitHub Actions
- Doesn't over-explain technical stuff — keeps it light, links the big ideas
- Short paragraphs. No corporate speak. No "In conclusion." No "It's worth noting that."

Tone examples from Luis himself:
- "I know how this sounds. Trust me. But hear me out."
- "Then my brain did what it always does — how can we make this more complicated?"
- "About four hours of 'coding' — heavily assisted by AI, let's be honest — and I enabled all of this."
- "We'll see."

When writing a post:
1. Start with a punchy title as H1
2. Open with something human — a reaction, a realization, a problem
3. Explain what changed and WHY in plain language
4. Be honest if something broke or was confusing
5. Keep it 300-500 words — scannable, not a wall of text
6. End with what's next, kept short and real
7. No motivational fluff. No "excited to share." Just the actual story.

Write ONLY the blog post. No frontmatter. No metadata. Start with the # title."""

    # If personal notes exist, inject them at the top of the prompt
    if personal_notes:
        user_prompt = f"""Here's what changed in today's changelog entries. Write a blog post about it in Luis's voice.

IMPORTANT: After the title, include a section called "## From Me" containing EXACTLY the following text.
Do not change, summarize, or rewrite a single word of it:

{personal_notes}

Then below that, write the AI summary of the changes.

Here's the changelog entries:
{changelog}

Write it like Luis is telling a friend what he did today — honest, a little chaotic, genuinely excited."""

    else:
        user_prompt = f"""Here's what changed in today's changelog entries. Write a blog post about it in Luis's voice:
{changelog}

Write it like Luis is telling a friend what he did today — honest, a little chaotic, genuinely excited. If something broke or was confusing, say so. Keep it real."""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            temperature=1,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        return message.content[0].text
    except Exception as e:
        print(f"Error calling Claude API: {e}")
        return None

def save_blog_post(content):
    """Wrap the blog post in frontmatter and save it to the posts folder."""
    today = datetime.utcnow()
    date_str = today.strftime("%Y-%m-%d")
    slug = f"update-{date_str}"

    # Pull the first line (the # Title) out to use as the frontmatter title
    lines = content.strip().splitlines()
    title = lines[0].lstrip("#").strip() if lines else "Update"

    frontmatter = f"""---
title: "{title}"
date: "{date_str}"
slug: "{slug}"
tags: ["trading-bot", "dev-log", "building-in-public"]
---

"""
    full_post = frontmatter + content

    # Make sure the posts folder exists
    os.makedirs("personal-website/posts", exist_ok=True)

    filepath = f"personal-website/posts/{slug}.md"
    with open(filepath, "w") as f:
        f.write(full_post)

    print(f"✅ Blog post saved to {filepath}")
    return filepath

# --- This is the main entry point ---
# When GitHub Actions runs `python scripts/generate-blog-post.py`, it starts here

if __name__ == "__main__":
    print("🤖 Auto-generating blog post from latest changelog entries...")

    # Step 1: Get recent changelog entries
    print("📂 Getting changelog entries from the last 24 hours...")
    changelog = get_changelog_entries()

    if not changelog or changelog.strip() == "":
        print("No recent changelog entries found — nothing to write about. Exiting.")
        exit(0)

    changelog = redact_changelog(changelog)
    print("🔒 Redaction filter applied.")

    # Step 2: Check for personal notes
    notes = get_personal_notes()
    if notes:
        print("📝 Personal notes found — adding 'From Me' section to post...")
    else:
        print("📭 No personal notes today — skipping 'From Me' section.")

    # Step 3: Generate the blog post
    print("🧠 Calling Claude API...")
    post_content = generate_blog_post(changelog, personal_notes=notes)

    if not post_content:
        print("❌ Failed to generate blog post. Exiting.")
        exit(1)

    # Step 4: Save the blog post
    print("💾 Saving blog post...")
    save_blog_post(post_content)

    # Step 5: Clear notes file so it's ready for next session
    if notes:
        clear_personal_notes()

    print("✅ Done!")
