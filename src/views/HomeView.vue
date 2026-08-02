<script setup>
const cards = [
  {
    icon: '📖',
    title: '原典解析',
    desc: '从"商品"到"资本"，逐个拆解核心概念。附带生活中的通俗例子与经典著作原文对照。',
    link: '/concepts',
    btnText: '进入概念库 →',
  },
  {
    icon: '🔍',
    title: '现实映射',
    desc: '用理论之刃解剖现实。从早期的圈地运动，到如今的平台经济与零工生态，看透经济运行逻辑。',
    link: '/concepts',
    btnText: '探索案例集 →',
  },
  {
    icon: '✍️',
    title: '沙盘推演',
    desc: '摒弃死记硬背，通过情景式的互动小测验，检验你对剩余价值、资本循环等规律的真实理解。',
    link: '/quizzes',
    btnText: '开始测验 →',
  },
]
</script>

<template>
  <header class="hero">
    <div class="hero-content">
      <h1>从零开始的政治经济学</h1>
      <p>无产阶级政党的全部理论来自对政治经济学的研究 ——恩格斯</p>
    </div>
  </header>

  <main class="features-grid">
    <div class="card" v-for="card in cards" :key="card.title">
      <div class="card-icon">{{ card.icon }}</div>
      <h3>{{ card.title }}</h3>
      <p>{{ card.desc }}</p>
      <router-link :to="card.link" class="btn-link">{{ card.btnText }}</router-link>
    </div>
  </main>
</template>
