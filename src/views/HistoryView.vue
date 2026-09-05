<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { historyData } from '../data/historyData'
import appData from '../data/appData'
import MermaidWrapper from '../components/MermaidWrapper.vue'

// 活跃章节与滚动定位状态
const activeEraId = ref(1)
const isPillarsActive = ref(false)

// 各时期的深度扩展区折叠状态（默认展开图谱，转折事件按需展开）
const expandedSections = ref({
  1: { chart: true, milestones: false },
  2: { chart: true, milestones: false },
  3: { chart: true, milestones: false },
  4: { chart: true, milestones: false },
  5: { chart: true, milestones: false },
  6: { chart: true, milestones: false }
})

const toggleAccordion = (eraId, sectionKey) => {
  if (!expandedSections.value[eraId]) {
    expandedSections.value[eraId] = { chart: false, milestones: false }
  }
  expandedSections.value[eraId][sectionKey] = !expandedSections.value[eraId][sectionKey]
}

// 概念库反向索引查询
const conceptMap = computed(() => {
  const map = new Map()
  if (appData && appData.concepts) {
    appData.concepts.forEach(c => {
      map.set(c.id, c)
    })
  }
  return map
})

const getConcept = (id) => conceptMap.value.get(id)

// 平滑滚动定位函数（支持 prefers-reduced-motion）
const scrollToSection = (anchorId, eraId = null, isPillars = false) => {
  const el = document.getElementById(anchorId)
  if (el) {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: isReduced ? 'auto' : 'smooth', block: 'start' })
    if (eraId) {
      activeEraId.value = eraId
      isPillarsActive.value = false
    }
    if (isPillars) {
      isPillarsActive.value = true
    }
  }
}

// 滚动监听 IntersectionObserver
let observer = null

onMounted(() => {
  const options = {
    root: null,
    rootMargin: '-15% 0px -65% 0px',
    threshold: 0
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetId = entry.target.id
        if (targetId === 'era-pillars') {
          isPillarsActive.value = true
        } else if (entry.target.dataset.eraId) {
          activeEraId.value = parseInt(entry.target.dataset.eraId, 10)
          isPillarsActive.value = false
        }
      }
    })
  }, options)

  document.querySelectorAll('.history-era-section, .socialism-pillars-section').forEach(section => {
    observer.observe(section)
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// LaTeX 简单行内公式替换
const renderMath = (text) => {
  if (!text) return ''
  return text
    .replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>')
    .replace(/\n/g, '<br/>')
}
</script>

<template>
  <main class="history-page-wrap">
    <!-- 顶部 Hero 区域 -->
    <header class="history-hero">
      <div class="history-hero-content">
        <div class="hero-tag">唯物史观 · 政治经济学全景专题</div>
        <h1 class="hero-title">{{ historyData.title }}</h1>
        <p class="hero-subtitle">{{ historyData.subtitle }}</p>
        <div class="hero-intro-card">
          <p>{{ historyData.intro }}</p>
        </div>

        <!-- 首屏“历史长廊全景总览时间轴” (Hero Corridor Map) -->
        <div class="hero-corridor-nav">
          <div class="corridor-nav-title">
            <span class="corridor-icon">🏛️</span>
            <span>长廊演进全景导航 · 点击直达历史时期</span>
          </div>
          <div class="corridor-track-scroll">
            <button
              v-for="era in historyData.eras"
              :key="era.id"
              :class="['corridor-node-card', { active: activeEraId === era.id && !isPillarsActive }]"
              :aria-current="activeEraId === era.id && !isPillarsActive ? 'step' : undefined"
              @click="scrollToSection(era.anchor, era.id, false)"
            >
              <div class="node-num">0{{ era.id }}</div>
              <div class="node-short-name">{{ era.shortName }}</div>
              <div class="node-period">{{ era.period }}</div>
            </button>
            
            <!-- 终章快速入口 -->
            <button
              :class="['corridor-node-card pillars-node', { active: isPillarsActive }]"
              :aria-current="isPillarsActive ? 'step' : undefined"
              @click="scrollToSection('era-pillars', null, true)"
            >
              <div class="node-num">🚩</div>
              <div class="node-short-name">现实课题</div>
              <div class="node-period">历史趋势与条件</div>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 移动端吸顶横向导航条 (<= 1024px) -->
    <nav class="mobile-phase-navbar" aria-label="移动端时期快速导航">
      <div class="mobile-phase-scroll">
        <button
          v-for="era in historyData.eras"
          :key="era.id"
          :class="['mobile-phase-chip', { active: activeEraId === era.id && !isPillarsActive }]"
          :aria-current="activeEraId === era.id && !isPillarsActive ? 'step' : undefined"
          @click="scrollToSection(era.anchor, era.id, false)"
        >
          <span>0{{ era.id }} {{ era.shortName }}</span>
        </button>
        <button
          :class="['mobile-phase-chip pillars-chip', { active: isPillarsActive }]"
          :aria-current="isPillarsActive ? 'step' : undefined"
          @click="scrollToSection('era-pillars', null, true)"
        >
          <span>🚩 现实课题</span>
        </button>
      </div>
    </nav>

    <!-- 主体区域：对称三列网格（左占位 + 中间主体 + 右侧精简时空轴） -->
    <div class="history-main-layout history-container">
      <!-- 左侧平衡占位区 -->
      <div class="history-sidebar-spacer" aria-hidden="true"></div>

      <!-- 中间主体：时期卡片流 -->
      <section class="history-content-flow">
        <!-- 6大历史时期卡片 -->
        <article
          v-for="era in historyData.eras"
          :key="era.id"
          :id="era.anchor"
          :data-era-id="era.id"
          class="history-era-section"
        >
          <!-- 1. 时期头部 -->
          <div class="era-header">
            <div class="era-badge-row">
              <span class="era-badge">{{ era.badge }}</span>
              <span class="era-period-tag">🕒 {{ era.period }}</span>
            </div>
            <h2 class="era-main-title">{{ era.title }}</h2>
            <h3 class="era-sub-title">{{ era.subtitle }}</h3>
            
            <!-- 时代命题金句卡 -->
            <div class="era-core-proposition" v-if="era.coreProposition">
              <span class="prop-icon">💡</span>
              <div class="prop-text">
                <strong>时代命题：</strong>{{ era.coreProposition }}
              </div>
            </div>

            <p class="era-summary-text">{{ era.summary }}</p>
          </div>

          <!-- 2. 双线并进核心卡片区：经济演变机制 vs 工人运动探索 -->
          <div class="era-dual-track-grid">
            <!-- 资本主义经济矛盾机制 -->
            <div class="track-card economics-track">
              <div class="track-header">
                <span class="track-icon">📈</span>
                <h4 class="track-title">资本主义经济矛盾演化</h4>
              </div>
              <div class="track-body">
                <div v-for="(mech, mIdx) in era.keyMechanisms" :key="mIdx" class="mechanism-item">
                  <h5 class="mech-name">{{ mech.title }}</h5>
                  <p class="mech-desc">{{ mech.desc }}</p>
                </div>
              </div>
            </div>

            <!-- 工人运动与社会主义探索 -->
            <div class="track-card labor-track">
              <div class="track-header">
                <span class="track-icon">🚩</span>
                <h4 class="track-title">{{ era.laborMovement.title }}</h4>
              </div>
              <div class="track-body">
                <p class="labor-intro">{{ era.laborMovement.content }}</p>
                <div class="labor-milestones-list">
                  <div
                    v-for="(lm, lIdx) in era.laborMovement.milestones"
                    :key="lIdx"
                    class="labor-milestone-item"
                  >
                    <div class="lm-tag-row">
                      <span class="lm-year">{{ lm.year }}</span>
                      <strong class="lm-event">{{ lm.event }}</strong>
                    </div>
                    <p class="lm-detail">{{ lm.detail }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 可折叠深度扩展区（收束嵌套层级） -->
          <div class="era-accordion-group">
            <!-- 矛盾演变图谱折叠卡 -->
            <div class="accordion-item">
              <button
                class="accordion-trigger"
                :aria-expanded="expandedSections[era.id]?.chart"
                @click="toggleAccordion(era.id, 'chart')"
              >
                <div class="acc-title-left">
                  <span class="acc-icon">📊</span>
                  <strong>唯物史观矛盾演进图谱</strong>
                  <small class="acc-hint">（点击折叠 / 展开）</small>
                </div>
                <span class="acc-chevron">{{ expandedSections[era.id]?.chart ? '▲' : '▼' }}</span>
              </button>
              <div v-show="expandedSections[era.id]?.chart" class="accordion-panel chart-panel">
                <div class="chart-read-tip">
                  <span>💡 读图指引：展示该时期生产力变革、生产关系矛盾与阶级抗争的客观演进脉络</span>
                </div>
                <MermaidWrapper :title="era.title" :content="era.mermaid" />
              </div>
            </div>

            <!-- 标志性历史转折与代表事件折叠卡 -->
            <div class="accordion-item">
              <button
                class="accordion-trigger"
                :aria-expanded="expandedSections[era.id]?.milestones"
                @click="toggleAccordion(era.id, 'milestones')"
              >
                <div class="acc-title-left">
                  <span class="acc-icon">🏛️</span>
                  <strong>标志性历史转折与代表事件 ({{ era.milestones.length }}条)</strong>
                </div>
                <span class="acc-chevron">{{ expandedSections[era.id]?.milestones ? '▲' : '▼' }}</span>
              </button>
              <div v-show="expandedSections[era.id]?.milestones" class="accordion-panel">
                <ul class="milestones-bullet-list">
                  <li v-for="(ms, msIdx) in era.milestones" :key="msIdx">
                    {{ ms }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 关联《资本论》核心文献概念 -->
            <div v-if="era.relatedConceptIds && era.relatedConceptIds.length" class="accordion-item static-item">
              <div class="accordion-static-header">
                <span class="acc-icon">📖</span>
                <strong>关联《资本论》核心理论概念</strong>
              </div>
              <div class="accordion-panel static-panel">
                <div class="concepts-tag-grid">
                  <template v-for="cid in era.relatedConceptIds" :key="cid">
                    <router-link
                      v-if="getConcept(cid)"
                      :to="`/concepts/${cid}`"
                      class="concept-link-badge"
                    >
                      <span class="badge-chapter">{{ getConcept(cid).chapter.split(' ')[0] }}</span>
                      <span class="badge-title">{{ getConcept(cid).core?.title || getConcept(cid).title }}</span>
                      <span class="badge-arrow">→</span>
                    </router-link>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- 终章：走向社会主义的历史趋势与现实条件 -->
        <article id="era-pillars" class="socialism-pillars-section">
          <div class="pillars-header">
            <div class="pillars-badge">历史趋势 · 唯物辩证收束</div>
            <h2 class="pillars-main-title">{{ historyData.socialismPillars.title }}</h2>
            <h3 class="pillars-sub-title">{{ historyData.socialismPillars.subtitle }}</h3>
            <p class="pillars-conclusion-lead">{{ historyData.socialismPillars.conclusion }}</p>
          </div>

          <div class="pillars-grid">
            <div
              v-for="p in historyData.socialismPillars.pillars"
              :key="p.num"
              class="pillar-card"
            >
              <div class="pillar-card-top">
                <span class="pillar-icon">{{ p.icon }}</span>
                <span class="pillar-num">{{ p.num }}</span>
              </div>
              <div class="pillar-name">{{ p.name }}</div>
              <h4 class="pillar-title">{{ p.title }}</h4>
              <p class="pillar-desc">{{ p.desc }}</p>
            </div>
          </div>

          <!-- 原著经典引文 -->
          <blockquote class="pillars-quote">
            <p v-html="renderMath(historyData.socialismPillars.classicQuote)"></p>
            <cite>—— {{ historyData.socialismPillars.quoteSource }}</cite>
          </blockquote>

          <!-- 底部导航跳转 -->
          <div class="history-bottom-actions">
            <router-link to="/concepts" class="bottom-action-btn primary">
              <span>📚 前往《资本论》核心概念库深度研读</span>
            </router-link>
            <router-link to="/quizzes" class="bottom-action-btn secondary">
              <span>✍️ 进入政治经济学全真题库测验</span>
            </router-link>
          </div>
        </article>
      </section>

      <!-- 右侧：悬浮精简时空轴导航 -->
      <aside class="history-sidebar">
        <div class="timeline-nav-sticky">
          <div class="timeline-nav-header">
            <span class="timeline-nav-icon">⏳</span>
            <span class="timeline-nav-title">演进时空轴</span>
          </div>
          <nav class="timeline-nav-list" aria-label="历史时期导航">
            <button
              v-for="era in historyData.eras"
              :key="era.id"
              :class="['timeline-nav-btn', { active: activeEraId === era.id && !isPillarsActive }]"
              :aria-current="activeEraId === era.id && !isPillarsActive ? 'step' : undefined"
              @click="scrollToSection(era.anchor, era.id, false)"
            >
              <span class="nav-step-dot"></span>
              <span class="nav-step-info">
                <small class="nav-step-period">{{ era.period.split(' ')[0] }}</small>
                <strong class="nav-step-name">{{ era.shortName }} · {{ era.title.split('与')[0] }}</strong>
              </span>
            </button>

            <!-- 终章导航 -->
            <button
              :class="['timeline-nav-btn pillars-btn', { active: isPillarsActive }]"
              :aria-current="isPillarsActive ? 'step' : undefined"
              @click="scrollToSection('era-pillars', null, true)"
            >
              <span class="nav-step-dot red"></span>
              <span class="nav-step-info">
                <small class="nav-step-period">现实课题</small>
                <strong class="nav-step-name">走向社会主义</strong>
              </span>
            </button>
          </nav>
        </div>
      </aside>
    </div>
  </main>
</template>
