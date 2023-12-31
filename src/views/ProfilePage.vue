<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { UserSchema, type User } from '@/schemas/user'
import { useUserStore } from '@/stores/user.store'

const user = ref<User | null>(null)
const userStore = useUserStore()

const props = defineProps<{ username: string }>()
const response = await axios.get(`/api/users/${props.username}/profile`)
if (response.status === 200) {
  const validateRes = UserSchema.safeParse(response.data)
  if (!validateRes.success) throw 'Error'
  user.value = validateRes.data
}
</script>

<template>
  <main>
    <div class="max-w-7xl mx-auto">
      <section>
        <div class="h-[250px] bg-green-400"></div>

        <div class="flex items-start relative py-4 px-4 sm:h-[100px] h-[75px]">
          <img
            :src="user?.image"
            class="top-0 -translate-y-[calc(50%+16px)] sm:h-[200px] sm:w-[200px] h-[150px] w-[150px] shrink-0 rounded-full border-4 border-white bg-gray-200"
          />

          <div v-if="userStore.user?.id === user?.id" class="ml-auto">
            <button class="bg-white border-2 py-2 px-4 rounded-lg">Edit profile</button>
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
          <p>
            follower: {{ user?.followerCount }} following:
            {{ user?.followingCount }}
          </p>
        </div>
        <div class="flex items-center bg-gray-100">
          <RouterLink
            :to="{ name: 'UserFeed', params: { username: props.username } }"
            class="py-4 w-full text-center hover:bg-gray-200"
          >
            Feed
          </RouterLink>
          <RouterLink
            :to="{ name: 'UserArticles', params: { username: props.username } }"
            class="py-4 w-full text-center hover:bg-gray-200"
          >
            Articles
          </RouterLink>
          <RouterLink
            :to="{ name: 'UserFavouriteArticles', params: { username: props.username } }"
            class="py-4 w-full text-center hover:bg-gray-200"
          >
            Favourite
          </RouterLink>
        </div>
      </section>
      <section class="py-12">
        <RouterView :user_id="user?.id"></RouterView>
      </section>
    </div>
  </main>
</template>
