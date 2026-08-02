<script setup>
import MermaidWrapper from './MermaidWrapper.vue'
import ConceptMapNode from './ConceptMapNode.vue'
import SurplusSlider from './sandbox/SurplusSlider.vue'
import ReproductionAnimator from './sandbox/ReproductionAnimator.vue'
import MoneyCirculationAnimator from './sandbox/MoneyCirculationAnimator.vue'
import FixedCapitalAnimator from './sandbox/FixedCapitalAnimator.vue'
import AccumulationPrerequisiteAnimator from './sandbox/AccumulationPrerequisiteAnimator.vue'

const props = defineProps({
  block: { type: Object, required: true }, // 对象形式：mermaid / interactive / concept-map
  index: { type: Number, default: 0 },
})

// 交互沙盘类型 → 组件映射
const sandboxRegistry = {
  surplus_slider: SurplusSlider,
  reproduction_animator: ReproductionAnimator,
  money_circulation_animator: MoneyCirculationAnimator,
  fixed_capital_animator: FixedCapitalAnimator,
  accumulation_prerequisite_animator: AccumulationPrerequisiteAnimator,
}

function resolveSandbox(block) {
  const type = block.params?.type || block.type
  return sandboxRegistry[type] || null
}
</script>

<template>
  <!-- 纯文本段 -->
  <p v-if="typeof block === 'string'" v-html="block"></p>

  <!-- mermaid 图 -->
  <MermaidWrapper
    v-else-if="block.type === 'mermaid'"
    :title="block.title"
    :content="block.content"
  />

  <!-- 概念树 -->
  <div v-else-if="block.type === 'concept-map'" class="econ-tree-wrapper">
    <ul>
      <ConceptMapNode :node="block.data" />
    </ul>
  </div>

  <!-- 交互沙盘：已注册组件则渲染，未注册则跳过（不展示坏入口） -->
  <component
    v-else-if="block.type === 'interactive' && resolveSandbox(block)"
    :is="resolveSandbox(block)"
    :sandbox="block"
  />
</template>
