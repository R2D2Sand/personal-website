import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function formatDate(dateString: string) {
  const normalizedDateString = dateString?.trim() || "";
  if (!normalizedDateString) return "";

  const date = new Date(normalizedDateString + "T00:00:00");
  if (Number.isNaN(date.getTime())) return normalizedDateString;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Where your markdown posts live
const postsDirectory = path.join(process.cwd(), "posts");

function getMarkdownFilePaths(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFilePaths(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      return [fullPath];
    }

    return [];
  });
}

// Get all posts sorted by date (newest first)
export function getAllPosts() {
  const filePaths = getMarkdownFilePaths(postsDirectory);

  const posts = filePaths
    .map((fullPath) => {
      const slug = path.basename(fullPath, ".md");
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        tags: data.tags || [],
      };
    });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Get a single post by slug
export function getPostBySlug(slug: string) {
  const fullPath = getMarkdownFilePaths(postsDirectory).find(
    (filePath) => path.basename(filePath, ".md") === slug
  );

  if (!fullPath) {
    throw new Error(`Post not found for slug: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    content,
  };
}
