<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { AddCommentSchema, type Comment, type AddComment } from '@/schemas/article'
import CommentBox from './CommentBox.vue'
import axios from 'axios'
import type { ZodFormattedError } from 'zod'

const props = defineProps<{ slug: string; image: string }>()
const userStore = useUserStore()

const comment = ref('')
const articleComments = ref<Comment[] | null>(null)
const commentInputError = ref<ZodFormattedError<AddComment> | null>()
const commentInput = ref<HTMLElement | null>(null)
const isFocused = ref(false)

const endpoint = `/api/articles/${props.slug}/comments`
const response = await axios.get<Comment[]>(endpoint)
if (response.status === 200) {
  articleComments.value = response.data
}

watch(comment, () => {
  if (commentInputError.value) commentInputError.value = null
})

function resizeTextArea() {
  commentInput.value!.style.height = 'auto'
  commentInput.value!.style.height = commentInput.value!.scrollHeight + 'px'
}

async function postComment() {
  const trimmedComment = comment.value.replace(/[ \t\r\n]+$/, '')
  const validateComment = AddCommentSchema.safeParse(trimmedComment)
  if (!validateComment.success) {
    commentInputError.value = validateComment.error.format()
    return
  }
  const response = await axios.post<Comment>(`/api/articles/${props.slug}/comments`, {
    body: validateComment.data
  })
  articleComments.value?.push(response.data)
  comment.value = ''
  await nextTick()
  resizeTextArea()
}

async function deleteComment(id: string, index: number) {
  await axios.delete(`/api/articles/${props.slug}/comments/${id}`)
  articleComments.value?.splice(index, 1)
}
</script>

<template>
  <section class="max-w-2xl mx-auto px-4 my-12">
    <h1 class="sm:text-4xl text-2xl font-bold">Comments</h1>
    <div
      v-if="userStore.isLoggedIn"
      class="w-full border-2 block px-4 py-4 mt-4"
      :class="[isFocused ? 'border-black' : '']"
    >
      <form @submit.prevent="postComment" class="block h-max">
        <div class="flex gap-x-4">
          <img :src="userStore.user?.image" class="h-12 w-12 rounded-full" />
          <textarea
            ref="commentInput"
            v-model="comment"
            @input="resizeTextArea"
            @focus="isFocused = true"
            @blur="isFocused = false"
            placeholder="Write your comment here!"
            class="overflow-hidden resize-none w-full px-2 inline-block whitespace-pre-wrap focus:outline-none"
          />
        </div>
        <div class="flex mt-4">
          <p class="text-red-700" v-if="commentInputError">
            ** {{ commentInputError._errors[0] }} **
          </p>
          <button
            type="submit"
            class="text-white rounded-xl px-2 py-1.5 text-sm bg-green-500 ml-auto"
          >
            Post
          </button>
        </div>
      </form>
    </div>
    <div class="mt-8" v-else>
      <RouterLink class="text-green-500 hover:text-green-600" :to="{ name: 'Signup' }">
        Sign up
      </RouterLink>
      and
      <RouterLink class="text-green-500 hover:text-green-600" :to="{ name: 'Login' }">
        Log in
      </RouterLink>
      first before add comment to this article.
    </div>
    <div class="mt-8">
      <CommentBox
        v-for="(comment, index) in articleComments"
        :key="comment.id"
        :comment="comment"
        @delete-comment="deleteComment(comment.id, index)"
      />
    </div>
  </section>
</template>
