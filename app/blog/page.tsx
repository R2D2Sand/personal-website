import { getAllPosts, formatDate } from "@/lib/posts";
import Link from "next/link";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <div className="max-w-2xl w-full mt-12">
        <Link href="/" className="text-blue-400 hover:underline text-sm">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mt-6 mb-2">Blog</h1>
        <p className="text-gray-400 mb-10">
          Documenting my journey building an AI trading bot from scratch.
        </p>

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="border border-gray-700 rounded-lg p-6 hover:border-blue-400 transition-colors"
            >
              <p className="text-sm text-gray-500 mb-1">{formatDate(post.date)}</p>
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <div className="flex gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}