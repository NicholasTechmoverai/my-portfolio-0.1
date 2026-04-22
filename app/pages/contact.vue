<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10">
    <!-- Header Section -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        {{ page?.title }}
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {{ page?.description }}
      </p>
    </div>

    <div class="grid lg:grid-cols-2 gap-12">
      <!-- Contact Info Column -->
      <div class="space-y-8">
        <!-- Contact Information -->
        <div>
          <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            {{ page?.contactInfo?.title }}
          </h2>
          <div class="space-y-4">
            <div v-for="item in page?.contactInfo?.items" :key="item.label"
              class="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
              <UIcon :name="item.icon" class="text-2xl text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ item.label }}
                </p>
                <a v-if="item.link" :href="item.link" :target="item.link.startsWith('http') ? '_blank' : undefined"
                  :rel="item.link.startsWith('http') ? 'noopener noreferrer' : undefined"
                  class="text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">
                  {{ item.value }}
                </a>
                <p v-else class="text-gray-900 dark:text-white break-all">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Connect Online -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {{ page?.connectOnline?.title }}
          </h3>
          <div class="flex flex-wrap gap-3">
            <a v-for="item in page?.connectOnline?.items" :key="item.label" :href="item.link" target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:scale-105 transition-all duration-200 group">
              <UIcon :name="item.icon"
                class="text-xl text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              <span
                class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ item.label }}
              </span>
            </a>
          </div>
        </div>
      </div>

      <!-- Contact Form Column -->
      <div class="lg:pl-4">
        <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Send a Message
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-5 flex flex-col gap-4 items-center w-full">
          <UFormField label="Name" name="name" required class="w-full">
            <UInput v-model="form.name" type="text" placeholder="Your name" size="lg" class="w-full" />
          </UFormField>

          <UFormField label="Email" name="email" required class="w-full">
            <UInput v-model="form.email" type="email" placeholder="your.email@example.com" size="lg" class="w-full" />
          </UFormField>

          <UFormField label="Subject" name="subject" required class="w-full"  >
            <UInput v-model="form.subject" type="text" placeholder="What's this about?" size="lg" class="w-full" />
          </UFormField>

          <UFormField label="Message" name="message" required class="w-full">
            <UTextarea v-model="form.message" placeholder="Your message here..." auto-resize :rows="6" size="lg" class="w-full" />
          </UFormField>

          <UButton type="submit" size="lg" block :loading="isSubmitting" class="mt-4">
            <template #leading>
              <UIcon name="i-lucide-send" class="text-lg" />
            </template>
            Send Message
          </UButton>
        </form>

        <!-- Success Message -->
        <div v-if="showSuccess" class="mt-4 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-check-circle" class="text-xl text-green-600 dark:text-green-400" />
            <p class="text-green-700 dark:text-green-300">
              Message sent successfully! I'll get back to you soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData("contact", () => {
  return queryCollection("contact").first();
});


if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

// Form state
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true

  // Simulate API call - replace with your actual endpoint
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Form submitted:', form)

    showSuccess.value = true
    // Reset form
    Object.assign(form, { name: '', email: '', subject: '', message: '' })

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isSubmitting.value = false
  }
}

const { global } = useAppConfig();

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description,
});
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>