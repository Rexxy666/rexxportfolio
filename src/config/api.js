const LOCAL_API_BASE = "http://localhost:3001";
const PRODUCTION_API_BASE = "https://rexxportfolio.onrender.com";

/** Resolve backend base URL from the current page hostname (works without build-time env). */
export function getApiBaseUrl() {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return LOCAL_API_BASE;
  }
  return PRODUCTION_API_BASE;
}

export function apiUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalized}`;
}
