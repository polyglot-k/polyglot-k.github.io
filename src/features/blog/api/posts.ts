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

// 카테고리 폴더를 재귀적으로 탐색하여 모든 MDX 파일 찾기
function getAllMdxFiles(dir: string): { filePath: string; slug: string }[] {
    const results: { filePath: string; slug: string }[] = [];

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            // 하위 디렉토리 재귀 탐색
            results.push(...getAllMdxFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith('.mdx')) {
            // slug는 파일명에서 .mdx 제거
            const slug = item.name.replace(/\.mdx$/, '');
            results.push({ filePath: fullPath, slug });
        }
    }

    return results;
}

export function getAllPosts(): PostMeta[] {
    const mdxFiles = getAllMdxFiles(postsDirectory);

    const posts = mdxFiles
        .map(({ filePath, slug }) => {
            const fileContents = fs.readFileSync(filePath, 'utf8');
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

// slug로 MDX 파일 경로 찾기 (카테고리 폴더 지원)
function findPostPath(slug: string): string | null {
    const mdxFiles = getAllMdxFiles(postsDirectory);
    const found = mdxFiles.find(f => f.slug === slug);
    return found ? found.filePath : null;
}

export function getPostBySlug(slug: string): Post | null {
    try {
        const fullPath = findPostPath(slug);
        if (!fullPath) return null;

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

export function getAllTags(): string[] {
    const posts = getAllPosts();
    const tags = new Set(posts.flatMap((post) => post.tags));
    return Array.from(tags);
}
