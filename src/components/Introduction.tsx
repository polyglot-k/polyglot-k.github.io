'use client';

import Image from 'next/image';
import { SocialLinks } from '@/components/SocialLinks';
import { siteConfig } from '@/lib/data';

export function Introduction() {
    return (
        <section className="mb-12 p-4 md:p-6 border border-border rounded-lg">
            <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                    <Image
                        src="/profile.png"
                        alt={siteConfig.author.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">{siteConfig.author.name}</h1>
                    <p className="text-base md:text-lg text-muted-foreground/80 font-medium">Software Engineer</p>
                </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-4 break-keep">
                {siteConfig.author.bio}
            </p>
            <SocialLinks github={siteConfig.links.github} linkedin={siteConfig.links.linkedin} />
        </section>
    );
}
