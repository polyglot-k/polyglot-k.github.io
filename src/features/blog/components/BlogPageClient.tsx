'use client';

import { useState, useMemo, useEffect } from 'react';
import { BlogCard } from '@/features/blog/components/BlogCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Filter, X, ChevronDown, RotateCcw } from 'lucide-react';
import type { PostMeta } from '@/features/blog/api/posts';

const STORAGE_KEY = 'blog-show-details';
const POSTS_PER_PAGE = 10;
const TAGS_PER_VIEW = 10;

interface BlogPageClientProps {
    posts: PostMeta[];
    categories: string[];
    tags: string[];
    categoryCounts: Record<string, number>;
}

export function BlogPageClient({ posts, categories, tags, categoryCounts }: BlogPageClientProps) {
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

    // 선택된 카테고리 기준으로 태그 필터링
    const filteredTags = useMemo(() => {
        if (!selectedCategory) return tags;

        const categoryPosts = posts.filter(post => post.category === selectedCategory);
        const tagsInCategory = new Set(categoryPosts.flatMap(post => post.tags));
        return tags.filter(tag => tagsInCategory.has(tag));
    }, [posts, tags, selectedCategory]);

    // 카테고리 변경 시 유효하지 않은 태그 자동 제거
    useEffect(() => {
        if (selectedTags.length > 0) {
            const validTags = selectedTags.filter(tag => filteredTags.includes(tag));
            if (validTags.length !== selectedTags.length) {
                setSelectedTags(validTags);
            }
        }
    }, [filteredTags, selectedTags]);

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
            <div className="max-w-2xl mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">Blog</h1>
                    <p className="text-sm text-muted-foreground">
                        개발과 기술에 대한 이야기
                    </p>
                </header>
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-muted rounded" />
                    <div className="flex gap-2">
                        <div className="h-8 w-20 bg-muted rounded-full" />
                        <div className="h-8 w-24 bg-muted rounded-full" />
                        <div className="h-8 w-20 bg-muted rounded-full" />
                    </div>
                    <div className="h-20 bg-muted rounded" />
                    <div className="h-20 bg-muted rounded" />
                </div>
            </div>
        );
    }

    const activeFilterCount = selectedTags.length;
    const visibleTags = filteredTags.slice(0, visibleTagsCount);
    const hasMoreTags = visibleTagsCount < filteredTags.length;

    const handleLoadMoreTags = () => {
        setVisibleTagsCount(prev => Math.min(prev + TAGS_PER_VIEW, tags.length));
    };

    return (
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16">
            <header className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Blog</h1>
                <p className="text-sm text-muted-foreground">
                    개발과 기술에 대한 이야기
                </p>
            </header>

            {/* Search and Filter */}
            <div className="flex gap-2 mb-4">
                <Input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-10 bg-background border-input focus:ring-1 focus:ring-foreground"
                />
                <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 relative border-input hover:bg-accent hover:text-accent-foreground">
                            <Filter className="h-4 w-4" />
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] text-background font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md w-[95vw] rounded-xl overflow-hidden flex flex-col max-h-[85vh] p-0 gap-0 bg-background">
                        <DialogHeader className="px-6 py-4 border-b border-border">
                            <DialogTitle className="text-lg font-bold">태그 필터</DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                            {/* Tags Filter */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-foreground">
                                    태그
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {visibleTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 text-xs border rounded-md transition-all duration-200 ${selectedTags.includes(tag)
                                                ? 'bg-foreground text-background border-foreground font-medium'
                                                : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
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
                                        className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground h-9 border border-dashed border-border hover:border-foreground/50 hover:bg-transparent"
                                    >
                                        더보기 <ChevronDown className="ml-1 h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-border bg-muted/5 flex gap-3 items-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedTags([]);
                                }}
                                className="h-11 px-4 border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                초기화
                            </Button>
                            <Button
                                className="flex-1 h-11 bg-foreground text-background hover:bg-foreground/90 font-medium text-base rounded-lg"
                                onClick={() => setIsFilterOpen(false)}
                            >
                                {filteredPosts.length}개 결과 보기
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${!selectedCategory
                        ? 'bg-foreground text-background font-medium'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                >
                    전체 ({posts.length})
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${selectedCategory === category
                            ? 'bg-foreground text-background font-medium'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {category} ({categoryCounts[category] || 0})
                    </button>
                ))}
            </div>

            {/* Active Tags Display */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground w-full mb-1">
                        <span className="font-medium text-foreground">선택된 태그:</span>
                        <button
                            onClick={() => setSelectedTags([])}
                            className="text-xs underline hover:text-foreground ml-auto"
                        >
                            모두 지우기
                        </button>
                    </div>
                    {selectedTags.map(tag => (
                        <div key={tag} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border text-xs font-medium shadow-sm">
                            <span className="text-muted-foreground">#</span>
                            <span className="text-foreground">{tag}</span>
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
                    className="w-4 h-4 rounded border-border accent-foreground cursor-pointer focus:ring-0"
                />
                <label htmlFor="showDetails" className="text-sm text-muted-foreground cursor-pointer select-none group-hover:text-foreground transition-colors">
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
                            className="mt-2 text-foreground underline-offset-4"
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
                        className="border-border"
                    >
                        이전
                    </Button>
                    <span className="text-sm font-medium text-foreground px-4">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="border-border"
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
}
