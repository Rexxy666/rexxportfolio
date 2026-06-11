/** Google Drive preview embed URLs — use with <iframe>, not raw <video src>. */
export const VIDEO_ASSETS = {
  // Shorts - Xtra
  xtra: "https://drive.google.com/file/d/13OmbLbvBtHF7e79aMhRK9y4MZHuVX_wx/preview",

  // Shorts - CrazyMike (第一支)
  crazyMikeShorts1: "https://drive.google.com/file/d/1o8zzmOjN0-u5Crsjp14U8pVpzhbGIIEo/preview",

  // Event - CrazyMike
  crazyMikeEvent: "https://drive.google.com/file/d/1H1KQY6uGyAGjOG7fI9kT7jbV30JmwZYt/preview",

  // Shorts - CrazyMike (第二支)
  crazyMikeShorts2: "https://drive.google.com/file/d/15twD0BuxM6B1W7l21aucPNjQh3sTs7eu/preview",

  // Shorts - LADYME
  ladyMe: "https://drive.google.com/file/d/1GM6mcTuaZcXVp16YAi-mj2LEe6oYmHQZ/preview",

  // Shorts - GuBao
  guBao: "https://drive.google.com/file/d/1R6U1qLV0KO9LdpWBW074GoVlV7f-PygC/preview",
};

export function isDrivePreviewUrl(url) {
  return typeof url === "string" && url.includes("drive.google.com/file/d/");
}

export const PORTFOLIO_VIDEOS = [
  {
    id: 1,
    title: { en: "Shorts - Xtra", zh: "短影音 - 女王波" },
    desc: { en: "1.2M views on YouTube", zh: "YouTube 觀看數 120 萬" },
    thumb: "/videos/0606-cover.png",
    url: VIDEO_ASSETS.xtra,
  },
  {
    id: 2,
    title: { en: "Shorts - CrazyMike", zh: "短影音 - 瘋狂賣客" },
    desc: { en: "Featured in annual report", zh: "收錄於年度報告" },
    thumb: "/videos/0805-cover.jpg",
    url: VIDEO_ASSETS.crazyMikeShorts1,
  },
  {
    id: 3,
    title: { en: "Event - CrazyMike", zh: "活動 - 瘋狂賣客" },
    desc: { en: "4.8M organic impressions", zh: "自然曝光達 480 萬" },
    thumb: "/videos/0106-cover.png",
    url: VIDEO_ASSETS.crazyMikeEvent,
  },
  {
    id: 4,
    title: { en: "Shorts - CrazyMike", zh: "短影音 - 瘋狂賣客" },
    desc: { en: "Official conference recap", zh: "官方會議精華回顧" },
    thumb: "/videos/fung.png",
    url: VIDEO_ASSETS.crazyMikeShorts2,
  },
  {
    id: 5,
    title: { en: "Shorts - LADYME", zh: "短影音 - LADYME" },
    desc: { en: "2.1M TikTok plays in 48h", zh: "48 小時 TikTok 播放 210 萬" },
    thumb: "/videos/0610-cover.jpg",
    url: VIDEO_ASSETS.ladyMe,
  },
  {
    id: 6,
    title: { en: "Shorts - GuBao", zh: "短影音 - 古寶無患子" },
    desc: { en: "Cannes Lions shortlisted", zh: "坎城創意節入圍作品" },
    thumb: "/videos/zhaofu-pingan-cover.png",
    url: VIDEO_ASSETS.guBao,
  },
];

/** Direct MP4 stream for hero background — native <video>, autoplay + object-fit: cover. */
export const HERO_BACKGROUND_MP4 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
