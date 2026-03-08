import os
import subprocess
from datetime import datetime
from anthropic import Anthropic

def get_git_diff():
    """Get the diff of the latest commit."""
    try:
        result = subprocess.run(
            ["git", "diff", "HEAD~1", "HEAD"],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error getting git diff: {e}")
        return None

def generate_blog_post(diff):
    """Call Claude API to generate a blog post based on the git diff."""
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

    user_prompt = f"""Here's what changed in today's commit. Write a blog post about it in Luis's voice:
```diff
{diff}
```

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
    os.makedirs("posts", exist_ok=True)

    filepath = f"posts/{slug}.md"
    with open(filepath, "w") as f:
        f.write(full_post)

    print(f"Blog post saved to {filepath}")
    return filepath

# --- This is the main entry point ---
# When GitHub Actions runs `python scripts/generate-blog-post.py`, it starts here

if __name__ == "__main__":
    print("Getting git diff...")
    diff = get_git_diff()

    if not diff or diff.strip() == "":
        print("No diff found — nothing to write about. Exiting.")
        exit(0)

    print("Calling Claude API...")
    post_content = generate_blog_post(diff)

    if not post_content:
        print("Failed to generate blog post. Exiting.")
        exit(1)

    print("Saving blog post...")
    save_blog_post(post_content)

    print("Done!")