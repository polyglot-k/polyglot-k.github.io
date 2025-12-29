'use client';

import { useEffect, useRef } from 'react';

export function Giscus() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 이미 스크립트가 있으면 제거
        const existingScript = containerRef.current.querySelector('script');
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', 'polyglot-k/polyglot-k.github.io');
        script.setAttribute('data-repo-id', 'R_kgDOP31qBA');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'DIC_kwDOP31qBM4Cv84E');
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '0'); // 추천하기 비활성화
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'light');
        script.setAttribute('data-lang', 'ko');
        script.setAttribute('data-loading', 'lazy');
        script.crossOrigin = 'anonymous';
        script.async = true;

        containerRef.current.appendChild(script);

        return () => {
            if (containerRef.current) {
                const script = containerRef.current.querySelector('script');
                if (script) {
                    script.remove();
                }
            }
        };
    }, []);

    return (
        <section className="mt-16 pt-8 border-t border-border">
            <div ref={containerRef} />
        </section>
    );
}
