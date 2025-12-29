import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-medium mt-4 mb-2">{children}</h3>
        ),
        p: ({ children }) => (
            <p className="text-base leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
        ),
        code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                {children}
            </pre>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                {children}
            </blockquote>
        ),
        a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline">
                {children}
            </a>
        ),
        ...components,
    };
}
