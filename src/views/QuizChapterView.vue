<script setup>
import { ref, computed, onMounted } from 'vue'
import appData from '../data/appData.js'
import { groupQuizzesByChapter } from '../utils/quizzes.js'

const props = defineProps({
  idx: { type: String, required: true }, // 1 起，对应第 idx 章
})

const groups = computed(() => groupQuizzesByChapter(appData.quizzes))
const idxNum = computed(() => parseInt(props.idx, 10))

const group = computed(() =>
  Number.isInteger(idxNum.value) ? groups.value[idxNum.value - 1] : undefined
)
const prevGroup = computed(() =>
  Number.isInteger(idxNum.value) && idxNum.value > 1 ? groups.value[idxNum.value - 2] : null
)
const nextGroup = computed(() =>
  Number.isInteger(idxNum.value) && idxNum.value < groups.value.length
    ? groups.value[idxNum.value]
    : null
)

// 自检作答状态：answers[quizId] = 已选选项下标；undefined 表示未答
// 不判分、不计分，仅就地反馈：答对绿色、答错标红，同时显示正确答案与解析
const answers = ref({})

function isAnswered(quizId) {
  return answers.value[quizId] !== undefined
}

function isCorrect(quizId) {
  const q = group.value.items.find(x => x.id === quizId)
  return !!q && answers.value[quizId] === q.answer
}

function selectOption(quizId, idx) {
  if (isAnswered(quizId)) return
  answers.value[quizId] = idx
}

onMounted(() => {
  if (group.value) document.title = `${group.value.chapter}测验 - Econ·入门`
})
</script>

<template>
  <main class="container">
    <router-link to="/quizzes" class="back-link">← 返回测验目录</router-link>

    <div v-if="!group" class="no-results">未找到该章节的测验题目。</div>

    <template v-else>
      <header class="page-header center-header">
        <h2>{{ group.chapter }}测验</h2>
      </header>

      <div class="quiz-chapter-list">
        <article
          v-for="q in group.items"
          :key="q.id"
          class="quiz-item"
          :class="{ 'is-answered': isAnswered(q.id) }"
        >
          <h3 class="quiz-item-question">
            <span class="quiz-item-no">{{ q.id }}.</span>
            {{ q.question }}
          </h3>
          <div class="options-group">
            <button
              v-for="(option, i) in q.options"
              :key="i"
              class="option-btn"
              :class="{
                answer: isAnswered(q.id) && i === q.answer,
                wrong: isAnswered(q.id) && answers[q.id] === i && i !== q.answer,
                dim: isAnswered(q.id) && i !== q.answer && answers[q.id] !== i,
              }"
              @click="selectOption(q.id, i)"
            >
              <span class="option-letter">{{ 'ABCD'[i] }}</span>
              <span class="option-text">{{ option }}</span>
              <span v-if="isAnswered(q.id) && i === q.answer" class="answer-tag">正确答案</span>
            </button>
          </div>
          <div
            v-if="isAnswered(q.id)"
            class="feedback"
            :class="isCorrect(q.id) ? 'ok' : 'no'"
          >
            <strong>解析</strong>
            <span class="feedback-body">{{ q.explanation }}</span>
          </div>
        </article>
      </div>

      <nav class="prev-next-nav">
        <router-link
          v-if="prevGroup"
          :to="`/quizzes/${idxNum - 1}`"
          class="prev-next-link prev"
        >
          <span class="pn-arrow">←</span>
          <span class="pn-text">
            <small>上一章</small>
            <span class="pn-title">{{ prevGroup.chapter }}</span>
          </span>
        </router-link>

        <router-link
          v-if="nextGroup"
          :to="`/quizzes/${idxNum + 1}`"
          class="prev-next-link next"
        >
          <span class="pn-text">
            <small>下一章</small>
            <span class="pn-title">{{ nextGroup.chapter }}</span>
          </span>
          <span class="pn-arrow">→</span>
        </router-link>
      </nav>
    </template>
  </main>
</template>
