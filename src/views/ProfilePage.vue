<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { type User } from '@/types/index'
import { useUserStore } from '@/stores/user.store'
import { useRouter } from 'vue-router'
import IconWrite from '@/components/icons/Write.vue'
import IconFollow from '@/components/icons/Follow.vue'
import IconUnfollow from '@/components/icons/Unfollow.vue'
import AppLink from '@/components/AppLink.vue'
import TransitionFade from '@/components/TransitionFade.vue'

const user = ref<User | null>(null)
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const props = defineProps<{ username: string }>()
const followStatusText = computed(() => {
  if (user.value?.followed) return 'Unfollow'
  else return 'Follow'
})
const followStatusIcon = {
  Follow: IconFollow,
  Unfollow: IconUnfollow
}

const response = await axios.get<User>(`/api/users/${props.username}/profile`)
user.value = response.data

async function followHandler() {
  if (!userStore.isLoggedIn) return router.push({ name: 'Login' })
  if (user.value?.followed) {
    const unfollow = confirm('Are you sure you want to unfollow this person')
    if (!unfollow) return
    await axios.delete(`/api/users/${user.value?.username}/follow`)
    user.value!.followed = false
    user.value!.followerCount--
  } else {
    await axios.post(`/api/users/${user.value?.username}/follow`)
    user.value!.followed = true
    user.value!.followerCount++
  }
}
</script>

<template>
  <div class="mx-auto min-h-[calc(100vh-56px)] max-w-7xl bg-white">
    <section>
      <div class="h-[250px] bg-gradient-to-r from-green-700 to-green-400 opacity-75"></div>

      <div class="relative flex h-[75px] items-start px-4 py-4 sm:h-[100px]">
        <img
          :src="user?.image"
          class="top-0 h-[150px] w-[150px] shrink-0 -translate-y-[calc(50%+16px)] rounded-full border-4 border-white bg-gray-200 sm:h-[200px] sm:w-[200px]"
        />

        <div class="ml-auto">
          <AppLink
            v-if="userStore.user?.id === user?.id"
            :to="{ name: 'CreateArticle' }"
            class="flex items-center gap-x-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
          >
            <span class="hidden sm:inline-block">Write article</span>
            <IconWrite class="h-4 w-4 sm:h-6 sm:w-6"></IconWrite>
          </AppLink>

          <button
            @click="followHandler"
            v-else
            :class="[user?.followed ? 'hover:bg-rose-600 hover:text-white' : 'hover:bg-gray-200']"
            class="ml-auto flex items-center gap-x-4 self-center rounded-lg bg-gray-100 px-4 py-2"
          >
            <span class="hidden sm:inline-block">{{ followStatusText }}</span>
            <component class="h-4 w-4" :is="followStatusIcon[followStatusText]"></component>
          </button>
        </div>
      </div>
      <div class="space-y-2 overflow-hidden px-4 py-4">
        <div>
          <p class="truncate text-2xl font-bold sm:text-start">{{ user?.name }}</p>
          <p class="truncate font-bold sm:text-start">@{{ user?.username }}</p>
        </div>
        <p class="truncate sm:text-start">
          {{ user?.bio }}
        </p>
        <div class="flex items-center gap-x-4">
          <AppLink
            class="hover:font-bold hover:underline"
            :to="{ name: 'UserFollowers', params: { username: props.username } }"
          >
            followers: {{ user?.followerCount }}
          </AppLink>

          <AppLink
            class="hover:font-bold hover:underline"
            :to="{ name: 'UserFollowings', params: { username: props.username } }"
          >
            followings: {{ user?.followingCount }}
          </AppLink>
        </div>
      </div>
      <div class="flex items-center bg-gray-100">
        <AppLink
          v-if="userStore.user?.username === user?.username"
          :to="{ name: 'UserFeedArticles', params: { username: props.username } }"
          active-class="bg-green-500 text-white font-bold"
          inactive-class="hover:bg-gray-200"
          class="w-full py-4 text-center"
        >
          Feed
        </AppLink>
        <AppLink
          :to="{ name: 'UserCreatedArticles', params: { username: props.username } }"
          active-class="bg-green-500 text-white font-bold"
          inactive-class="hover:bg-gray-200"
          class="w-full py-4 text-center"
        >
          Articles
        </AppLink>
        <AppLink
          :to="{ name: 'UserFavouriteArticles', params: { username: props.username } }"
          active-class="bg-green-500 text-white font-bold"
          inactive-class="hover:bg-gray-200"
          class="w-full py-4 text-center"
        >
          Favourites
        </AppLink>
      </div>
    </section>
    <section class="py-8">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <TransitionFade>
            <KeepAlive :max="3">
              <Suspense>
                <component :is="Component" :key="route.fullPath"></component>
              </Suspense>
            </KeepAlive>
          </TransitionFade>
        </template>
      </RouterView>
    </section>
  </div>
</template>
