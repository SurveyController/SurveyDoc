# SurveyController

基于 VitePress 的文档站点项目。

## 简介

这是一个使用 VitePress 构建的文档项目，用于展示和分享 Markdown 文档内容。

## 环境要求

- Node.js >= 18
- npm

## 安装

```bash
npm install
```

## 使用

### 开发模式

启动本地开发服务器，支持热重载：

```bash
npm run docs:dev
```

### 构建生产版本

生成静态站点文件：

```bash
npm run docs:build
```

### 预览构建结果

预览构建后的静态站点：

```bash
npm run docs:preview
```

## 项目结构

```
├── .vitepress/          # VitePress 配置
│   └── config.mts       # 站点配置文件
├── index.md             # 首页
├── markdown-examples.md # Markdown 示例
├── api-examples.md      # API 示例
└── package.json         # 项目配置
```

## 文档

本地文档站点地址：`http://localhost:5173`

## 许可证

ISC
