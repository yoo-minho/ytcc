<script setup lang="ts">
import { MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const youtubeApi = useYoutubeApi();
const videoDataState = useVideoDataState();

const { data: videos, error, status } = youtubeApi.fetchTrendingVideos(MAX_TREND_VIDEO_COUNT);
videoDataState.value.trendVideoData = videos.value || [];

const tabs = [{ id: 'top', label: '전체' }, { id: 'yesterday', label: '최신' }, { id: 'music', label: '음악' }];
const selectedTabId = ref(tabs[0].id);
const selectTab = (id: string) => selectedTabId.value = id;

const formattedVideos = computed(() => videos.value?.filter(v => {
    if (selectedTabId.value === 'yesterday') return v.publishedAt === '1일 전';
    if (selectedTabId.value === 'music') return v.categoryName === '음악';
    if (selectedTabId.value === 'top') return true;
    return true;
}) || [])
</script>
<template>
    <div class="w-full flex flex-col">
        <div class="flex gap-4 px-4 pt-2 sticky top-0 z-10 border-b border-white/20 bg-black">
            <template v-for="tab in tabs">
                <div class="text-center w-12 h-8 cursor-pointer"
                    :class="[tab.id === selectedTabId ? 'text-white border-b-2' : 'text-white/50']"
                    @click="selectTab(tab.id)">

                    {{ tab.label }}
                </div>
            </template>
        </div>
        <div style="calc(100% - 40px)">
            <div class="px-4 py-2">
                <SharedVideoList :videos="formattedVideos" :status="status" :error="error" :rank="true"
                    :loading-item-count="8" />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped></style>
