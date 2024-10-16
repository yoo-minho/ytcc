<script setup lang="ts">
const props = defineProps<{ name: string; size?: string; show?: boolean }>();
</script>
<template>
    <Icon :name="name" :size="size" />
</template>