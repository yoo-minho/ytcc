<script setup lang='ts'>
import type { TimelineCommentType } from '@/types/comm';

defineProps<{ comment: TimelineCommentType; selected: boolean }>();
</script>

<template>
    <UCard class="w-full max-w-full flex gap-2" :ui="{
        body: {
            base: 'w-full',
            padding: 'px-4 py-5 sm:p-3',
        }
    }">
        <div class="flex gap-2">
            <div class="flex-1 flex flex-col items-start" style="width: 0;">
                <div style="color:#3ea6ff">
                    {{ formatSeconds(comment.sec) }}
                </div>
                <template v-for="v in comment.comments">
                    <div class="text-sm font-medium w-full text-left" :class="selected ? `` : `truncate`">
                        {{ v.comment }}
                    </div>
                </template>
            </div>
            <div class="min-w-[48px]">
                <div class="flex items-center gap-1 text-base">
                    <UIcon name="i-heroicons-hand-thumb-up-solid" />
                    <div>{{ comment.totalLikeCount }}</div>
                </div>
            </div>
        </div>
    </UCard>
</template>

<style lang='scss' scoped></style>