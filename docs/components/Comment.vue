<template>
    <div class="comment-section">
        <div id="giscus-container" ref="giscusContainer"></div>
    </div>
</template>

<script>
export default {
    name: "Comment",
    methods: {
        loadGiscus() {
            const giscusContainer = this.$refs.giscusContainer;
            if (!giscusContainer) return;

            // 기존 Giscus 스크립트가 있으면 제거
            const existingScript = document.querySelector('script[src*="giscus"]');
            if (existingScript) {
                existingScript.remove();
            }

            // Giscus 컨테이너 초기화
            giscusContainer.innerHTML = "";

            // 새 Giscus 스크립트 생성
            const script = document.createElement("script");
            script.src = "https://giscus.app/client.js";
            script.setAttribute("data-repo", "polyglot-k/polyglot-k.github.io");
            script.setAttribute("data-repo-id", "R_kgDONGt-zw");
            script.setAttribute("data-category", "General");
            script.setAttribute("data-category-id", "DIC_kwDONGt-z84CjvgS");
            script.setAttribute("data-mapping", "pathname");
            script.setAttribute("data-strict", "0");
            script.setAttribute("data-reactions-enabled", "1");
            script.setAttribute("data-emit-metadata", "0");
            script.setAttribute("data-input-position", "bottom");
            script.setAttribute("data-theme", "preferred_color_scheme");
            script.setAttribute("data-lang", "ko");
            script.setAttribute("data-loading", "lazy");
            script.crossOrigin = "anonymous";
            script.async = true;

            giscusContainer.appendChild(script);
        },
    },
    mounted() {
        // 컴포넌트가 마운트된 후 Giscus 로드
        setTimeout(() => {
            this.loadGiscus();
        }, 100);
    },
    watch: {
        "$route.path"() {
            // 라우트가 변경될 때마다 Giscus 다시 로드
            setTimeout(() => {
                this.loadGiscus();
            }, 100);
        },
    },
};
</script>

<style scoped>
.comment-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--c-border, #eaecef);
}

@media (max-width: 768px) {
    .comment-section {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
    }
}
</style>
