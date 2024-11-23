<script setup lang="ts">
import { MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const youtubeApi = useYoutubeApi();
const videoDataState = useVideoDataState();

const { data: videos, error, status } = youtubeApi.fetchTrendingVideos(
    MAX_TREND_VIDEO_COUNT
);
videoDataState.value.trendVideoData = videos.value || [];

const tabs = [
    { id: "top", label: "전체" },
    { id: "yesterday", label: "최신", badge: "N" },
    { id: "music", label: "음악" },
    { id: "trip", label: "여행" },
];
const selectedTabId = ref(tabs[0].id);
const selectTab = (id: string) => (selectedTabId.value = id);

const formattedVideos = computed(() => {
    return (videos.value || []).filter((v) => {
        if (selectedTabId.value === "yesterday")
            return +formatPublishedAt(v.publishedAt, "minFromNow") < 60 * 48;
        if (selectedTabId.value === "music") return v.categoryName === "음악";
        if (selectedTabId.value === "trip") return v.categoryName === "여행";
        if (selectedTabId.value === "top") return true;
        return true;
    });
});

useSeoMeta({
    ogUrl: location.href,
    title: "인기 급상승 동영상 | YouTube Moments",
    ogTitle: "인기 급상승 동영상 | YouTube Moments",
    description: "최고의 영상 속 최고의 순간을 즐기고 공유하세요.",
    ogDescription: "최고의 영상 속 최고의 순간을 즐기고 공유하세요.",
    twitterCard: "summary_large_image",
    ogImage: "/og-image.png",
    ogSiteName: "YouTube Moments",
});
</script>
<template>
    <div class="w-full flex flex-col">
        <div class="flex gap-4 px-4 pt-2 sticky top-0 z-10 border-b border-white/20 bg-black">
            <template v-for="tab in tabs">
                <div class="text-center w-12 h-8 cursor-pointer relative"
                    :class="[tab.id === selectedTabId ? 'text-white border-b-2' : 'text-white/50']"
                    @click="selectTab(tab.id)">
                    {{ tab.label }}
                    <span v-if="tab.badge" class="absolute -top-1 -right-1 text-xs text-red-500 font-bold">
                        {{ tab.badge }}
                    </span>
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
