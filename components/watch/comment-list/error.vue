<script setup lang="ts">
defineProps<{ error: any }>();
</script>

<template>
    <div class="p-4 flex w-full h-full justify-center items-center">
        {{ error.data.message }}
    </div>
</template>

<style scoped></style>