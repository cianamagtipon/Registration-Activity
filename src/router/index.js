import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      component: () => import('../components/views/DashboardView.vue'),
    },
    {
      path: '/masterlist',
      component: () => import('../components/views/MasterlistView.vue'),
    },
  ],
})

export default router
