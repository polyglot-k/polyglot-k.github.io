module.exports = {
    base: "/",
    title: "나의 블로그",
    description: "VuePress로 만든 나의 멋진 블로그",
    head: [["link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" }]],
    themeConfig: {
        logo: "https://avatars.githubusercontent.com/u/126179088?v=4",
        sidebarDepth: 2,
        nav: [
            { text: "Home", link: "/" },
            { text: "Posts", link: "/posts/2025-09-28-second-post.html" },
        ],
        sidebar: {
            "/posts/": [
                {
                    title: "게시물 목록",
                    collapsable: false,
                    children: ["2025-09-27-first-post.md", "2025-09-28-second-post.md"],
                },
            ],
        },
    },
};
