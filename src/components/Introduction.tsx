'use client';

import { SocialLinks } from '@/components/SocialLinks';
import { siteConfig } from '@/lib/data';

export function Introduction() {
    return (
        <section className="mb-12 p-4 md:p-6 border border-border rounded-lg">
            <h1 className="text-xl font-bold mb-1">{siteConfig.author.name}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-4 break-keep">
                {siteConfig.author.bio}
            </p>
            <SocialLinks github={siteConfig.links.github} linkedin={siteConfig.links.linkedin} />
        </section>
    );
}
