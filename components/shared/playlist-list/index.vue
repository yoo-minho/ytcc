<script setup lang="ts">
const props = defineProps<{ playlists: any[], status: string, error?: any, thumbnail?: boolean, loadingItemCount?: number }>();

const loading = computed(() => ['pending', 'idle', ''].includes(props.status));
</script>

<template>
    <SharedPlaylistListError v-if="error" :error="error" />

    <div v-else-if="loading" class="grid grid-cols-2 gap-4">
        <SharedPlaylistListLoading v-for="n in (loadingItemCount || 3)" :thumbnail="thumbnail" />
    </div>

    <SharedPlaylistListEmpty v-else-if="playlists && playlists.length === 0" />

    <div v-else>
        <div v-if="thumbnail" class="grid grid-cols-2 gap-4">
            <SharedPlaylistListItem v-for="playlist in playlists" :playlist="playlist" :thumbnail="true" />
        </div>
        <SharedPlaylistListItem v-else :playlist="playlists[0]" :thumbnail="false" />
    </div>
</template>

<style scoped></style>