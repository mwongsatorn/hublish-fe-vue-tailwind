<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLink from '@/components/AppLink.vue'
import TransitionFade from '@/components/TransitionFade.vue'

const props = defineProps<{ username: string }>()
const isFinished = ref(false)
const route = useRoute()

function finishedLoading() {
  isFinished.value = true
}
</script>

<template>
  <div v-show="isFinished" class="mx-auto min-h-[calc(100vh-56px)] max-w-7xl bg-white">
    <div class="flex items-center">
      <AppLink
        active-class="bg-green-500 text-white font-bold"
        inactive-class="hover:bg-gray-200"
        class="grow bg-gray-100 p-4 text-center"
        :to="{ name: 'UserFollowers', params: { username: props.username } }"
      >
        Followers
      </AppLink>
      <AppLink
        active-class="bg-green-500 text-white font-bold"
        inactive-class="hover:bg-gray-200"
        class="grow bg-gray-100 p-4 text-center"
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
              <component
                :is="Component"
                :key="route.fullPath"
                :finishedLoading="finishedLoading"
              ></component>
            </Suspense>
          </KeepAlive>
        </TransitionFade>
      </template>
    </RouterView>
  </div>
</template>
