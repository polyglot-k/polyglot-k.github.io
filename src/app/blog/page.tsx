import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';
import { BlogPageClient } from '@/components/BlogPageClient';

export default function BlogPage() {
    const posts = getAllPosts();
    const categories = getAllCategories();
    const tags = getAllTags();

    return <BlogPageClient posts={posts} categories={categories} tags={tags} />;
}
