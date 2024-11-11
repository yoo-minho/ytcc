<script setup lang='ts'>
const displayState = useDisplayState();

const moveMain = () => navigateTo({ path: '/' });

const isOpen = ref(false);
const install = async () => {
    localStorage.removeItem("true");
    const nuxtApp = useNuxtApp();
    if (nuxtApp.$pwa && nuxtApp.$pwa.showInstallPrompt) {
        nuxtApp.$pwa.install();
    } else {
        isOpen.value = true;
    }
};

const isPWAUnInstalled = ref(false);
onMounted(
    () => {
        const nuxtApp = useNuxtApp();
        isPWAUnInstalled.value = nuxtApp.$pwa?.isPWAInstalled === false;
    }
);
</script>
<template>
    <div v-if="$route.query.v"></div>
    <div v-else class="px-4 flex items-center gap-3 h-[60px]  w-full"
        :class="['weekly', 'trend'].includes(displayState.currentPage) ? `` : `border-b border-white/20`">
        <div v-if="String(displayState.currentPage) !== ''" @click="moveBack()"
            class="flex items-center cursor-pointer">
            <UIcon name="i-ph-arrow-left-bold" size="28px" />
        </div>
        <div class="flex-1 flex items-end">
            <template v-if="displayState.currentPage === 'trend'">
                <span class="text-xl font-bold tracking-tighter">인기 급상승 동영상</span>
            </template>
            <template v-else-if="displayState.currentPage === 'weekly'">
                <span class="text-xl font-bold">요일웹예능</span>
            </template>
            <template v-else-if="displayState.currentPage === 'playlist'">
                <span class="text-xl font-bold tracking-tighter">플레이리스트</span>
            </template>
            <template v-else>
                <div class="flex items-center gap-2 cursor-pointer" @click="moveMain()">
                    <img src="/public/icon-192.png" width="24px" />
                    <div class="flex items-center">
                        <span class="font-bold mr-1 text-xl tracking-tighter">YouTube</span>
                        <span class="font-bold text-xl text-red-500 tracking-tighter">Moments</span>
                    </div>
                </div>
            </template>
        </div>
        <UButton v-if="isPWAUnInstalled && $route.query.page === undefined" color="white" @click="install()">
            <span class="text-sm">앱설치</span>
        </UButton>
        <UiShareIcon :t="0" class="flex text-[24px]" />
    </div>
    <ModalPwaInstall v-model="isOpen" />
</template>

<style lang='scss' scoped></style>
