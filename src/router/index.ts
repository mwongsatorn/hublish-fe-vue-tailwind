import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import HomePage from '@/views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundPage.vue')
    },
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginPage.vue'),
      beforeEnter: () => {
        const userStore = useUserStore()
        if (userStore.isLoggedIn) {
          return {
            name: 'Home'
          }
        }
      }
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
      redirect: (to) => {
        const userStore = useUserStore()
        if (userStore.user?.username !== to.params.username)
          return {
            name: 'UserCreatedArticles',
            params: {
              username: to.params.username
            }
          }
        else
          return {
            name: 'UserFeedArticles',
            params: {
              username: to.params.username
            }
          }
      },
      children: [
        {
          path: 'feed',
          component: () => import('@/views/UserArticlesPage.vue'),
          name: 'UserFeedArticles',
          props: true
        },
        {
          path: 'articles',
          component: () => import('@/views/UserArticlesPage.vue'),
          name: 'UserCreatedArticles',
          props: true
        },
        {
          path: 'favourites',
          component: () => import('@/views/UserArticlesPage.vue'),
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
          component: () => import('@/views/FollowRelationsNestedPage.vue'),
          props: true
        },
        {
          path: 'followers',
          name: 'UserFollowers',
          component: () => import('@/views/FollowRelationsNestedPage.vue'),
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
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/SearchPage.vue'),
      redirect: { name: 'SearchArticles' },
      children: [
        {
          path: 'articles',
          name: 'SearchArticles',
          component: () => import('@/views/SearchNestedPage.vue')
        },
        {
          path: 'tags',
          name: 'SearchTags',
          component: () => import('@/views/SearchNestedPage.vue')
        },
        {
          path: 'people',
          name: 'SearchUsers',
          component: () => import('@/views/SearchNestedPage.vue')
        }
      ]
    }
  ],
  scrollBehavior(to, from) {
    if (from.params.username && to.params.username && from.params.username === to.params.username)
      return
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 300)
    })
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
