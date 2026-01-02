import Link from 'next/link';

interface BlogCardProps {
    slug: string;
    title: string;
    description: string;
    date: string;
    category: string;
    tags?: string[];
    featured?: boolean;
    compact?: boolean;
}

export function BlogCard({ slug, title, description, date, category, tags, featured, compact }: BlogCardProps) {
    return (
        <Link href={`/blog/${slug}`} className="block group">
            <article className={`border-b border-border ${compact ? 'py-4' : 'py-6'} ${featured && !compact ? 'pb-8' : ''}`}>
                {/* Compact: Title + Date + Category */}
                {compact ? (
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="font-bold text-foreground group-hover:text-muted-foreground transition-colors truncate flex-1">
                            {title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0 text-xs text-muted-foreground">
                            <span>{date}</span>
                            <span>·</span>
                            <span>{category}</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Date + Category */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <time>{date}</time>
                            <span>·</span>
                            <span>{category}</span>
                        </div>

                        {/* Title */}
                        <h3 className={`font-bold text-foreground group-hover:text-muted-foreground transition-colors mt-2 mb-2 ${featured ? 'text-xl' : 'text-lg'}`}>
                            {title}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                            {description}
                        </p>

                        {/* Tags */}
                        {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 text-xs border border-border rounded-full text-muted-foreground"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </article>
        </Link>
    );
}
