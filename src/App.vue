<script setup>
import { useRoute } from 'vue-router'
import { useTheme } from './composables/useTheme'
import { useZoom } from './composables/useZoom'
const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const { factor, zoomIn, zoomOut, resetZoom } = useZoom()
const navItems = [
  { path: '/', label: '首页', exact: true },
  { path: '/concepts', label: '概念库' },
  { path: '/quizzes', label: '测验' },
]
function isActive(path, exact = false) {
  if (exact) return route.path === path
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">🏛️</span>
        <span class="logo-text">Econ·入门</span>
      </router-link>
      <div class="nav-right">
        <ul class="nav-links">
          <li v-for="item in navItems" :key="item.path">
            <router-link :to="item.path" :class="{ active: isActive(item.path, item.exact) }">
              {{ item.label }}
            </router-link>
          </li>
        </ul>
        <div class="page-zoom" aria-label="页面缩放">
          <button class="page-zoom-btn" @click="zoomOut" title="缩小（Ctrl+滚轮向下）" :disabled="factor <= 0.8">A−</button>
          <span class="page-zoom-value">{{ Math.round(factor * 100) }}%</span>
          <button class="page-zoom-btn" @click="zoomIn" title="放大（Ctrl+滚轮向上）" :disabled="factor >= 1.5">A+</button>
          <button class="page-zoom-btn page-zoom-reset" @click="resetZoom" title="重置为 100%" :disabled="factor === 1">↺</button>
        </div>
        <div class="theme-toggle-container" @click="toggleTheme">
            <span class="theme-label">{{ isDark ? '深色模式' : '浅色模式' }}</span>
            <button :class="['theme-toggle-switch', { 'is-dark': isDark }]"
                    :title="isDark ? '切换到亮色模式' : '切换到深色模式'"
                    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'">
                <span class="switch-track">
                    <span class="icon light">☀️</span>
                    <span class="icon dark">🌙</span>
                </span>
                <span class="switch-thumb"></span>
            </button>
        </div>
      </div>
    </div>
  </nav>
    
  <router-view />
</template>
