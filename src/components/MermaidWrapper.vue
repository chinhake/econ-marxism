<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  content: { type: String, required: true },
})

const container = ref(null)
let mermaidPromise = null

// 动态加载 mermaid CDN（与旧版一致，不引入 npm 依赖）
function loadMermaid() {
  if (typeof window.mermaid !== 'undefined') return Promise.resolve(window.mermaid)
  if (mermaidPromise) return mermaidPromise
  mermaidPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    script.onload = () => resolve(window.mermaid)
    script.onerror = reject
    document.head.appendChild(script)
  })
  return mermaidPromise
}

async function renderMermaid() {
  const mermaid = await loadMermaid()
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    flowchart: { htmlLabels: true, useMaxWidth: true, nodeSpacing: 70, rankSpacing: 70 },
    themeVariables: { fontSize: '18px' },
  })
  const el = container.value
  if (el) {
    el.innerHTML = props.content
    await mermaid.run({ nodes: [el] })
  }
}

onMounted(() => {
  // 让 mermaid 渲染后宽度正确
  requestAnimationFrame(renderMermaid)
})
onBeforeUnmount(() => {})
</script>

<template>
  <div class="mermaid-wrapper">
    <h4 v-if="title" class="mermaid-title">📊 {{ title }}</h4>
    <div ref="container" class="mermaid"></div>
  </div>
</template>
