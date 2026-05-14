<template>
    <div class="ai-page relative min-h-dvh w-full flex flex-col items-center overflow-hidden bg-inherit"
        :class="{ 'is-chatting': messages.length > 0 }">

        <!-- Ambient background orbs -->
        <div class="orb orb-1 fixed rounded-full pointer-events-none z-0 opacity-20 dark:opacity-[0.18] blur-[80px] w-[600px] h-[600px] -top-[200px] -left-[200px] bg-violet-200 dark:bg-primary-400"
            aria-hidden="true" />
        <div class="orb orb-2 fixed rounded-full pointer-events-none z-0 opacity-20 dark:opacity-[0.18] blur-[80px] w-[500px] h-[500px] -bottom-[150px] -right-[150px] bg-pink-200 dark:bg-primary-600"
            aria-hidden="true" />
        <div class="orb orb-3 fixed rounded-full pointer-events-none z-0 opacity-10 dark:opacity-[0.08] blur-[80px] w-[300px] h-[300px] top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-cyan-200 dark:bg-primary-300"
            aria-hidden="true" />

        <!-- Grid overlay -->
        <div class="grid-overlay fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />

        <!-- Hero state -->
        <Transition name="hero-fade">
            <div v-if="messages.length === 0"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-10 text-center px-6 w-full max-w-[560px]">
                <div class="relative w-20 h-20 flex items-center justify-center">
                    <div
                        class="glyph-ring glyph-ring-1 absolute rounded-full border border-violet-300/30 dark:border-primary-400/30 w-20 h-20" />
                    <div
                        class="glyph-ring glyph-ring-2 absolute rounded-full border border-dashed border-violet-300/25 dark:border-primary-400/30 w-[60px] h-[60px]" />
                    <div
                        class="glyph-ring glyph-ring-3 absolute rounded-full border border-violet-400/40 dark:border-primary-500/50 w-10 h-10" />
                    <div
                        class="relative z-10 w-8 h-8 rounded-full bg-violet-100/60 dark:bg-primary-500/15 border border-violet-400/30 dark:border-primary-400/40 flex items-center justify-center backdrop-blur-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"
                            class="w-4 h-4 text-violet-600 dark:text-primary-300">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                                opacity="0.3" />
                            <path d="M8 12s1.5 2 4 2 4-2 4-2" stroke-linecap="round" />
                            <path d="M9 9h.01M15 9h.01" stroke-linecap="round" stroke-width="2" />
                        </svg>
                    </div>
                </div>

                <h1
                    class="text-[clamp(1.6rem,4vw,2.4rem)] font-light tracking-tight leading-tight text-gray-900 dark:text-white">
                    {{ page?.ai?.fullName || 'Ask me anything' }}
                </h1>
                <p class="text-sm text-gray-500 dark:text-white/45 max-w-[380px] leading-relaxed font-light">
                    {{ page?.ai?.shortDescription || 'Your intelligent companion — ready to explore ideas with you' }}
                </p>

                <div class="flex flex-wrap gap-2 justify-center mt-2">
                    <button v-for="chip in (page?.suggestions || defaultChips)" :key="chip"
                        class="px-[14px] py-[7px] rounded-full border border-violet-300/40 dark:border-primary-500/30 bg-white/70 dark:bg-primary-950/50 text-gray-600 dark:text-white/65 text-xs cursor-pointer backdrop-blur-sm transition-all duration-200 hover:border-violet-500/60 dark:hover:border-primary-400/70 hover:bg-violet-50 dark:hover:bg-primary-500/15 hover:text-gray-900 dark:hover:text-white hover:-translate-y-px"
                        @click="prefillAndSend(chip)">{{ chip }}</button>
                </div>
            </div>
        </Transition>

        <!-- Messages feed -->
        <div ref="messagesRef"
            class="messages-feed relative z-10 w-full max-w-[720px] flex-1 overflow-y-auto pt-24 pb-8 px-5 flex flex-col gap-6 mb-5"
            :class="{ 'has-messages': messages.length > 0 }">
            <TransitionGroup name="msg-float">
                <div v-for="msg in messages" :key="msg.id" class="flex items-end gap-[10px] w-full"
                    :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
                    <!-- AI avatar -->
                    <div v-if="msg.role === 'assistant'"
                        class="relative w-7 h-7 rounded-full bg-violet-100 dark:bg-primary-500/12 border border-violet-300/40 dark:border-primary-400/25 flex items-center justify-center shrink-0 text-[8px] font-semibold text-violet-600 dark:text-primary-300 tracking-wide"
                        aria-hidden="true">
                        <div
                            class="avatar-pulse absolute inset-[-3px] rounded-full border border-violet-300/20 dark:border-primary-400/20" />
                        <span>G-(ai)</span>
                    </div>

                    <div class="flex flex-col max-w-[75%] gap-1"
                        :class="msg.role === 'user' ? 'items-end' : 'items-start'">
                        <div class="px-[14px] py-[10px] text-[0.8125rem] leading-relaxed break-words relative backdrop-blur-md"
                            :class="msg.role === 'user'
                                ? 'rounded-[18px] rounded-br-[4px] bg-primary-500 text-white shadow-[0_0_0_1px_rgba(var(--color-primary-400),0.3),0_4px_24px_rgba(var(--color-primary-600),0.25)]'
                                : 'rounded-[18px] rounded-bl-[4px] bg-white dark:bg-white/[0.04] text-gray-800 dark:text-white/88 border border-gray-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)]'"
                            @click="msg.role === 'assistant' ? onBubbleClick($event) : null">
                            <span v-if="msg.role === 'user'">{{ msg.content }}</span>
                            <span v-else-if="isTyping(msg.id)" class="typing-text">
                                {{ typingMap[msg.id] }}<span
                                    class="typing-cursor inline-block w-[2px] h-3 bg-primary-400 dark:bg-primary-300/90 rounded-sm ml-px align-middle" />
                            </span>
                            <span v-else class="prose-content" v-html="renderMessage(msg.content)" />
                        </div>
                        <time class="text-[0.625rem] text-gray-400 dark:text-white/22 px-1 tracking-wide">{{
                            formatTime(msg.date) }}</time>
                    </div>
                </div>
            </TransitionGroup>

            <!-- Thinking indicator -->
            <Transition name="think-fade">
                <div v-if="isLoading" class="flex items-end gap-[10px] w-full flex-row">
                    <div class="relative w-7 h-7 rounded-full bg-violet-100 dark:bg-primary-500/12 border border-violet-300/40 dark:border-primary-400/25 flex items-center justify-center shrink-0 text-[8px] font-semibold text-violet-600 dark:text-primary-300 tracking-wide"
                        aria-hidden="true">
                        <div
                            class="avatar-pulse avatar-pulse--active absolute inset-[-3px] rounded-full border border-violet-400/40 dark:border-primary-400/50" />
                        <span>AI</span>
                    </div>
                    <div
                        class="rounded-[18px] rounded-bl-[4px] bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)] px-4 py-3 flex items-center gap-[5px]">
                        <span
                            class="think-dot w-[6px] h-[6px] rounded-full bg-violet-400/70 dark:bg-primary-400/70 inline-block"
                            style="animation-delay:0ms" />
                        <span
                            class="think-dot w-[6px] h-[6px] rounded-full bg-violet-400/70 dark:bg-primary-400/70 inline-block"
                            style="animation-delay:160ms" />
                        <span
                            class="think-dot w-[6px] h-[6px] rounded-full bg-violet-400/70 dark:bg-primary-400/70 inline-block"
                            style="animation-delay:320ms" />
                    </div>
                </div>
            </Transition>
        </div>

        <!-- Floating input bar -->
        <div
            class="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center px-5 pb-6 bg-gradient-to-t from-white/95 dark:from-gray-950/95 via-white/60 dark:via-gray-950/60 to-transparent">
            <div class="input-bar w-full max-w-[680px] flex items-center gap-2 py-2 pr-2 pl-4 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow] duration-200"
                :class="inputFocused ? 'border-violet-400/60 dark:border-primary-500/50 shadow-[0_0_0_3px_rgba(139,92,246,0.08),0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_3px_rgba(var(--color-primary-500),0.08),0_8px_32px_rgba(0,0,0,0.4)]' : ''">
                <Transition name="icon-pop">
                    <button v-if="messages.length > 0"
                        class="w-[30px] h-[30px] rounded-full bg-transparent border-none cursor-pointer flex items-center justify-center text-gray-400 dark:text-white/30 shrink-0 transition-colors duration-150 hover:text-gray-600 dark:hover:text-white/70"
                        title="Clear chat" @click="clearChat">
                        <svg class="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                </Transition>

                <input ref="inputRef" v-model="newMessage"
                    class="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 dark:text-white/88 caret-violet-500 dark:caret-primary-400 leading-relaxed placeholder:text-gray-400 dark:placeholder:text-white/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    :placeholder="isLoading ? (page?.input?.loading || 'thinking…') : (page?.input?.placeholder || 'Ask anything…')"
                    :disabled="isLoading" autocomplete="off" @focus="inputFocused = true" @blur="inputFocused = false"
                    @keydown.enter="sendMessage" />

                <button
                    class="w-9 h-9 rounded-full border-none cursor-pointer shrink-0 flex items-center justify-center transition-all duration-200 bg-violet-100 dark:bg-primary-500/25 text-violet-400 dark:text-primary-300/60 disabled:cursor-not-allowed"
                    :class="newMessage.trim() && !isLoading ? 'bg-primary-500 !text-white shadow-[0_0_16px_rgba(var(--color-primary-500),0.4)] hover:bg-primary-400 hover:scale-105' : ''"
                    :disabled="isLoading || !newMessage.trim()" @click="sendMessage">
                    <svg v-if="!isLoading" class="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                    <svg v-else class="spin w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path
                            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                </button>
            </div>

            <p class="mt-2 text-[0.625rem] text-gray-400 dark:text-white/18 tracking-wide">
                <kbd
                    class="px-[5px] py-px bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/10 rounded font-mono text-[0.6rem]">Enter</kbd>
                to send ·
                <kbd
                    class="px-[5px] py-px bg-gray-100 dark:bg-white/[0.07] border border-gray-200 dark:border-white/10 rounded font-mono text-[0.6rem]">Shift+Enter</kbd>
                for new line
            </p>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { renderMessage } from '~/composables/useMarkdown'
import { useChatTyping } from '~/composables/useChatTyping'

const chatStore = useChatStore()
const router = useRouter()
const route = useRoute()
const { data: page } = await useAsyncData('ai-page', () => queryCollection('ai_template').first())

const defaultChips = [
    'What can you help me with?',
    'Tell me something surprising',
    'Help me write something',
    'Explain a complex topic simply',
]

const inputFocused = ref(false)
const newMessage = ref('')
const inputRef = ref<HTMLInputElement>()
const messagesRef = ref<HTMLElement>()
const copiedId = ref<string | null>(null)

const { typingMap, typeIn } = useChatTyping()

const messages = computed(() => chatStore.allMessages)
const isLoading = computed(() => chatStore.isProcessing)

function isTyping(id: string) {
    return id in typingMap.value
}

const scrollToBottom = async () => {
    await nextTick()
    messagesRef.value?.scrollTo({ top: messagesRef.value.scrollHeight, behavior: 'smooth' })
}

const sendMessage = async () => {
    const text = newMessage.value.trim()
    if (!text || isLoading.value) return
    newMessage.value = ''
    setTimeout(() => { inputRef.value?.focus(); scrollToBottom() }, 100)

    const prevCount = messages.value.length
    await chatStore.sendMessage(text)

    await nextTick()
    const aiMsg = messages.value.slice(prevCount).find(m => m.role === 'assistant')
    if (aiMsg) {
        typeIn(aiMsg.id, aiMsg.content, () => scrollToBottom())
    }

    await scrollToBottom()
    inputRef.value?.focus()
}

const prefillAndSend = (text: string) => {
    newMessage.value = text
    sendMessage()
}

async function copyCode(code: string, id: string) {
    await navigator.clipboard.writeText(code)
    copiedId.value = id
    setTimeout(() => { copiedId.value = null }, 1500)
}

function onBubbleClick(e: MouseEvent) {
    const btn = (e.target as HTMLElement).closest('.msg-copy-btn') as HTMLElement | null
    if (!btn) return
    copyCode(btn.dataset.code ?? '', btn.dataset.id ?? '')
}

const formatTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const clearChat = () => {
    if (confirm('Clear conversation?')) chatStore.clearMessages()
}

const queryPrompt = computed(() => route.query.q as string || '')
watch(queryPrompt, async (q) => {
    if (q?.trim() && !isLoading.value) {
        newMessage.value = q
        await sendMessage()
        await router.replace({ query: {} })
    }
})

onMounted(() => {
    chatStore.init()
    inputRef.value?.focus()
})
</script>

<style scoped>
/* Kept scoped only for things Tailwind can't do: keyframe animations, :deep() prose, scrollbar */

.messages-feed:not(.has-messages) {
    pointer-events: none;
    opacity: 0;
}

/* Orb drift animations */
.orb-1 {
    animation: drift1 18s ease-in-out infinite alternate;
}

.orb-2 {
    animation: drift2 22s ease-in-out infinite alternate;
}

.orb-3 {
    animation: drift3 14s ease-in-out infinite alternate;
}

@keyframes drift1 {
    from {
        transform: translate(0, 0) scale(1);
    }

    to {
        transform: translate(60px, 80px) scale(1.15);
    }
}

@keyframes drift2 {
    from {
        transform: translate(0, 0) scale(1);
    }

    to {
        transform: translate(-50px, -60px) scale(1.1);
    }
}

@keyframes drift3 {
    from {
        transform: translate(-50%, -50%) scale(1);
    }

    to {
        transform: translate(-45%, -55%) scale(1.2);
    }
}

/* Grid overlay */
.grid-overlay {
    background-image:
        linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}

.dark .grid-overlay {
    background-image:
        linear-gradient(rgba(var(--color-primary-500), 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--color-primary-500), 0.04) 1px, transparent 1px);
}

/* Glyph rings */
.glyph-ring {
    animation: ring-spin linear infinite;
}

.glyph-ring-1 {
    animation-duration: 12s;
}

.glyph-ring-2 {
    animation-duration: 8s;
    animation-direction: reverse;
}

.glyph-ring-3 {
    animation-duration: 5s;
}

@keyframes ring-spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Avatar pulse */
.avatar-pulse {
    animation: pulse-ring 3s ease-out infinite;
}

.avatar-pulse--active {
    animation-duration: 1.2s;
}

@keyframes pulse-ring {
    0% {
        transform: scale(1);
        opacity: 0.6;
    }

    70% {
        transform: scale(1.4);
        opacity: 0;
    }

    100% {
        transform: scale(1.4);
        opacity: 0;
    }
}

/* Thinking dots */
.think-dot {
    animation: think-bounce 1.4s ease-in-out infinite;
}

@keyframes think-bounce {

    0%,
    80%,
    100% {
        transform: scale(0.6);
        opacity: 0.4;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }
}

/* Typing cursor blink */
@keyframes blink {

    0%,
    50% {
        opacity: 1;
    }

    51%,
    100% {
        opacity: 0;
    }
}

.typing-cursor {
    animation: blink 1s infinite;
}

/* Spin */
.spin {
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Scrollbar */
.messages-feed {
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 92, 246, 0.2) transparent;
}

.messages-feed::-webkit-scrollbar {
    width: 3px;
}

.messages-feed::-webkit-scrollbar-track {
    background: transparent;
}

.messages-feed::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.2);
    border-radius: 3px;
}

/* Prose inside AI bubbles */
.prose-content :deep(p) {
    margin-bottom: 8px;
}

.prose-content :deep(p:last-child) {
    margin-bottom: 0;
}

.prose-content :deep(a) {
    color: rgb(139, 92, 246);
    text-decoration: underline;
    text-underline-offset: 2px;
}

.prose-content :deep(a:hover) {
    color: rgb(167, 139, 250);
}

.prose-content :deep(code:not([class])) {
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.18);
    border-radius: 4px;
    padding: 1px 5px;
    font-family: ui-monospace, monospace;
    font-size: 0.75rem;
    color: rgb(109, 40, 217);
}

.dark .prose-content :deep(code:not([class])) {
    background: rgba(var(--color-primary-500), 0.15);
    border-color: rgba(var(--color-primary-400), 0.2);
    color: rgb(var(--color-primary-200));
}

.prose-content :deep(.msg-code-block) {
    border-radius: 10px;
    overflow: hidden;
    margin: 8px 0;
    background: rgba(30, 27, 46, 0.05);
    border: 1px solid rgba(30, 27, 46, 0.1);
}

.dark .prose-content :deep(.msg-code-block) {
    background: rgba(0, 0, 0, 0.5);
    border-color: rgba(255, 255, 255, 0.07);
}

.prose-content :deep(.msg-code-header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    background: rgba(30, 27, 46, 0.04);
    border-bottom: 1px solid rgba(30, 27, 46, 0.08);
}

.dark .prose-content :deep(.msg-code-header) {
    background: rgba(255, 255, 255, 0.04);
    border-bottom-color: rgba(255, 255, 255, 0.06);
}

.prose-content :deep(.msg-code-lang) {
    font-size: 0.65rem;
    font-family: ui-monospace, monospace;
    color: rgba(109, 40, 217, 0.7);
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.dark .prose-content :deep(.msg-code-lang) {
    color: rgba(var(--color-primary-300), 0.7);
}

.prose-content :deep(.msg-copy-btn) {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.65rem;
    color: rgba(30, 27, 46, 0.35);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.15s;
    font-family: ui-monospace, monospace;
}

.prose-content :deep(.msg-copy-btn:hover) {
    color: rgba(30, 27, 46, 0.8);
}

.dark .prose-content :deep(.msg-copy-btn) {
    color: rgba(255, 255, 255, 0.3);
}

.dark .prose-content :deep(.msg-copy-btn:hover) {
    color: rgba(255, 255, 255, 0.8);
}

.prose-content :deep(.msg-code-content) {
    padding: 10px 12px;
    overflow-x: auto;
    color: rgba(30, 27, 46, 0.8);
    font-family: ui-monospace, monospace;
    line-height: 1.6;
    font-size: 0.75rem;
}

.dark .prose-content :deep(.msg-code-content) {
    color: rgba(255, 255, 255, 0.75);
}

.prose-content :deep(ul),
.prose-content :deep(ol) {
    padding-left: 18px;
    margin-bottom: 8px;
}

.prose-content :deep(ul > * + *),
.prose-content :deep(ol > * + *) {
    margin-top: 3px;
}

.prose-content :deep(li) {
    font-size: 0.8125rem;
}

.prose-content :deep(hr) {
    border: none;
    border-top: 1px solid rgba(30, 27, 46, 0.1);
    margin: 10px 0;
}

.dark .prose-content :deep(hr) {
    border-top-color: rgba(255, 255, 255, 0.08);
}

.prose-content :deep(strong) {
    font-weight: 600;
    color: rgba(30, 27, 46, 0.95);
}

.dark .prose-content :deep(strong) {
    color: rgba(255, 255, 255, 0.95);
}

.prose-content :deep(em) {
    font-style: italic;
    color: rgba(30, 27, 46, 0.65);
}

.dark .prose-content :deep(em) {
    color: rgba(255, 255, 255, 0.7);
}

/* Transitions */
.hero-fade-enter-active {
    transition: all 0.5s ease;
}

.hero-fade-leave-active {
    transition: all 0.3s ease;
    position: absolute;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -45%);
}

.msg-float-enter-active {
    animation: float-in 0.35s cubic-bezier(0.34, 1.45, 0.64, 1);
}

@keyframes float-in {
    from {
        opacity: 0;
        transform: translateY(16px) scale(0.96);
        filter: blur(4px);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
}

.think-fade-enter-active {
    transition: all 0.25s ease;
}

.think-fade-leave-active {
    transition: all 0.2s ease;
}

.think-fade-enter-from,
.think-fade-leave-to {
    opacity: 0;
    transform: translateY(6px);
}

.icon-pop-enter-active {
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon-pop-leave-active {
    transition: all 0.15s ease;
}

.icon-pop-enter-from,
.icon-pop-leave-to {
    opacity: 0;
    transform: scale(0.7);
}
</style>