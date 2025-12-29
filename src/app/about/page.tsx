import { Timeline } from '@/components/Timeline';
import { Introduction } from '@/components/Introduction';
import { skillsData, careerData, activityData, opensourceData, awardsData } from '@/lib/data';

export default function AboutPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16">
            {/* Introduction Section */}
            <Introduction />

            {/* Skills Section */}
            <section className="mb-12">
                <h2 className="text-lg font-bold mb-4">Skill</h2>
                <div className="space-y-6">
                    {skillsData.map((group) => (
                        <div key={group.category} className="flex flex-col md:flex-row gap-2 md:gap-16">
                            <div className="w-full md:w-32 flex-shrink-0">
                                <span className="text-sm font-medium text-foreground">
                                    {group.category}
                                </span>
                            </div>
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                                {group.skills.flat().map((skill, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                        <span className="text-muted-foreground/50">·</span>
                                        <span className="truncate">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Career Timeline Section */}
            <section className="mb-12">
                <h2 className="text-lg font-bold mb-4">Career</h2>
                <Timeline items={careerData} />
            </section>

            {/* Activity Timeline Section */}
            <section className="mb-12">
                <h2 className="text-lg font-bold mb-4">Activity</h2>
                <Timeline items={activityData} />
            </section>

            {/* Opensource Section */}
            <section className="mb-12">
                <h2 className="text-lg font-bold mb-4">Opensource</h2>
                <Timeline items={opensourceData} />
            </section>

            {/* Publications Section */}
            <section className="mb-12">
                <h2 className="text-lg font-bold mb-4">Publications</h2>
                <div className="space-y-3">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-foreground text-sm font-medium md:font-normal truncate">
                                RAG와 CoVe 기법을 활용한 LLM의 환각 현상 감소 연구
                            </span>
                            <span className="text-muted-foreground text-xs flex-shrink-0">
                                2024
                            </span>
                        </div>
                        <span className="text-muted-foreground text-xs truncate">
                            (한국정보기술학회, 한국컴퓨터정보학회)
                        </span>
                    </div>
                </div>
            </section>

            {/* Awards Section */}
            <section className="mb-12">
                <h2 className="text-lg font-bold mb-4">Awards</h2>
                <div className="space-y-3">
                    {awardsData.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-0.5">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-foreground text-sm font-medium md:font-normal truncate">
                                        {item.title}
                                    </span>
                                    <span className="text-foreground text-xs font-semibold flex-shrink-0">
                                        {item.award}
                                    </span>
                                </div>
                                <span className="text-muted-foreground text-xs flex-shrink-0">
                                    {item.year}
                                </span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <span className="truncate">({item.org})</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section>
                <h2 className="text-lg font-bold mb-4">Education</h2>
                <div className="space-y-3">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-foreground text-sm font-medium md:font-normal truncate">
                                경북대학교
                            </span>
                            <span className="text-muted-foreground text-xs flex-shrink-0">
                                2023.03 - 2026.02
                            </span>
                        </div>
                        <span className="text-muted-foreground text-xs truncate">
                            컴퓨터학부 (졸업예정)
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-foreground text-sm font-medium md:font-normal truncate">
                                인제대학교
                            </span>
                            <span className="text-muted-foreground text-xs flex-shrink-0">
                                2019.03 - 2023.02
                            </span>
                        </div>
                        <span className="text-muted-foreground text-xs truncate">
                            컴퓨터공학과 (중퇴)
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}
