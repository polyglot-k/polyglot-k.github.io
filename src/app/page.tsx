import Link from 'next/link';
import { BlogCard } from '@/components/BlogCard';
import { Introduction } from '@/components/Introduction';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
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
