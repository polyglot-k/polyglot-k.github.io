import { getAllPosts, getAllCategories, getAllTags } from '@/features/blog/api/posts';
import { BlogPageClient } from '@/features/blog/components/BlogPageClient';

export default function BlogPage() {
    const posts = getAllPosts();
    const categories = getAllCategories();
    const tags = getAllTags();

    // 카테고리별 포스트 개수 계산
    const categoryCounts = categories.reduce((acc, category) => {
        acc[category] = posts.filter(post => post.category === category).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <BlogPageClient
            posts={posts}
            categories={categories}
            tags={tags}
            categoryCounts={categoryCounts}
        />
    );
}
