type SeoBasicType = {
  title?: string;
  description?: string;
  image?: string;
};

const metaArr = [
  {
    type: "landing",
    meta: {
      title: "영상 최고의 순간을 즐기세요",
      description: "YouTube 영상 최고의 순간을 즐기고 공유하세요.",
      image: "/og-image.png",
    },
  },
  {
    type: "trend",
    meta: {
      title: "인기 급상승 동영상",
      description: "최고의 영상 속 최고의 순간을 즐기고 공유하세요.",
      image: "/og-image.png",
    },
  },
  {
    type: "weekly",
    meta: {
      title: "요일웹예능",
      description: "요일별 준비된 웹예능의 인상 깊은 순간을 즐기고 공유하세요.",
      image: "/og-image.png",
    },
  },
];

export function useCustomSeoMeta(metaParam: string | SeoBasicType) {
  let meta;
  if (typeof metaParam === "string") {
    meta = metaArr.find((m) => m.type === metaParam)?.meta || metaArr[0].meta;
  } else {
    meta = metaParam;
  }

  const title = (meta.title || metaArr[0].meta.title) + " | YouTubeMoments";
  const description = meta.description || metaArr[0].meta.description;
  const image = meta.image || metaArr[0].meta.image;

  useHead({ title });
  useSeoMeta({
    ogUrl: useRequestURL().href,
    title,
    ogTitle: title,
    twitterTitle: title,
    description,
    ogDescription: description,
    twitterDescription: description,
    twitterCard: "summary_large_image",
    ogImage: image,
  });
}
