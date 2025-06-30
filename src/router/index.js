import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../components/views/LoginView.vue'

import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

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
      name: 'dashboard',
      component: () => import('../components/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/masterlist',
      name: 'masterlist',
      component: () => import('../components/views/MasterlistView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore()
        const { isLoggedIn } = storeToRefs(userStore)

        if (isLoggedIn.value) {
          next({ name: 'dashboard' })
        } else {
          next({ name: 'login' })
        }
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const { isLoggedIn } = storeToRefs(userStore)

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isLoggedIn.value) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
