<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: Ref<NuxtError<unknown>> }>();

const errorMessage = computed(() => (props.error.value?.data as any)?.statusMessage);
</script>

<template>
    <div>
        {{ errorMessage }}
    </div>
</template>

<style scoped></style>