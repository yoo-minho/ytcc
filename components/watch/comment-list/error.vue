<script setup lang="ts">
defineProps<{ error: string }>();
</script>

<template>
    <div class="p-4 flex w-full h-full justify-center items-center">
        {{ error }}
    </div>
</template>

<style scoped></style>