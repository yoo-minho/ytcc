<script setup lang="ts">
defineProps<{ videoId: string }>();
</script>

<template>
    <div class="flex flex-col p-4 w-full h-full justify-center items-center gap-2">
        이 콘텐츠에는 타임라인 댓글이 없습니다.<br />
        첫번째 타임라인 댓글을 작성해보세요!
        <UiYoutubeAppBtn :video-id="videoId" />
    </div>
</template>

<style scoped></style>