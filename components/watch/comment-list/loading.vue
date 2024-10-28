<script setup lang="ts">
</script>

<template>
    <div class="dark">
        <UCard class="w-full flex gap-2 relative overflow-hidden rounded-none cursor-pointer" :ui="{
            body: { base: 'w-full', padding: 'p-4 sm:p-4' },
        }">
            <div class="flex gap-2">
                <div class="flex-1 flex flex-col items-start gap-1" style="width: 100%">
                    <div class="flex justify-between w-full">
                        <div class="flex gap-2" style="color: #3ea6ff">
                            <span>00:00</span>
                        </div>
                    </div>
                    <div class="w-full overflow-hidden gap-2 flex flex-col">
                        <USkeleton class="h-4 w-full" />
                        <USkeleton class="h-4 w-full" />
                        <USkeleton class="h-4 w-2/3" />
                    </div>
                    <div class="flex justify-between w-full">
                        <div class="flex items-center gap-1 text-base">
                            <UIcon name="i-heroicons-hand-thumb-up" />
                            <div>-</div>
                        </div>
                        <div>
                            <UiShareIcon :t="0" />
                        </div>
                    </div>
                </div>
            </div>
        </UCard>
    </div>
</template>

<style scoped></style>