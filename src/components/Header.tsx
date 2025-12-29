'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navItems = [
    { href: '/', label: '홈' },
    { href: '/about', label: '소개' },
    { href: '/blog', label: '블로그' },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex h-14 items-center justify-between border-b">
                    <Link href="/" className="text-base font-semibold text-foreground">
                        배고픈 개발자의 생존일기
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Navigation - only render after mount to avoid hydration issues */}
                    {mounted ? (
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" className="h-9 px-2 flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                                <div className="p-6 border-b bg-muted/30">
                                    <SheetTitle className="text-left font-bold text-xl">Menu</SheetTitle>
                                </div>
                                <nav className="flex flex-col p-4">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-center justify-between py-4 px-2 border-b border-border/40 hover:bg-muted/50 rounded-lg transition-all"
                                        >
                                            <span className="text-lg font-medium text-foreground/80 group-hover:text-primary transition-colors">
                                                {item.label}
                                            </span>
                                            <span className="text-muted-foreground/40 group-hover:text-primary/40 group-hover:translate-x-1 transition-all">
                                                →
                                            </span>
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    ) : (
                        <Button variant="ghost" className="h-9 px-2 flex items-center gap-2 text-muted-foreground hover:text-foreground md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="text-sm font-medium">MENU</span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
