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
  <div class="concept-interactive-sandbox interactive-node" data-type="accumulation_prerequisite_animator">
    <h3 class="sandbox-title">🕹️ {{ sandbox.title }}</h3>
    <div class="modern-anim-stage">
      <div class="transaction-arena">
        <div v-if="!currentStepData" class="trans-placeholder">等候推演指令输入...</div>
        <div v-else class="accumulation-step pop-in">
          <div class="acc-stage-badge">{{ currentStepData.stage || `阶段推演 ${currentStep + 1}` }}</div>
          <div class="acc-formula-display">{{ currentStepData.formula || currentStepData.desc }}</div>
        </div>
      </div>
    </div>

    <div class="animator-controls">
      <button class="scanner-btn step-btn-node" style="background:var(--primary-color); color:#fff;" @click="onButtonClick">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>
