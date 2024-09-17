<script setup lang='ts'>
import type { CommentType } from '@/types/comm';

defineProps<{ comment: CommentType; selected: boolean }>();
</script>

<template>
    <div class="flex-1 flex space-x-2 max-w-full text-left " :class="selected ? `text-primary-500` : ``">
        <div class="w-[48px] text-sm font-medium">
            {{ formatSeconds(comment.sec) }}
        </div>
        <div class="flex-1 text-sm font-medium text-left" :class="selected ? `` : `truncate`">
            {{ comment.comment }}
        </div>
        <div class="w-[48px] text-sm font-medium text-left flex items-center gap-1">
            <UIcon name="i-heroicons-hand-thumb-up" />
            <div>{{ comment.likeCount }}</div>
        </div>
    </div>
</template>

<style lang='scss' scoped></style>