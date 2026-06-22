import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  title: "SurveyController",
  description: "SurveyController 官方文档",
  head: [
    ['link', { rel: 'icon', href: '/assets/icon.ico' }]
  ],
  themeConfig: {
    logo: '/assets/icon.ico',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'API 文档', link: '/sdk/index' },
      { text: '参与文档编写', link: 'https://github.com/SurveyController/SurveyDoc'}
      { text: '状态监测', link: 'https://status.hungrym0.com/status/surveycontroller' }
    ],

    sidebar: [
      {
        text: '使用前准备',
        items: [
          { text: '下载与安装', link: '/guide/download-install' },
          { text: '如何提问', link: '/support/how-to-ask' }
        ]
      },
      {
        text: '使用过程',
        items: [
          { text: '载入问卷', link: '/guide/upload' },
          { text: '选项比例的配置', link: '/guide/questions' },
          { text: '运行参数', link: '/guide/runtime' },
          { text: '随机 IP 与随机 UA', link: '/guide/random' },
          { text: 'API Key 配置', link: '/guide/api-key-configuration' }
        ]
      },
      {
        text: '开发接入',
        items: [
          { text: 'SDK 总览', link: '/sdk/' },
          { text: '接口说明', link: '/sdk/api' },
          { text: '数据结构', link: '/sdk/schemas' },
          { text: '错误处理', link: '/sdk/errors' },
          { text: '调用示例', link: '/sdk/examples' }
        ]
      }
    ],


    socialLinks: [
      { icon: 'github', link: 'https://github.com/hungryM0/SurveyController' }
    ]
  }
})
