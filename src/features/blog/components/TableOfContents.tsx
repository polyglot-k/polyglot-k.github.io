'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { TocItem } from '@/features/blog/api/posts';

interface TableOfContentsProps {
    items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
    const [isOpen, setIsOpen] = useState(true);

    if (items.length === 0) return null;

    // 가장 낮은 레벨을 찾음 (보통 1 또는 2)
    const minLevel = Math.min(...items.map(item => item.level));

    return (
        <nav className="mb-8 border border-border rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-muted/50 hover:bg-muted transition-colors"
            >
                <span className="text-sm font-semibold text-foreground">목차</span>
                {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            {isOpen && (
                <ul className="px-4 py-3 space-y-2 bg-background">
                    {items.map((item, index) => {
                        const isTopLevel = item.level === minLevel;
                        const indent = (item.level - minLevel) * 16;

                        return (
                            <li
                                key={index}
                                className="flex items-center gap-2"
                                style={{ paddingLeft: `${indent}px` }}
                            >
                                {!isTopLevel && (
                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                )}
                                <a
                                    href={`#${item.id}`}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors block py-0.5"
                                >
                                    {item.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            )}
        </nav>
    );
}
