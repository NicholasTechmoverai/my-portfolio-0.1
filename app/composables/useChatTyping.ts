import { ref } from 'vue'

export function useChatTyping() {
  const typingMap = ref<Record<string, string>>({}) // msgId -> partial content
  const activeTypers = new Map<string, ReturnType<typeof setInterval>>()

  function typeIn(msgId: string, fullText: string, onDone?: () => void) {
    let i = 0
    typingMap.value[msgId] = ''

    const interval = setInterval(() => {
      if (i >= fullText.length) {
        clearInterval(interval)
        activeTypers.delete(msgId)
        delete typingMap.value[msgId]
        onDone?.()
        return
      }
      typingMap.value[msgId] += fullText[i++]
    }, 16) // ~60fps feel

    activeTypers.set(msgId, interval)
  }

  function stopTyping(msgId: string) {
    const t = activeTypers.get(msgId)
    if (t) { clearInterval(t); activeTypers.delete(msgId) }
    delete typingMap.value[msgId]
  }

  return { typingMap, typeIn, stopTyping }
}