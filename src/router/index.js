import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  // 每次切页回到页面顶部（避免从底部点"下一节"后新页面还停在底部）
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/concepts',
      name: 'concepts',
      component: () => import('../views/ConceptsView.vue'),
    },
    {
      path: '/concepts/:id',
      name: 'concept-detail',
      component: () => import('../views/ConceptDetailView.vue'),
      props: true,
    },
    {
      path: '/quizzes',
      name: 'quizzes',
      component: () => import('../views/QuizzesView.vue'),
    },
    {
      path: '/quizzes/:idx(\\d+)',
      name: 'quiz-chapter',
      component: () => import('../views/QuizChapterView.vue'),
      props: true,
    },
  ],
})

export default router
