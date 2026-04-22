<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Proposals</h1>
                <p class="text-gray-600 mt-2">Browse and manage your proposals</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <UCard
                    v-for="proposal in proposals"
                    :key="proposal.id"
                    class="hover:shadow-lg transition-shadow"
                >
                    <template #header>
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-semibold text-gray-900">{{ proposal.title }}</h3>
                            <UBadge :color="getStatusColor(proposal.status)">
                                {{ proposal.status }}
                            </UBadge>
                        </div>
                    </template>

                    <p class="text-gray-600 text-sm mb-4">{{ proposal.description }}</p>
                    
                    <div class="space-y-2 text-sm mb-4">
                        <p><span class="font-medium text-gray-900">Client:</span> {{ proposal.client }}</p>
                        <p><span class="font-medium text-gray-900">Amount:</span> ${{ proposal.amount }}</p>
                        <p><span class="font-medium text-gray-900">Date:</span> {{ formatDate(proposal.date) }}</p>
                    </div>

                    <template #footer>
                        <div class="flex gap-2">
                            <UButton color="blue" variant="soft" class="flex-1">View</UButton>
                            <UButton color="gray" variant="ghost" class="flex-1">Edit</UButton>
                        </div>
                    </template>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const proposals = ref([
    {
        id: 1,
        title: 'Website Redesign',
        description: 'Complete redesign of company website',
        client: 'Acme Corp',
        amount: 5000,
        status: 'pending',
        date: new Date('2024-01-15')
    },
    {
        id: 2,
        title: 'Mobile App Development',
        description: 'Native iOS and Android application',
        client: 'Tech Startup',
        amount: 15000,
        status: 'approved',
        date: new Date('2024-01-10')
    }
])

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: 'amber',
        approved: 'green',
        rejected: 'red',
        completed: 'blue'
    }
    return colors[status] || 'gray'
}

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>