<script setup lang="ts">
defineProps<{ t?: number }>();

const { loop } = usePlayerProvider(); // 현재 재생 시간 추적

onMounted(() => {
  sharable.value =
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) && !!navigator.share;
});

const sharable = ref(false);
const copyCheck = ref("");
const toast = useToast();

const getShareUrl = (sec?: number) => {
  const url = new URL(window.location.href);
  if (sec) url.searchParams.set("t", sec.toString());
  if (loop.value !== 10) url.searchParams.set("loop", loop.value.toString());
  return url.toString();
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({ title: "클립보드에 복사하였습니다!" });
    copyCheck.value = "-check";
    setTimeout(() => (copyCheck.value = ""), 3000);
  } catch (err) {
    toast.add({ title: "잠시 후 다시 시도해주세요!" });
  }
};

const shareContent = async (url: string) => {
  try {
    await navigator.share({
      url,
    });
    console.log("공유 성공");
  } catch (error) {
    console.error("공유 실패:", error);
  }
};

const shareTimelineComment = (sec?: number) => {
  const url = getShareUrl(sec);
  sharable.value ? shareContent(url) : copyToClipboard(url);

  const { gtag } = useGtag();
  gtag("event", "share_click", {
    category: "Share",
    action: "click",
    label: url,
  });
};
</script>

<template>
  <div class="cursor-pointer flex" @click.stop="shareTimelineComment(t)">
    <template v-if="t === undefined">
      <UButton color="black" :ui="{ rounded: 'rounded-full' }"> 공유 </UButton>
    </template>
    <template v-else-if="sharable">
      <Icon name="lucide:send" />
    </template>
    <template v-else>
      <Icon :name="`heroicons:clipboard-document${copyCheck}`" />
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
