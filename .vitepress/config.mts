import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "SurveyController",
  description: "基于 VitePress 的文档站点",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '示例',
        items: [
          { text: '下载与安装', link: '/download-install' },
          { text: '使用说明', link: '/usage-guide' },
          { text: 'API Key配置', link: '/api-key-configuration' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hungryM0/SurveyController' }
    ]
  }
})
