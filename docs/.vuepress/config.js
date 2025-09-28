module.exports = {
    base: "/",
    title: "Polyglot-K의 블로그",
    description: "다양한 도전을 즐기는 개발자 Polyglot-K의 블로그입니다.",
    head: [["link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" }]],
    themeConfig: {
        logo: "https://avatars.githubusercontent.com/u/126179088?v=4",
        sidebarDepth: 2,
        nav: [
            { text: "Home", link: "/" },
            { text: "Posts", link: "/posts/2025-08-25-spring-webflux-performance.html" },
        ],
        sidebar: {
            "/posts/": [
                {
                    title: "게시물 목록",
                    collapsable: false,
                    children: ["2025-07-15-text-based-real-time-streaming-virtual-interview.md", "2025-07-20-ice-breaking-platform.md", "2025-08-05-valkey-concurrency-issue.md", "2025-08-10-scheduler-mq-data-archiving.md", "2025-08-25-spring-webflux-performance.md"],
                },
            ],
        },
    },
};
