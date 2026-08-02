# Econ·入门 — Vue 重构版

以1975年徐禾版《政治经济学概论》为底本的马克思主义政治经济学互动教学网站。本仓库是从原纯静态版（TEST 目录）迁移到 Vue 3 + Vite 的现代化重构。

## 技术栈

- **Vue 3** (`<script setup>` SFC) + **Vue Router 4**
- **Vite** 构建（开发热更新 HMR + 生产构建）
- 内容数据：`src/data/appData.js`（唯一内容源，来自原 data.js）

## 快速开始

```bash
npm install
npm run dev       # 开发，热更新
npm run build     # 生产构建
npm run preview   # 预览构建产物
```

## 目录结构

```
src/
├── data/appData.js          # 唯一内容源（66条概念 + quizzes）
├── router/index.js          # 路由（懒加载）
├── views/
│   ├── HomeView.vue         # 首页
│   ├── ConceptsView.vue     # 概念库（手风琴+搜索）
│   ├── ConceptDetailView.vue# 详情页
│   └── QuizzesView.vue      # 测验页
├── components/
│   ├── MermaidWrapper.vue   # mermaid 图渲染（CDN 动态加载）
│   ├── ConceptMapNode.vue   # 概念树递归节点
│   ├── ExplanationBlock.vue # 解释段调度器（字符串/对象分派）
│   └── sandbox/             # 交互沙盘组件（建设中）
└── style.css                # 原站完整样式
```

## 已完成功能

- [x] Vite + Vue 3 脚手架（ECON 文件夹，原 TEST 目录未动）
- [x] data.js 转为 ESM 模块接入（66 条概念验证可加载）
- [x] 4 条路由 + 路由懒加载
- [x] 导航栏（首页/概念库/测验）
- [x] 首页复刻
- [x] 概念库：章节手风琴 + 搜索过滤
- [x] 详情页：hook / core / 正文 / mermaid / 概念树 / 现实关联 / 原典引用
- [x] 测验页逻辑（quizzes 数据目前为空）
- [x] 路由懒加载代码分割
- [x] 交互沙盘组件迁移（5种，数据中无 commodity_scanner 未实现）：
  - [x] SurplusSlider（剩余价值滑块）— concept 17 全局
  - [x] ReproductionAnimator（再生产交换沙盘）— concept 35/36，兼容 4/5 步
  - [x] MoneyCirculationAnimator（货币流通动画）— concept 35
  - [x] FixedCapitalAnimator（固定资本折旧）— concept 35
  - [x] AccumulationPrerequisiteAnimator（积累前提推演）— concept 36
- [x] 交互沙盘在 ExplanationBlock 中注册接入
- [x] 详情页全局 interactive 区块接入（concept.interactive）
- [x] 补全沙盘结构 CSS（原版缺失类）

## 待办列表

- [ ] （可选）FastAPI 内容管理后台

## 构建说明

- `vite.config.js` 已设 `chunkSizeWarningLimit: 800`。appData 数据 chunk（gzip 273KB）一次性懒加载，首页不加载；概念库页因搜索/手风琴需要全量数据，属必要加载，不做按章拆分（评估见会话记录）。

## 迁移说明

- 原版 main.js 中 fixed_capital / accumulation 组件的 steps 只有 desc 字段，但原代码却去读 badge/stage 字段，导致实际内容从不渲染（落到通用兜底）。Vue 版已正确渲染 desc。
- ReproductionAnimator 原版硬编码 4 步；concept 36 的数据实际是 5 步。Vue 版改为通用步进，两种数据都正确。
- [ ] （可选）FastAPI 内容管理后台
