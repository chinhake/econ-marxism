<script setup>
import { ref, computed } from 'vue'
import appData from '../data/appData.js'
import { groupQuizzesByChapter } from '../utils/quizzes.js'

const searchTerm = ref('')

const filteredConcepts = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) return appData.concepts
  return appData.concepts.filter(c => {
    const matchTitle = c.title && c.title.toLowerCase().includes(term)
    const matchDef = c.core && c.core.definition && String(c.core.definition).toLowerCase().includes(term)
    return matchTitle || matchDef
  })
})

const groupedChapters = computed(() => {
  const grouped = {}
  filteredConcepts.value.forEach(concept => {
    const chapter = concept.chapter || '未分类概念'
    if (!grouped[chapter]) grouped[chapter] = []
    grouped[chapter].push(concept)
  })
  return grouped
})

// 章名 → 对应测验页索引与题数（用于每章末尾并列的"本章测验"入口）
const quizByChapter = computed(() => {
  const map = {}
  groupQuizzesByChapter(appData.quizzes).forEach((g, i) => {
    map[g.chapter] = { idx: i + 1, count: g.items.length }
  })
  return map
})
</script>

<template>
  <main class="container">
    <header class="page-header center-header">
      <h2>政治经济学概论</h2>
      <p>探索政治经济学的核心基石。点击对应章节展开概念列表。</p>
      <div class="concept-search-bar">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="🔍 搜索你想了解的理论 (例如：剩余价值)..."
        >
      </div>
    </header>

    <div v-if="Object.keys(groupedChapters).length === 0" class="no-results">
      未找到与 "{{ searchTerm }}" 相关的概念。
    </div>

    <div v-else class="accordion-list">
      <details
        v-for="(concepts, chapter) in groupedChapters"
        :key="chapter"
        class="chapter-details"
        :open="!!searchTerm"
      >
        <summary class="chapter-summary">
          <span>{{ chapter }}</span>
          <span class="concept-count">{{ concepts.length }} 节</span>
        </summary>
        <div class="chapter-content">
          <router-link
            v-for="item in concepts"
            :key="item.id"
            :to="`/concepts/${item.id}`"
            class="concept-link-item"
          >
            <span class="icon">🔹</span>
            <span class="title">{{ item.title }}</span>
          </router-link>
          <router-link
            v-if="quizByChapter[chapter]"
            :to="`/quizzes/${quizByChapter[chapter].idx}`"
            class="concept-link-item quiz-link-item"
          >
            <span class="icon">📝</span>
            <span class="title">本章测验（{{ quizByChapter[chapter].count }} 题）</span>
            <span class="quiz-link-arrow">→</span>
          </router-link>
        </div>
      </details>
    </div>
  </main>
</template>
