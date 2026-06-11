import { useState, useEffect, useRef } from "react";
import Chatbot from "./components/Chatbot/Chatbot.jsx";

const VIDEOS = [
  {
    id: 1,
    title: { en: "Shorts - Xtra", zh: "短影音 - 女王波" },
    desc: { en: "1.2M views on YouTube", zh: "YouTube 觀看數 120 萬" },
    thumb: "/videos/0606-cover.png",
    url: "/videos/0606.mov",
    isLocal: true,
  },
  {
    id: 2,
    title: { en: "Shorts - CrazyMike", zh: "短影音 - 瘋狂賣客" },
    desc: { en: "Featured in annual report", zh: "收錄於年度報告" },
    thumb: "/videos/0805-cover.jpg",
    url: "/videos/0805.mov",
    isLocal: true,
  },
  {
    id: 3,
    title: { en: "Event - CrazyMike", zh: "活動 - 瘋狂賣客" },
    desc: { en: "4.8M organic impressions", zh: "自然曝光達 480 萬" },
    thumb: "/videos/0106-cover.png",
    url: "/videos/0106.mov",
    isLocal: true,
  },
  {
    id: 4,
    title: { en: "Shorts - CrazyMike", zh: "短影音 - 瘋狂賣客" },
    desc: { en: "Official conference recap", zh: "官方會議精華回顧" },
    thumb: "/videos/fung.png",
    url: "/videos/1218.mov",
    isLocal: true,
  },
  {
    id: 5,
    title: { en: "Shorts - LADYME", zh: "短影音 - LADYME" },
    desc: { en: "2.1M TikTok plays in 48h", zh: "48 小時 TikTok 播放 210 萬" },
    thumb: "/videos/0610-cover.jpg",
    url: "/videos/0610.mp4",
    isLocal: true,
  },
  {
    id: 6,
    title: { en: "Shorts - GuBao", zh: "短影音 - 古寶無患子" },
    desc: { en: "Cannes Lions shortlisted", zh: "坎城創意節入圍作品" },
    thumb: "/videos/zhaofu-pingan-cover.png",
    url: "/videos/zhaofu-pingan.mov",
    isLocal: true,
  },
];

const SERVICES = [
  {
    icon: "🎬",
    title: { en: "Brand & Corporate Films", zh: "品牌與企業影片" },
    tagline: { en: "Make your brand impossible to ignore.", zh: "讓品牌存在感無法被忽視。" },
    desc: {
      en: "Cut the noise. We leverage high-frequency pacing and precise visual language to embed your brand identity in seconds. From social snippets and high-energy ad cuts to product showcases-every frame hits the core.",
      zh: "拒絕冗長的鋪陳，我們用高頻快節奏與精準視覺語法，在數秒內深植品牌基因。無論是社群短片、廣告快剪或產品展示，每一幀都直擊核心。",
    },
  },
  {
    icon: "📱",
    title: { en: "Short-Form Social Content", zh: "社群短影音內容" },
    tagline: { en: "Boost engagement with high-energy vertical video.", zh: "用高節奏直式影片提升互動率。" },
    desc: {
      en: "Platform-native Reels and TikToks engineered for the scroll - attention-grabbing in the first second, shareable by the last.",
      zh: "為平台量身打造 Reels 與 TikTok，首秒吸睛、結尾促分享，為滑動場景設計。",
    },
  },
  {
    icon: "🎥",
    title: { en: "Event Documentation", zh: "活動紀錄製作" },
    tagline: { en: "Capture the moments that define your brand.", zh: "捕捉定義品牌的每個關鍵時刻。" },
    desc: {
      en: "From product launches to conferences, cinematic event coverage that turns one-day experiences into evergreen marketing assets.",
      zh: "從新品發表到大型會議，以電影感紀錄把一天活動轉化為可長期使用的行銷素材。",
    },
  },
];

const HERO_VIDEO_POOL = VIDEOS.filter((video) => video.isLocal).map((video) => video.url);

const TRANSLATIONS = {
  en: {
    nav: { hero: "home", portfolio: "portfolio", services: "services", contact: "contact" },
    hero: {
      eyebrow: "Professional Video Production",
      titleTop: "Forging The Next Generation Of",
      titleEm: "Visual Experiences",
      sub: "Dynamic Storytelling For Brands And Projects At The Frontier Of Innovation",
      ctaWork: "View My Work",
      ctaBook: "Book a Consult",
      scroll: "Scroll",
    },
    portfolio: {
      label: "Selected Work",
      titleTop: "The Proof Is",
      titleBottom: "In the Frame",
      sub: "A selection of brand films, social campaigns, and event documentation that moved audiences - and moved the needle.",
      close: "Close",
    },
    services: {
      label: "What We Do",
      titleTop: "Full-Service",
      titleBottom: "Visual Production",
    },
    contact: {
      label: "Get In Touch",
      titleTop: "Let's Create Something",
      titleEm: "Unforgettable",
      sub: "Whether you have a full brief or just an idea - We're here to help shape it into a film your audience won't forget.",
      location: "Based in Taipei, Taiwan - Available Worldwide",
      success: "Message received - We'll be in touch within 24 hours.",
      name: "Name",
      email: "Email",
      projectType: "Project Type",
      message: "Message",
      file: "Brief / Reference Files (optional)",
      uploadPlaceholder: "Upload brief, moodboard, or reference",
      send: "Send Inquiry",
      note: "No commitment. Response within 24h.",
      namePlaceholder: "Jane Smith",
      emailPlaceholder: "jane@company.com",
      msgPlaceholder: "Tell me about your project, timeline, and goals...",
      projectOptions: [
        "Brand & Corporate Film",
        "Short-Form Social Content",
        "Event Documentation",
        "Other",
      ],
      projectDefault: "Select a service...",
      uploadPrefix: "Upload:",
    },
    footer: {
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms",
    },
    langLabel: "Language",
  },
  zh: {
    nav: { hero: "首頁", portfolio: "作品", services: "服務", contact: "聯絡" },
    hero: {
      eyebrow: "專業影像製作",
      titleTop: "鍛造下一世代的",
      titleEm: "視覺體驗",
      sub: "為追求創新的品牌與計畫，打造深具動態感的敘事體驗",
      ctaWork: "查看作品",
      ctaBook: "預約諮詢",
      scroll: "向下",
    },
    portfolio: {
      label: "精選作品",
      titleTop: "畫面",
      titleBottom: "就是證明",
      sub: "精選品牌影片、社群企劃與活動紀錄，既打動受眾，也帶動成果。",
      close: "關閉",
    },
    services: {
      label: "服務項目",
      titleTop: "一站式",
      titleBottom: "影像製作",
    },
    contact: {
      label: "聯絡我們",
      titleTop: "一起打造",
      titleEm: "難忘作品",
      sub: "不論你已有完整需求或只是初步想法，我們都能協助你把它變成令人難忘的影片。",
      location: "駐點於台北，台灣 - 可全球接案",
      success: "已收到你的訊息，我們會在 24 小時內回覆。",
      name: "姓名",
      email: "Email",
      projectType: "專案類型",
      message: "訊息內容",
      file: "企劃 / 參考檔案（選填）",
      uploadPlaceholder: "上傳企劃、風格板或參考素材",
      send: "送出詢問",
      note: "無需承諾，24 小時內回覆。",
      namePlaceholder: "王小明",
      emailPlaceholder: "you@company.com",
      msgPlaceholder: "請告訴我你的需求、時程與目標...",
      projectOptions: ["品牌與企業影片", "社群短影音內容", "活動紀錄製作", "其他"],
      projectDefault: "請選擇服務...",
      uploadPrefix: "已選擇：",
    },
    footer: {
      rights: "版權所有。",
      privacy: "隱私政策",
      terms: "服務條款",
    },
    langLabel: "語言",
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080808; --surface: #111111; --border: rgba(255,255,255,0.07);
    --gold: #C9A84C; --gold-dim: rgba(201,168,76,0.15);
    --white: #F0EDE8; --muted: rgba(240,237,232,0.45);
    --font-display: 'Cormorant Garamond', serif; --font-body: 'DM Sans', sans-serif;
    --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--white); font-family: var(--font-body); font-weight: 300; overflow-x: hidden; }

  nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1.4rem 4rem; transition: background 0.4s var(--ease), backdrop-filter 0.4s; }
  nav.scrolled { background: rgba(8,8,8,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
  .nav-logo { display: inline-flex; align-items: center; text-decoration: none; }
  .nav-logo img { height: 54px; width: auto; display: block; mix-blend-mode: screen; }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a { font-size: 0.78rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; position: relative; }
  .nav-links a::after { content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 1px; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 0.3s var(--ease); }
  .nav-links a:hover { color: var(--white); }
  .nav-links a:hover::after { transform: scaleX(1); }
  .nav-right { display: flex; align-items: center; gap: 0.8rem; }
  .lang-select {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    color: var(--white);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.45rem 0.65rem;
    min-width: 80px;
  }

  #hero { position: relative; height: 100vh; min-height: 600px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
  #hero video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.35; }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.6) 100%); }
  .hero-content { position: relative; z-index: 2; max-width: 820px; padding: 0 2rem; }
  .hero-eyebrow { font-size: 0.72rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.5rem; opacity: 0; animation: fadeUp 0.9s var(--ease) 0.3s forwards; }
  .hero-title { font-family: var(--font-display); font-size: clamp(2.3rem, 5.3vw, 4.8rem); font-weight: 300; line-height: 1.08; letter-spacing: -0.01em; color: var(--white); margin-bottom: 1.5rem; opacity: 0; animation: fadeUp 0.9s var(--ease) 0.5s forwards; }
  .hero-title em { font-style: italic; color: var(--gold); }
  .hero-title-line { display: block; white-space: nowrap; }
  .hero-sub { font-size: 1rem; font-weight: 300; color: var(--muted); line-height: 1.7; max-width: 480px; margin: 0 auto 2.8rem; opacity: 0; animation: fadeUp 0.9s var(--ease) 0.7s forwards; }
  .hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; opacity: 0; animation: fadeUp 0.9s var(--ease) 0.9s forwards; }
  .btn-primary { padding: 0.85rem 2.2rem; background: var(--gold); color: #080808; font-family: var(--font-body); font-size: 0.8rem; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; border: none; cursor: pointer; transition: opacity 0.2s, transform 0.2s; }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-outline { padding: 0.85rem 2.2rem; background: transparent; border: 1px solid rgba(240,237,232,0.3); color: var(--white); font-family: var(--font-body); font-size: 0.8rem; font-weight: 400; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: border-color 0.2s, color 0.2s, transform 0.2s; }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-1px); }
  .hero-scroll { position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; opacity: 0; animation: fadeIn 1s var(--ease) 1.4s forwards; }
  .hero-scroll span { font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--muted); }
  .scroll-line { width: 1px; height: 48px; background: var(--gold); animation: scrollPulse 2s ease-in-out infinite; }

  section { padding: 7rem 4rem; }
  .section-label { font-size: 0.68rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 1rem; }
  .section-title { font-family: var(--font-display); font-size: clamp(2.2rem, 4vw, 3.6rem); font-weight: 300; line-height: 1.1; margin-bottom: 1.2rem; }
  .section-sub { color: var(--muted); font-size: 0.95rem; line-height: 1.8; max-width: 520px; }
  .section-header { margin-bottom: 4rem; }
  .divider { width: 48px; height: 1px; background: var(--gold); margin: 1.4rem 0; }

  #portfolio { background: var(--bg); }
  #portfolio .section-sub { text-align: left; margin-left: 0; margin-right: 0; }
  .portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; }
  .portfolio-item { position: relative; aspect-ratio: 9/16; overflow: hidden; cursor: pointer; background: #111; }
  .portfolio-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease), filter 0.4s; filter: brightness(0.7) saturate(0.8); }
  .portfolio-item:hover img { transform: scale(1.06); filter: brightness(0.5) saturate(0.6); }
  .portfolio-item-info { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 1.4rem; background: linear-gradient(to top, rgba(8,8,8,0.92) 0%, transparent 55%); opacity: 0; transition: opacity 0.35s var(--ease); }
  .portfolio-item:hover .portfolio-item-info { opacity: 1; }
  .portfolio-item-info h3 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 400; margin-bottom: 0.3rem; }
  .portfolio-item-info p { font-size: 0.75rem; color: var(--gold); letter-spacing: 0.05em; }
  .play-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.8); width: 52px; height: 52px; border: 1.5px solid rgba(255,255,255,0.6); border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s, transform 0.3s; }
  .play-icon svg { margin-left: 3px; }
  .portfolio-item:hover .play-icon { opacity: 1; transform: translate(-50%, -50%) scale(1); }

  .modal-backdrop { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.96); display: flex; align-items: center; justify-content: center; animation: fadeIn 0.25s var(--ease); padding: 2rem; }
  .modal-inner { position: relative; width: 100%; max-width: 420px; animation: scaleIn 0.3s var(--ease); }
  .modal-video-wrap { position: relative; padding-top: 177.78%; background: #000; }
  .modal-video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
  .modal-caption { padding: 1.2rem 0 0; }
  .modal-caption h3 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 400; }
  .modal-caption p { color: var(--gold); font-size: 0.82rem; margin-top: 0.3rem; }
  .modal-close { position: absolute; top: -3rem; right: 0; background: none; border: none; color: var(--muted); font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: color 0.2s; }
  .modal-close:hover { color: var(--white); }
  .policy-modal-backdrop { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
  .policy-modal-inner { width: min(900px, 100%); max-height: 88vh; overflow: auto; background: #0e0e0e; border: 1px solid var(--border); padding: 1.5rem; }
  .policy-modal-title { font-family: var(--font-display); font-size: 1.7rem; margin-bottom: 0.7rem; color: var(--white); }
  .policy-modal-section { margin-top: 1.2rem; }
  .policy-modal-section h4 { color: var(--gold); font-size: 0.95rem; letter-spacing: 0.04em; margin-bottom: 0.5rem; }
  .policy-modal-section p, .policy-modal-section li { color: var(--muted); line-height: 1.75; font-size: 0.9rem; }
  .policy-modal-section ul { padding-left: 1.2rem; display: grid; gap: 0.3rem; }
  .policy-close { position: sticky; top: 0; margin-left: auto; display: block; background: transparent; border: 1px solid var(--border); color: var(--white); padding: 0.4rem 0.7rem; cursor: pointer; }

  #services { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  #services .section-title { color: var(--white); }
  .services-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
  .service-card { padding: 3rem 2.5rem; background: var(--bg); border: 1px solid var(--border); transition: border-color 0.3s, transform 0.3s var(--ease); position: relative; overflow: hidden; }
  .service-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform 0.4s var(--ease); }
  .service-card:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-4px); }
  .service-card:hover::before { transform: scaleX(1); }
  .service-icon { font-size: 2rem; margin-bottom: 1.5rem; display: block; }
  .service-card h3 { font-family: var(--font-display); font-size: 1.4rem; font-weight: 400; margin-bottom: 0.5rem; }
  .service-tagline { color: var(--gold); font-size: 0.8rem; margin-bottom: 1rem; letter-spacing: 0.03em; }
  .service-desc { color: var(--muted); font-size: 0.88rem; line-height: 1.8; }

  #contact { background: var(--bg); }
  #contact .contact-info h2 { color: var(--white); }
  .contact-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 6rem; align-items: start; }
  .contact-info { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .contact-info h2 { font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 300; line-height: 1.15; margin-bottom: 1.5rem; }
  .contact-detail { display: flex; flex-direction: column; align-items: center; gap: 0.85rem; margin-top: 1.5rem; }
  .contact-detail a { color: var(--muted); text-decoration: none; font-size: 0.88rem; transition: color 0.2s; }
  .contact-detail a:hover { color: var(--gold); }
  .contact-form { display: flex; flex-direction: column; gap: 1.2rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.45rem; }
  .form-group label { font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
  .form-group input, .form-group select, .form-group textarea { background: var(--surface); border: 1px solid var(--border); color: var(--white); padding: 0.85rem 1rem; font-family: var(--font-body); font-size: 0.9rem; font-weight: 300; outline: none; transition: border-color 0.25s; appearance: none; }
  .form-group select { cursor: pointer; }
  .form-group input::placeholder, .form-group textarea::placeholder { color: rgba(240,237,232,0.2); }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--gold); }
  .form-group textarea { resize: vertical; min-height: 120px; }
  .file-upload-label { border: 1px dashed rgba(201,168,76,0.3); padding: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 0.6rem; cursor: pointer; color: var(--muted); font-size: 0.85rem; transition: border-color 0.25s, color 0.25s; }
  .file-upload-label:hover { border-color: var(--gold); color: var(--gold); }
  .file-upload-label input { display: none; }
  .form-submit-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .form-note { font-size: 0.75rem; color: var(--muted); }
  .submit-success { background: var(--gold-dim); border: 1px solid var(--gold); padding: 1rem 1.4rem; font-size: 0.85rem; color: var(--gold); animation: fadeUp 0.4s var(--ease), successFadeOut 0.6s var(--ease) 10s forwards; }

  footer { padding: 2.5rem 4rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.2rem; }
  .footer-copy { font-size: 0.75rem; color: var(--muted); }
  .footer-socials { display: flex; gap: 1.5rem; }
  .footer-socials a { color: var(--muted); transition: color 0.2s; font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; }
  .footer-socials a:hover { color: var(--gold); }
  .footer-links { display: flex; gap: 1.5rem; }
  .footer-links a { font-size: 0.72rem; letter-spacing: 0.1em; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--white); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes successFadeOut { from { opacity: 1; } to { opacity: 0; } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes scrollPulse { 0%,100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; } 50% { opacity: 1; transform: scaleY(1); transform-origin: top; } }
  .reveal { opacity: 1; transform: none; transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
  .reveal.visible { opacity: 1; transform: none; }

  @media (max-width: 1024px) {
    nav { padding: 1.2rem 2rem; } section { padding: 5rem 2rem; } footer { padding: 2rem; }
    .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
    .services-grid { grid-template-columns: 1fr; }
    .contact-layout { grid-template-columns: 1fr; gap: 3rem; }
  }
  @media (max-width: 640px) {
    .nav-links { display: none; }
    .portfolio-grid { grid-template-columns: 1fr; }
    .services-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .hero-ctas { flex-direction: column; align-items: center; }
    footer { flex-direction: column; align-items: flex-start; }
  }
`;

function Nav({ scrolled, t, lang, setLang }) {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const navItems = ["hero", "portfolio", "services", "contact"];
  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <a href="#hero" className="nav-logo" aria-label="REXX.VISUALS">
        <img src="/rexx-logo.png" alt="REXX.VISUALS logo" />
      </a>
      <div className="nav-right">
        <ul className="nav-links">
          {navItems.map((id) => (
            <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); scroll(id); }}>{t.nav[id]}</a></li>
          ))}
        </ul>
        <select className="lang-select" aria-label={t.langLabel} value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="en">EN</option>
          <option value="zh">中文</option>
        </select>
      </div>
    </nav>
  );
}

function Hero({ t }) {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const heroVideoRef = useRef(null);
  const [heroVideoUrl, setHeroVideoUrl] = useState(() => HERO_VIDEO_POOL[0] ?? "");

  useEffect(() => {
    if (HERO_VIDEO_POOL.length <= 1) return undefined;

    const timer = setInterval(() => {
      setHeroVideoUrl((currentUrl) => {
        const candidates = HERO_VIDEO_POOL.filter((url) => url !== currentUrl);
        return candidates[Math.floor(Math.random() * candidates.length)] ?? currentUrl;
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const videoEl = heroVideoRef.current;
    if (!videoEl) return undefined;

    const setRandomStart = () => {
      if (!Number.isFinite(videoEl.duration) || videoEl.duration <= 10) {
        videoEl.currentTime = 0;
        return;
      }
      videoEl.currentTime = Math.random() * (videoEl.duration - 10);
    };

    videoEl.addEventListener("loadedmetadata", setRandomStart);
    return () => videoEl.removeEventListener("loadedmetadata", setRandomStart);
  }, [heroVideoUrl]);

  return (
    <section id="hero">
      <video ref={heroVideoRef} key={heroVideoUrl} autoPlay muted playsInline preload="metadata" src={heroVideoUrl} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-eyebrow">{t.hero.eyebrow}</p>
        <h1 className="hero-title">
          <span className="hero-title-line">{t.hero.titleTop}</span>
          <em className="hero-title-line">{t.hero.titleEm}</em>
        </h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => scroll("portfolio")}>{t.hero.ctaWork}</button>
          <button className="btn-outline" onClick={() => scroll("contact")}>{t.hero.ctaBook}</button>
        </div>
      </div>
      <div className="hero-scroll">
        <span>{t.hero.scroll}</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

function PortfolioItem({ video, onClick, lang }) {
  return (
    <div className="portfolio-item reveal" onClick={() => onClick(video)}>
      <img src={video.thumb} alt={video.title[lang]} loading="lazy" />
      <div className="play-icon">
        <svg width="14" height="16" viewBox="0 0 14 16" fill="white"><path d="M1 1l12 7-12 7V1z" /></svg>
      </div>
      <div className="portfolio-item-info">
        <h3>{video.title[lang]}</h3>
      </div>
    </div>
  );
}

function Modal({ video, onClose, t, lang }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>{t.portfolio.close}</button>
        <div className="modal-video-wrap">
          {video.isLocal ? (
            <video
              src={video.url}
              title={video.title[lang]}
              controls
              autoPlay
              playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <iframe src={`${video.url}?autoplay=1`} title={video.title[lang]} allow="autoplay; fullscreen" allowFullScreen />
          )}
        </div>
        <div className="modal-caption">
          <h3>{video.title[lang]}</h3>
        </div>
      </div>
    </div>
  );
}

function Portfolio({ t, lang }) {
  const [active, setActive] = useState(null);
  return (
    <section id="portfolio">
      <div className="section-header">
        <p className="section-label reveal">{t.portfolio.label}</p>
        <h2 className="section-title reveal">{t.portfolio.titleTop}<br />{t.portfolio.titleBottom}</h2>
        <div className="divider reveal" />
        <p className="section-sub reveal">{t.portfolio.sub}</p>
      </div>
      <div className="portfolio-grid">
        {VIDEOS.map((v) => <PortfolioItem key={v.id} video={v} onClick={setActive} lang={lang} />)}
      </div>
      {active && <Modal video={active} onClose={() => setActive(null)} t={t} lang={lang} />}
    </section>
  );
}

function Services({ t, lang }) {
  return (
    <section id="services">
      <div className="section-header">
        <p className="section-label reveal">{t.services.label}</p>
        <h2 className="section-title reveal">{t.services.titleTop}<br />{t.services.titleBottom}</h2>
        <div className="divider reveal" />
      </div>
      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <div className="service-card reveal" key={s.title.en} style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className="service-icon">{s.icon}</span>
            <h3>{s.title[lang]}</h3>
            <p className="service-tagline">{s.tagline[lang]}</p>
            <p className="service-desc">{s.desc[lang]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact({ t, lang }) {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleFile = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
    }
  };
  const handleSubmit = () => {
    setShowSuccess(true);
    setForm({ name: "", email: "", type: "", message: "" });
    setFile(null);
  };

  useEffect(() => {
    if (!showSuccess) return undefined;
    const timer = setTimeout(() => setShowSuccess(false), 10600);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  return (
    <section id="contact">
      <div className="contact-layout">
        <div className="contact-info reveal">
          <p className="section-label">{t.contact.label}</p>
          <div className="divider" />
          <h2>{t.contact.titleTop}<br /><em style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", color: "var(--gold)" }}>{t.contact.titleEm}</em></h2>
          <p className="section-sub" style={{ marginTop: "0.35rem", textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>{t.contact.sub}</p>
          <div className="contact-detail">
            <a href="mailto:rexxvisuals26@gmail.com">rexxvisuals26@gmail.com</a>
            <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{t.contact.location}</span>
          </div>
        </div>
        <div className="contact-form reveal">
          {showSuccess ? <div className="submit-success">{t.contact.success}</div> : null}
          <form
            onSubmit={handleSubmit}
            action="https://formsubmit.co/rexxvisuals26@gmail.com"
            method="POST"
            encType="multipart/form-data"
            target="formsubmit_iframe"
          >
            <input type="hidden" name="_subject" value={`[RexxVisuals] New inquiry from ${form.name || "Website Visitor"}`} />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_replyto" value={form.email} />
            <input type="hidden" name="language" value={lang === "zh" ? "zh-Hant" : "en"} />
            <div className="form-row">
              <div className="form-group"><label htmlFor="name">{t.contact.name}</label><input id="name" name="name" placeholder={t.contact.namePlaceholder} value={form.name} onChange={handleChange} /></div>
              <div className="form-group"><label htmlFor="email">{t.contact.email}</label><input id="email" name="email" type="email" placeholder={t.contact.emailPlaceholder} value={form.email} onChange={handleChange} /></div>
            </div>
            <div className="form-group">
              <label htmlFor="type">{t.contact.projectType}</label>
              <select id="type" name="type" value={form.type} onChange={handleChange}>
                <option value="">{t.contact.projectDefault}</option>
                {t.contact.projectOptions.map((option, index) => <option key={`${option}-${index}`}>{option}</option>)}
              </select>
            </div>
            <div className="form-group"><label htmlFor="message">{t.contact.message}</label><textarea id="message" name="message" placeholder={t.contact.msgPlaceholder} value={form.message} onChange={handleChange} /></div>
            <div className="form-group">
              <label>{t.contact.file}</label>
              <label className="file-upload-label">
                <input type="file" name="attachment" onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.png,.mp4" />
                {file ? `${t.contact.uploadPrefix} ${file.name}` : t.contact.uploadPlaceholder}
              </label>
            </div>
            <div className="form-submit-row">
              <button className="btn-primary" type="submit">{t.contact.send}</button>
              <span className="form-note">{t.contact.note}</span>
            </div>
          </form>
          <iframe
            title="formsubmit_iframe"
            name="formsubmit_iframe"
            style={{ display: "none" }}
          />
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer>
      <p className="footer-copy">{`© ${new Date().getFullYear()} REXX VISUALS. ${t.footer.rights}`}</p>
      <div className="footer-socials">
        <a href="https://www.facebook.com/profile.php?id=61578498400931" target="_blank" rel="noreferrer">FACEBOOK</a><a href="https://www.instagram.com/rexxvisuals26/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noreferrer">Instagram</a><a href="#">X</a>
      </div>
      <div className="footer-links">
        <a href="#" onClick={t.onPrivacyOpen}>{t.footer.privacy}</a><a href="#" onClick={t.onTermsOpen}>{t.footer.terms}</a>
      </div>
    </footer>
  );
}

function PrivacyPolicyModal({ onClose, lang }) {
  return (
    <div className="policy-modal-backdrop" onClick={onClose}>
      <div className="policy-modal-inner" onClick={(e) => e.stopPropagation()}>
        <button className="policy-close" onClick={onClose}>Close</button>
        {lang === "zh" ? (
          <>
            <h3 className="policy-modal-title">隱私權政策</h3>
            <p className="policy-modal-section">
              歡迎造訪 REXX.VISUALS（以下稱「本網站」）。我們非常重視您的隱私權，為了讓您安心使用本網站的各項服務，特此說明本網站的隱私權保護政策。
            </p>
            <div className="policy-modal-section">
              <h4>1. 個人資料的蒐集目的</h4>
              <p>當您使用本網站的「預約諮詢」、「聯絡我們」或相關表單時，我們會請您提供姓名、電子郵件、電話號碼及專案需求。這些資訊僅用於：</p>
              <ul>
                <li>回覆您的詢問與專案溝通。</li>
                <li>提供與影像製作相關的後續服務。</li>
                <li>內部統計與分析，以優化網站內容。</li>
              </ul>
            </div>
            <div className="policy-modal-section">
              <h4>2. 資料的保護與安全</h4>
              <p>本網站主機均設有相關資訊安全設備及必要的防護措施，保護您的個人資料不被非法存取、損毀或洩漏。您的資料僅由授權的人員處理。</p>
            </div>
            <div className="policy-modal-section">
              <h4>3. 第三方分享政策</h4>
              <p>本網站絕不會提供、交換、出租或出售任何您的個人資料給其他個人、團體、私人企業或公務機關。但有法律依據或合約義務者，不在此限。</p>
            </div>
            <div className="policy-modal-section">
              <h4>4. Cookie 之使用</h4>
              <p>為了提供您最佳的服務，本網站會在您的電腦中放置並取用我們的 Cookie。若您不願接受 Cookie 的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，即可拒絕 Cookie 的寫入，但可能會導至網站某些功能無法正常執行。</p>
            </div>
            <div className="policy-modal-section">
              <h4>5. 隱私權政策之修訂</h4>
              <p>本網站隱私權保護政策將因應需求隨時進行修正，修正後的條款將刊登於網站上，不另行個別通知。</p>
            </div>
            <div className="policy-modal-section">
              <h4>6. 聯繫我們</h4>
              <p>若您對本隱私權政策有任何疑問，或想行使《個資法》規定的查詢、閱覽、製給複製本、補充、更正、停止蒐集處理利用或刪除等權利，請透過以下方式與我們聯繫：</p>
              <p>Email: rexxvisuals26@gmail.com</p>
            </div>
          </>
        ) : (
          <>
            <h3 className="policy-modal-title">Privacy Policy</h3>
            <div className="policy-modal-section">
              <p>Welcome to REXX.VISUALS (hereinafter referred to as "this Website"). We value your privacy and have established this Privacy Policy to ensure you can use our services with confidence.</p>
            </div>
            <div className="policy-modal-section">
              <h4>1. Purpose of Data Collection</h4>
              <p>When you use the "Book a Consultation," "Contact Us," or other forms on this Website, we may ask for your name, email address, phone number, and project requirements. This information is used solely for:</p>
              <ul>
                <li>Responding to your inquiries and project communications.</li>
                <li>Providing follow-up services related to video production.</li>
                <li>Internal statistics and analysis to optimize website content.</li>
              </ul>
            </div>
            <div className="policy-modal-section">
              <h4>2. Data Protection and Security</h4>
              <p>This Website is equipped with information security devices and necessary protective measures to prevent unauthorized access, damage, or disclosure of your personal data. Your information is handled only by authorized personnel.</p>
            </div>
            <div className="policy-modal-section">
              <h4>3. Third-Party Sharing Policy</h4>
              <p>This Website will never provide, exchange, rent, or sell any of your personal data to other individuals, groups, private enterprises, or public agencies, except where required by legal basis or contractual obligations.</p>
            </div>
            <div className="policy-modal-section">
              <h4>4. Use of Cookies</h4>
              <p>To provide you with the best service, this Website places and accesses our cookies on your computer. If you do not wish to accept cookies, you can set the privacy level to "High" in your browser settings to refuse cookies; however, this may cause some website functions to operate improperly.</p>
            </div>
            <div className="policy-modal-section">
              <h4>5. Amendments to the Privacy Policy</h4>
              <p>This Privacy Policy may be updated at any time in response to needs. The revised terms will be posted on the website without individual notice.</p>
            </div>
            <div className="policy-modal-section">
              <h4>6. Contact Us</h4>
              <p>If you have any questions regarding this Privacy Policy or wish to exercise your rights under the Personal Data Protection Act (such as inquiry, review, duplication, supplementation, correction, or deletion of data), please contact us via:</p>
              <p>Email: rexxvisuals26@gmail.com</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TermsModal({ onClose, lang }) {
  return (
    <div className="policy-modal-backdrop" onClick={onClose}>
      <div className="policy-modal-inner" onClick={(e) => e.stopPropagation()}>
        <button className="policy-close" onClick={onClose}>Close</button>
        {lang === "zh" ? (
          <>
            <h3 className="policy-modal-title">服務條款</h3>
            <p className="policy-modal-section">
              歡迎使用 REXX.VISUALS 之影像製作服務（以下稱「本服務」）。當您委託我們進行拍攝、剪輯或任何影像專案時，即視為您已閱讀並同意以下條款：
            </p>

            <div className="policy-modal-section">
              <h4>1. 專案委託與定金</h4>
              <ul>
                <li>專案啟動以收到定金（通常為總金額之 30%-50%）為準。</li>
                <li>定金支付後，若因客戶單方面取消專案，定金恕不退還，以補償已投入之人力與時間成本。</li>
              </ul>
            </div>

            <div className="policy-modal-section">
              <h4>2. 修改與校對</h4>
              <ul>
                <li>每項專案提供 [兩] 次免費小幅度修改（如：字幕更正、剪接節奏調整）。</li>
                <li>若超出免費修改次數，或涉及重大腳本變更、重新拍攝，將根據工作量額外加收費用。</li>
                <li>客戶需在收到初稿後 [7] 個工作日內提供反饋，逾期視為驗收通過。</li>
              </ul>
            </div>

            <div className="policy-modal-section">
              <h4>3. 著作權與授權</h4>
              <ul>
                <li>作品歸屬：影片成品之著作權歸 REXX.VISUALS 與客戶共有（或依合約約定）。</li>
                <li>使用權限制：未經書面同意，客戶不得將成品拆解、二次剪輯或用於合約範圍外之商業營利。</li>
                <li>宣傳權利：REXX.VISUALS 保有將成品或幕後花絮作為作品集、社群媒體宣傳之權利。若有保密需求，請於簽約前主動告知。</li>
              </ul>
            </div>

            <div className="policy-modal-section">
              <h4>4. 素材提供與延遲</h4>
              <p>客戶應按時提供專案所需素材（如：品牌 Logo、參考腳本、音樂授權等）。若因客戶提供素材延誤、拍攝場地協調不當導致進度受阻，本網站不承擔延期責任。</p>
            </div>

            <div className="policy-modal-section">
              <h4>5. 免責聲明</h4>
              <p>本網站不對因不可抗力（如天氣、硬體損毀、意外事故）導致的延誤承擔超過專案總金額之賠償責任。</p>
            </div>

            <div className="policy-modal-section">
              <h4>6. 條款修訂與管轄</h4>
              <p>本條款之解釋與適用，均依中華民國法律為準。</p>
            </div>
          </>
        ) : (
          <>
            <h3 className="policy-modal-title">Terms of Service</h3>
            <div className="policy-modal-section">
              <h4>1. Project Commission & Deposit</h4>
              <ul>
                <li>A project is officially initiated upon receipt of the deposit (typically 30%-50% of the total quote).</li>
                <li>Deposits are non-refundable in the event of a client-side cancellation.</li>
              </ul>
            </div>

            <div className="policy-modal-section">
              <h4>2. Revisions & Feedback</h4>
              <ul>
                <li>Each project includes [two] rounds of minor revisions (e.g., text corrections, pacing adjustments).</li>
                <li>Major script changes or additional shoots will incur extra costs.</li>
                <li>Feedback must be provided within [7] business days of receiving the draft, otherwise, it will be deemed accepted.</li>
              </ul>
            </div>

            <div className="policy-modal-section">
              <h4>3. Intellectual Property</h4>
              <ul>
                <li>Ownership: REXX.VISUALS retains the artistic credit for all works created.</li>
                <li>Promotional Use: REXX.VISUALS reserves the right to display the final work and behind-the-scenes footage in our portfolio and social media for promotional purposes.</li>
              </ul>
            </div>

            <div className="policy-modal-section">
              <h4>4. Client Responsibilities</h4>
              <p>The client is responsible for providing necessary assets (logos, music licenses, etc.) on time. We are not liable for delays caused by missing or late assets.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState("en");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  }, [lang]);

  return (
    <>
      <style>{css}</style>
      <Nav scrolled={scrolled} t={t} lang={lang} setLang={setLang} />
      <Hero t={t} />
      <Portfolio t={t} lang={lang} />
      <Services t={t} lang={lang} />
      <Contact t={t} lang={lang} />
      <Footer
        t={{
          ...t,
          onPrivacyOpen: (e) => { e.preventDefault(); setTermsOpen(false); setPrivacyOpen(true); },
          onTermsOpen: (e) => { e.preventDefault(); setPrivacyOpen(false); setTermsOpen(true); },
        }}
      />
      {privacyOpen ? <PrivacyPolicyModal lang={lang} onClose={() => setPrivacyOpen(false)} /> : null}
      {termsOpen ? <TermsModal lang={lang} onClose={() => setTermsOpen(false)} /> : null}
      <Chatbot lang={lang} />
    </>
  );
}
