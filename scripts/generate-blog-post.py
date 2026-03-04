#!/usr/bin/env python3
import os
import subprocess
import re
from datetime import datetime
from anthropic import Anthropic

def get_latest_commit_diff():
    """Get the git diff of the latest commit."""
    try:
        # Get the diff of the last commit
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

def create_slug(title):
    """Convert a title into a URL-friendly slug."""
    # Remove special characters and convert to lowercase
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    # Replace spaces with hyphens
    slug = re.sub(r'[-\s]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

def extract_frontmatter(content):
    """Extract title, tags, and content from Claude's response."""
    lines = content.strip().split('\n')
    
    # Default values
    title = "Development Update"
    tags = ["development"]
    main_content = content
    
    # Try to extract title from first heading
    for i, line in enumerate(lines):
        if line.startswith('# '):
            title = line.replace('# ', '').strip()
            # Remove the title line from content
            main_content = '\n'.join(lines[i+1:]).strip()
            break
    
    # Try to extract tags from content (look for common keywords)
    content_lower = content.lower()
    possible_tags = []
    
    tag_keywords = {
        'trading': ['trading', 'trade', 'market'],
        'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml'],
        'python': ['python'],
        'nextjs': ['next.js', 'nextjs', 'react'],
        'api': ['api'],
        'database': ['database', 'sql', 'postgres'],
        'deployment': ['deploy', 'vercel', 'production'],
        'bug-fix': ['bug', 'fix', 'error'],
        'feature': ['feature', 'new'],
    }
    
    for tag, keywords in tag_keywords.items():
        if any(keyword in content_lower for keyword in keywords):
            possible_tags.append(tag)
    
    if possible_tags:
        tags = possible_tags[:3]  # Limit to 3 tags
    
    return title, tags, main_content

def generate_blog_post(diff):
    """Call Claude API to generate a blog post based on the git diff."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set")
        return None
    
    client = Anthropic(api_key=api_key)
    
    system_prompt = """You are Luis Sandoval, a builder documenting your journey of building an AI-powered automated trading bot from scratch while simultaneously building a personal website to document the process.

Write in first person with an authentic, learning-focused tone:
- Be honest about mistakes and learning moments
- Write for beginners who want to follow along
- Explain WHY you made changes, not just WHAT changed
- Keep it conversational and approachable
- Share the thought process behind decisions
- Mention when you used AI tools (like Claude or GitHub Copilot) to help

Your background: You work in operations and data at a technology hardware company. You're teaching yourself Python, SQL, and development tools. You're not a traditional developer, but you're building anyway.

Based on the git diff provided, write a blog post that:
1. Starts with a clear title (as an H1 heading with #)
2. Explains what you built or changed
3. Shares why you made these changes
4. Mentions any challenges or learning moments
5. Keeps it concise and scannable (300-600 words)
6. Ends with a brief note about what's next

Write ONLY the blog post content with the title as the first line. Do not include any frontmatter or metadata."""

    user_prompt = f"""Here's the git diff from my latest commit. Write a blog post about what I changed and why:

```diff
{diff}
```

Remember: Write as me (Luis), in first person, focused on the journey and learning."""

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
    """Save the blog post as a markdown file with frontmatter."""
    # Extract title, tags, and clean content
    title, tags, main_content = extract_frontmatter(content)
    
    # Generate slug and filename
    date = datetime.now()
    date_str = date.strftime("%Y-%m-%d")
    slug = create_slug(title)
    filename = f"{date_str}-{slug}.md"
    
    # Create posts directory if it doesn't exist
    posts_dir = "posts"
    os.makedirs(posts_dir, exist_ok=True)
    
    filepath = os.path.join(posts_dir, filename)
    
    # Check if file already exists
    if os.path.exists(filepath):
        print(f"Blog post already exists: {filepath}")
        return
    
    # Format tags for frontmatter
    tags_str = ", ".join([f'"{tag}"' for tag in tags])
    
    # Create frontmatter
    frontmatter = f"""---
title: "{title}"
date: "{date_str}"
slug: "{slug}"
tags: [{tags_str}]
---

"""
    
    # Write the file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(frontmatter + main_content)
    
    print(f"✅ Blog post created: {filepath}")
    print(f"   Title: {title}")
    print(f"   Tags: {', '.join(tags)}")

def main():
    print("🤖 Auto-generating blog post from latest commit...")
    
    # Get the git diff
    diff = get_latest_commit_diff()
    if not diff:
        print("❌ No git diff found")
        return
    
    # Skip if diff is too small (likely not meaningful changes)
    if len(diff) < 50:
        print("⏭️  Diff too small, skipping blog post generation")
        return
    
    print(f"📝 Found diff with {len(diff)} characters")
    
    # Generate the blog post using Claude
    print("🧠 Calling Claude API to generate blog post...")
    blog_content = generate_blog_post(diff)
    
    if not blog_content:
        print("❌ Failed to generate blog post")
        return
    
    # Save the blog post
    save_blog_post(blog_content)
    print("✅ Done!")

if __name__ == "__main__":
    main()
