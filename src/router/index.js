import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
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
  ],
})

export default router
