<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  sandbox: { type: Object, required: true },
})

const p = props.sandbox.params || {}
const steps = p.steps || []
const totalSteps = steps.length

// currentStep：-1 = 初始待命；0..n-1 为已展示的步
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
  <div class="concept-interactive-sandbox interactive-node" data-type="money_circulation_animator">
    <h3 class="sandbox-title">🕹️ {{ sandbox.title }}</h3>
    <div class="modern-anim-stage">
      <div v-if="p.totalCurrency" class="money-stats">
        <span class="stat-badge">总额 {{ p.totalCurrency }} 货币</span>
        <span class="stat-badge">媒介 {{ p.totalValue }} 商品价值</span>
      </div>
      <div class="transaction-arena">
        <div v-if="!currentStepData" class="trans-placeholder">等候推演指令输入...</div>
        <div v-else class="flow-transaction pop-in">
          <div class="flow-node sender">{{ currentStepData.actor }}</div>
          <div class="flow-path">
            <span class="flow-amount">{{ currentStepData.action }}</span>
            <div class="flow-arrow">➔</div>
          </div>
          <div class="flow-node receiver">{{ currentStepData.recipient }}</div>
        </div>
      </div>
    </div>

    <div class="animator-controls">
      <button class="scanner-btn step-btn-node" style="background:#722f37; color:#fff;" @click="onButtonClick">
        {{ buttonText }}
      </button>
      <p v-if="currentStepData" class="scan-reason-text desc-node" style="color:#333; margin-top:1rem; font-size:1.05rem; line-height:1.6;">
        {{ currentStepData.desc }}
      </p>
    </div>
  </div>
</template>
