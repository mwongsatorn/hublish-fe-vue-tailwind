<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import IconChevronDown from '@/components/icons/ChevronDown.vue'

const userStore = useUserStore()

const isMenuOpened = ref(false)
const menu = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (e.target instanceof HTMLElement && !menu.value?.contains(e.target)) isMenuOpened.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="shadow-lg">
    <div class="max-w-7xl mx-auto flex items-center h-[56px] px-4">
      <RouterLink to="/">
        <span class="font-bold text-xl uppercase">Hublish</span>
      </RouterLink>
      <div v-if="!userStore.isLoggedIn" class="ml-auto flex items-center gap-x-4">
        <RouterLink class="hover:text-green-500" to="/login"> Log in </RouterLink>
        <RouterLink class="hover:text-green-500" to="/signup"> Sign up </RouterLink>
      </div>

      <div
        @click.stop="isMenuOpened = !isMenuOpened"
        v-else
        class="ml-auto flex items-center gap-x-4 relative group cursor-pointer"
      >
        <div class="h-10 w-10 rounded-full bg-gray-300" />
        <div class="sm:block hidden">
          <span>{{ userStore.user?.username }}</span>
        </div>
        <div>
          <IconChevronDown class="h-6 w-6"></IconChevronDown>
        </div>
        <div
          v-show="isMenuOpened"
          ref="menu"
          class="w-full min-w-[200px] bg-white absolute top-[140%] right-0 p-2"
        >
          <RouterLink
            class="px-4 py-2 block text-center hover:bg-gray-200"
            :to="`/${userStore.user?.username}`"
          >
            Profile
          </RouterLink>
          <RouterLink class="px-4 py-2 block text-center hover:bg-gray-200" :to="`/settings`">
            Settings
          </RouterLink>
          <RouterLink
            @click="userStore.logOut"
            class="px-4 py-2 block text-center hover:bg-gray-200"
            to="/"
          >
            Log out
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
