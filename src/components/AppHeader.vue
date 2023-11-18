<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import IconChevronDown from '@/components/icons/ChevronDown.vue'
import IconSearch from '@/components/icons/Search.vue'
import IconCross from '@/components/icons/Cross.vue'

const userStore = useUserStore()
const router = useRouter()

const isMenuOpened = ref(false)
const isSearchBarOpened = ref(false)
const searchQuery = ref('')
const menu = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (e.target instanceof HTMLElement && !menu.value?.contains(e.target)) isMenuOpened.value = false
}

function handleResize() {
  if (window.innerWidth > 640) isSearchBarOpened.value = false
}

function search() {
  router.push({ name: 'Search', query: { query: searchQuery.value } })
  searchQuery.value = ''
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header class="shadow-lg">
    <div class="max-w-7xl mx-auto flex items-center h-[56px] px-4">
      <div class="flex items-center gap-x-4 w-full sm:w-fit">
        <RouterLink :class="[isSearchBarOpened ? 'hidden sm:block' : '']" to="/">
          <span class="font-bold text-xl uppercase">Hublish</span>
        </RouterLink>
        <form
          @submit.prevent="search"
          :class="[isSearchBarOpened ? 'flex basis-full' : 'hidden sm:flex w-[275px]']"
          class=""
        >
          <button type="button" @click.prevent="isSearchBarOpened = false">
            <IconCross class="w-6 h-6 text-black sm:hidden mr-2"></IconCross>
          </button>
          <input
            v-model="searchQuery"
            class="px-2 py-1.5 border-2 rounded-l-lg w-full"
            type="text"
          />
          <button
            type="submit"
            class="self-stretch flex items-center px-2 rounded-r-lg bg-gray-200"
          >
            <IconSearch class="w-6 h-6"></IconSearch>
          </button>
        </form>
        <button
          @click="isSearchBarOpened = true"
          :class="[isSearchBarOpened ? 'hidden' : 'sm:hidden block']"
          class="px-2 py-2 rounded-full bg-gray-200"
        >
          <IconSearch class="w-6 h-6"></IconSearch>
        </button>
      </div>
      <div
        v-if="!userStore.isLoggedIn"
        :class="[isSearchBarOpened ? 'hidden' : 'flex']"
        class="ml-auto shrink-0 items-center gap-x-4"
      >
        <RouterLink class="hover:text-green-500" to="/login"> Log in </RouterLink>
        <RouterLink class="hover:text-green-500" to="/signup"> Sign up </RouterLink>
      </div>

      <div
        v-else
        @click.stop="isMenuOpened = !isMenuOpened"
        :class="[isSearchBarOpened ? 'hidden' : 'flex']"
        class="ml-auto flex items-center gap-x-4 relative group cursor-pointer"
      >
        <img :src="userStore.user?.image" class="h-10 w-10 rounded-full bg-gray-300 shrink-0" />
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
            :to="{ name: 'Profile', params: { username: userStore.user?.username } }"
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
