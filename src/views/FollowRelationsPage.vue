<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppLink from '@/components/AppLink.vue'
import TransitionFade from '@/components/TransitionFade.vue'

const props = defineProps<{ username: string }>()
const route = useRoute()
</script>

<template>
  <main class="bg-gray-100 h-[calc(100vh-56px)]">
    <section class="mx-auto max-w-7xl bg-white h-full">
      <div class="flex items-center">
        <AppLink
          active-class="bg-green-500 text-white font-bold"
          inactive-class="hover:bg-gray-200"
          class="p-4 grow text-center bg-gray-100"
          :to="{ name: 'UserFollowers', params: { username: props.username } }"
        >
          Followers
        </AppLink>
        <AppLink
          active-class="bg-green-500 text-white font-bold"
          inactive-class="hover:bg-gray-200"
          class="p-4 grow text-center bg-gray-100"
          :to="{ name: 'UserFollowings', params: { username: props.username } }"
        >
          Followings
        </AppLink>
      </div>

      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <TransitionFade>
            <KeepAlive>
              <Suspense>
                <component :is="Component" :key="route.fullPath"></component>
              </Suspense>
            </KeepAlive>
          </TransitionFade>
        </template>
      </RouterView>
    </section>
  </main>
</template>
