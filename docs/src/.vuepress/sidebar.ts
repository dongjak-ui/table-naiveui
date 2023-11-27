import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/examples/": [
    {
      text: "示例",
      icon: "laptop-code",
      collapsible:true,
      children: "structure",
    },

  ],
});
