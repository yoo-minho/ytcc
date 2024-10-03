export const MAX_TREND_VIDEO_COUNT = 50;

export enum YouTubeCategory {
  FILM_ANIMATION = "1",
  AUTOS_VEHICLES = "2",
  MUSIC = "10",
  PETS_ANIMALS = "15",
  SPORTS = "17",
  TRAVEL_EVENTS = "19",
  GAMING = "20",
  BLOGS = "22",
  COMEDY = "23",
  ENTERTAINMENT = "24",
  NEWS_POLITICS = "25",
  HOWTO_STYLE = "26",
  EDUCATION = "27",
  SCIENCE_TECH = "28",
  NONPROFITS_ACTIVISM = "29",
}

export const YOUTUBE_CATEGORY_MAP: Record<YouTubeCategory, string> = {
  [YouTubeCategory.FILM_ANIMATION]: "영화",
  [YouTubeCategory.AUTOS_VEHICLES]: "자동차",
  [YouTubeCategory.MUSIC]: "음악",
  [YouTubeCategory.PETS_ANIMALS]: "동물",
  [YouTubeCategory.SPORTS]: "스포츠",
  [YouTubeCategory.TRAVEL_EVENTS]: "여행",
  [YouTubeCategory.GAMING]: "게임",
  [YouTubeCategory.BLOGS]: "블로그",
  [YouTubeCategory.COMEDY]: "코미디",
  [YouTubeCategory.ENTERTAINMENT]: "엔터",
  [YouTubeCategory.NEWS_POLITICS]: "뉴스",
  [YouTubeCategory.HOWTO_STYLE]: "노하우",
  [YouTubeCategory.EDUCATION]: "교육",
  [YouTubeCategory.SCIENCE_TECH]: "과학",
  [YouTubeCategory.NONPROFITS_ACTIVISM]: "비영리",
};

export const WEEKLY_PLAYLIST_ARR = [
  {
    id: "PLBKy1umsMi3QKhFNFXEkhZJhUtMCrVrse",
    title: "🏀 턴오버",
    description: "2024 KBL 드래프트 도전기",
    actor: "하승진, 전태풍",
    cycle: "매주 월요일 오후 9시",
    day: "월",
  },
  {
    id: "PLbG_OH_pU3mpeKIrPn4DM9CroiCEg0l7n",
    cycle: "매주 화요일 오후 6시",
    day: "화",
  },
  {
    id: "PL8ZmFxF9Ts5wzAOc6dlEHcZ2p87p4oWx5",
    cycle: "격주 화요일 오후 6시 30분",
    actor: "장성규",
    day: "화",
  },
  {
    id: "PLuli3DqAnwjzEHHAC4He-Hf_pDK6xEjQX",
    title: "🍜나래식🥗",
    description: "한식, 양식, 중식, 일식 중 가장 맛있는 건? 나래식",
    actor: "박나래",
    cycle: "매주 수요일 오후 6시 30분",
    day: "수",
  },
  {
    id: "PLbG_OH_pU3moPUelcLwX2rM11BkWmSPqD",
    title: "🍜 B주류경제학 시즌2",
    description: "존박, 레오",
    actor: "김창선 PD, 이재용 회계사",
    cycle: "매주 목요일 오후 6시",
    day: "목",
  },
  {
    id: "PLL8Ck3RZ-liVMP6kg9iRIFqEfPWddoWO5",
    cycle: "매주 목요일 오후 6시",
    day: "목",
  },

  {
    id: "PLfBjRrTX1Ewqz6MgyiCHubNpfQF6lUlz2",
    title: "🌻덱스의 냉터뷰🌻",
    description: "냉장고도 파헤치고 요리도 하는 덱스의 냉터뷰 (｡•̀ᴗ-)✧",
    actor: "덱스",
    cycle: "격주 목요일 오후 7시",
    day: "목",
  },
  {
    id: "PLHqqPM2t7weIMhLb_1_xa7qyPOKW8OCiq",
    title: "",
    actor: "장성규",
    cycle: "매주 금요일 오후 6시",
    day: "금",
  },
  {
    id: "PL8ZmFxF9Ts5yZY-RlNAG51MqkURwYBBk5",
    cycle: "매주 금요일 오후 6시 30분",
    actor: "풍자",
    day: "금",
  },
  {
    id: "PLBOye70K3oCFHfbeABGgnXgTV1oR8ontz",
    title: "",
    actor: "이영지",
    cycle: "매주 금요일 오후 7시",
    day: "금",
  },
  // {
  //   id: "PL4nhDXRzk6q1Fc1OFhK8OcVWk4yDUs-Ua",
  //   title: "띱?",
  //   cycle: "매주 토요일 12시",
  //   day: "토",
  // },
  {
    id: "PL7MQjbfOyOE00FrDWwrbaTtH7mSZOKnvO",
    day: "시즌",
  },
  {
    id: "PL_OIehNcWkf2Ke1g77DwROk-0I9vDmt7J",
    day: "완결",
  },
  {
    id: "PL2vkLEO0P2xcnd29fHTjMCBZgs4APKKbl",
    day: "완결",
    actor: "조현아",
    cycle: "매주 목요일 오후 7시",
  },
];
