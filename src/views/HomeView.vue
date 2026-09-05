<script setup>
const cards = [
  {
    icon: '📖',
    title: '原典解析',
    desc: '每个概念都从一个真问题讲起——商品凭什么能画等号、工资为什么看着像劳动的价格——再一步步推到结论，最后落回马克思的原话。',
    link: '/concepts',
    btnText: '翻开概念库 →',
  },
  {
    icon: '🏛️',
    title: '历史长廊',
    desc: '从圈地运动到机器大工业，从帝国主义到全球金融化与数字垄断——用唯物史观透视资本主义演进史与走向社会主义的客观必然性。',
    link: '/history',
    btnText: '进入历史长廊 →',
  },
  {
    icon: '✍️',
    title: '自检测验',
    desc: '学没学会，做几道题最清楚。六十六道自检题按章排好：先自己想一想，再点开看答案——答错了没关系，解析会告诉你错在哪。',
    link: '/quizzes',
    btnText: '去做题 →',
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
