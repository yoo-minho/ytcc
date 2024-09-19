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
            <div class="flex-1 flex flex-col items-start" style="width: 0;">
                <div class="flex w-full justify-between">
                    <div style="color:#3ea6ff">
                        {{ formatSeconds(comment.sec) }}
                    </div>
                    <div class="min-w-[48px]">
                        <div class="flex items-center gap-1 text-base">
                            <UIcon name="i-heroicons-hand-thumb-up-solid" />
                            <div>{{ comment.totalLikeCount }}</div>
                        </div>
                    </div>
                </div>
                <template v-for="(v, i) in filterComments">
                    <div class="flex w-full gap-1">
                        <template v-if="filterComments.length === 1">
                            <div class="text-sm font-medium w-full text-left" :class="selected ? `` : `truncate`">
                                {{ v.comment }}
                            </div>
                        </template>
                        <template v-else>
                            <div class="text-sm font-medium w-full text-left" :class="selected ? `` : `truncate`">
                                {{ i + 1 }}. {{ v.comment }}
                            </div>
                            <div class="min-w-[48px]">
                                <div class="flex items-center gap-1 text-sm">
                                    <UIcon name="i-heroicons-hand-thumb-up" />
                                    <div>{{ v.likeCount }}</div>
                                </div>
                            </div>
                        </template>

                    </div>
                </template>
            </div>

        </div>
    </UCard>
</template>

<style lang='scss' scoped></style>