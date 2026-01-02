'use client';

import { useState, ReactNode } from 'react';

interface CodeBlockProps {
    children: ReactNode;
    className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const getCodeText = (node: ReactNode): string => {
        if (typeof node === 'string') return node;
        if (Array.isArray(node)) return node.map(getCodeText).join('');
        if (node && typeof node === 'object' && 'props' in node) {
            return getCodeText((node as { props: { children: ReactNode } }).props.children);
        }
        return '';
    };

    const handleCopy = () => {
        const code = getCodeText(children);
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                type="button"
            >
                {copied ? '복사됨!' : '복사'}
            </button>
            <pre className={className}>{children}</pre>
        </div>
    );
}
