<template>
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <!-- Chat Window -->
        <Transition name="chat-pop">
            <div v-if="isOpen"
                class="chat-window w-80 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden flex flex-col">
                <!-- Header with glass effect -->
                <div
                    class="relative flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-primary-500/90 to-primary-600/90 backdrop-blur-sm">
                    <div class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-t-2xl">
                    </div>
                    <div
                        class="relative w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {{ page?.ai?.shortName || 'AI' }}
                    </div>
                    <div class="relative flex-1">
                        <div class="text-sm font-semibold text-white">{{ page?.ai?.fullName || "AI Assistant"}}</div>
                        <div class="flex items-center gap-1.5">
                            <span class="relative flex h-1.5 w-1.5">
                                <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                            </span>
                            <span class="text-[10px] text-white/90">{{ page?.ai?.shortDescription || "Ready to help" }}</span>
                        </div>
                    </div>
                    <div class="relative flex gap-1">
                        <button
                            class="w-6 h-6 rounded-md hover:bg-white/20 backdrop-blur flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
                            @click="clearChat">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                        <button
                            class="w-6 h-6 rounded-md hover:bg-white/20 backdrop-blur flex items-center justify-center text-white/80 hover:text-white transition-all duration-200"
                            @click="isOpen = false">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Messages with subtle glass effect -->
                <div ref="messagesRef"
                    class="flex-1 overflow-y-auto p-3 space-y-2 max-h-60 min-h-40 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
                    <div v-if="messages.length === 0"
                        class="flex flex-col items-center justify-center h-full text-center">
                        <div
                            class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/20 backdrop-blur flex items-center justify-center mb-3">
                            <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
                                    stroke-width="1.5" />
                            </svg>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium"> {{ page?.startChat?.title || "✨Start a conversation with Nicholas" }}</p>
                        <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{{ page?.startChat?.description || "Ask about my projects, experience, or anything else!" }}
                        </p>
                    </div>

                    <TransitionGroup name="msg-fade">
                        <div v-for="msg in messages" :key="msg.id" class="flex gap-1.5"
                            :class="msg.role === 'user' ? 'flex-row-reverse' : ''">
                            <div
                                class="w-5 h-5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[9px] font-medium flex items-center justify-center shrink-0 shadow-md">
                                {{ msg.role === 'user' ? 'U' : 'AI' }}
                            </div>
                            <div class="flex flex-col gap-0.5 max-w-[82%]"
                                :class="msg.role === 'user' ? 'items-end' : ''">
                                <div class="px-2.5 py-1.5 rounded-xl text-xs leading-relaxed break-words backdrop-blur-sm"
                                    :class="msg.role === 'user'
                                        ? 'bg-primary-500/90 text-white rounded-br-sm shadow-md'
                                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border border-white/30 dark:border-gray-700/50 rounded-bl-sm shadow-sm'">
                                    {{ msg.content }}
                                </div>
                                <span class="text-[9px] text-gray-400 dark:text-gray-500 px-1">{{ formatTime(msg.date)
                                    }}</span>
                            </div>
                        </div>
                    </TransitionGroup>

                    <!-- Enhanced Typing Indicator -->
                    <div v-if="isLoading" class="flex gap-1.5">
                        <div
                            class="w-5 h-5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[9px] font-medium flex items-center justify-center shadow-md">{{ page?.ai?.name || 'AI' }}</div>
                        <div
                            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/30 dark:border-gray-700/50 rounded-xl rounded-bl-sm px-3 py-2 shadow-sm">
                            <div class="flex gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce"
                                    style="animation-delay: 0ms" />
                                <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce"
                                    style="animation-delay: 150ms" />
                                <span class="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce"
                                    style="animation-delay: 300ms" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Input with glass morphism -->
                <div
                    class="p-2.5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/30">
                    <div class="flex gap-1 items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border rounded-lg px-2 py-1 transition-all duration-200"
                        :class="inputFocused ? 'border-primary-400 shadow-lg shadow-primary-500/20' : 'border-gray-300/50 dark:border-gray-600/50'">
                        <input ref="inputRef" v-model="newMessage" type="text"
                            class="flex-1 bg-transparent outline-none text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                            :placeholder="isLoading ? page?.input?.loading || 'AI is thinking...' : page?.input?.placeholder || 'Ask something magical...'"
                            :disabled="isLoading" @focus="inputFocused = true" @blur="inputFocused = false"
                            @keydown.enter="sendMessage" />
                        <button
                            class="w-7 h-7 rounded-md bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            :disabled="isLoading || !newMessage.trim()" @click="sendMessage">
                            <svg v-if="!isLoading" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                            <svg v-else class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5">
                                <path
                                    d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                        </button>
                    </div>
                    <p class="text-[9px] text-center text-gray-400 dark:text-gray-500 mt-1.5">
                        Press <kbd
                            class="px-1 py-0.5 bg-white/50 dark:bg-gray-800/50 rounded text-xs font-mono">Enter</kbd> to
                        send
                    </p>
                </div>
            </div>
        </Transition>

        <!-- Enhanced Trigger Button with glass effect -->
        <button
            class="group relative w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
            :class="{ 'scale-95 shadow-md': isOpen }" @click="toggleChat">
            <div
                class="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm">
            </div>
            <div class="relative flex items-center justify-center w-full h-full">
                <Transition name="icon-swap" mode="out-in">
                    <svg v-if="!isOpen" key="open" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                    <svg v-else key="close" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </Transition>
            </div>
            <span v-if="unreadCount > 0 && !isOpen"
                class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-gray-900 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {{ unreadCount }}
            </span>
        </button>
    </div>
</template>

<script lang="ts" setup>
const chatStore = useChatStore()
const router = useRouter()
const route = useRoute()
const { data: page } = await useAsyncData("ai-template-page", () => queryCollection("ai_template").first())

const props = defineProps<{
    isFull?: boolean
}>()

const isOpen = ref(false)
const inputFocused = ref(false)
const newMessage = ref('')
const inputRef = ref<HTMLInputElement>()
const messagesRef = ref<HTMLElement>()
const unreadCount = ref(0)
let lastMessageCount = 0

const messages = computed(() => chatStore.allMessages)
const isLoading = computed(() => chatStore.isProcessing)

const scrollToBottom = async () => {
    await nextTick()
    if (messagesRef.value) {
        messagesRef.value.scrollTo({ top: messagesRef.value.scrollHeight, behavior: 'smooth' })
    }
}

const sendMessage = async () => {

    const text = newMessage.value.trim()
    if (!text || isLoading.value) return


    newMessage.value = ''
    setTimeout(() => {
        inputRef.value?.focus()
        scrollToBottom()
    }, 150)
    await chatStore.sendMessage(text)
    await scrollToBottom()
    await nextTick()
    inputRef.value?.focus()
}

const formatTime = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const clearChat = () => {
    if (confirm('Clear all messages?')) {
        chatStore.clearMessages()
    }
}

const toggleChat = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        unreadCount.value = 0
        nextTick(scrollToBottom)
    }
}

// Track unread messages
watch([messages, isOpen], () => {
    if (!isOpen.value && messages.value.length > lastMessageCount) {
        unreadCount.value++
    }
    lastMessageCount = messages.value.length
})

// Auto-send from URL query
const queryPrompt = computed(() => route.query.q as string || '')
watch(queryPrompt, async (newQuery) => {
    if (newQuery?.trim() && !isLoading.value) {
        isOpen.value = true
        newMessage.value = newQuery
        await sendMessage()
        await router.replace({ query: {} })
    }
})

onMounted(() => {
    chatStore.init()
    lastMessageCount = messages.value.length
})
</script>

<style scoped>
/* Glass morphism backdrop effect */
.chat-window {
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
}

/* Transitions */
.chat-pop-enter-active {
    animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-pop-leave-active {
    animation: popOut 0.2s ease-in forwards;
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: scale(0.85) translateY(10px);
        filter: blur(4px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
        filter: blur(0);
    }
}

@keyframes popOut {
    from {
        opacity: 1;
        transform: scale(1) translateY(0);
        filter: blur(0);
    }

    to {
        opacity: 0;
        transform: scale(0.88) translateY(8px);
        filter: blur(2px);
    }
}

.msg-fade-enter-active {
    animation: msgIn 0.25s ease-out;
}

@keyframes msgIn {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.icon-swap-enter-active,
.icon-swap-leave-active {
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon-swap-enter-from {
    opacity: 0;
    transform: rotate(-30deg) scale(0.7);
}

.icon-swap-leave-to {
    opacity: 0;
    transform: rotate(30deg) scale(0.7);
}

/* Custom scrollbar with glass effect */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(108, 99, 255, 0.3);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(108, 99, 255, 0.5);
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgba(108, 99, 255, 0.4);
}

/* Focus ring enhancement */
input:focus {
    ring: none;
}
</style>