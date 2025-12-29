'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { SocialLinks } from '@/components/SocialLinks';
import { siteConfig } from '@/lib/data';

const FOOD_EMOJIS = ['🍕', '🍔', '🍟', '🌭', '🍱', '🍣', '🍙', '🍗', '🍜', '🍩', '🍦'];

export function Introduction() {
    const [clickCount, setClickCount] = useState(0);
    const [isHungry, setIsHungry] = useState(false);
    const [fallingEmojis, setFallingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);

    const handleProfileClick = () => {
        setClickCount(prev => prev + 1);

        // 클릭할 때마다 고퍼가 살짝 들썩이는 효과 (isHungry 상태 활용 가능)
        if (clickCount + 1 >= 7) {
            triggerEasterEgg();
            setClickCount(0);
        }
    };

    const triggerEasterEgg = () => {
        setIsHungry(true);
        const newEmojis = Array.from({ length: 20 }).map((_, i) => ({
            id: Date.now() + i,
            emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
            left: Math.random() * 100
        }));
        setFallingEmojis(newEmojis);

        setTimeout(() => {
            setIsHungry(false);
            setFallingEmojis([]);
        }, 3000);
    };

    return (
        <section className="mb-12 p-4 md:p-6 border border-border/50 hover:border-foreground/20 hover:bg-muted/40 hover:shadow-sm hover:-translate-y-1 rounded-lg transition-all duration-500 group relative overflow-hidden">
            {/* Easter Egg Emojis */}
            {fallingEmojis.map((item) => (
                <span
                    key={item.id}
                    className="absolute top-[-2rem] text-2xl animate-fall select-none z-10"
                    style={{
                        left: `${item.left}%`,
                        animationDuration: `${Math.random() * 2 + 1}s`,
                        animationDelay: `${Math.random() * 0.5}s`
                    }}
                >
                    {item.emoji}
                </span>
            ))}

            <div className="flex items-center gap-4 mb-4">
                <div
                    onClick={handleProfileClick}
                    className={`relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 overflow-hidden rounded-full border border-border bg-muted cursor-pointer transition-transform active:scale-95 ${isHungry ? 'animate-bounce' : ''}`}
                >
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

            {isHungry && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[1px] pointer-events-none">
                    <span className="text-4xl font-bold animate-pulse text-foreground/40">배고파요!! 🍖</span>
                </div>
            )}
        </section>
    );
}

