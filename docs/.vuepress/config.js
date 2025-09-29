const fs = require("fs");
const path = require("path");

// posts 폴더의 마크다운 파일들을 자동으로 읽어서 children 배열 생성
function getPostChildren() {
    const postsDir = path.resolve(__dirname, "../posts");

    try {
        const files = fs
            .readdirSync(postsDir)
            .filter((file) => file.endsWith(".md"))
            .sort((a, b) => b.localeCompare(a));
        return files;
    } catch (error) {
        console.warn("포스트 디렉토리를 읽을 수 없습니다:", error.message);
        return [];
    }
}

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
                    children: getPostChildren(),
                },
            ],
        },
    },
};
