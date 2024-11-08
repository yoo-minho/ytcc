<script setup lang="ts">
import type { TrendingVideoType } from "@/types/comm";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";
import YoutubeAppBtn from "./ui/YoutubeAppBtn.vue";
import { WEEKLY_PLAYLIST_ARR } from "~/constants/youtube";

const youtubeApi = useYoutubeApi();

const route = useRoute();
const listId = ref();
watch(
    () => route.query.list,
    () => {
        listId.value = route.query.list ? String(route.query.list) : undefined;
    },
    { immediate: true }
);

const { data: playlists, status: playlistsStatus } = youtubeApi.fetchPlayListInfo(listId.value);

const { data: videos, status } = useAsyncData(
    "playlist",
    async () => {
        if (!listId.value) return;
        return await $fetch<TrendingVideoType[]>("/api/playlist", {
            method: "POST",
            body: { listId: listId.value },
        })
    },
    {
        watch: [listId],
        transform: (videos) => {
            return videos?.map((v) => {
                const matchingData = WEEKLY_PLAYLIST_ARR.find((v) => v.id === listId.value);
                let title = v.title;
                if (typeof matchingData?.prettyTitle === 'function') {
                    title = matchingData.prettyTitle(v.title);
                }
                return { ...v, title };
            });
        },
    }
);
</script>
<template>
    <div class="w-full absolute">
        <SharedPlaylistList :playlists="playlists || []" :status="playlistsStatus" :thumbnail="false"
            :loading-item-count="1" class="m-4" />
        <YoutubeAppBtn :playlist-id="String(listId)" text="앱에서 재생목록 열기" class="mx-4 mb-2" />
        <SharedVideoList :videos="videos || []" :status="status" :loading-item-count="8" class="px-4" />
    </div>
</template>

<style lang="scss" scoped></style>
