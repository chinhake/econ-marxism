<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
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
      <ul class="nav-links">
        <li v-for="item in navItems" :key="item.path">
          <router-link :to="item.path" :class="{ active: isActive(item.path, item.exact) }">
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>

  <router-view />
</template>
