<script setup lang="ts">
const items = [{
    id: 15,
    label: '15초',
}, {
    id: 30,
    label: '30초',
}, {
    id: 60,
    label: '60초',
}]

const route = useRoute();
const router = useRouter();

const selected = computed({
    get() {
        const index = items.findIndex((item) => item.id === Number(route.query.shorts))
        if (index === -1) return 0
        return index;
    },
    set(value) {
        router.replace({ query: { ...route.query, shorts: items[value].id } })
    }
});
</script>

<template>
    <UTabs v-model="selected" :items="items" />
</template>