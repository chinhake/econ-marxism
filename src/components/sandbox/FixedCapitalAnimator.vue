<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  sandbox: { type: Object, required: true },
})

const p = props.sandbox.params || {}
const steps = p.steps || []
const totalSteps = steps.length

const currentStep = ref(-1)

const buttonText = computed(() => {
  if (currentStep.value === -1) return `开始推演 (1/${totalSteps})`
  if (currentStep.value < totalSteps - 1) return `下一步 (${currentStep.value + 2}/${totalSteps})`
  return '重新推演'
})

const currentStepData = computed(() => steps[currentStep.value] || null)

function onButtonClick() {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
  } else {
    currentStep.value = -1
  }
}
</script>

<template>
  <div class="concept-interactive-sandbox interactive-node" data-type="fixed_capital_animator">
    <h3 class="sandbox-title">🕹️ {{ sandbox.title }}</h3>
    <div class="modern-anim-stage">
      <div v-if="p.annualDepreciation" class="money-stats">
        <span class="stat-badge">年折旧 {{ p.annualDepreciation }}</span>
        <span class="stat-badge">固定资本总额 {{ p.totalFixedCapital }}</span>
      </div>
      <div class="transaction-arena">
        <div v-if="!currentStepData" class="trans-placeholder">等候推演指令输入...</div>
        <div v-else class="fixed-cap-step pop-in">
          <div class="step-badge" style="background:var(--primary-light);">第 {{ currentStep + 1 }} 步</div>
          <div class="step-content">{{ currentStepData.desc }}</div>
        </div>
      </div>
    </div>

    <div class="animator-controls">
      <button class="scanner-btn step-btn-node" style="background:#4a6fa5; color:#fff;" @click="onButtonClick">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>
