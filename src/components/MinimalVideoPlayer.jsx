import { useCallback, useEffect, useRef, useState } from "react";
import { getDriveFileId, getDrivePreviewUrl, getDriveStreamUrl, getDriveViewUrl, isDrivePreviewUrl } from "../config/videos.js";
import "./MinimalVideoPlayer.css";

const HIDE_DELAY_MS = 2500;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MinimalVideoPlayer({
  src,
  poster,
  title,
  landscape = false,
}) {
  const videoRef = useRef(null);
  const hideTimerRef = useRef(null);
  const [useIframe, setUseIframe] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const fileId = getDriveFileId(src);
  const streamSrc = isDrivePreviewUrl(src) ? getDriveStreamUrl(src) : src;
  const previewSrc = isDrivePreviewUrl(src) ? getDrivePreviewUrl(src) : null;
  const viewUrl = isDrivePreviewUrl(src) ? getDriveViewUrl(src) : src;

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      const el = videoRef.current;
      if (el && !el.paused) setShowControls(false);
    }, HIDE_DELAY_MS);
  }, [clearHideTimer]);

  const revealControls = useCallback(() => {
    setShowControls(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  useEffect(() => {
    setUseIframe(false);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
    setShowControls(true);
  }, [src]);

  const togglePlay = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
        setPlaying(true);
        setShowControls(true);
        scheduleHide();
      } catch {
        setUseIframe(true);
      }
    } else {
      el.pause();
      setPlaying(false);
      setShowControls(true);
      clearHideTimer();
    }
  }, [clearHideTimer, scheduleHide]);

  const handleContainerTap = useCallback((e) => {
    // First interaction: reveal controls; if already visible while playing, toggle pause/play on video surface
    if (!showControls && playing) {
      e.preventDefault();
      revealControls();
      return;
    }
    revealControls();
  }, [playing, revealControls, showControls]);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    revealControls();
  }, [revealControls]);

  const onSeek = useCallback((e) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * duration;
    setProgress(ratio * 100);
    revealControls();
  }, [duration, revealControls]);

  if (useIframe && previewSrc) {
    return (
      <div className={`mvp${landscape ? " mvp--landscape" : ""}`}>
        <iframe
          className="mvp__iframe"
          src={`${previewSrc}${previewSrc.includes("?") ? "&" : "?"}autoplay=1`}
          title={title}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
        {fileId ? (
          <a
            className="mvp__external"
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in Google Drive"
            onClick={(e) => e.stopPropagation()}
          >
            ↗
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`mvp${landscape ? " mvp--landscape" : ""}${showControls ? " show-controls" : ""}${playing ? " is-playing" : ""}`}
      onClick={handleContainerTap}
      onMouseMove={revealControls}
      onTouchStart={handleContainerTap}
    >
      <video
        ref={videoRef}
        className="mvp__video"
        src={streamSrc}
        poster={poster}
        title={title}
        playsInline
        preload="metadata"
        onClick={(e) => {
          e.stopPropagation();
          if (!showControls && playing) {
            revealControls();
            return;
          }
          togglePlay();
        }}
        onPlay={() => {
          setPlaying(true);
          scheduleHide();
        }}
        onPause={() => {
          setPlaying(false);
          setShowControls(true);
          clearHideTimer();
        }}
        onTimeUpdate={() => {
          const el = videoRef.current;
          if (!el || !el.duration) return;
          setProgress((el.currentTime / el.duration) * 100);
        }}
        onLoadedMetadata={() => {
          const el = videoRef.current;
          if (el) setDuration(el.duration || 0);
        }}
        onError={() => setUseIframe(Boolean(previewSrc))}
        onCanPlay={() => {
          const el = videoRef.current;
          if (el && el.paused) {
            el.play().catch(() => {});
          }
        }}
      />

      {fileId ? (
        <a
          className="mvp__external"
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open in Google Drive"
          onClick={(e) => e.stopPropagation()}
        >
          ↗
        </a>
      ) : null}

      <button
        type="button"
        className="mvp__center-play"
        aria-label="Play"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      >
        <svg width="22" height="24" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
          <path d="M1 1l12 7-12 7V1z" />
        </svg>
      </button>

      <div className="mvp__controls" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="mvp__btn"
          aria-label={playing ? "Pause" : "Play"}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
              <path d="M1 1l12 7-12 7V1z" />
            </svg>
          )}
        </button>

        <div
          className="mvp__progress"
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          onClick={onSeek}
        >
          <div className="mvp__progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <span className="mvp__time">
          {formatTime((progress / 100) * duration)} / {formatTime(duration)}
        </span>

        <button
          type="button"
          className="mvp__btn"
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={toggleMute}
        >
          {muted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M11 5L6 9H3v6h3l5 4V5zM22 9l-6 6M16 9l6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M11 5L6 9H3v6h3l5 4V5z" strokeLinejoin="round" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
