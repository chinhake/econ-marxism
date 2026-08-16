<script setup>
import { computed } from 'vue'
import appData from '../data/appData.js'
import { groupQuizzesByChapter } from '../utils/quizzes.js'

// 章节目录：按章分组，保持书顺序（章内按 id 升序）
const groups = computed(() => groupQuizzesByChapter(appData.quizzes))
</script>

<template>
  <main class="container">
    <header class="page-header center-header">
      <h2>政治经济学测验</h2>
    </header>

    <div v-if="!groups.length" class="no-results">暂无测验题目。</div>

    <div v-else class="accordion-list quiz-dir-list">
      <router-link
        v-for="(group, idx) in groups"
        :key="group.chapter"
        :to="`/quizzes/${idx + 1}`"
        class="quiz-dir-row"
      >
        <span class="quiz-dir-name">{{ group.chapter }}</span>
        <span class="quiz-dir-meta">
          <span class="concept-count">{{ group.items.length }} 题</span>
          <span class="quiz-dir-arrow">→</span>
        </span>
      </router-link>
    </div>
  </main>
</template>
