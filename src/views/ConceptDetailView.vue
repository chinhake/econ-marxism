<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import appData from '../data/appData.js'
import MermaidWrapper from '../components/MermaidWrapper.vue'
import ExplanationBlock from '../components/ExplanationBlock.vue'
import SurplusSlider from '../components/sandbox/SurplusSlider.vue'
import ReproductionAnimator from '../components/sandbox/ReproductionAnimator.vue'
import MoneyCirculationAnimator from '../components/sandbox/MoneyCirculationAnimator.vue'
import FixedCapitalAnimator from '../components/sandbox/FixedCapitalAnimator.vue'
import AccumulationPrerequisiteAnimator from '../components/sandbox/AccumulationPrerequisiteAnimator.vue'

const route = useRoute()
const id = computed(() => parseInt(route.params.id))

const concept = computed(() =>
  appData.concepts.find(c => c.id === id.value)
)

// 上/下一节：基于数组下标（数组按书顺序排列），跨章节自然衔接
const conceptIndex = computed(() =>
  appData.concepts.findIndex(c => c.id === id.value)
)
const prevConcept = computed(() =>
  conceptIndex.value > 0 ? appData.concepts[conceptIndex.value - 1] : null
)
const nextConcept = computed(() =>
  conceptIndex.value < appData.concepts.length - 1 ? appData.concepts[conceptIndex.value + 1] : null
)

// 全局 interactive（concept.interactive）的类型解析
const sandboxRegistry = {
  surplus_slider: SurplusSlider,
  reproduction_animator: ReproductionAnimator,
  money_circulation_animator: MoneyCirculationAnimator,
  fixed_capital_animator: FixedCapitalAnimator,
  accumulation_prerequisite_animator: AccumulationPrerequisiteAnimator,
}
const globalSandboxComponent = computed(() => {
  const g = concept.value?.interactive
  if (!g) return null
  return sandboxRegistry[g.params?.type || g.type] || null
})

const explanationBlocks = computed(() => concept.value?.explanation || [])
const globalVisualizations = computed(() => concept.value?.visualizations || [])

onMounted(() => {
  if (concept.value) {
    document.title = `${concept.value.title} - Econ·入门`
  }
})
</script>

<template>
  <main class="container">
    <router-link to="/concepts" class="back-link">← 返回目录</router-link>

    <div v-if="!concept" class="no-results">未找到该文献记录。</div>

    <article v-else id="detail-container" class="detail-article">
      <header class="detail-header">
        <div class="concept-meta">{{ concept.chapter || '' }} / {{ concept.section || '' }}</div>
        <h1 class="detail-title">{{ concept.title }}</h1>
      </header>

      <div class="detail-content-body">
        <!-- 1. Hook：question + scenarios -->
        <div v-if="concept.question || concept.hook" class="intro-hook-box">
          <h3 v-if="concept.question" class="hook-question">🤔 {{ concept.question }}</h3>
          <ul v-if="concept.scenarios" class="hook-scenarios">
            <li v-for="(s, i) in concept.scenarios" :key="i">{{ s }}</li>
          </ul>
        </div>

        <!-- 2. Core -->
        <div v-if="concept.core" class="core-focus-box">
          <div class="core-label">{{ concept.core.title }}</div>
          <div class="core-definition" v-html="concept.core.definition"></div>
        </div>

        <!-- 3. Explanation -->
        <div v-if="explanationBlocks.length" class="explanation-text">
          <ExplanationBlock
            v-for="(block, i) in explanationBlocks"
            :key="i"
            :block="block"
            :index="i"
          />
        </div>

        <!-- 4. Global Visualizations (mermaid) -->
        <template v-for="(v, i) in globalVisualizations" :key="'viz-' + i">
          <MermaidWrapper v-if="v.type === 'mermaid'" :title="v.title" :content="v.content" />
        </template>

        <!-- 5. Global Interactive -->
        <component
          v-if="concept.interactive && globalSandboxComponent"
          :is="globalSandboxComponent"
          :sandbox="concept.interactive"
        />

        <!-- 6. Real World -->
        <div v-if="concept.real_world" class="real-world-box">
          <h4 class="real-world-title">🌍 {{ concept.real_world.title }}</h4>
          <div class="real-world-content">
            <template v-if="Array.isArray(concept.real_world.content)">
              <p v-for="(p, i) in concept.real_world.content" :key="i" v-html="p"></p>
            </template>
            <p v-else v-html="concept.real_world.content"></p>
          </div>
        </div>

        <!-- 7. Quote -->
        <blockquote v-if="concept.quote" class="marx-quote">
          <p v-html="concept.quote"></p>
          <cite v-if="concept.source">—— {{ concept.source }}</cite>
        </blockquote>

        <!-- 8. 上一节 / 下一节 导航 -->
        <nav class="prev-next-nav">
          <router-link
            v-if="prevConcept"
            :to="`/concepts/${prevConcept.id}`"
            class="prev-next-link prev"
          >
            <span class="pn-arrow">←</span>
            <span class="pn-text">
              <small>上一节</small>
              <span class="pn-title">{{ prevConcept.title }}</span>
            </span>
          </router-link>

          <span v-else class="prev-next-link disabled prev">
            <span class="pn-arrow">←</span>
            <span class="pn-text">已是第一节</span>
          </span>

          <router-link
            v-if="nextConcept"
            :to="`/concepts/${nextConcept.id}`"
            class="prev-next-link next"
          >
            <span class="pn-text">
              <small>下一节</small>
              <span class="pn-title">{{ nextConcept.title }}</span>
            </span>
            <span class="pn-arrow">→</span>
          </router-link>

          <span v-else class="prev-next-link disabled next">
            <span class="pn-text">已是最后一节</span>
            <span class="pn-arrow">→</span>
          </span>
        </nav>
      </div>
    </article>
  </main>
</template>
