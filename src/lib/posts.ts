import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostMeta {
    slug: string;
    title: string;
    description: string;
    date: string;
    category: string;
    tags: string[];
}

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

export interface PostNavigation {
    prev: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
}

export interface Post extends PostMeta {
    content: string;
    toc: TocItem[];
    navigation: PostNavigation;
}

export function getAllPosts(): PostMeta[] {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                title: data.title,
                description: data.description,
                date: data.date,
                category: data.category,
                tags: data.tags || [],
            };
        })
        .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

    return posts;
}

function extractToc(content: string): TocItem[] {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const toc: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        // GitHub slugger style
        const id = text
            .toLowerCase()
            .replace(/[^\w\s가-힣-]/g, '')
            .replace(/\s+/g, '-');

        toc.push({ id, text, level });
    }

    return toc;
}

export function getPostBySlug(slug: string): Post | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const toc = extractToc(content);

        // 이전/다음 포스트 찾기
        const allPosts = getAllPosts();
        const currentIndex = allPosts.findIndex(p => p.slug === slug);

        const navigation: PostNavigation = {
            prev: currentIndex < allPosts.length - 1
                ? { slug: allPosts[currentIndex + 1].slug, title: allPosts[currentIndex + 1].title }
                : null,
            next: currentIndex > 0
                ? { slug: allPosts[currentIndex - 1].slug, title: allPosts[currentIndex - 1].title }
                : null,
        };

        return {
            slug,
            title: data.title,
            description: data.description,
            date: data.date,
            category: data.category,
            tags: data.tags || [],
            content,
            toc,
            navigation,
        };
    } catch {
        return null;
    }
}

export function getAllCategories(): string[] {
    const posts = getAllPosts();
    const categories = new Set(posts.map((post) => post.category));
    return Array.from(categories);
}
