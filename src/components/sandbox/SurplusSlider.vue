<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  sandbox: { type: Object, required: true },
})

const p = props.sandbox.params || {}
const hourlyValue = p.hourly_value || 50
const dailyWage = p.daily_wage || 200
const maxHours = p.max_hours || 14
const necessaryHours = dailyWage / hourlyValue

const hours = ref(8)

const totalVal = computed(() => hours.value * hourlyValue)
const surplusVal = computed(() => totalVal.value - dailyWage)

const barStyle = computed(() => {
  if (hours.value <= necessaryHours) {
    return { necessary: '100%', surplus: '0%' }
  }
  const nec = (necessaryHours / hours.value) * 100
  return { necessary: nec + '%', surplus: (100 - nec) + '%' }
})

const conclusion = computed(() => {
  if (hours.value < necessaryHours) {
    return { text: '工人创造的价值还不够付工资，资本家亏本了。', color: '#666' }
  }
  if (hours.value === necessaryHours) {
    return { text: '工人刚好挣回了自己的工资，资本家白忙一场。', color: '#666' }
  }
  return {
    text: `这就是绝对剩余价值的秘密：强迫工人超过 ${necessaryHours} 小时工作，老板凭空攫取了 <strong>${surplusVal.value}元</strong> 的剩余价值！`,
    color: 'var(--primary-color)',
  }
})
</script>

<template>
  <div class="concept-interactive-sandbox interactive-node" data-type="surplus_slider">
    <h3 class="sandbox-title">🕹️ {{ sandbox.title }}</h3>
    <div class="sandbox-intro">
      设定：工人每小时为工厂创造 <strong>{{ hourlyValue }}元</strong> 的真实利润，但日薪固定为 <strong>{{ dailyWage }}元</strong>。
    </div>

    <div class="slider-container">
      <label>拖动调整工人的实际工作时长：<span class="hours-display highlight-num">{{ hours }}</span> 小时</label>
      <input
        v-model.number="hours"
        type="range"
        class="work-hours-slider"
        :min="0"
        :max="maxHours"
        step="1"
      >
    </div>

    <div class="visual-bar-container">
      <div class="bar-necessary" :style="{ width: barStyle.necessary }">必要劳动</div>
      <div class="bar-surplus" :style="{ width: barStyle.surplus }">剩余劳动</div>
    </div>

    <div class="sandbox-stats">
      <div class="stat-box">
        <span>创造总产出</span>
        <strong class="total-val-display">{{ totalVal }} 元</strong>
      </div>
      <div class="stat-box">
        <span>工人的固定日薪</span>
        <strong class="wage-display">{{ dailyWage }} 元</strong>
      </div>
      <div class="stat-box highlight-box">
        <span>老板榨取的剩余价值</span>
        <strong class="surplus-val-display">{{ hours < necessaryHours ? '亏损' : (hours === necessaryHours ? '0' : surplusVal) }} 元</strong>
      </div>
    </div>

    <div class="sandbox-conclusion conclusion-node" :style="{ color: conclusion.color }" v-html="conclusion.text"></div>
  </div>
</template>
