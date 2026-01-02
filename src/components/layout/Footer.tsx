import Link from 'next/link';

export function Footer() {
    return (
        <footer>
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-4 py-8 md:h-16 md:flex-row md:py-0 border-t">
                    <p className="text-center text-xs text-muted-foreground md:text-left">
                        © {new Date().getFullYear()} My Blog. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/about"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            소개
                        </Link>
                        <Link
                            href="/blog"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            블로그
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
