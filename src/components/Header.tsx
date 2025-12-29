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
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sticky wrapper to keep position, inner div for visual styles?
    // Actually applying styles to the header tag itself tracking `sticky` behavior might be tricky if "sticky" is what triggers the visual change.
    // User said: "When it starts following (sticky point), give it shadow/shade".
    // Since we used `sticky top-4`, it starts sticking when scroll reaches top-4.
    // Actually, `sticky` stays in flow until scrolled to.
    // If it's at the very top (mt-4 or whatever), `scrollY` reflects that.
    // Let's assume when scrollY > 0 or small threshold, we trigger the "floating active" look.

    return (
        <header
            className={`sticky top-0 z-50 w-full max-w-[40rem] mx-auto mb-2 transition-all duration-300 ease-in-out border rounded-md ${isScrolled
                ? 'bg-background/5 backdrop-blur-sm border-border shadow-lg supports-[backdrop-filter]:bg-background/5'
                : 'bg-transparent border-border/50 shadow-none backdrop-blur-none'
                }`}
        >
            <div className="px-6">
                <div className="flex h-14 items-center justify-between">
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
