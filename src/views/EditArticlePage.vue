<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
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
</script>

<template>
  <main>
    <section class="max-w-7xl mx-auto px-4 py-12 min-h-[calc(100vh-56px)]">
      <h1 class="font-bold text-2xl text-center">Edit Article</h1>
      <p class="mt-4 text-red-700 text-center" v-if="editArticleError">
        {{ editArticleError }}
      </p>
      <form @submit.prevent="editArticleSubmit">
        <div class="mt-4">
          <label for="">Article title</label>
          <input
            v-model="editArticleForm.title"
            class="block w-full mt-2 border-2 px-4 py-1.5"
            type="text"
            placeholder="Title of your article"
          />
          <p class="text-red-700" v-if="formError?.title">** {{ formError.title._errors[0] }} **</p>
        </div>
        <div class="mt-4">
          <label for="">Article content</label>
          <textarea
            v-model="editArticleForm.content"
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
            v-model="editArticleForm.tags"
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
