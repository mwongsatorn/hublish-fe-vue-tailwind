<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { CreateArticleSchema, type CreateArticle } from '@/schemas/article'
import { type ZodFormattedError } from 'zod'
import axios from 'axios'

const router = useRouter()

const formError = ref<ZodFormattedError<CreateArticle> | null>(null)
const createArticleError = ref('')

const createArticleForm = ref({
  title: '',
  content: '',
  tags: ''
})

watch(createArticleForm.value, () => {
  if (formError.value) formError.value = null
})

async function createArticleSubmit() {
  const tags = createArticleForm.value.tags.split(/[,\s]+/).filter(Boolean)
  const validateForm = CreateArticleSchema.safeParse({
    title: createArticleForm.value.title,
    content: createArticleForm.value.content,
    tags: tags
  })
  if (!validateForm.success) {
    formError.value = validateForm.error.format()
    return
  }
  const response = await axios.post('/api/articles/', validateForm.data)
  if (response.status !== 201) {
    createArticleError.value = 'Something went wrong.'
    return
  }
  alert('Created article successfully')
  router.push({ name: 'ArticleDetails', params: { slug: response.data.slug } })
}

useHead({
  title: 'Create Article'
})
</script>

<template>
  <div class="mx-auto min-h-[calc(100vh-56px)] max-w-7xl bg-white px-4 py-12">
    <h1 class="text-center text-3xl font-bold">Create Article</h1>
    <p class="mt-4 text-center text-red-700" v-if="createArticleError">
      {{ createArticleError }}
    </p>
    <form @submit.prevent="createArticleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label for="article-title">Article title</label>
        <input
          v-model="createArticleForm.title"
          id="article-title"
          class="mt-2 block w-full border-2 px-4 py-1.5"
          type="text"
          placeholder="Title of your article"
        />
        <p class="text-red-700" v-if="formError?.title">** {{ formError.title._errors[0] }} **</p>
      </div>
      <div class="space-y-2">
        <label for="article-content">Article content</label>
        <textarea
          v-model="createArticleForm.content"
          id="article-content"
          class="mt-2 block h-[200px] w-full resize-none border-2 px-4 py-1.5"
          placeholder="Write your article here.."
        />
        <p class="text-red-700" v-if="formError?.content">
          ** {{ formError.content._errors[0] }} **
        </p>
      </div>
      <div class="space-y-2">
        <label for="article-tags">Article tags</label>
        <input
          v-model="createArticleForm.tags"
          id="article-tags"
          class="mt-2 block w-full border-2 px-4 py-1.5"
          type="text"
          placeholder="Seperate tags by white space or comma"
        />
        <p class="text-red-700" v-if="formError?.tags">** {{ formError.tags._errors[0] }} **</p>
      </div>
      <button type="submit" class="ml-auto mt-8 block rounded-lg bg-green-500 px-4 py-2 text-white">
        Submit
      </button>
    </form>
  </div>
</template>
