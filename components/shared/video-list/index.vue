<script setup lang="ts">
const props = defineProps<{ videos: TrendingVideoType[], status: string, error?: any, rank?: boolean }>();

const loading = computed(() => ['pending', 'idle', ''].includes(props.status));
</script>

<template>
    <div class="flex-1 overflow-scroll" ref="scrollContainer">
        <div class="flex flex-col">
            <SharedVideoListError v-if="error" :error="error" />
            <SharedVideoListLoading v-else-if="loading" v-for="n in 3" />
            <SharedVideoListEmpty v-else-if="videos && videos.length === 0" />
            <template v-else>
                <template v-for="(video, idx) in videos">
                    <SharedVideoListItem v-if="rank" :video="video" :idx="idx" />
                    <SharedVideoListItem v-else :video="video" />
                </template>
            </template>
        </div>
    </div>
</template>

<style scoped></style>