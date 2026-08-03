import { ref, watchEffect } from 'vue'

const THEME_KEY = 'econ-theme'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved
  } catch (e) {}
  return 'auto'
}

// 模块级单例状态：所有使用 useTheme 的组件共享同一主题
const theme = ref(getInitialTheme())
const systemDark = ref(false)

// 监听系统深色偏好实时变化（auto 模式跟随）
let mql = null
function initSystemListener() {
  if (typeof window === 'undefined' || mql) return
  mql = window.matchMedia('(prefers-color-scheme: dark)')
  systemDark.value = mql.matches
  mql.addEventListener('change', (e) => { systemDark.value = e.matches })
}
initSystemListener()

export function useTheme() {
  const isDark = ref(false)

  // 同步 <html data-theme> + 计算有效暗色状态
  watchEffect(() => {
    const effective = theme.value === 'dark' || (theme.value === 'auto' && systemDark.value)
    isDark.value = effective
    document.documentElement.setAttribute('data-theme', effective ? 'dark' : 'light')
  })

  function setTheme(mode) {
    theme.value = mode
    try { localStorage.setItem(THEME_KEY, mode) } catch (e) {}
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return { isDark, theme, setTheme, toggleTheme }
}
