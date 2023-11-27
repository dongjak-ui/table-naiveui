// .vuepress/client.ts
import { defineClientConfig } from "@vuepress/client";
import { defineVuePlaygroundConfig } from "vuepress-plugin-md-enhance/client";
// import {NaiveDataTable} from "@dongjak-ui/table-naiveui";
defineVuePlaygroundConfig({
    // 在此设置 @vue/repl 选项
});
import Full from "../examples/full.vue";
// import VueFullscreen from 'vue-fullscreen'
export default defineClientConfig({
    enhance: ({ app, router, siteData }) => {
        app.component("Full", Full);
        // app.use(VueFullscreen);
    },
});
