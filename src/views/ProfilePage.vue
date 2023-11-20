<script setup lang="ts">
import { computed, ref } from 'vue'
import axios from 'axios'
import { type User } from '@/schemas/user'
import { useUserStore } from '@/stores/user.store'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import IconWrite from '@/components/icons/Write.vue'
import IconFollow from '@/components/icons/Follow.vue'
import IconUnfollow from '@/components/icons/Unfollow.vue'
import AppLink from '@/components/AppLink.vue'

const user = ref<User | null>(null)
const userStore = useUserStore()
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

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.username !== from.params.username) {
    const response = await axios.get<User>(`/api/users/${to.params.username}/profile`)
    user.value = response.data
  }
})
</script>

<template>
  <main>
    <div class="max-w-7xl mx-auto">
      <section>
        <div class="h-[250px] bg-gray-300"></div>

        <div class="flex items-start relative py-4 px-4 sm:h-[100px] h-[75px]">
          <img
            :src="user?.image"
            class="top-0 -translate-y-[calc(50%+16px)] sm:h-[200px] sm:w-[200px] h-[150px] w-[150px] shrink-0 rounded-full border-4 border-white bg-gray-200"
          />

          <div class="ml-auto">
            <AppLink
              v-if="userStore.user?.id === user?.id"
              :to="{ name: 'CreateArticle' }"
              class="px-4 py-2 flex items-center gap-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <span class="hidden sm:inline-block">Write article</span>
              <IconWrite class="sm:w-6 sm:h-6 w-4 h-4"></IconWrite>
            </AppLink>

            <button
              @click="followHandler"
              v-else
              :class="[user?.followed ? 'hover:bg-rose-600 hover:text-white' : 'hover:bg-gray-200']"
              class="ml-auto self-center flex items-center gap-x-4 px-4 py-2 bg-gray-100 rounded-lg"
            >
              <span class="hidden sm:inline-block">{{ followStatusText }}</span>
              <component class="h-4 w-4" :is="followStatusIcon[followStatusText]"></component>
            </button>
          </div>
        </div>
        <div class="space-y-2 px-4 py-4 overflow-hidden">
          <div>
            <p class="text-2xl font-bold sm:text-start truncate">{{ user?.name }}</p>
            <p class="font-bold sm:text-start truncate">@{{ user?.username }}</p>
          </div>
          <p class="sm:text-start truncate">
            {{ user?.bio }}
          </p>
          <div class="flex items-center gap-x-4">
            <AppLink
              class="hover:underline hover:font-bold"
              :to="{ name: 'UserFollowers', params: { username: user?.username } }"
            >
              followers: {{ user?.followerCount }}
            </AppLink>

            <AppLink
              class="hover:underline hover:font-bold"
              :to="{ name: 'UserFollowings', params: { username: user?.username } }"
            >
              followings: {{ user?.followingCount }}
            </AppLink>
          </div>
        </div>
        <div class="flex items-center bg-gray-100">
          <AppLink
            v-if="userStore.user?.username === user?.username"
            :to="{ name: 'UserFeed' }"
            active-class="bg-green-500 text-white font-bold"
            inactive-class="hover:bg-gray-200"
            class="py-4 w-full text-center"
          >
            Feed
          </AppLink>
          <AppLink
            :to="{ name: 'UserArticles' }"
            active-class="bg-green-500 text-white font-bold"
            inactive-class="hover:bg-gray-200"
            class="py-4 w-full text-center"
          >
            Articles
          </AppLink>
          <AppLink
            :to="{ name: 'UserFavouriteArticles' }"
            active-class="bg-green-500 text-white font-bold"
            inactive-class="hover:bg-gray-200"
            class="py-4 w-full text-center"
          >
            Favourites
          </AppLink>
        </div>
      </section>
      <section class="py-12">
        <RouterView></RouterView>
      </section>
    </div>
  </main>
</template>
