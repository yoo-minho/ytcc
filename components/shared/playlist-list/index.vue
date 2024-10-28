<script setup lang="ts">
const props = defineProps<{ playlists: any[], status: string, error?: any, thumbnail?: boolean }>();

const loading = computed(() => ['pending', 'idle', ''].includes(props.status));
</script>

<template>
    <SharedPlaylistListError v-if="error" :error="error" />
    <div v-else-if="loading" class="grid grid-cols-2 gap-4">
        <SharedPlaylistListLoading v-for="n in 2" />
    </div>
    <SharedPlaylistListEmpty v-else-if="playlists && playlists.length === 0" />
    <template v-else>
        <div class="grid grid-cols-2 gap-4">
            <template v-for="(playlist) in playlists">
                <SharedPlaylistListItem :playlist="playlist" :thumbnail="!!thumbnail" />
            </template>
        </div>
    </template>
</template>

<style scoped></style>