<script setup lang="ts">
defineProps<{ thumbnail?: boolean }>();
</script>

<template>
    <div>
        <div class="flex flex-col gap-1">
            <USkeleton v-if="thumbnail" class="w-full mb-1" style="aspect-ratio: 16 / 9;" />
            <USkeleton class="h-5 w-full mb-1" />
            <USkeleton class="h-4 w-3/4 mb-1" />
            <USkeleton class="h-4 w-2/3" />
        </div>
    </div>
</template>

<style scoped></style>