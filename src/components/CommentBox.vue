<script setup lang="ts">
import { type Comment } from '@/schemas/article'
import IconDelete from './icons/Delete.vue'
import { useUserStore } from '@/stores/user.store'
import { formatDate } from '@/helpers/formatDate'

interface Props {
  comment: Comment
}
const props = defineProps<Props>()
const emits = defineEmits<{
  deleteComment: []
}>()

const userStore = useUserStore()
</script>

<template>
  <div class="relative p-4 flex gap-x-4 border-2 [&_+_div]:border-t-0">
    <RouterLink
      class="w-12 h-12 rounded-full shrink-0"
      :to="{
        name: 'Profile',
        params: { username: `${props.comment.commentAuthor.username}` }
      }"
    >
      <img :src="props.comment.commentAuthor.image" />
    </RouterLink>

    <div class="w-full overflow-hidden">
      <div class="sm:text-sm text-xs gap-x-4 flex">
        <RouterLink
          class="basis-[75%] overflow-hidden block"
          :to="{
            name: 'Profile',
            params: { username: `${props.comment.commentAuthor.username}` }
          }"
        >
          <div class="font-bold hover:underline truncate">
            {{ props.comment.commentAuthor.name }}
          </div>
          <div class="truncate">@{{ props.comment.commentAuthor.username }}</div>
        </RouterLink>

        <div class="basis-[25%] min-w-[60px] text-end">
          {{ formatDate(props.comment.createdAt) }}
        </div>
      </div>
      <p class="my-4 pr-4 text-sm sm:text-base whitespace-pre-wrap">
        {{ props.comment.body }}
      </p>
    </div>

    <button
      v-if="props.comment.commentAuthor_id === userStore.user?.id"
      @click="emits('deleteComment')"
      class="absolute bottom-4 right-4 text-rose-600"
    >
      <IconDelete class="h-4 w-4" />
    </button>
  </div>
</template>
