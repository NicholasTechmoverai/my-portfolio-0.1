<script setup lang="ts">
import FloatingChat from '~/components/chat/FloatingChat.vue';

const isClosed = ref(false)
</script>

<template>
  <UContainer class="sm:border-x border-default pt-10">
    <AppHeader :links="navLinks" />
    <slot />
    <!-- <ChatTemplate :isFull="false" /> -->
    <FloatingChat />
    <AppFooter />
  </UContainer>
</template>