import { getAllPosts, getAllCategories, getAllTags } from '@/features/blog/api/posts';
import { BlogPageClient } from '@/features/blog/components/BlogPageClient';

export default function BlogPage() {
    const posts = getAllPosts();
    const categories = getAllCategories();
    const tags = getAllTags();

    return <BlogPageClient posts={posts} categories={categories} tags={tags} />;
}
