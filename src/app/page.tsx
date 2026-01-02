import Link from 'next/link';
import { BlogCard } from '@/features/blog/components/BlogCard';
import { Introduction } from '@/features/about/components/Introduction';
import { getAllPosts } from '@/features/blog/api/posts';

export default function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16">
      {/* Introduction Section */}
      <Introduction />

      {/* Recent Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">최근 게시물</h2>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            전체 보기 →
          </Link>
        </div>
        <div>
          {recentPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
}
