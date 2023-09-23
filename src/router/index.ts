import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('@/views/SignupPage.vue')
    },
    {
      path: '/profile/:id',
      name: 'Profile',
      component: () => import('@/views/ProfilePage.vue')
    }
  ]
})

export default router
