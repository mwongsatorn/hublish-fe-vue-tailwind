import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
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
      path: '/:username',
      name: 'Profile',
      component: () => import('@/views/ProfilePage.vue'),
      props: true,
      redirect: {
        name: 'UserFeed'
      },
      children: [
        {
          path: 'feed',
          component: () => import('@/views/UserFeedPage.vue'),
          name: 'UserFeed',
          beforeEnter: (to, from, next) => {
            const userStore = useUserStore()
            if (!userStore.isLoggedIn || userStore.user.username !== to.params.username)
              return next({
                name: 'UserArticles',
                params: {
                  username: to.params.username
                }
              })

            return next()
          }
        },
        {
          path: 'articles',
          component: () => import('@/views/UserArticlesPage.vue'),
          name: 'UserArticles'
        },
        {
          path: 'favourite',
          component: () => import('@/views/UserFavouriteArticlesPage.vue'),
          name: 'UserFavouriteArticles'
        }
      ]
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsPage.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/articles/create',
      name: 'CreateArticle',
      component: () => import('@/views/CreateArticlePage.vue'),
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/articles/:slug/edit',
      name: 'EditArticle',
      component: () => import('@/views/EditArticlePage.vue'),
      meta: {
        requireAuth: true
      },
      props: true
    },
    {
      path: '/articles/:slug',
      name: 'ArticleDetails',
      component: () => import('@/views/ArticleDetailsPage.vue'),
      props: true
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.isLoggedIn) {
    await userStore.refreshAccessToken()
  }
  if (to.meta?.requireAuth && !userStore.isLoggedIn) {
    next({ name: 'Login' })
  } else next()
})

export default router
