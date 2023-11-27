import {defineUserConfig, viteBundler} from "vuepress";
import theme from "./theme.js";
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from "unplugin-auto-import/vite";
export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "文档演示",
    description: "vuepress-theme-hope 的文档演示",
    bundler: viteBundler({
        viteOptions: {
            plugins:[UnoCSS(),
                AutoImport({
                    imports: ['vue'],
                    dts: 'src/typings/auto-imports.d.ts',
                    vueTemplate: true,
                }),
                Components({
                    dts: 'src/typings/components.d.ts',
                    resolvers: [
                        NaiveUiResolver(),
                    ]
                }),
            ]
        },
        vuePluginOptions: {},
    }),
    theme,

    // Enable it with pwa
    // shouldPrefetch: false,
});
