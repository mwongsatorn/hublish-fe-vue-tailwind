<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.store'
import IconChevronDown from '@/components/icons/ChevronDown.vue'
import IconSearch from '@/components/icons/Search.vue'
import IconCross from '@/components/icons/Cross.vue'
import AppLink from './AppLink.vue'

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
  <header class="sticky top-0 z-[9999] bg-white shadow-lg">
    <div class="mx-auto flex h-[56px] max-w-7xl items-center px-4">
      <div class="flex w-full items-center gap-x-4 sm:w-fit">
        <AppLink :class="[isSearchBarOpened ? 'hidden sm:block' : '']" to="/">
          <span class="text-xl font-bold uppercase">Hublish</span>
        </AppLink>
        <form
          @submit.prevent="search"
          :class="[isSearchBarOpened ? 'flex basis-full' : 'hidden w-[275px] sm:flex']"
          class=""
        >
          <button type="button" @click.prevent="isSearchBarOpened = false">
            <IconCross class="mr-2 h-6 w-6 text-black sm:hidden"></IconCross>
          </button>
          <input
            v-model="searchQuery"
            class="w-full rounded-l-lg border-2 px-2 py-1.5"
            type="text"
          />
          <button
            type="submit"
            class="flex items-center self-stretch rounded-r-lg bg-gray-200 px-2"
          >
            <IconSearch class="h-6 w-6"></IconSearch>
          </button>
        </form>
        <button
          @click="isSearchBarOpened = true"
          :class="[isSearchBarOpened ? 'hidden' : 'block sm:hidden']"
          class="rounded-full bg-gray-200 px-2 py-2"
        >
          <IconSearch class="h-6 w-6"></IconSearch>
        </button>
      </div>
      <div
        v-if="!userStore.isLoggedIn"
        :class="[isSearchBarOpened ? 'hidden' : 'flex']"
        class="ml-auto shrink-0 items-center gap-x-4"
      >
        <AppLink class="hover:text-green-500" to="/login"> Log in </AppLink>
        <AppLink class="hover:text-green-500" to="/signup"> Sign up </AppLink>
      </div>

      <div
        v-else
        @click.stop="isMenuOpened = !isMenuOpened"
        :class="[isSearchBarOpened ? 'hidden' : 'flex']"
        class="group relative ml-auto flex cursor-pointer items-center gap-x-4"
      >
        <img :src="userStore.user?.image" class="h-10 w-10 shrink-0 rounded-full bg-gray-300" />
        <div class="hidden sm:block">
          <span>{{ userStore.user?.username }}</span>
        </div>
        <div>
          <IconChevronDown class="h-6 w-6"></IconChevronDown>
        </div>
        <div
          v-show="isMenuOpened"
          ref="menu"
          class="absolute right-0 top-[140%] w-full min-w-[200px] bg-white shadow-lg"
        >
          <AppLink
            active-class="bg-green-500 font-bold text-white"
            inactive-class="hover:bg-gray-200"
            class="block px-4 py-2 text-center"
            :to="{ name: 'Profile', params: { username: userStore.user?.username } }"
          >
            Profile
          </AppLink>
          <AppLink
            active-class="bg-green-500 font-bold text-white"
            inactive-class="hover:bg-gray-200"
            class="block px-4 py-2 text-center"
            :to="`/settings`"
          >
            Settings
          </AppLink>
          <AppLink
            @click="userStore.logOut"
            class="block px-4 py-2 text-center hover:bg-gray-200"
            to="/"
          >
            Log out
          </AppLink>
        </div>
      </div>
    </div>
  </header>
</template>
