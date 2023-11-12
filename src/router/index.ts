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
          props: true,
          beforeEnter: async (to, from, next) => {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 100)
            })
            const userStore = useUserStore()
            if (!userStore.isLoggedIn || userStore.user?.username !== to.params.username)
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
          name: 'UserArticles',
          props: true
        },
        {
          path: 'favourite',
          component: () => import('@/views/UserFavouriteArticlesPage.vue'),
          name: 'UserFavouriteArticles',
          props: true
        }
      ]
    },
    {
      path: '/:username',
      name: 'UserFollowRelations',
      component: () => import('@/views/FollowRelationsPage.vue'),
      props: true,
      children: [
        {
          path: 'followings',
          name: 'UserFollowings',
          component: () => import('@/views/UserFollowingsPage.vue'),
          props: true
        },
        {
          path: 'followers',
          name: 'UserFollowers',
          component: () => import('@/views/UserFollowersPage.vue'),
          props: true
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
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

let visited = false
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (!visited) {
    await userStore.refreshAccessToken().catch((e) => {})
    visited = true
  }
  if (to.meta.requireAuth && !userStore.isLoggedIn) {
    next({ name: 'Login' })
  } else next()
})

export default router
