<script setup lang="ts">
const props = defineProps<{ playlists: PlaylistType[], status?: string, error?: any, thumbnail?: boolean, loadingItemCount?: number }>();
const loading = computed(() => ['pending', 'idle', ''].includes(props.status || 'success'));
</script>
<template>
    <template v-if="error">
        <SharedPlaylistListError :error="error" />
    </template>
    <template v-else-if="loading">
        <div class="grid grid-cols-2 gap-4">
            <SharedPlaylistListLoading v-for="n in (loadingItemCount || 3)" :thumbnail="thumbnail" />
        </div>
    </template>
    <template v-else-if="playlists && playlists.length === 0">
        <SharedPlaylistListEmpty />
    </template>
    <template v-else>
        <div>
            <template v-if="thumbnail">
                <div class="grid grid-cols-2 gap-4">
                    <SharedPlaylistListItem v-for="playlist in playlists" :playlist="playlist" :thumbnail="true" />
                </div>
            </template>
            <template v-else>
                <SharedPlaylistListItem v-for="playlist in playlists" :playlist="playlist" :thumbnail="false" />
            </template>
        </div>
    </template>
</template>

<style scoped></style>