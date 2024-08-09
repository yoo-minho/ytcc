<script setup lang="ts">
const { data } = await useFetch("/api/test");
</script>
<template>
  <div style="white-space: pre-wrap">
    ::
    {{ JSON.stringify(data, null, 2) }}
    ::
  </div>
</template>
<style lang="scss" scoped></style>
