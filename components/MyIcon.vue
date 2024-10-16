<script setup lang="ts">
defineProps<{ name: string; size?: string; show?: boolean }>();
</script>
<template>
    <div class="cursor-pointer flex flex-col">
        <Icon :name="name" :size="show ? size : '0'" />
        <span class="line-clamp-1" :style="{ fontSize: '6px', width: size }">{{ name }}</span>
    </div>
</template>