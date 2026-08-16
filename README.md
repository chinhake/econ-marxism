# Econ·入门 — Vue 重构版

以1975年徐禾版《政治经济学概论》为底本的马克思主义政治经济学互动教学网站。本仓库是从原纯静态版（TEST 目录）迁移到 Vue 3 + Vite 的现代化重构。

## 技术栈

- **Vue 3** (`<script setup>` SFC) + **Vue Router 4**
- **Vite** 构建（开发热更新 HMR + 生产构建）
- 内容数据：`src/data/appData.js`（概念内容源，来自原 data.js）+ `src/data/quizzes.js`（测验数据，由 appData.js 聚合导出）

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
├── data/appData.js          # 概念内容源（65条概念）
├── data/quizzes.js          # 测验数据（50 道自检题，按章配题）
├── utils/quizzes.js         # 测验按章分组工具
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
- [x] 测验页：**50 道自检题**（`src/data/quizzes.js`，11 章按内容需要配题 5/6/3/5/5/4/5/4/4/4/5）；章节目录页 + 章节独立页两级结构；自检模式（点击选项：答对绿色、答错标红并显示正确答案与解析，不计分）
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
- [x] 详情页底部"上一节/下一节"导航（数组下标驱动，跨章节衔接，首尾自动隐藏）
- [x] 数据去重：删除重复的 id=25（保留审查后版本），现 65 条概念、id 唯一

## 待办列表

- [ ] （可选）FastAPI 内容管理后台

## 打包 / 分发

**目标：发给别人一个单文件，双击即用，无需终端、无需服务器、断网可用。**

```bash
npm run build
```

产物：`dist/index.html`（约 4.3MB，完全自包含）。

**方案 B（已实施）：**
- `vite-plugin-singlefile`：JS/CSS/数据/mermaid 全部内联进单个 HTML
- 路由改为 **hash 模式**（`#/concepts/16`），`base: './'` → `file://` 双击可用
- **mermaid 本地化**：从 CDN 动态加载改为 `npm install mermaid` + 直接 import → 离线可用
- 构建配置：`codeSplitting: false`（singlefile 自动设置），无需手动合并

**分发：** 把 `dist/index.html` 这一个文件发给对方即可，双击浏览器打开。

**注意：**
- 开发仍用 `npm run dev`（热更新）；生产分发用 `npm run build` 出单文件
- 文件名含中文内容，勿用旧版浏览器（需支持 ES2020+）
- 4.3MB 主要为 mermaid 运行时（约 2MB+）与内容数据（gzip 后 1.2MB）

## 构建说明

- `vite.config.js` 已设 `chunkSizeWarningLimit: 800`。

## 迁移说明

- 原版 main.js 中 fixed_capital / accumulation 组件的 steps 只有 desc 字段，但原代码却去读 badge/stage 字段，导致实际内容从不渲染（落到通用兜底）。Vue 版已正确渲染 desc。
- ReproductionAnimator 原版硬编码 4 步；concept 36 的数据实际是 5 步。Vue 版改为通用步进，两种数据都正确。
- [ ] （可选）FastAPI 内容管理后台
