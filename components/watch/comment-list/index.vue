<script setup lang="ts">
const props = defineProps<{
    videoId: string;
    comments: TimelineCommentType[];
    status: string;
    error: any;
}>();

const emit = defineEmits<{
    (e: 'changeTime', sec: number, videoId: string): void
}>()

const loading = computed(() => ["pending", "idle", ""].includes(props.status));
const { scrollContainer } = usePlayerProvider();
</script>

<template>
    <div class="flex-1 overflow-scroll" ref="scrollContainer">
        <div class="flex flex-col">
            <WatchCommentListError v-if="error" :error="error" />
            <WatchCommentListLoading v-else-if="loading" v-for="n in 3" />
            <WatchCommentListEmpty v-else-if="comments && comments.length === 0" :video-id="videoId" />
            <template v-else>
                <template v-for="comment in comments">
                    <WatchCommentListItem :id="`comment-${comment.sec}`" :video-id="videoId" :comment="comment"
                        @click="emit('changeTime', comment.sec, comment.videoId || '')" />
                </template>
            </template>
        </div>
    </div>
</template>

<style scoped></style>
