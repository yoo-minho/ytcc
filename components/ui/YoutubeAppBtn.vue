<script setup lang="ts">
defineProps<{ videoId?: string; text?: string }>();
</script>

<template>
    <UButton color="black" :ui="{ rounded: 'rounded-full' }" class="flex items-center justify-center gap-1"
        @click="openYouTubeApp(videoId)">
        <UIcon name="i-openmoji-youtube" size="20px" />
        <div>{{ text || '앱 열기' }}</div>
    </UButton>
</template>

<style scoped></style>