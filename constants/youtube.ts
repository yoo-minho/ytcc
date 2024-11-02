export const MAX_TREND_VIDEO_COUNT = 100;

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

//이거 한번 조회해서 파일로 만들어버릴까?
export const WEEKLY_PLAYLIST_ARR = [
  {
    id: "PLdvjXAGyK6xXPqNiGx8FZ885N1bM1zjcy",
    title: "짠한형",
    actor: "신동엽",
    cycle: "매주 월요일 오후 6시",
    day: "월",
    prettyTitle: (title: string) => {
      //EP. 64
      title = title.replace("[ENG SUB]", "").trim();
      const [actors = "", realTitle = ""] = title.split("{짠한형}");
      return `${realTitle} ${actors}`;
    },
  },
  {
    id: "PLBKy1umsMi3QKhFNFXEkhZJhUtMCrVrse",
    title: "🏀 턴오버",
    description: "2024 KBL 드래프트 도전기",
    actor: "하승진, 전태풍",
    cycle: "매주 월요일 오후 9시",
    day: "월",
    prettyTitle: (title: string) => {
      //EP49
      const [actors = "", realTitle = ""] = title.split(" | 턴 오버");
      return `${realTitle.trim()}\n${actors.trim()}`;
    },
  },
  {
    id: "PLbG_OH_pU3mpeKIrPn4DM9CroiCEg0l7n",
    actor: "존박, 레오",
    cycle: "매주 화요일 오후 6시",
    day: "화",
    prettyTitle: (title: string) => {
      title = title.replace(" | K’s 스터디", "").replace(" | K's 스터디", "").replace(" | K's스터디", "").trim();
      return title;
    },
  },
  {
    id: "PLWk6nxHc-4qZHRavpwqLYxk9zUsJCobYv",
    actor: "장도연",
    cycle: "매주 화요일 오후 6시",
    day: "화",
    prettyTitle: (title: string) => {
      //[SUB] 장도연 번호 따는 방법 | EP.63 홍경 노윤서 | 살롱드립2
      title = title.replace("[SUB]", "").replace(" | 살롱드립2", "").trim();
      const [x = "", y = ""] = title.split("| EP.");
      return `EP.${y} ${x}`;
    },
  },
  {
    id: "PLol-dXBOYZCxtuPo8l_HLXN4ZncUTK82o",
    actor: "탁재훈, 신규진",
    cycle: "매주 수요일 오후 6시",
    day: "수",
    prettyTitle: (title: string) => {
      //조이서, 김종민을 위협하는 신종 바보ㅣ노빠꾸탁재훈 시즌3 EP.17
      const [x = "", y = ""] = title.split("ㅣ노빠꾸탁재훈 시즌3 ");
      return `${y} ${x}`;
    },
  },
  {
    id: "PL8ZmFxF9Ts5wzAOc6dlEHcZ2p87p4oWx5",
    cycle: "격주 화요일 오후 6시 30분",
    actor: "장성규",
    day: "화",
    prettyTitle: (title: string) => {
      //[EN/JP] 걸그룹 숙소 최초 방문‼️ 대학 축제 휩쓴 QWER X 김계란, 첫 정산 근황은? | 아침먹고 가2 EP.22
      // 부동산에도 검색 안되는 홍진경 평창동 대저택🏠 과연 얼마일까?! | 아침먹고가2 EP.3
      const _title = title.replace("[EN/JP]", "").replace("[EN]", "").replace("(EN)", "").replace("[EN|ID]", "").trim();
      const getSplitText = () => {
        if (_title.includes("| 아침먹고가2 ")) return "| 아침먹고가2 ";
        if (_title.includes("| 아침먹고 가2 ")) return "| 아침먹고 가2 ";
        if (_title.includes("| 아침먹고 가 ")) return "| 아침먹고 가 ";
        if (_title.includes("| 아침먹고가 ")) return "| 아침먹고가 ";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },
  {
    id: "PLW9qLIgfFDYWFgXc5QQPljO4dwTO4V6y2",
    actor: "효연",
    cycle: "매주 수요일 오후 5시 30분",
    day: "수",
    prettyTitle: (title: string) => {
      //[EN] JYP에 입성한 SM 고인물 효연 / 밥사효 EP.13 ITZY 예지 편
      const _title = title.replace("[EN]", "").trim();
      const getSplitText = () => {
        if (_title.includes(" / 밥사효 ")) return " / 밥사효 ";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },

  {
    id: "PLuli3DqAnwjzEHHAC4He-Hf_pDK6xEjQX",
    title: "🍜나래식🥗",
    description: "한식, 양식, 중식, 일식 중 가장 맛있는 건? 나래식",
    actor: "박나래",
    cycle: "매주 수요일 오후 6시 30분",
    day: "수",
    prettyTitle: (title: string) => {
      //풍자X엄지윤 | 무서운 게 뭔 줄 알아? 나를 제일 잘 아는 사람이 나오는 거야.. [나래식] EP.06
      title = title.replace("(ENG)", "");
      if (title.includes("[나래식]")) {
        const [x = "", y = ""] = title.split(" [나래식] ");
        return `${y} ${x}`;
      } else {
        const [x = "", y = ""] = title.split(" 나래식 ");
        return `${y} ${x}`;
      }
    },
  },
  {
    id: "PLbG_OH_pU3moPUelcLwX2rM11BkWmSPqD",
    title: "🍜 B주류경제학 시즌2",
    description: "존박, 레오",
    actor: "김창선 PD, 이재용 회계사",
    cycle: "매주 목요일 오후 6시",
    day: "목",
    prettyTitle: (title: string) => {
      //출판사보다 더 아날로그인 산업이 있다? 낭만 그 자체인 보드게임 씬 이야기 (w. 넉살, 가이오트) | B주류경제학
      title = title.replace(" | B주류경제학", "");
      return title;
    },
  },
  {
    id: "PLL8Ck3RZ-liVMP6kg9iRIFqEfPWddoWO5",
    cycle: "매주 목요일 오후 6시",
    day: "목",
    prettyTitle: (title: string) => {
      //포항공대 vs 카이스트 맞짱 뜬 썰 푼다 [포항공대 컴퓨터공학과] | 전과자 ep.70 [EN]
      const _title = title.replace("[EN]", "").trim();
      const getSplitText = () => {
        if (_title.includes(" | 전과자 ")) return " | 전과자 ";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },
  {
    id: "PLdvjXAGyK6xWIZfCWJzeQTACl-dGKGmuS",
    title: "쏘는형",
    actor: "신동엽",
    cycle: "매주 목요일 오후 6시",
    day: "목",
    prettyTitle: (title: string) => {
      //[Sub] 조우진 하윤경 신동엽 Let's go 주당끼리 술 없이 찐토크 털고 감🍻 | 쏘는형 EP.15
      const _title = title.replace("[Sub]", "").trim();
      const getSplitText = () => {
        if (_title.includes(" | 쏘는형 ")) return " | 쏘는형 ";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },
  {
    id: "PLfBjRrTX1Ewqz6MgyiCHubNpfQF6lUlz2",
    title: "🌻덱스의 냉터뷰🌻",
    description: "냉장고도 파헤치고 요리도 하는 덱스의 냉터뷰 (｡•̀ᴗ-)✧",
    actor: "덱스",
    cycle: "격주 목요일 오후 7시",
    day: "목",
    prettyTitle: (title: string) => {
      //[덱스의 냉터뷰] 엄마 얘네 또 싸워 l EP.25 안은진 편
      const _title = title.replace("[덱스의 냉터뷰]", "").trim();
      const getSplitText = () => {
        if (_title.includes("l EP.")) return "l EP.";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `EP.${y} ${x}`;
    },
  },
  {
    id: "PLehGL5C3_2C4c9NP8XA3CdBn2mMKYvvao",
    title: "조동아리",
    actor: "김용만, 지석진, 김수용",
    cycle: "매주 금요일 오후 6시",
    day: "금",
  },
  {
    id: "PLHqqPM2t7weIMhLb_1_xa7qyPOKW8OCiq",
    title: "",
    actor: "장성규",
    cycle: "매주 금요일 오후 6시",
    day: "금",
  },
  {
    id: "PLol-dXBOYZCyVjq6u3XRvMFhjMJdCQFvu",
    cycle: "매주 금요일 오후 6시",
    actor: "탁재훈",
    day: "금",
    prettyTitle: (title: string) => {
      //과즙세연, 횡단보도 트라우마 때문에 육교만 건너 다니는 그녀 ㅣ탁재훈 신규진 김예원의 탁스패치 EP.25
      const _title = title.replace("[EN]", "").trim();
      const getSplitText = () => {
        if (_title.includes("ㅣ탁재훈 신규진 김예원의 탁스패치 ")) return "ㅣ탁재훈 신규진 김예원의 탁스패치 ";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },
  {
    id: "PL8ZmFxF9Ts5yZY-RlNAG51MqkURwYBBk5",
    cycle: "매주 금요일 오후 6시 30분",
    actor: "풍자",
    day: "금",
    prettyTitle: (title: string) => {
      //군산 맛 끝판왕 등장🔥 군산 주민이 올해만 100그릇 먹은 찐로컬 맛집 찾았다 | 또간집 EP.63
      const _title = title.replace("[SUB]", "").trim();
      const getSplitText = () => {
        if (_title.includes(" | 또간집 ")) return " | 또간집 ";
        if (_title.includes("| 또간집 ")) return "| 또간집 ";
        if (_title.includes(" | 간판또간집 ")) return " | 간판또간집 ";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },
  {
    id: "PLBOye70K3oCFHfbeABGgnXgTV1oR8ontz",
    title: "",
    actor: "이영지",
    cycle: "매주 금요일 오후 7시",
    day: "금",
    prettyTitle: (title: string) => {
      //[SUB] 죄송하지만 여권을 제게 내놓으시겠습니까?  [차린건 쥐뿔도 없지만] EP.32 #이영지 #켄타로
      const _title = title.replace("[SUB]", "").trim();
      const getSplitText = () => {
        if (_title.includes("[차린건 쥐뿔도 없지만]")) return "[차린건 쥐뿔도 없지만]";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },
  {
    id: "PLZHuNVGYrlkvFwUOIPcJnAITdo9n6WllN",
    title: "🥄토요일은 밥이 쏜다 🥄",
    actor: "히밥",
    cycle: "매주 토요일 오후 5시",
    day: "토",
    prettyTitle: (title: string) => {
      //히밥, 배달앱 6개월 결제금액이..ㄷㄷ [토요일은 밥이 쏜다] EP.03 #토밥쏜다
      const _title = title.replace("#토밥쏜다", "").trim();
      const getSplitText = () => {
        if (_title.includes("[토요일은 밥이 쏜다]")) return "[토요일은 밥이 쏜다]";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },

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
    title: "조현아의 목요일 밤",
    day: "완결",
    actor: "조현아",
    cycle: "매주 목요일 오후 7시",
    prettyTitle: (title: string) => {
      //[SUB] 과즙 머금은 아기토끼🐰 대체 불가 서머 퀸👑 엔딩요정 나연🍑 l EP.78 l 조현아의 목요일 밤 l 나연 조현아
      const _title = title.replace("[SUB]", "").trim();
      const getSplitText = () => {
        if (_title.includes(" l ")) return " l ";
        if (_title.includes(" | ")) return " | ";
        if (_title.includes("|")) return "|";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },
  {
    id: "PL4P8Dv_rpsNzWhpntV51XhQdq4R-iBNtD",
    cycle: "",
    day: "일",
    prettyTitle: (title: string) => {
      //전과자 vs 전 과체중! 유튜브 예능의 매운 맛을 서로에게 알려주는 토크쇼 | 딱대 EP 17 이창섭
      const _title = title.replace("#토밥쏜다", "").trim();
      const getSplitText = () => {
        if (_title.includes(" | 딱대 ")) return " | 딱대 ";
        return "_";
      };
      const [x = "", y = ""] = _title.split(getSplitText());
      return `${y} ${x}`;
    },
  },
  {
    id: "PLol-dXBOYZCwzaXU5Hh9YhU7AxpJXzHNA",
    actor: "김예원",
    cycle: "매주 월요일 오후 6시",
    day: "완결",
    prettyTitle: (title: string) => {
      //전과자 vs 전 과체중! 유튜브 예능의 매운 맛을 서로에게 알려주는 토크쇼 | 딱대 EP 17 이창섭
      const _title = title.replace("김예원의 솔로탈출 ", "").replace("| (노빠꾸 탁재훈 월요일 프로젝트)", "").trim();
      return _title;
    },
  },
];
