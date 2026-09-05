<script setup>
    import { ref, onMounted, watch, nextTick } from 'vue'
    import mermaid from 'mermaid'
    import { useTheme } from '../composables/useTheme'

    const props = defineProps({
        title: String,
        content: String
    })

    const containerRef = ref(null)
    const scale = ref(1) // 缩放比例
    const { isDark } = useTheme()

    // 初始化 mermaid
    const getMermaidConfig = () => ({
        startOnLoad: false,
        theme: isDark.value ? 'dark' : 'default',
        securityLevel: 'loose',
        flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            curve: 'basis',
            nodePadding: 16,
            padding: 20
        },
        themeVariables: {
            fontSize: '13px',
            fontFamily: '"Microsoft YaHei", "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }
    })

    mermaid.initialize(getMermaidConfig())

    // 主题切换时重新初始化并渲染图表
    watch(isDark, () => {
        mermaid.initialize(getMermaidConfig())
        renderChart()
    })

    const renderChart = async () => {
        if (!props.content || !containerRef.value) return
        try {
            const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`
            const { svg } = await mermaid.render(id, props.content)
            containerRef.value.innerHTML = svg
        } catch (e) {
            console.error('Mermaid 渲染失败:', e)
        }
    }

    // 缩放操作
    const zoomIn = () => {
        if (scale.value < 2.5) scale.value += 0.25
    }
    const zoomOut = () => {
        if (scale.value > 0.5) scale.value -= 0.25
    }
    const resetZoom = () => {
        scale.value = 1
    }

    onMounted(() => {
        renderChart()
    })

    watch(() => props.content, () => {
        nextTick(() => renderChart())
    })
</script>

<template>
    <div class="mermaid-wrapper">
        <!-- 顶部工具栏：标题 + 右上角控制按钮 -->
        <div class="mermaid-toolbar">
            <div class="mermaid-title" v-if="title">{{ title }}</div>
            <div class="zoom-controls">
                <button @click="zoomOut" title="缩小" class="zoom-btn">-</button>
                <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
                <button @click="zoomIn" title="放大" class="zoom-btn">+</button>
                <button @click="resetZoom" title="重置" class="zoom-btn reset">↺</button>
            </div>
        </div>

        <!-- 图表视口区域 -->
        <div class="mermaid-viewport">
            <div ref="containerRef"
                 class="mermaid-container"
                 :style="{ transform: `scale(${scale})`, transformOrigin: 'top center' }"></div>
        </div>
    </div>
</template>

<style scoped>
    .mermaid-wrapper {
        position: relative;
        width: 100%;
        margin: 1.2rem 0;
        background: var(--bg-surface);
        border: 1px solid var(--border-color, #e0e0e0);
        border-radius: 8px;
        padding: 1.2rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        overflow: hidden;
    }

    .mermaid-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px solid var(--border-light);
    }

    .mermaid-title {
        font-size: 1.05rem;
        font-weight: bold;
        color: var(--primary-color, #722f37);
        border-left: 3px solid var(--primary-color, #722f37);
        padding-left: 8px;
    }

    /* 右上角控制按钮组 */
    .zoom-controls {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        background: var(--bg-surface-hover);
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        margin-left: auto;
    }

    .zoom-btn {
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border-color);
        background: var(--bg-surface);
        color: var(--text-heading);
        border-radius: 4px;
        font-size: 0.95rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        user-select: none;
    }

        .zoom-btn:hover {
            background: var(--accent-red-bg);
            color: #fff;
            border-color: var(--accent-red-bg);
        }

        .zoom-btn.reset {
            font-size: 0.85rem;
        }

    .zoom-level {
        font-size: 0.75rem;
        color: var(--text-muted);
        min-width: 42px;
        text-align: center;
        font-family: monospace;
    }

    .mermaid-viewport {
        width: 100%;
        overflow-x: auto;
        padding: 1rem 0;
    }

    .mermaid-container {
        transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        display: flex;
        justify-content: center;
    }

    :deep(.node foreignObject) {
        overflow: visible !important;
    }

    :deep(.node foreignObject div) {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        line-height: 1.4 !important;
        font-family: "Microsoft YaHei", "PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 13px !important;
    }
</style>