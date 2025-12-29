import { getAllPosts, getAllCategories } from '@/lib/posts';
import { BlogPageClient } from '@/components/BlogPageClient';

export default function BlogPage() {
    const posts = getAllPosts();
    const categories = getAllCategories();

    return <BlogPageClient posts={posts} categories={categories} />;
}
