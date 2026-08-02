<script setup>
import { ref } from 'vue'
import appData from '../data/appData.js'

const quizzes = appData.quizzes || []
const currentIndex = ref(0)
const selected = ref(null)      // 已选选项下标
const finished = ref(quizzes.length === 0)

const quiz = quizzes[currentIndex.value]

function selectOption(idx) {
  if (selected.value !== null) return
  selected.value = idx
}

function next() {
  if (currentIndex.value + 1 < quizzes.length) {
    currentIndex.value++
    selected.value = null
  } else {
    finished.value = true
  }
}
</script>

<template>
  <main class="container quiz-container">
    <div class="quiz-box">
      <h2 v-if="finished">测验完成！</h2>
      <p v-if="finished">理论结合实际，继续保持阅读和思考。</p>

      <template v-else>
        <h2 id="quiz-question">{{ quiz.question }}</h2>
        <div class="options-group">
          <button
            v-for="(option, i) in quiz.options"
            :key="i"
            class="option-btn"
            :class="{
              correct: selected !== null && i === quiz.answer,
              wrong: selected === i && i !== quiz.answer,
            }"
            :disabled="selected !== null"
            @click="selectOption(i)"
          >
            {{ option }}
          </button>
        </div>

        <div
          v-if="selected !== null"
          class="feedback"
          :style="{ borderLeft: selected === quiz.answer ? '4px solid #28a745' : '4px solid #dc3545' }"
        >
          <strong>{{ selected === quiz.answer ? '回答正确！' : '回答错误。' }}</strong><br>
          {{ quiz.explanation }}
        </div>

        <button v-if="selected !== null" id="next-btn" class="btn-primary" @click="next">
          下一题
        </button>
      </template>
    </div>
  </main>
</template>
