'use client';

import { useState, useMemo, useEffect } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Filter, X, ChevronDown } from 'lucide-react';
import type { PostMeta } from '@/lib/posts';

const STORAGE_KEY = 'blog-show-details';
const POSTS_PER_PAGE = 10;
const TAGS_PER_VIEW = 10;

interface BlogPageClientProps {
    posts: PostMeta[];
    categories: string[];
    tags: string[];
}

export function BlogPageClient({ posts, categories, tags }: BlogPageClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showDetails, setShowDetails] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Tag pagination state
    const [visibleTagsCount, setVisibleTagsCount] = useState(TAGS_PER_VIEW);

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

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedTags([]);
        setSearchQuery('');
    };

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !selectedCategory || post.category === selectedCategory;

            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => post.tags.includes(tag));

            return matchesSearch && matchesCategory && matchesTags;
        });
    }, [posts, searchQuery, selectedCategory, selectedTags]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    // 검색/필터 변경 시 첫 페이지로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedTags]);

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

    const activeFilterCount = (selectedCategory ? 1 : 0) + selectedTags.length;
    const visibleTags = tags.slice(0, visibleTagsCount);
    const hasMoreTags = visibleTagsCount < tags.length;

    const handleLoadMoreTags = () => {
        setVisibleTagsCount(prev => Math.min(prev + TAGS_PER_VIEW, tags.length));
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
            <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Blog</h1>
                <p className="text-sm text-muted-foreground">
                    개발과 기술에 대한 이야기
                </p>
            </header>

            {/* Search and Filter */}
            <div className="flex gap-2 mb-6">
                <Input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-10"
                />
                <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 relative">
                            <Filter className="h-4 w-4" />
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>필터</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-8">
                            {/* Category Filter */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    카테고리
                                </h3>
                                <div className="flex flex-wrap gap-2">
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
                            </div>

                            {/* Tags Filter */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    태그
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {visibleTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-2.5 py-1 text-xs border rounded-md transition-colors ${selectedTags.includes(tag)
                                                ? 'bg-primary/10 border-primary text-primary font-medium'
                                                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                                }`}
                                        >
                                            # {tag}
                                        </button>
                                    ))}
                                </div>
                                {hasMoreTags && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLoadMoreTags}
                                        className="w-full text-xs text-muted-foreground hover:text-foreground h-8"
                                    >
                                        더보기 <ChevronDown className="ml-1 h-3 w-3" />
                                    </Button>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4">
                                <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
                                    결과 보기 ({filteredPosts.length})
                                </Button>
                                {(selectedCategory || selectedTags.length > 0) && (
                                    <Button variant="outline" onClick={() => {
                                        setSelectedCategory(null);
                                        setSelectedTags([]);
                                    }}>
                                        초기화
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory || selectedTags.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground w-full mb-1">
                        <span className="font-medium text-foreground">적용된 필터:</span>
                        <button
                            onClick={() => { setSelectedCategory(null); setSelectedTags([]); }}
                            className="text-xs underline hover:text-foreground ml-auto"
                        >
                            모두 지우기
                        </button>
                    </div>
                    {selectedCategory && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-sm">
                            <span className="text-muted-foreground">카테고리:</span>
                            <span className="font-medium text-foreground">{selectedCategory}</span>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    {selectedTags.map(tag => (
                        <div key={tag} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-sm">
                            <span className="text-muted-foreground">#</span>
                            <span className="font-medium text-foreground">{tag}</span>
                            <button
                                onClick={() => toggleTag(tag)}
                                className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

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
                {paginatedPosts.length > 0 ? (
                    paginatedPosts.map((post, index) => (
                        <BlogCard key={post.slug} {...post} featured={currentPage === 1 && index === 0} compact={!showDetails} />
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-lg border border-border/50 border-dashed">
                        <p className="text-muted-foreground">
                            조건에 맞는 글이 없습니다.
                        </p>
                        <Button
                            variant="link"
                            onClick={clearFilters}
                            className="mt-2"
                        >
                            필터 초기화
                        </Button>
                    </div>
                )}
            </div>

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
