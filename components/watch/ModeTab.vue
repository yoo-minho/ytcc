<script setup lang="ts">
const items = [{
    id: 'top',
    label: 'Top 10',
    icon: 'i-heroicons-information-circle',
}, {
    id: 'timeline',
    label: 'Timeline',
    icon: 'i-heroicons-arrow-down-tray',
}]

const route = useRoute();
const router = useRouter();

const selected = computed({
    get() {
        const index = items.findIndex((item) => item.id === route.query.mode)
        if (index === -1) return 0
        return index;
    },
    set(value) {
        router.replace({ query: { ...route.query, mode: items[value].id } })
    }
});
</script>

<template>
    <UTabs v-model="selected" :items="items" />
</template>