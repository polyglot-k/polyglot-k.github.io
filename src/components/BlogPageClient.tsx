'use client';

import { useState, useMemo, useEffect } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { PostMeta } from '@/lib/posts';

const STORAGE_KEY = 'blog-show-details';
const POSTS_PER_PAGE = 10;

interface BlogPageClientProps {
    posts: PostMeta[];
    categories: string[];
}

export function BlogPageClient({ posts, categories }: BlogPageClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // localStorage에서 상태 불러오기
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        setShowDetails(stored === 'true');
    }, []);

    // 상태 변경 시 localStorage에 저장
    const handleShowDetailsChange = (checked: boolean) => {
        setShowDetails(checked);
        localStorage.setItem(STORAGE_KEY, String(checked));
    };

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || post.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [posts, searchQuery, selectedCategory]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    // 검색/필터 변경 시 첫 페이지로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    // 초기 로딩 중에는 스켈레톤 표시
    if (showDetails === null) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">Blog</h1>
                    <p className="text-sm text-muted-foreground">
                        개발과 기술에 대한 이야기
                    </p>
                </header>
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-muted rounded" />
                    <div className="flex gap-2">
                        <div className="h-8 w-16 bg-muted rounded-full" />
                        <div className="h-8 w-16 bg-muted rounded-full" />
                        <div className="h-8 w-20 bg-muted rounded-full" />
                    </div>
                    <div className="h-20 bg-muted rounded" />
                    <div className="h-20 bg-muted rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
            <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Blog</h1>
                <p className="text-sm text-muted-foreground">
                    개발과 기술에 대한 이야기
                </p>
            </header>

            {/* Search */}
            <div className="mb-6">
                <Input
                    type="text"
                    placeholder="검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10"
                />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 text-sm border rounded-full transition-colors ${!selectedCategory
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                        }`}
                >
                    전체
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                        className={`px-3 py-1.5 text-sm border rounded-full transition-colors ${selectedCategory === category
                                ? 'bg-foreground text-background border-foreground'
                                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Detail Toggle */}
            <div className="flex items-center gap-2 mb-6">
                <input
                    type="checkbox"
                    id="showDetails"
                    checked={showDetails}
                    onChange={(e) => handleShowDetailsChange(e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-foreground"
                />
                <label htmlFor="showDetails" className="text-sm text-muted-foreground cursor-pointer">
                    자세히 보기
                </label>
            </div>

            {/* Posts */}
            <div>
                {paginatedPosts.map((post, index) => (
                    <BlogCard key={post.slug} {...post} featured={currentPage === 1 && index === 0} compact={!showDetails} />
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <p className="text-muted-foreground py-10">
                    검색 결과가 없습니다.
                </p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        이전
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
}
