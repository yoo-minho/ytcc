<script setup lang="ts">
useColorMode().preference = "dark";

const displayState = useDisplayState();
const layoutName = computed(() => displayState.value.currentPage === 'detail' ? 'shorts' : 'default');
</script>
<template>
  <UNotifications />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<style lang="scss" scoped></style>
