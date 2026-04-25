<template>
  <div>
    <UPage v-if="page">
      <UPageHero 
        :title="page.title" 
        :description="page.description" 
        :links="page.links" 
        :ui="{ title: 'mx-0! text-left', description: 'mx-0! text-left', links: 'justify-start' }" 
      />

      <FloatingChat  :is-full="true"/>

    </UPage>

    <!-- Loading State -->
    <div v-else class="flex justify-center items-center h-screen">
      <USkeleton class="h-32 w-64" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()
const inputRef = ref()

import FloatingChat from '~/components/chat/FloatingChat.vue'

const newMessage = ref('')
const queryPrompt = computed(() => route.query.q as string || '')

const { data: page } = await useAsyncData("chat-page", () => queryCollection("chat").first())
if (!page.value) throw createError({ statusCode: 404 })



const formatTime = (date: Date | string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })


watch(queryPrompt, async (newQuery) => {
  if (newQuery?.trim() && !isLoading.value) {
    newMessage.value = newQuery
    await sendMessage()
  }
})

onMounted(() => {
  chatStore.init()
  if (queryPrompt.value && !isLoading.value) nextTick(sendMessage)
  nextTick(() => inputRef.value?.$el?.querySelector('input')?.focus())
})

const { global } = useAppConfig();

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description,
});
</script>

<style scoped>
.messages-container {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 1rem;
}

.p-4 {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

/* .messages-container::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800 rounded;
}

.messages-container::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
} */

@media (max-width: 768px) {
  .sticky.bottom-4 {
    margin: 0 -1rem;
    border-radius: 0;
  }
  
  .messages-container {
    max-height: calc(100vh - 250px);
  }
}
</style>