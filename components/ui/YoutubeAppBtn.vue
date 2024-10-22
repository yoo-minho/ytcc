<script setup lang="ts">
const props = defineProps<{ videoId?: string; playlistId?: string; text?: string; time?: number }>();

const isMobile = ref(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
const isPWA = ref(window.matchMedia('(display-mode: standalone)').matches);

const youtubeUrl = computed(() => {
    let baseUrl = "https://www.youtube.com/";
    if (props.videoId) {
        baseUrl += `watch?v=${props.videoId}`;
    } else if (props.playlistId) {
        baseUrl += `playlist?list=${props.playlistId}`;
    }
    return props.time ? `${baseUrl}&t=${props.time}` : baseUrl;
});

const youtubeAppUrl = computed(() => {
    let baseUrl = 'vnd.youtube://';
    if (props.videoId) {
        baseUrl += props.videoId;
    } else if (props.playlistId) {
        baseUrl += `www.youtube.com/playlist?list=${props.playlistId}`;
    }
    return props.time ? `${baseUrl}?t=${props.time}` : baseUrl;
});

const openYouTubeApp = () => {
    if (isMobile.value) {
        if (isPWA.value) {
            const newWindow = window.open(youtubeUrl.value, '_blank');
            if (newWindow) {
                newWindow.addEventListener('load', () => window.close());
            }
        } else {
            window.location.href = youtubeAppUrl.value;
            setTimeout(() => {
                if (document.hasFocus()) {
                    window.location.href = youtubeUrl.value;
                }
            }, 2000);
        }
    } else {
        navigateTo(youtubeUrl.value, {
            external: true,
            open: { target: "youtube" },
        });
    }
};

</script>

<template>
    <template v-if="time">
        <Icon name="openmoji:youtube" size="24px" @click="openYouTubeApp" class="flex" />
    </template>
    <template v-else>
        <UButton color="black" class="flex items-center justify-center gap-1" @click="openYouTubeApp">
            <Icon name="openmoji:youtube" class="w-5 h-5" />
            <div class="tracking-tighter">{{ text || "앱 열기" }}</div>
        </UButton>
    </template>
</template>

<style scoped></style>