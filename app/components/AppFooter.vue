<script setup lang="ts">
const { footer } = useAppConfig()

const faqAnswers = [
  {
    question: "What services do you offer?",
    answer: "I specialize in full-stack development and machine learning engineering. This includes backend APIs with FastAPI, frontend apps with Nuxt 4, database design, ML model deployment, and DevOps with Docker."
  },
  {
    question: "What is your development process like?",
    answer: "My process involves requirement analysis, architecture design, iterative development with testing, and deployment. I focus on scalable, maintainable code with CI/CD pipelines."
  },
  {
    question: "How much does a project typically cost?",
    answer: "Project costs vary by scope. Small projects start at $1,000, medium at $5,000+, and large at $10,000+. I offer hourly rates for consulting."
  },
  {
    question: "What are your hobbies outside of work?",
    answer: "When I'm not coding, I enjoy exploring new technologies, contributing to open-source, cycling, and mentoring junior developers."
  }
]
</script>

<template>
  <UFooter
    class="z-10 bg-default"
    :ui="{ left: 'text-muted text-xs' }"
  >
    <template #left>
      {{ footer.credits }}
    </template>

    <template #center>
      <div class="space-y-4">
        <h3 class="text-sm font-semibold">Quick FAQ</h3>
        <div class="space-y-2">
          <details v-for="faq in faqAnswers" :key="faq.question" class="text-xs">
            <summary class="cursor-pointer font-medium">{{ faq.question }}</summary>
            <p class="mt-1 text-muted">{{ faq.answer }}</p>
          </details>
        </div>
      </div>
    </template>

    <template #right>
      <template v-if="footer?.links">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
