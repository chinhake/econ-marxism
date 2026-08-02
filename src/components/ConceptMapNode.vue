<script setup>
defineProps({
  node: { type: Object, required: true },
})
</script>

<template>
  <li>
    <div :class="`tree-card ${node.class || ''}`">{{ node.label }}</div>
    <ul v-if="node.children && node.children.length > 0">
      <ConceptMapNode v-for="(child, i) in node.children" :key="i" :node="child" />
    </ul>
  </li>
</template>
