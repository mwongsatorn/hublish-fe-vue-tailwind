<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { EditArticleSchema, type EditArticle } from '@/schemas/article'
import { type ZodFormattedError } from 'zod'
import axios from 'axios'

const props = defineProps<{ slug: string }>()
const router = useRouter()

const formError = ref<ZodFormattedError<EditArticle> | null>(null)
const editArticleError = ref('')

const editArticleForm = ref({
  title: '',
  content: '',
  tags: ''
})

const response = await axios.get<EditArticle>(`/api/articles/${props.slug}`)
if (response.status === 200) {
  editArticleForm.value.title = response.data.title!
  editArticleForm.value.content = response.data.content!
  editArticleForm.value.tags = response.data.tags!.join(' ')
}

watch(editArticleForm.value, () => {
  if (formError.value) formError.value = null
})

function compareChangedWithPrevious() {
  const result: EditArticle = {}
  if (editArticleForm.value.title !== response.data.title)
    result.title = editArticleForm.value.title
  if (editArticleForm.value.content !== response.data.content)
    result.content = editArticleForm.value.content
  if (editArticleForm.value.tags !== response.data.tags?.join(' ')) {
    const tags = editArticleForm.value.tags.split(/[,\s]+/).filter(Boolean)
    result.tags = tags
  }
  return result
}

async function editArticleSubmit() {
  const compared = compareChangedWithPrevious()
  const validateForm = EditArticleSchema.safeParse(compared)
  if (!validateForm.success) {
    formError.value = validateForm.error.format()
    return
  }
  const response = await axios.put(`/api/articles/${props.slug}`, validateForm.data)
  if (response.status !== 200) {
    editArticleError.value = 'Something went wrong.'
    return
  }
  alert('Updated article successfully')
  router.push({ name: 'ArticleDetails', params: { slug: response.data.slug } })
}

useHead({
  title: `Edit Article - ${response.data.title}`
})
</script>

<template>
  <div class="mx-auto min-h-[calc(100vh-56px)] max-w-7xl bg-white px-4 py-12">
    <h1 class="text-center text-3xl font-bold">Edit Article</h1>
    <p class="mt-4 text-center text-red-700" v-if="editArticleError">
      {{ editArticleError }}
    </p>
    <form @submit.prevent="editArticleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label for="article-title">Article title</label>
        <input
          v-model="editArticleForm.title"
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
          v-model="editArticleForm.content"
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
          v-model="editArticleForm.tags"
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
