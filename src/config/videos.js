/** Google Drive preview embed URLs — use with <iframe>, not raw <video src>. */
export const VIDEO_ASSETS = {
  // Shorts - Xtra
  xtra: "https://drive.google.com/file/d/13OmbLbvBtHF7e79aMhRK9y4MZHuVX_wx/preview",

  // Award Film - New Taipei Advertisers
  newTaipeiAdvertisers: "https://drive.google.com/file/d/12LJGQRFwZ8VkRSOMHQyzahzdFktKqmZA/preview",

  // Event - CrazyMike
  crazyMikeEvent: "https://drive.google.com/file/d/1H1KQY6uGyAGjOG7fI9kT7jbV30JmwZYt/preview",

  // Shorts - CrazyMike
  crazyMikeShorts: "https://drive.google.com/file/d/1zgXqgA8jLLIPzxCapSBU3b8IK5r_xpoM/preview",

  // Shorts - LADYME
  ladyMe: "https://drive.google.com/file/d/1GM6mcTuaZcXVp16YAi-mj2LEe6oYmHQZ/preview",

  // Shorts - Astra Wong
  astraWong: "https://drive.google.com/file/d/1PdkMTNsI0Fe65Z4uxVfvu0U3hf_3iRLQ/preview",

  // Micro Film - Breaking Free (破繭)
  poJian: "https://drive.google.com/file/d/1cjD52lQCo0Zv9fwGTJrApeihYp-g-oIq/preview",
};

export function isDrivePreviewUrl(url) {
  return typeof url === "string" && url.includes("drive.google.com/file/d/");
}

export const PORTFOLIO_VIDEOS = [
  {
    id: 1,
    title: { en: "Shorts - Astra Wong", zh: "短影音 - 艾斯特拉旺" },
    desc: { en: "Short-form social content", zh: "社群短影音" },
    thumb: "https://drive.google.com/thumbnail?id=1PdkMTNsI0Fe65Z4uxVfvu0U3hf_3iRLQ&sz=w1200",
    url: VIDEO_ASSETS.astraWong,
  },
  {
    id: 2,
    title: { en: "Event - CrazyMike", zh: "活動 - 瘋狂賣客" },
    desc: { en: "4.8M organic impressions", zh: "自然曝光達 480 萬" },
    thumb: "/videos/0106-cover.png",
    url: VIDEO_ASSETS.crazyMikeEvent,
  },
  {
    id: 3,
    title: { en: "Shorts - CrazyMike", zh: "短影音 - 瘋狂賣客" },
    desc: { en: "Short-form social content", zh: "社群短影音" },
    thumb: "https://drive.google.com/thumbnail?id=1zgXqgA8jLLIPzxCapSBU3b8IK5r_xpoM&sz=w1200",
    url: VIDEO_ASSETS.crazyMikeShorts,
  },
  {
    id: 4,
    title: { en: "Shorts - LADYME", zh: "短影音 - LADYME" },
    desc: { en: "2.1M TikTok plays in 48h", zh: "48 小時 TikTok 播放 210 萬" },
    thumb: "/videos/0610-cover.jpg",
    url: VIDEO_ASSETS.ladyMe,
  },
  {
    id: 5,
    title: { en: "Shorts - Xtra", zh: "短影音 - 女王波" },
    desc: { en: "1.2M views on YouTube", zh: "YouTube 觀看數 120 萬" },
    thumb: "/videos/0606-cover.png",
    url: VIDEO_ASSETS.xtra,
  },
  {
    id: 6,
    title: { en: "Award Film - New Taipei Advertisers", zh: "新北廣告人 - 獲獎影片" },
    desc: { en: "Award-winning film", zh: "獲獎作品" },
    thumb: "https://drive.google.com/thumbnail?id=1KASn2NgQig7-O1I3ycnd5b-SufD9st7H&sz=w1200",
    url: VIDEO_ASSETS.newTaipeiAdvertisers,
    landscape: true,
  },
  {
    id: 7,
    title: { en: "Award Film - Breaking Free", zh: "傳技展獲獎影片 - 破繭" },
    desc: { en: "16:9 micro film · Award winner", zh: "16:9 微電影 · 獲獎作品" },
    thumb: "https://drive.google.com/thumbnail?id=10j2Rih5xXoIK15ulFwjKARE5lEt0yKbT&sz=w1200",
    url: VIDEO_ASSETS.poJian,
    landscape: true,
  },
];
