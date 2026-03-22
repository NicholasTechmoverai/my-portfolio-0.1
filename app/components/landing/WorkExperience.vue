<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :ui="{
      container: '!p-0 gap-4 sm:gap-4 w-full',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'mt-2'
    }"
  >
    <template #description>
      <div class="flex flex-col gap-3">
        <Motion
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 + 0.2 * index }"
          :in-view-options="{ once: true }"
          class="text-muted flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
        >
          <!-- Date -->
          <p class="text-xs sm:text-sm shrink-0">
            {{ experience.date }}
          </p>

          <USeparator class="hidden sm:block" />

          <!-- Content -->
          <ULink
            class="flex items-center gap-2 min-w-0"
            :to="experience.company.url"
            target="_blank"
          >
            <!-- Position -->
            <span class="text-xs sm:text-sm shrink-0 w-full overflow-hidden ">
              {{ experience.position }}
            </span>

            <!-- Company -->
            <div
              class="flex items-center gap-1 min-w-0"
              :style="{ color: experience.company.color }"
            >
              <span class="font-medium truncate max-w-[140px] sm:max-w-[200px]">
                {{ experience.company.name }}
              </span>

              <UIcon
                :name="experience.company.logo"
                class="shrink-0 opacity-80"
              />
            </div>
          </ULink>
        </Motion>
      </div>
    </template>
  </UPageSection>
</template>

<style scoped>

</style>
