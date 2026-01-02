'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { SocialLinks } from '@/components/common/SocialLinks';
import { siteConfig } from '@/shared/config/site';
import { sendGAEvent } from '@next/third-parties/google';

const FOOD_EMOJIS = ['🍕', '🍔', '🍟', '🌭', '🍱', '🍣', '🍙', '🍗', '🍜', '🍩', '🍦'];
const SKULL_EMOJIS = ['💀', '☠️', '🦴', '👻', '🪦', '⚰️', '🖤'];

const PROFILE_STORAGE_KEY = 'profile_state';
const PROFILE_TIMESTAMP_KEY = 'profile_full_timestamp';
const PROFILE_TTL_MS = 30 * 1000; // 30초

export function Introduction() {
    const [clickCount, setClickCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationMessage, setAnimationMessage] = useState('');
    const [fallingEmojis, setFallingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);
    const [isSectionHovered, setIsSectionHovered] = useState(false);
    const [isFull, setIsFull] = useState(false); // false: 기본(profile1/2), true: 배부름(profile3/4)

    // localStorage에서 프로필 상태 불러오기 (TTL 체크)
    useEffect(() => {
        const savedState = localStorage.getItem(PROFILE_STORAGE_KEY);
        const savedTimestamp = localStorage.getItem(PROFILE_TIMESTAMP_KEY);

        if (savedState === 'full' && savedTimestamp) {
            const timestamp = parseInt(savedTimestamp, 10);
            const now = Date.now();

            if (now - timestamp < PROFILE_TTL_MS) {
                // TTL 내: 배부름 상태 유지
                setIsFull(true);

                // 남은 시간 후 자동 복구
                const remainingTime = PROFILE_TTL_MS - (now - timestamp);
                const timer = setTimeout(() => {
                    setIsFull(false);
                    localStorage.removeItem(PROFILE_STORAGE_KEY);
                    localStorage.removeItem(PROFILE_TIMESTAMP_KEY);
                }, remainingTime);

                return () => clearTimeout(timer);
            } else {
                // TTL 만료: 기본 상태로 복구
                localStorage.removeItem(PROFILE_STORAGE_KEY);
                localStorage.removeItem(PROFILE_TIMESTAMP_KEY);
            }
        }
    }, []);

    // 프로필 상태 저장 (타임스탬프 포함)
    const saveProfileState = (full: boolean) => {
        if (full) {
            localStorage.setItem(PROFILE_STORAGE_KEY, 'full');
            localStorage.setItem(PROFILE_TIMESTAMP_KEY, Date.now().toString());
        } else {
            localStorage.removeItem(PROFILE_STORAGE_KEY);
            localStorage.removeItem(PROFILE_TIMESTAMP_KEY);
        }
    };

    const handleProfileClick = () => {
        // 애니메이션 중에는 클릭 무시
        if (isAnimating) return;

        setClickCount(prev => prev + 1);

        if (clickCount + 1 >= 7) {
            triggerEasterEgg();
            setClickCount(0);
        }
    };

    const triggerEasterEgg = () => {
        setIsAnimating(true);

        if (!isFull) {
            // 기본 상태 → 배부름 상태로 전환
            setIsFull(true);
            saveProfileState(true);
            setAnimationMessage('배불렁!! 🍖');

            sendGAEvent('event', 'easter_egg_found', {
                value: 'full_gopher',
                label: '배불렁'
            });

            const newEmojis = Array.from({ length: 20 }).map((_, i) => ({
                id: Date.now() + i,
                emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
                left: Math.random() * 100
            }));
            setFallingEmojis(newEmojis);
        } else {
            // 배부름 상태 → 그대로 유지하면서 "그만" 애니메이션만 실행
            setAnimationMessage('그만!! 💀');

            sendGAEvent('event', 'easter_egg_found', {
                value: 'stop_gopher',
                label: '그만'
            });

            const newEmojis = Array.from({ length: 20 }).map((_, i) => ({
                id: Date.now() + i,
                emoji: SKULL_EMOJIS[Math.floor(Math.random() * SKULL_EMOJIS.length)],
                left: Math.random() * 100
            }));
            setFallingEmojis(newEmojis);
        }

        setTimeout(() => {
            setIsAnimating(false);
            setFallingEmojis([]);
            setAnimationMessage('');
        }, 3000);
    };

    // 현재 상태에 따른 프로필 이미지 결정
    const getProfileImage = () => {
        if (isFull) {
            return isSectionHovered ? "/profile4.png" : "/profile3.png";
        }
        return isSectionHovered ? "/profile2.png" : "/profile.png";
    };

    // 커서는 항상 도넛
    const getCursorEmoji = () => {
        return '🍩';
    };

    return (
        <section
            className="mb-12 p-4 md:p-6 border border-border/50 hover:border-foreground/20 hover:bg-muted/40 hover:shadow-sm hover:-translate-y-1 rounded-lg transition-all duration-500 group relative overflow-hidden"
            style={{ cursor: isSectionHovered ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size:24px'><text y='24'>${getCursorEmoji()}</text></svg>"), auto` : 'default' }}
            onMouseEnter={() => setIsSectionHovered(true)}
            onMouseLeave={() => setIsSectionHovered(false)}
        >
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
                    className={`relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 overflow-hidden rounded-full border border-border bg-muted transition-transform active:scale-95 ${isAnimating ? 'animate-bounce' : ''}`}
                    style={{ cursor: isSectionHovered ? 'inherit' : 'pointer' }}
                >
                    <Image
                        src={getProfileImage()}
                        alt={siteConfig.author.name}
                        fill
                        className="object-cover transition-all duration-300"
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

            {isAnimating && animationMessage && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[1px] pointer-events-none">
                    <span className="text-4xl font-bold animate-pulse text-foreground/40">{animationMessage}</span>
                </div>
            )}
        </section>
    );
}
