<script setup lang="ts">
</script>
<template>
    <div class="flex gap-2 py-2">
        <div class="p-1 w-1/2">
            <div class="relative">
                <USkeleton class="w-full" style="aspect-ratio: 16 / 9;" />
                <USkeleton class="absolute bottom-2 right-2 w-12 h-4 rounded" />
                <USkeleton class="absolute top-2 left-2 w-6 h-6 rounded" />
            </div>
        </div>
        <div class="p-1 w-1/2">
            <div>
                <USkeleton class="h-4 w-full mb-1" />
                <USkeleton class="h-4 w-3/4 mb-1" />
                <USkeleton class="h-3 w-1/2 mb-1" />
                <USkeleton class="h-3 w-1/2 mb-1" />
                <USkeleton class="h-3 w-3/4" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>