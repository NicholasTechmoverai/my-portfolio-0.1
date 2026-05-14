import { defineStore } from 'pinia'

interface Message {
  id: string
  content: string
  role: 'user' | 'authenticated' | 'admin'
  date: Date
}

interface ChatConfig {
  model: keyof typeof Models
  temperature: number
  maxTokens: number
  role: 'admin' | 'user' | 'authenticated'
  userId: string
}

export const Models = {
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    description: 'Best balance of performance and cost',
    maxTokens: 4096
  },
  'gpt-4': {
    name: 'GPT-4',
    description: 'Advanced reasoning for complex tasks',
    maxTokens: 8192
  },
  'gpt-4-32k': {
    name: 'GPT-4 32K',
    description: 'Extended context for large documents',
    maxTokens: 32768
  }
}

const generateUserId = () => `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[],
    isLoading: false,
    config: {
      model: 'gpt-3.5-turbo' as keyof typeof Models,
      temperature: 0.7,
      maxTokens: 500,
      role: 'user' as ChatConfig['role'],
      userId: process.client ? localStorage.getItem('chat_user_id') || generateUserId() : generateUserId()
    } as ChatConfig
  }),

  getters: {
    allMessages: (state) => state.messages,
    isProcessing: (state) => state.isLoading,
    availableModels: () => Models,
    currentModel: (state) => Models[state.config.model]
  },

  actions: {
    init() {
      if (!process.client) return

      const saved = localStorage.getItem('chat_messages')
      if (saved) {
        this.messages = JSON.parse(saved).map((msg: any) => ({
          ...msg,
          date: new Date(msg.date)
        }))
      }

      if (!localStorage.getItem('chat_user_id')) {
        localStorage.setItem('chat_user_id', this.config.userId)
      }
    },

    addMessage(content: string, role: 'user' | 'assistant') {
      const message: Message = {
        id: Date.now().toString(),
        content,
        role,
        date: new Date()
      }
      this.messages.push(message)
      this.persist()
      return message
    },

    async sendMessage(content: string) {
      if (!content.trim() || this.isLoading) return null

      this.addMessage(content, 'user')
      this.isLoading = true

      try {
        const response = await $fetch(useEndpoints().chat, {
          method: 'POST',
          body: {
            prompt: content,
            history: this.messages.slice(-12), // last 12 messages
            config: this.config
          }
        })

        const aiResponse =
          response.content ||
          response.results?.[0]?.output?.message ||
          'Unable to process request'

        this.addMessage(aiResponse, 'assistant')

        return aiResponse
      } catch (error) {
        this.addMessage(
          'Sorry, an error occurred. Please try again.',
          'assistant'
        )
        return null
      } finally {
        this.isLoading = false
      }
    },

    updateConfig(updates: Partial<ChatConfig>) {
      this.config = { ...this.config, ...updates }
      if (process.client) {
        localStorage.setItem('chat_config', JSON.stringify(this.config))
      }
    },

    changeModel(model: keyof typeof Models) {
      this.config.model = model
      this.config.maxTokens = Models[model].maxTokens
      this.updateConfig({ model, maxTokens: Models[model].maxTokens })
    },

    clearMessages() {
      if (confirm('Clear all messages?')) {
        this.messages = []
        this.persist()
      }
    },

    removeMessage(id: string) {
      this.messages = this.messages.filter(msg => msg.id !== id)
      this.persist()
    },

    persist() {
      if (process.client) {
        localStorage.setItem('chat_messages', JSON.stringify(this.messages))
      }
    }
  }
})