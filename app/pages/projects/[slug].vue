<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Fetch all projects
const { data: projects } = await useAsyncData('projects', () => {
    return queryCollection('projects').all()
})


// Find the project that matches the slug
const project = computed(() => {
    const found = projects.value?.find((p: any) => p.meta?.slug === slug || p.stem === `projects/${slug}`)
    return found
})

if (!project.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Project not found',
        fatal: true
    })
}

// SEO
useSeoMeta({
    title: project.value.title,
    description: project.value.description,
    ogTitle: project.value.title,
    ogDescription: project.value.description,
    ogImage: project.value.image

})

</script>

<template>
    <UPage v-if="project">
        <UButton :to="`/projects/`" variant="soft" color="neutral" icon="i-lucide-arrow-left" label="Back to Projects" class="mb-4"/>
       
        <UPageHero :title="project.title" :description="project.description" :image="project.image" />

        <img :src="project.image" :alt="project.title + ' Image'" srcset="" class="w-full h-64 object-cover rounded-lg mb-0" />

        <UPageSection>
            <div class="prose max-w-none">
                <p>{{ project.description }}</p>
                <div class="mt-4">
                    <h2 class="text-xl font-semibold mb-2">Technologies Used</h2>
                    <div class="flex flex-wrap gap-2">
                        <UBadge v-for="tag in project.tags" :key="tag" color="neutral" variant="subtle">{{ tag }}
                        </UBadge>
                    </div>
                </div>
            </div>
        </UPageSection>
    </UPage>
</template>
