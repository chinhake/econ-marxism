import { ref, watch } from 'vue'

const ZOOM_KEY = 'econ-zoom'
const MIN_ZOOM = 0.8
const MAX_ZOOM = 1.5
const STEP = 0.1

function getInitialZoom() {
  try {
    const saved = parseFloat(localStorage.getItem(ZOOM_KEY))
    if (Number.isFinite(saved)) return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, saved))
  } catch (e) {}
  return 1
}

// 模块级单例状态：所有使用 useZoom 的组件共享同一缩放
const factor = ref(getInitialZoom())

// 应用到 <html>，等价于浏览器 Ctrl+滚轮缩放（px/rem/图片/公式一起缩放并回流）
watch(factor, (v) => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.zoom = String(v)
  }
}, { immediate: true })

function setZoom(v) {
  factor.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(v * 100) / 100))
  try { localStorage.setItem(ZOOM_KEY, String(factor.value)) } catch (e) {}
}

function zoomIn() { setZoom(factor.value + STEP) }
function zoomOut() { setZoom(factor.value - STEP) }
function resetZoom() { setZoom(1) }

// 挂载一次 Ctrl+滚轮：拦截浏览器原生缩放，只走我们的状态，避免双重缩放
let wheelBound = false
function bindCtrlWheel() {
  if (wheelBound || typeof window === 'undefined') return
  wheelBound = true
  window.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return
    e.preventDefault()
    if (e.deltaY < 0) zoomIn()
    else if (e.deltaY > 0) zoomOut()
  }, { passive: false })
}

export function useZoom() {
  bindCtrlWheel()
  return { factor, zoomIn, zoomOut, resetZoom }
}
