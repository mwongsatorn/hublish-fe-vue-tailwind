<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
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
  if (response.status !== 200) {
    createArticleError.value = 'Something went wrong.'
    return
  }
  alert('Created article successfully')
  router.push({ name: 'ArticleDetails', params: { slug: response.data.slug } })
}
</script>

<template>
  <main>
    <section class="max-w-7xl mx-auto px-4 py-12 min-h-[calc(100vh-56px)]">
      <h1 class="font-bold text-2xl text-center">Create Article</h1>
      <p class="mt-4 text-red-700 text-center" v-if="createArticleError">
        {{ createArticleError }}
      </p>
      <form @submit.prevent="createArticleSubmit">
        <div class="mt-4">
          <label for="">Article title</label>
          <input
            v-model="createArticleForm.title"
            class="block w-full mt-2 border-2 px-4 py-1.5"
            type="text"
            placeholder="Title of your article"
          />
          <p class="text-red-700" v-if="formError?.title">** {{ formError.title._errors[0] }} **</p>
        </div>
        <div class="mt-4">
          <label for="">Article content</label>
          <textarea
            v-model="createArticleForm.content"
            class="block w-full mt-2 border-2 px-4 py-1.5 h-[200px] resize-none"
            placeholder="Write your article here.."
          />
          <p class="text-red-700" v-if="formError?.content">
            ** {{ formError.content._errors[0] }} **
          </p>
        </div>
        <div class="mt-4">
          <label for="">Article tags</label>
          <input
            v-model="createArticleForm.tags"
            class="block w-full mt-2 border-2 px-4 py-1.5"
            type="text"
            placeholder="Seperate tags by white space or comma"
          />
          <p class="text-red-700" v-if="formError?.tags">** {{ formError.tags._errors[0] }} **</p>
        </div>
        <button
          type="submit"
          class="ml-auto rounded-lg mt-8 block bg-green-500 px-4 py-2 text-white"
        >
          Submit
        </button>
      </form>
    </section>
  </main>
</template>
