import Link from 'next/link';
import React from 'react';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/features/blog/api/posts';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { TableOfContents } from '@/features/blog/components/TableOfContents';
import { CodeBlock } from '@/features/blog/components/CodeBlock';
import { Giscus } from '@/features/blog/components/Giscus';
import { ChevronLeft, ChevronRight, Info, Lightbulb, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    const url = `https://polyglot-k.github.io/blog/${slug}`;

    return {
        title: post.title,
        description: post.description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.description,
            url: url,
            siteName: '배고픈 개발자의 생존일기',
            locale: 'ko_KR',
            publishedTime: post.date,
            authors: ['polyglot-k'],
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
        },
        keywords: post.tags,
    };
}

const mdxOptions = {
    remarkPlugins: [remarkGfm, remarkBreaks, remarkAlert],
    rehypePlugins: [rehypeHighlight, rehypeSlug],
};

const alertIcons = {
    note: Info,
    tip: Lightbulb,
    important: AlertCircle,
    warning: AlertTriangle,
    caution: ShieldAlert,
};

const components: MDXRemoteProps['components'] = {
    pre: (props) => (
        <CodeBlock className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto my-6">
            {props.children}
        </CodeBlock>
    ),
    h1: (props) => (
        <h1 className="text-2xl md:text-3xl font-bold mt-12 mb-6 pb-4 border-b border-border text-foreground" {...props} />
    ),
    h2: (props) => (
        <h2 className="text-xl md:text-2xl font-bold mt-10 mb-4 text-foreground" {...props} />
    ),
    h3: (props) => (
        <h3 className="text-lg md:text-xl font-bold mt-8 mb-3 text-foreground" {...props} />
    ),
    p: (props) => (
        <p className="text-muted-foreground leading-8 mb-6 text-[17px]" {...props} />
    ),
    ul: (props) => (
        <ul className="list-disc pl-6 my-6 space-y-2 leading-7" {...props} />
    ),
    ol: (props) => (
        <ol className="list-decimal pl-6 my-6 space-y-2 leading-7" {...props} />
    ),
    li: (props) => (
        <li className="text-muted-foreground pl-1" {...props} />
    ),
    blockquote: (props) => {
        const className = props.className || '';
        const isAlert = className.includes('markdown-alert');

        if (isAlert) {
            const typeMatch = className.match(/markdown-alert-(\w+)/);
            const type = typeMatch ? typeMatch[1] : 'note';
            const Icon = alertIcons[type as keyof typeof alertIcons] || Info;

            const childrenArray = React.Children.toArray(props.children);
            const titleElement = childrenArray[0] as React.ReactElement<{ children: React.ReactNode }>;
            const contentElements = childrenArray.slice(1);

            // Strip SVGs (potential icons) from the title
            const titleChildren = React.Children.toArray(titleElement.props.children).filter(
                (child) => typeof child === 'string' || (React.isValidElement(child) && child.type !== 'svg')
            );

            return (
                <div className={className}>
                    <div className="markdown-alert-title">
                        {type}
                    </div>
                    {contentElements}
                </div>
            );
        }

        return (
            <blockquote
                className="border-l-[3px] border-primary bg-muted/30 pl-7 pr-6 py-3 rounded-r-lg text-muted-foreground my-8"
                {...props}
            />
        );
    },
    a: (props) => (
        <a className="text-primary font-medium underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all" {...props} />
    ),
    strong: (props) => (
        <strong className="font-bold text-foreground" {...props} />
    ),
    hr: (props) => (
        <hr className="my-8 border-border" {...props} />
    ),
    table: (props) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className="w-full text-sm" {...props} />
        </div>
    ),
    th: (props) => (
        <th className="border-b border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />
    ),
    td: (props) => (
        <td className="border-b border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props} />
    ),
};

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
            <article>
                <header className="mb-8">
                    <Link
                        href="/blog"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← 블로그로 돌아가기
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">{post.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                        <time>{post.date}</time>
                        <span>·</span>
                        <span>{post.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 text-xs border border-border rounded-full text-muted-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Table of Contents */}
                <TableOfContents items={post.toc} />

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <MDXRemote
                        source={post.content}
                        options={{ mdxOptions }}
                        components={components}
                    />
                </div>
            </article>

            {/* Post Navigation */}
            <nav className="mt-16 pt-8 border-t border-border">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {post.navigation.prev ? (
                        <Link
                            href={`/blog/${post.navigation.prev.slug}`}
                            className="flex-1 group p-4 border border-border rounded-lg hover:border-foreground transition-colors"
                        >
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <ChevronLeft className="w-3 h-3" />
                                <span>이전 글</span>
                            </div>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {post.navigation.prev.title}
                            </p>
                        </Link>
                    ) : (
                        <div className="flex-1 hidden md:block" />
                    )}

                    {post.navigation.next ? (
                        <Link
                            href={`/blog/${post.navigation.next.slug}`}
                            className="flex-1 group p-4 border border-border rounded-lg hover:border-foreground transition-colors text-right"
                        >
                            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mb-1">
                                <span>다음 글</span>
                                <ChevronRight className="w-3 h-3" />
                            </div>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {post.navigation.next.title}
                            </p>
                        </Link>
                    ) : (
                        <div className="flex-1 hidden md:block" />
                    )}
                </div>
            </nav>

            {/* Comments */}
            <Giscus />
        </div>
    );
}
