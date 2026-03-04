import { getPostBySlug, getAllPosts, formatDate } from "@/lib/posts";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();
  
  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <div className="max-w-2xl w-full mt-12">
        <Link href="/blog" className="text-blue-400 hover:underline text-sm">
          ← Back to Blog
        </Link>

        <p className="text-gray-500 text-sm mt-6">{formatDate(post.date)}</p>
        <h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>

        <div className="flex gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </main>
  );
}