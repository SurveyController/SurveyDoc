import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "SurveyController",
  description: "基于 VitePress 的文档站点",
  head: [
    ['link', { rel: 'icon', href: '/assets/icon.ico' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '状态监测', link: 'https://status.hungrym0.top/status/surveycontroller' }
    ],

    sidebar: [
      {
        text: '使用前准备：',
        items: [
          { text: '下载与安装', link: '/download-install' },
          { text: '如何提问', link: '/how-to-ask' }
        ]
      },
      {
        text: '使用过程：',
        items: [
          { text: '载入问卷', link: '/upload' },
          { text: '选项比例的配置', link: '/questions' },
          { text: '运行参数', link: '/runtime' },
          { text: '随机 IP 与随机 UA', link: '/random' },
          { text: 'API Key 配置', link: '/api-key-configuration' }
        ]
      }
    ],


    socialLinks: [
      { icon: 'github', link: 'https://github.com/hungryM0/SurveyController' }
    ]
  }
})
