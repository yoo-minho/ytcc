<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-6">내 구독 채널</h1>
        <UButton v-if="!isAuthenticated" @click="startAuth" color="red" class="mb-4">
            Google로 로그인
        </UButton>
        <div v-else-if="pending" class="text-center">
            <USpinner />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="subscription in subscriptions" :key="subscription.id"
                class="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img :src="subscription.snippet.thumbnails.medium.url" :alt="subscription.snippet.title"
                    class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-semibold mb-2 truncate">{{ subscription.snippet.title }}</h2>
                    <p class="text-gray-400 text-sm mb-2 truncate">{{ subscription.snippet.description }}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-300 text-sm">
                            구독자 {{ formatSubscriberCount(subscription.statistics?.subscriberCount) }}
                        </span>
                        <span class="text-gray-300 text-sm">
                            동영상 {{ formatVideoCount(subscription.statistics?.videoCount) }}개
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const isAuthenticated = ref(true);
const { data: subscriptions, pending, error } = await useFetch('/api/subscriptions', {
    lazy: true,
});

const startAuth = () => {
    navigateTo("/auth/google", { external: true });
};

const formatSubscriberCount = (count: string | undefined) => {
    if (!count) return '알 수 없음';
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const formatVideoCount = (count: string | undefined) => {
    return count ? parseInt(count).toLocaleString() : '알 수 없음';
};

watch(subscriptions, (newSubscriptions) => {
    if (newSubscriptions && newSubscriptions.length > 0) {
        isAuthenticated.value = true;
    }
});

onMounted(() => {
    if (!subscriptions.value) {
        refreshNuxtData('subscriptions');
    }
});
</script>
