<script setup lang="ts">
import { ref, watch } from 'vue'
import { AddCommentSchema, type Comment, type AddComment } from '@/schemas/article'
import CommentBox from './CommentBox.vue'
import axios from 'axios'
import type { ZodFormattedError } from 'zod'

const props = defineProps<{ slug: string; image: string }>()

const comment = ref('')
const articleComments = ref<Comment[] | null>(null)
const commentInputError = ref<ZodFormattedError<AddComment> | null>()
const addCommentError = ref('')
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

async function postComment() {
  console.log(`${comment.value}`)
  const validateComment = AddCommentSchema.safeParse(comment.value)
  if (!validateComment.success) {
    commentInputError.value = validateComment.error.format()
    return
  }
  const response = await axios.post<Comment>(`/api/articles/${props.slug}/comments`, {
    body: comment.value
  })
  if (response.status !== 201) addCommentError.value = 'Error'
  articleComments.value?.push(response.data)
  comment.value = ''
  commentInput.value!.textContent = ''
}

async function deleteComment(id: string, index: number) {
  const response = await axios.delete(`/api/articles/${props.slug}/comments/${id}`)
  if (response.status !== 204) throw 'Error'
  articleComments.value?.splice(index, 1)
}
</script>

<template>
  <section class="max-w-2xl mx-auto px-4 my-12">
    <h1 class="sm:text-4xl text-2xl font-bold">Comments</h1>
    <div class="w-full border-2 block px-4 py-4 mt-4" :class="[isFocused ? 'border-black' : '']">
      <form @submit.prevent="postComment" class="block h-full">
        <div class="flex gap-x-4">
          <img :src="props.image" class="h-12 w-12 rounded-full" />
          <div
            ref="commentInput"
            contenteditable="true"
            @input="comment = ($event.target as HTMLElement).textContent!"
            @keyup.enter.exact="postComment"
            @focus="isFocused = true"
            @blur="isFocused = false"
            placeholder="Write your comment here!"
            class="w-full group px-2 whitespace-pre-wrap focus:outline-none resize-none overflow-hidden empty:before:[&:not(:focus)]:content-[attr(placeholder)] before:cursor-text"
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
