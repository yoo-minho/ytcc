<script setup lang='ts'>
const toast = useToast();

const copyLink = async () => {
    await navigator.clipboard.writeText(location.href);
    toast.add({
        id: "copyLink",
        title: "링크 복사! 공유를 시작하세요!",
        icon: "i-heroicons-check-circle",
    });
} 
</script>

<template>
    <div
        class="mx-auto px-2 max-w-7xl flex items-center justify-between gap-3 h-[60px] border-b border-gray-800 w-full">
        <div class="flex gap-1">
            <UButton color="gray" variant="ghost" @click="() => navigateTo('/')">
                <span class="text-sm">메인으로</span>
            </UButton>
        </div>
        <div class="flex-1 text-xl font-bold text-center">타임라인 댓글추출</div>
        <div class="flex gap-1">
            <UButton color="gray" variant="ghost" @click="copyLink()">
                <span class="text-sm">공유하기</span>
            </UButton>
        </div>
    </div>
</template>

<style lang='scss' scoped></style>
