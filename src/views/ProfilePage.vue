<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { type User } from '@/schemas/user'
import { useUserStore } from '@/stores/user.store'
import IconWrite from '@/components/icons/Write.vue'
import { onBeforeRouteUpdate } from 'vue-router'

const user = ref<User | null>(null)
const userStore = useUserStore()

const props = defineProps<{ username: string }>()
const response = await axios.get<User>(`/api/users/${props.username}/profile`)
user.value = response.data

async function followUser() {
  await axios.post(`/api/users/${user.value?.username}/follow`)
  user.value!.followed = true
  user.value!.followerCount++
}

async function unfollowUser() {
  const unfollow = confirm('Are you sure you want to unfollow this person')
  if (!unfollow) return
  await axios.delete(`/api/users/${user.value?.username}/follow`)
  user.value!.followed = false
  user.value!.followerCount--
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
            <RouterLink
              v-if="userStore.user?.id === user?.id"
              :to="{ name: 'CreateArticle' }"
              class="px-4 py-2 flex items-center gap-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <span class="hidden sm:inline-block">Write article</span>
              <IconWrite class="sm:w-6 sm:h-6 w-4 h-4"></IconWrite>
            </RouterLink>

            <button
              v-else-if="!user?.followed"
              @click="followUser"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Follow
            </button>
            <button
              v-else-if="user?.followed"
              @click="unfollowUser"
              class="px-4 py-2 bg-gray-100 hover:bg-rose-600 hover:text-white rounded-lg"
            >
              Unfollow
            </button>
          </div>
        </div>
        <div class="space-y-2 px-4 py-4">
          <div>
            <p class="text-2xl font-bold sm:text-start">{{ user?.name }}</p>
            <p class="font-bold sm:text-start">@{{ user?.username }}</p>
          </div>
          <p class="sm:text-start">
            {{ user?.bio }}
          </p>
          <div class="flex items-center gap-x-4">
            <RouterLink
              class="hover:underline hover:font-bold"
              :to="{ name: 'UserFollowers', params: { username: user?.username } }"
            >
              followers: {{ user?.followerCount }}
            </RouterLink>

            <RouterLink
              class="hover:underline hover:font-bold"
              :to="{ name: 'UserFollowings', params: { username: user?.username } }"
            >
              followings: {{ user?.followingCount }}
            </RouterLink>
          </div>
        </div>
        <div class="flex items-center bg-gray-100">
          <RouterLink :to="{ name: 'UserFeed' }" class="py-4 w-full text-center hover:bg-gray-200">
            Feed
          </RouterLink>
          <RouterLink
            :to="{ name: 'UserArticles' }"
            class="py-4 w-full text-center hover:bg-gray-200"
          >
            Articles
          </RouterLink>
          <RouterLink
            :to="{ name: 'UserFavouriteArticles' }"
            class="py-4 w-full text-center hover:bg-gray-200"
          >
            Favourite
          </RouterLink>
        </div>
      </section>
      <section class="py-12">
        <RouterView></RouterView>
      </section>
    </div>
  </main>
</template>
