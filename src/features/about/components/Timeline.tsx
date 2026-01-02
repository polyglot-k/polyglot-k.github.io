interface TimelineDetail {
    title: string;
    items?: string[];
}

interface TimelineItem {
    period: string;
    company: string;
    role?: string;
    details?: TimelineDetail[];
}

interface TimelineProps {
    items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    return (
        <div className="relative">
            {/* Single continuous vertical line */}
            <div
                className="absolute top-2 w-px bg-border left-[5px] md:left-[93px]"
                style={{
                    height: 'calc(100% - 16px)'
                }}
            />

            <div className="space-y-8">
                {items.map((item, index) => (
                    <div key={index} className="relative flex gap-4 items-start">
                        {/* Period - Hidden on mobile */}
                        <div className="hidden md:block md:w-[72px] flex-shrink-0 text-right">
                            <span className="text-xs text-muted-foreground tracking-tight">
                                {item.period}
                            </span>
                        </div>

                        {/* Dot container */}
                        <div className="w-[10px] flex-shrink-0 flex justify-center pt-1">
                            <div className="w-2.5 h-2.5 bg-background border-2 border-muted-foreground rounded-full z-10" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Mobile Period */}
                            <span className="block md:hidden text-xs text-muted-foreground mb-0.5">
                                {item.period}
                            </span>
                            <h3 className="text-sm font-semibold text-foreground leading-tight">
                                {item.company}
                            </h3>
                            {item.role && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {item.role}
                                </p>
                            )}

                            {item.details && item.details.length > 0 && (
                                <div className="mt-4 space-y-1">
                                    {item.details.map((detail, detailIndex) => (
                                        <div key={detailIndex} className={detail.items && detail.items.length > 0 && detailIndex > 0 ? "mt-5" : ""}>
                                            {/* title + items가 있으면 기존 스타일 */}
                                            {detail.items && detail.items.length > 0 ? (
                                                <div>
                                                    <p className="text-sm font-medium text-foreground/80 mb-2">
                                                        {detail.title}
                                                    </p>
                                                    <ul className="space-y-1">
                                                        {detail.items.map((detailItem, itemIndex) => (
                                                            <li key={itemIndex} className="flex items-center gap-2 text-xs text-muted-foreground leading-loose">
                                                                <span className="text-muted-foreground/50 flex-shrink-0">•</span>
                                                                <span className="break-words">{detailItem}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                /* title만 있으면 bullet 스타일 */
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground leading-loose">
                                                    <span className="text-muted-foreground/50 flex-shrink-0">•</span>
                                                    <span className="break-words">{detail.title}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
