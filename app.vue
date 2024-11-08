<script setup lang="ts">
useHead({
  titleTemplate: "%s",
  meta: [
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
  ]
});
</script>
<template>
  <VitePwaManifest />
  <UNotifications />
  <NuxtLayout class="light bg-gray-500 ">
    <NuxtPage />
  </NuxtLayout>
</template>
<style lang="scss" scoped></style>
