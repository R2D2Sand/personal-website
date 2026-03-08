---
title: "Cleaning Up: Why I Removed a Duplicate Header"
date: "2026-03-08"
slug: "cleaning-up-why-i-removed-a-duplicate-header"
tags: ["trading", "ai", "api"]
---

Today I made a tiny but important change to my first blog post - I removed a duplicate header that was creating formatting issues.

## What I Fixed

Looking at my markdown file for the "Day One" post, I noticed something that was bugging me. I had the title "Hello World: I Built a Trading Bot and a Blog to Prove It" appearing twice - once in the frontmatter metadata and once as an H1 heading in the actual content. This was causing the title to show up redundantly when the blog post rendered.

So I deleted the duplicate H1 heading (`# Hello World: I Built a Trading Bot and a Blog to Prove It`) from the markdown content, keeping only the version in the frontmatter.

## Why This Matters

This might seem like a trivial change, but it highlights something I'm learning about static site generators and markdown. The frontmatter (that YAML block at the top between the `---` lines) contains metadata that the site generator uses to create the actual page. The `title` field there becomes the page title and main heading automatically.

When I was writing that first post, I was thinking like someone writing a Word document - of course you put a heading at the top! But in markdown for static sites, that creates redundancy. The build system was essentially rendering:

```
Hello World: I Built a Trading Bot and a Blog to Prove It
# Hello World: I Built a Trading Bot and a Blog to Prove It
```

Which looked weird and unprofessional.

## The Learning Moment

This is exactly the kind of mistake I expected to make as someone coming from operations rather than web development. I understand the logic of databases and data flows, but the conventions of web development are still new to me.

I caught this while reviewing my site locally before pushing more content. It's a good reminder to always check how things actually render, not just how they look in the markdown file.

These small details matter when you're building in public. If I'm going to document this entire trading bot journey, I want the documentation itself to be clean and professional.

## What's Next

Now that I've got the basic formatting cleaned up, I'm ready to push forward with the actual trading bot development. Next up: setting up my development environment properly and making my first API calls to Alpaca. The real coding starts now.