<script setup lang="ts">
</script>
<template>
    <div class="flex justify-center bg-gray-500">
        <div class="min-w-xs max-w-[430px] w-full flex flex-col h-dvh bg-black">
            <UNotifications />
            <LayoutDefaultHeader />
            <div class="flex-1 overflow-y-auto">
                <slot />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
