import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/fe-docs/obr-utils/',
  title: '@obr-fe/utils使用文档',
  description: '@obr-fe/utils使用文档',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    sidebar: [
      {
        text: '@obr-fe/utils',
        items: [
          { text: '快速开始', link: '/' },
          { text: 'TS类型', link: '/types' },
          { text: 'utils 文档', link: '/api-docs' },
          { text: 'request 文档', link: '/request' },
          { text: '更新日志', link: '/changelogs' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'npm', link: 'https://dev-fe.oberyun.com/npm/-/web/detail/@obr-fe/utils' },
    ],
    search: {
      provider: 'local',
    },
  },
})
