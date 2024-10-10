<script setup lang="ts">
defineProps<{ name: string; size: string; show: boolean }>();
</script>
<template>
    <Icon class="cursor-pointer" :name="name" :size="show ? size : '0'" />
</template>