<script setup lang='ts'>
import type { TimelineCommentType } from '@/types/comm';

const props = defineProps<{ idx: number; comment: TimelineCommentType; selected: boolean }>();

const filterComments = [...props.comment.comments].filter(c => c.likeCount > 0).splice(0, 10);
</script>

<template>
    <UCard class="w-full max-w-full flex gap-2" :ui="{
        body: {
            base: 'w-full',
            padding: 'px-4 py-5 sm:p-3',
        }
    }">
        <div class="flex gap-2">
            <div class="flex-1 flex flex-col items-start gap-1" style="width: 0;">
                <div style="color:#3ea6ff">
                    {{ formatSeconds(comment.sec) }}
                </div>
                <template v-for="(v, i) in filterComments">
                    <div class="flex w-full gap-1">
                        <template v-if="filterComments.length === 1">
                            <div class="text-sm font-medium w-full text-left">
                                {{ v.comment }}
                            </div>
                        </template>
                        <template v-else>
                            <div class="text-sm font-medium w-full text-left">
                                {{ i + 1 }}. {{ v.comment }} ({{ formatCount(v.likeCount) }})
                            </div>
                        </template>
                    </div>
                </template>
                <div class="flex items-center gap-1 text-base ">
                    <UIcon name="i-heroicons-hand-thumb-up" />
                    <div>{{ formatCount(comment.totalLikeCount) }}</div>
                </div>
            </div>

        </div>
    </UCard>
</template>

<style lang='scss' scoped></style>