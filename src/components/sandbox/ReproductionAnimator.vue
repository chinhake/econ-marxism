<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  sandbox: { type: Object, required: true },
})

const p = props.sandbox.params || {}
const steps = p.steps || []

// 当前步：0 = 初始状态（steps[0]），1..n-1 为推演过程
const step = ref(0)
const totalSteps = steps.length

const currentDesc = computed(() => steps[Math.min(step.value, steps.length - 1)]?.desc || '')

// 箭头与公式展示
const showArrow1 = computed(() => {
  const s = steps[step.value]
  return s && s.arrowText && step.value === 1
})
const showArrow2 = computed(() => {
  const s = steps[step.value]
  return s && s.arrowText && step.value === 2
})
const showEquation = computed(() => {
  const s = steps[step.value]
  return s && s.equation
})

const currentStepData = computed(() => steps[step.value] || steps[0])

const buttonText = computed(() => {
  if (step.value === 0) return `开始推演 (1/${totalSteps})`
  if (step.value < totalSteps - 1) return `下一步 (${step.value + 1}/${totalSteps})`
  return '重置推演'
})

const isDept1Highlighted = computed(() => step.value === 1)
const isDept2Highlighted = computed(() => step.value === 2)

function onButtonClick() {
  if (step.value === 0 || step.value < totalSteps - 1) {
    step.value++
  } else {
    step.value = 0
  }
}
</script>

<template>
  <div class="concept-interactive-sandbox animator-box interactive-node" data-type="reproduction_animator">
    <h3 class="sandbox-title">🕹️ {{ sandbox.title }}</h3>
    <div class="sandbox-intro">点击"下一步"播放流转动画：</div>

    <div class="reproduction-anim-container">
      <div class="dept-card dept-1">
        <h4>{{ p.dept1.name }}</h4>
        <div class="dept-inner">{{ p.dept1.inner }}</div>
        <div class="dept-exchange d1-ex-node" :style="{ backgroundColor: isDept1Highlighted ? '#fff2cc' : '#fdfdfd' }">
          {{ p.dept1.exchange }}
        </div>
      </div>

      <div class="exchange-channel">
        <div class="anim-arrow right" :class="[showArrow1 ? 'flow-right' : 'hidden']">
          <span class="arrow-text">{{ currentStepData.arrowText || '' }}</span>
        </div>
        <div class="anim-equation" :class="[showEquation ? 'pop-in' : 'hidden']">
          <div class="glow-text">{{ currentStepData.equation || '' }}</div>
          <small>{{ currentStepData.equationSub || '' }}</small>
        </div>
        <div class="anim-arrow left" :class="[showArrow2 ? 'flow-left' : 'hidden']">
          <span class="arrow-text">{{ currentStepData.arrowText || '' }}</span>
        </div>
      </div>

      <div class="dept-card dept-2">
        <h4>{{ p.dept2.name }}</h4>
        <div class="dept-exchange d2-ex-node" :style="{ backgroundColor: isDept2Highlighted ? '#fff2cc' : '#fdfdfd' }">
          {{ p.dept2.exchange }}
        </div>
        <div class="dept-inner">{{ p.dept2.inner }}</div>
      </div>
    </div>

    <div class="animator-controls">
      <button class="scanner-btn step-btn-node" style="background:var(--primary-color); color:#fff;" @click="onButtonClick">
        {{ buttonText }}
      </button>
      <p class="scan-reason-text desc-node" style="color:#333; font-weight:bold; margin-top:1rem;">{{ currentDesc }}</p>
    </div>
  </div>
</template>
