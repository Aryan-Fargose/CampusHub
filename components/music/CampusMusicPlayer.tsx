"use client";

import React, { useState, useRef } from "react";
import {
  Music,
  Sparkles,
  ExternalLink,
  X,
  AlertCircle,
  Radio,
  Minimize2,
  Wand2,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { animate } from "animejs";
import { useCampusMusic } from "./CampusMusicContext";

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
import {
  DEFAULT_SPOTIFY_PLAYLIST_1,
  DEFAULT_SPOTIFY_PLAYLIST_2,
  DEFAULT_YOUTUBE_PLAYLIST,
} from "@/lib/campusMusicPresets";

export interface CampusMusicPlayerProps {
  variant?: "embedded" | "modal";
  onClose?: () => void;
  onMinimize?: () => void;
  className?: string;
}

export const CampusMusicPlayer: React.FC<CampusMusicPlayerProps> = ({
  variant = "embedded",
  onClose: propOnClose,
  onMinimize: propOnMinimize,
  className,
}) => {
  const {
    provider,
    setProvider,

    // Spotify
    selectedSpotifyPlaylistId,
    selectSpotifyPlaylist,
    customSpotifyPlaylist,
    saveCustomSpotifyPlaylist,
    removeCustomSpotifyPlaylist,
    activeSpotifyEmbedUrl,

    // YouTube
    selectedYouTubePlaylistId,
    selectYouTubePlaylist,
    customYouTubePlaylist,
    saveCustomYouTubePlaylist,
    removeCustomYouTubePlaylist,
    activeYouTubeEmbedUrl,

    // Controls
    closePlayer,
    minimizePlayer,
    isMuted,
    toggleMute,
    spotifyMuteNotice,
    clearSpotifyMuteNotice,
  } = useCampusMusic();

  const onClose = propOnClose || closePlayer;
  const onMinimize = propOnMinimize || minimizePlayer;

  // Add Playlist input panel state
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [addPlaylistInput, setAddPlaylistInput] = useState("");
  const [addPlaylistError, setAddPlaylistError] = useState<string | null>(null);

  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // Switch provider with smooth animation
  const handleSwitchProvider = (newProvider: "spotify" | "youtube") => {
    if (newProvider === provider) return;
    setProvider(newProvider);
    setIsAddPlaylistOpen(false);
    setAddPlaylistError(null);
    setAddPlaylistInput("");

    try {
      if (playerContainerRef.current) {
        animate(playerContainerRef.current, {
          scale: [0.99, 1],
          opacity: [0.85, 1],
          duration: 220,
          easing: "easeOutQuad",
        });
      }
    } catch {
      // Safe fallback
    }
  };

  // Switch Spotify playlist
  const handleSelectSpotifyPlaylist = (id: string) => {
    if (id === selectedSpotifyPlaylistId) return;
    selectSpotifyPlaylist(id);

    try {
      if (playerContainerRef.current) {
        animate(playerContainerRef.current, {
          scale: [0.99, 1],
          opacity: [0.85, 1],
          duration: 200,
          easing: "easeOutQuad",
        });
      }
    } catch {
      // Safe fallback
    }
  };

  // Switch YouTube playlist
  const handleSelectYouTubePlaylist = (id: string) => {
    if (id === selectedYouTubePlaylistId) return;
    selectYouTubePlaylist(id);

    try {
      if (playerContainerRef.current) {
        animate(playerContainerRef.current, {
          scale: [0.99, 1],
          opacity: [0.85, 1],
          duration: 200,
          easing: "easeOutQuad",
        });
      }
    } catch {
      // Safe fallback
    }
  };

  // Load custom playlist for active provider
  const handleLoadCustomPlaylist = () => {
    if (!addPlaylistInput.trim()) {
      setAddPlaylistError(
        provider === "youtube"
          ? "Please paste a YouTube playlist URL."
          : "Please paste a Spotify playlist URL."
      );
      return;
    }

    if (provider === "youtube") {
      const result = saveCustomYouTubePlaylist(addPlaylistInput);
      if (!result.success) {
        setAddPlaylistError(result.error || "Please enter a valid YouTube playlist URL.");
        return;
      }
    } else {
      const result = saveCustomSpotifyPlaylist(addPlaylistInput);
      if (!result.success) {
        setAddPlaylistError(result.error || "Please enter a valid Spotify playlist URL.");
        return;
      }
    }

    setAddPlaylistError(null);
    setIsAddPlaylistOpen(false);
    setAddPlaylistInput("");

    try {
      if (playerContainerRef.current) {
        animate(playerContainerRef.current, {
          scale: [0.98, 1],
          opacity: [0.85, 1],
          duration: 250,
          easing: "easeOutCubic",
        });
      }
    } catch {
      // Safe fallback
    }
  };

  // Current metadata for active provider
  const activeMeta = (() => {
    if (provider === "youtube") {
      if (selectedYouTubePlaylistId === "custom-yt" && customYouTubePlaylist) {
        return {
          title: "My YouTube Playlist",
          url: customYouTubePlaylist.url,
          providerLabel: "Official YouTube Embed",
        };
      }
      return {
        title: DEFAULT_YOUTUBE_PLAYLIST.title,
        url: DEFAULT_YOUTUBE_PLAYLIST.url,
        providerLabel: "Official YouTube Embed",
      };
    }

    // Spotify
    if (selectedSpotifyPlaylistId === "default-2") {
      return {
        title: DEFAULT_SPOTIFY_PLAYLIST_2.title,
        url: DEFAULT_SPOTIFY_PLAYLIST_2.url,
        providerLabel: "Official Spotify Embed",
      };
    }
    if (selectedSpotifyPlaylistId === "custom" && customSpotifyPlaylist) {
      return {
        title: "My Spotify Playlist",
        url: customSpotifyPlaylist.url,
        providerLabel: "Official Spotify Embed",
      };
    }
    return {
      title: DEFAULT_SPOTIFY_PLAYLIST_1.title,
      url: DEFAULT_SPOTIFY_PLAYLIST_1.url,
      providerLabel: "Official Spotify Embed",
    };
  })();

  return (
    <div
      className={cn(
        "relative w-full rounded-2xl bg-[#030a10]/95 border border-[#E7C56D]/60 p-4 sm:p-5 shadow-[0_0_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-[#f1ede4] select-none",
        variant === "modal" ? "max-w-xl mx-auto" : "max-w-xl mx-auto",
        className
      )}
    >
      {/* Hogwarts Enchanted Corner Brackets */}
      <span className="absolute top-2 left-2 text-[10px] text-[#E7C56D]/60 select-none pointer-events-none">
        ⌜✦
      </span>
      <span className="absolute top-2 right-2 text-[10px] text-[#E7C56D]/60 select-none pointer-events-none">
        ✦⌝
      </span>
      <span className="absolute bottom-2 left-2 text-[10px] text-[#E7C56D]/60 select-none pointer-events-none">
        ⌞✦
      </span>
      <span className="absolute bottom-2 right-2 text-[10px] text-[#E7C56D]/60 select-none pointer-events-none">
        ✦⌟
      </span>

      {/* ========================================================================= */}
      {/* 1. Header: [Music] [Volume] controls, Title & Window Controls              */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-3 pb-2.5 mb-3 border-b border-[#142e3b]">
        {/* Left: Audio Controls (Music Indicator & Functional Mute/Volume Button) */}
        <div className="flex items-center gap-2">
          {/* Music Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#071924] border border-[#48D1CC]/60 text-[#48D1CC] shadow-[0_0_8px_rgba(72,209,204,0.25)] select-none">
            <Music className="w-3.5 h-3.5 text-[#48D1CC] animate-pulse" />
            <span className="font-cinzel text-[11px] font-bold tracking-wider">Music</span>
          </div>

          {/* Functional Volume / Speaker Button */}
          <button
            type="button"
            onClick={toggleMute}
            title={
              provider === "youtube"
                ? isMuted
                  ? "Unmute YouTube playback"
                  : "Mute YouTube playback"
                : isMuted
                ? "Muted (Use Spotify player slider)"
                : "Mute audio (Use Spotify player slider)"
            }
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none text-[11px] font-serif",
              isMuted
                ? "bg-[#181105] border-amber-500/60 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                : "bg-[#04131d] hover:bg-[#071f2e] border-[#1b3a47] hover:border-[#48D1CC]/50 text-[#AFC3CF] hover:text-[#48D1CC]"
            )}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
            <span>{isMuted ? "Muted" : "Volume"}</span>
          </button>
        </div>

        {/* Center/Right: Title & Window controls */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-cinzel text-xs font-bold tracking-widest text-[#E7C56D]">
            CAMPUS MUSIC
          </span>

          <div className="flex items-center gap-1">
            {onMinimize && (
              <button
                type="button"
                onClick={onMinimize}
                title="Minimize player (audio continues)"
                aria-label="Minimize player"
                className="p-1 rounded-md bg-[#04131d] hover:bg-[#0a2638] border border-[#1b3a47] text-[#80949F] hover:text-[#48D1CC] transition-colors cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="Close player"
                aria-label="Close Campus Music"
                className="p-1 rounded-md bg-[#04131d] hover:bg-[#0a2638] border border-[#1b3a47] hover:border-red-500/60 text-[#80949F] hover:text-red-400 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gentle Notification when Spotify external mute limitation applies */}
      {spotifyMuteNotice && (
        <div className="flex items-center justify-between gap-2 p-2 mb-3 rounded-lg bg-[#0c1824] border border-[#48D1CC]/40 text-[#48D1CC] text-[10px] font-serif animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{spotifyMuteNotice}</span>
          </div>
          <button
            type="button"
            onClick={clearSpotifyMuteNotice}
            className="p-0.5 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Service Tabs: Spotify vs YouTube Option                                 */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#02070c] border border-[#142834] mb-3">
        {/* Spotify Tab */}
        <button
          type="button"
          onClick={() => handleSwitchProvider("spotify")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] font-cinzel font-semibold tracking-wider transition-all duration-200 cursor-pointer",
            provider === "spotify"
              ? "bg-[#072418] border border-[#1DB954] text-[#1DB954] shadow-[0_0_12px_rgba(29,185,84,0.3)] font-bold"
              : "text-[#80949F] hover:text-[#AFC3CF] hover:bg-[#04111c]"
          )}
        >
          <span className="text-xs">🟢</span>
          <span>Spotify</span>
        </button>

        {/* YouTube Tab */}
        <button
          type="button"
          onClick={() => handleSwitchProvider("youtube")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] font-cinzel font-semibold tracking-wider transition-all duration-200 cursor-pointer",
            provider === "youtube"
              ? "bg-[#250d0d] border border-[#ff4d4d] text-[#ff6b6b] shadow-[0_0_12px_rgba(255,77,77,0.3)] font-bold"
              : "text-[#80949F] hover:text-[#AFC3CF] hover:bg-[#04111c]"
          )}
        >
          <YouTubeIcon className="w-3.5 h-3.5 text-[#ff4d4d]" />
          <span>YouTube</span>
        </button>
      </div>

      <div className="space-y-3">
        {/* ======================================================================= */}
        {/* 3. PLAYLISTS SECTION (Spotify or YouTube depending on active provider)   */}
        {/* ======================================================================= */}
        <div className="space-y-2.5">
          {/* Section Header with "ADD PLAYLIST" Action */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E7C56D]" />
              <span className="font-cinzel text-[11px] font-bold uppercase tracking-wider text-[#AFC3CF]">
                {provider === "youtube" ? "YOUTUBE PLAYLISTS" : "CAMPUS PLAYLISTS"}
              </span>
            </div>

            {!isAddPlaylistOpen && (
              <button
                type="button"
                onClick={() => {
                  setIsAddPlaylistOpen(true);
                  setAddPlaylistError(null);
                }}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-cinzel font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-sm border",
                  provider === "youtube"
                    ? "bg-[#250d0d] hover:bg-[#331111] border-[#ff4d4d]/50 hover:border-[#ff4d4d] text-[#ff6b6b]"
                    : "bg-[#072418] hover:bg-[#0b3322] border-[#1DB954]/50 hover:border-[#1DB954] text-[#1DB954]"
                )}
              >
                <Plus className="w-2.5 h-2.5" />
                <span>ADD PLAYLIST</span>
              </button>
            )}
          </div>

          {/* PLAYLIST CARDS */}
          {provider === "spotify" ? (
            /* Spotify Playlist Cards (Default 1, Default 2, My Playlist) */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Option 1: Default 1 */}
              <button
                type="button"
                onClick={() => handleSelectSpotifyPlaylist("default-1")}
                className={cn(
                  "relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                  selectedSpotifyPlaylistId === "default-1"
                    ? "bg-[#072418] border-[#1DB954] shadow-[0_0_12px_rgba(29,185,84,0.25)] ring-1 ring-[#1DB954]/50"
                    : "bg-[#04121c] border-[#142834] hover:border-[#48D1CC]/50 hover:bg-[#071c2b]"
                )}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs">⚡</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-[#AFC3CF]">
                    Default 1
                  </span>
                </div>
                <span className="font-cinzel text-[11px] font-bold text-[#f1ede4]">
                  Default Playlist 1
                </span>
                <span className="text-[9px] text-[#80949F] font-serif line-clamp-1 mt-0.5">
                  Hogwarts Study Session
                </span>
                {selectedSpotifyPlaylistId === "default-1" && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]" />
                  </span>
                )}
              </button>

              {/* Option 2: Default 2 */}
              <button
                type="button"
                onClick={() => handleSelectSpotifyPlaylist("default-2")}
                className={cn(
                  "relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                  selectedSpotifyPlaylistId === "default-2"
                    ? "bg-[#072418] border-[#1DB954] shadow-[0_0_12px_rgba(29,185,84,0.25)] ring-1 ring-[#1DB954]/50"
                    : "bg-[#04121c] border-[#142834] hover:border-[#48D1CC]/50 hover:bg-[#071c2b]"
                )}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs">🏰</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-[#AFC3CF]">
                    Default 2
                  </span>
                </div>
                <span className="font-cinzel text-[11px] font-bold text-[#f1ede4]">
                  Default Playlist 2
                </span>
                <span className="text-[9px] text-[#80949F] font-serif line-clamp-1 mt-0.5">
                  Campus Ambience &amp; Chill
                </span>
                {selectedSpotifyPlaylistId === "default-2" && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]" />
                  </span>
                )}
              </button>

              {/* Option 3: My Playlist / Add Playlist */}
              {customSpotifyPlaylist ? (
                <div
                  onClick={() => handleSelectSpotifyPlaylist("custom")}
                  className={cn(
                    "relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer group",
                    selectedSpotifyPlaylistId === "custom"
                      ? "bg-[#072418] border-[#1DB954] shadow-[0_0_12px_rgba(29,185,84,0.25)] ring-1 ring-[#1DB954]/50"
                      : "bg-[#04121c] border-[#142834] hover:border-[#48D1CC]/50 hover:bg-[#071c2b]"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs">✨</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-[#1DB954]">
                        Custom
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomSpotifyPlaylist();
                        }}
                        title="Remove custom playlist"
                        aria-label="Remove custom playlist"
                        className="p-0.5 rounded hover:bg-red-950/80 text-[#80949F] hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <span className="font-cinzel text-[11px] font-bold text-[#f1ede4]">
                    My Playlist
                  </span>
                  <span className="text-[9px] text-[#80949F] font-serif line-clamp-1 mt-0.5">
                    Saved Spotify Playlist
                  </span>
                  {selectedSpotifyPlaylistId === "custom" && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]" />
                    </span>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPlaylistOpen(true);
                    setAddPlaylistError(null);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-dashed border-[#1b3a47] hover:border-[#1DB954]/80 bg-[#04121c]/60 hover:bg-[#072418]/40 text-center transition-all duration-200 cursor-pointer group"
                >
                  <Plus className="w-3.5 h-3.5 text-[#80949F] group-hover:text-[#1DB954] mb-0.5 transition-colors" />
                  <span className="font-cinzel text-[11px] font-semibold text-[#AFC3CF] group-hover:text-[#1DB954]">
                    Add Playlist
                  </span>
                  <span className="text-[8px] text-[#64748b] font-serif">
                    Paste Spotify URL
                  </span>
                </button>
              )}
            </div>
          ) : (
            /* YouTube Playlist Cards (Default Playlist, My Playlist) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Option 1: Default YouTube Playlist */}
              <button
                type="button"
                onClick={() => handleSelectYouTubePlaylist("default-yt")}
                className={cn(
                  "relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                  selectedYouTubePlaylistId === "default-yt"
                    ? "bg-[#250d0d] border-[#ff4d4d] shadow-[0_0_12px_rgba(255,77,77,0.25)] ring-1 ring-[#ff4d4d]/50"
                    : "bg-[#04121c] border-[#142834] hover:border-[#ff4d4d]/50 hover:bg-[#180a0a]"
                )}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs">🏮</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-[#ff6b6b]">
                    Default YouTube
                  </span>
                </div>
                <span className="font-cinzel text-[11px] font-bold text-[#f1ede4]">
                  Hogwarts Ambience &amp; Lo-Fi
                </span>
                <span className="text-[9px] text-[#80949F] font-serif line-clamp-1 mt-0.5">
                  Curated study beats &amp; chamber atmosphere
                </span>
                {selectedYouTubePlaylistId === "default-yt" && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d4d] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4d4d]" />
                  </span>
                )}
              </button>

              {/* Option 2: My YouTube Playlist / Add YouTube Playlist */}
              {customYouTubePlaylist ? (
                <div
                  onClick={() => handleSelectYouTubePlaylist("custom-yt")}
                  className={cn(
                    "relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer group",
                    selectedYouTubePlaylistId === "custom-yt"
                      ? "bg-[#250d0d] border-[#ff4d4d] shadow-[0_0_12px_rgba(255,77,77,0.25)] ring-1 ring-[#ff4d4d]/50"
                      : "bg-[#04121c] border-[#142834] hover:border-[#ff4d4d]/50 hover:bg-[#180a0a]"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs">🎬</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-[#ff6b6b]">
                        Custom
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCustomYouTubePlaylist();
                        }}
                        title="Remove custom playlist"
                        aria-label="Remove custom playlist"
                        className="p-0.5 rounded hover:bg-red-950/80 text-[#80949F] hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <span className="font-cinzel text-[11px] font-bold text-[#f1ede4]">
                    My YouTube Playlist
                  </span>
                  <span className="text-[9px] text-[#80949F] font-serif line-clamp-1 mt-0.5">
                    User custom playlist
                  </span>
                  {selectedYouTubePlaylistId === "custom-yt" && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d4d] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4d4d]" />
                    </span>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPlaylistOpen(true);
                    setAddPlaylistError(null);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-dashed border-[#1b3a47] hover:border-[#ff4d4d]/80 bg-[#04121c]/60 hover:bg-[#250d0d]/40 text-center transition-all duration-200 cursor-pointer group"
                >
                  <Plus className="w-3.5 h-3.5 text-[#80949F] group-hover:text-[#ff6b6b] mb-0.5 transition-colors" />
                  <span className="font-cinzel text-[11px] font-semibold text-[#AFC3CF] group-hover:text-[#ff6b6b]">
                    Add YouTube Playlist
                  </span>
                  <span className="text-[8px] text-[#64748b] font-serif">
                    Paste YouTube playlist URL
                  </span>
                </button>
              )}
            </div>
          )}

          {/* ADD PLAYLIST INPUT PANEL */}
          {isAddPlaylistOpen && (
            <div className="p-3 rounded-xl bg-[#041018] border border-[#1b3a47] shadow-[0_4px_20px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="media-playlist-url-input"
                  className="font-cinzel text-[10px] font-bold text-[#E7C56D] uppercase tracking-wider"
                >
                  {provider === "youtube"
                    ? "Paste YouTube playlist URL:"
                    : "Paste Spotify playlist URL:"}
                </label>
                <span className="text-[9px] text-[#80949F] font-mono">
                  {provider === "youtube"
                    ? "https://www.youtube.com/playlist?list=..."
                    : "https://open.spotify.com/playlist/..."}
                </span>
              </div>

              <div className="relative mb-2">
                <input
                  id="media-playlist-url-input"
                  type="text"
                  value={addPlaylistInput}
                  onChange={(e) => {
                    setAddPlaylistInput(e.target.value);
                    if (addPlaylistError) setAddPlaylistError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLoadCustomPlaylist();
                    if (e.key === "Escape") setIsAddPlaylistOpen(false);
                  }}
                  placeholder={
                    provider === "youtube"
                      ? "https://www.youtube.com/playlist?list=PLAYLIST_ID"
                      : "https://open.spotify.com/playlist/..."
                  }
                  className={cn(
                    "w-full h-8 px-3 pr-7 rounded-lg bg-[#02070c] border text-[11px] font-mono text-[#D6D9D4] placeholder:text-[#476072] transition-colors focus:outline-none",
                    addPlaylistError
                      ? "border-red-500/80 focus:border-red-400"
                      : provider === "youtube"
                      ? "border-[#193747] focus:border-[#ff4d4d]"
                      : "border-[#193747] focus:border-[#1DB954]"
                  )}
                />
                {addPlaylistInput && (
                  <button
                    type="button"
                    onClick={() => setAddPlaylistInput("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#80949F] hover:text-white"
                    title="Clear text"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {addPlaylistError && (
                <div className="flex items-center gap-1.5 mb-2 p-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-[10px] font-serif animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span>{addPlaylistError}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                {(provider === "youtube" ? customYouTubePlaylist : customSpotifyPlaylist) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (provider === "youtube") {
                        removeCustomYouTubePlaylist();
                      } else {
                        removeCustomSpotifyPlaylist();
                      }
                      setIsAddPlaylistOpen(false);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-red-900/60 hover:bg-red-950/40 text-red-400 text-[10px] font-cinzel transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>REMOVE PLAYLIST</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddPlaylistOpen(false);
                      setAddPlaylistError(null);
                    }}
                    className="px-2.5 py-1 rounded-md border border-[#1b3a47] hover:border-[#64748b] text-[10px] font-serif text-[#AFC3CF] hover:text-white transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadCustomPlaylist}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-gradient-to-r from-[#d9be85] via-[#e5cf9e] to-[#caa76a] text-[#1e1507] border border-[#8f6d33] hover:border-[#fef08a] font-cinzel text-[10px] font-bold tracking-wider hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-sm"
                  >
                    <Wand2 className="w-3 h-3 text-[#1e1507]" />
                    <span>LOAD PLAYLIST</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* 4. OFFICIAL EMBED (SPOTIFY or YOUTUBE - Persistent & Responsive)         */}
        {/* ======================================================================= */}
        <div
          ref={playerContainerRef}
          className="relative rounded-xl overflow-hidden bg-[#02070c] border border-[#142e3b] p-1.5 shadow-inner"
        >
          {provider === "youtube" ? (
            /* YouTube Iframe Embed */
            <div className="w-full">
              <iframe
                id="campus-music-youtube-iframe"
                key="youtube-embed-iframe"
                title="CampusHub YouTube Playlist Player"
                src={activeYouTubeEmbedUrl}
                width="100%"
                height="190"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="rounded-xl w-full transition-all duration-300"
                style={{
                  borderRadius: "12px",
                  border: "none",
                }}
              />

              {/* Bottom Metadata & Link */}
              <div className="flex items-center justify-between gap-2 mt-1.5 px-1 text-[10px] text-[#AFC3CF]">
                <div className="flex items-center gap-1.5 font-serif text-[9px] text-[#80949F]">
                  <Radio className="w-2.5 h-2.5 text-[#ff4d4d] animate-pulse" />
                  <span>
                    Now Playing: <span className="text-[#f1ede4] font-medium">{activeMeta.title}</span> • Official YouTube Embed
                  </span>
                </div>

                <a
                  href={activeMeta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-cinzel text-[9px] font-semibold text-[#E7C56D] hover:text-[#F6E6AE] hover:underline"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ) : (
            /* Spotify Iframe Embed */
            <div className="w-full">
              <iframe
                id="campus-music-spotify-iframe"
                key="spotify-embed-iframe"
                title="CampusHub Spotify Embed Player"
                src={activeSpotifyEmbedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl w-full transition-all duration-300"
                style={{
                  borderRadius: "12px",
                  border: "none",
                }}
              />

              {/* Bottom Metadata & Link */}
              <div className="flex items-center justify-between gap-2 mt-1.5 px-1 text-[10px] text-[#AFC3CF]">
                <div className="flex items-center gap-1.5 font-serif text-[9px] text-[#80949F]">
                  <Radio className="w-2.5 h-2.5 text-[#1DB954] animate-pulse" />
                  <span>
                    Now Playing: <span className="text-[#f1ede4] font-medium">{activeMeta.title}</span> • Official Spotify Embed
                  </span>
                </div>

                <a
                  href={activeMeta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-cinzel text-[9px] font-semibold text-[#E7C56D] hover:text-[#F6E6AE] hover:underline"
                >
                  <span>Open in Spotify</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
