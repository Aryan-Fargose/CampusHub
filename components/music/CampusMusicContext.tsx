"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  DEFAULT_SPOTIFY_PLAYLIST_1,
  DEFAULT_SPOTIFY_PLAYLIST_2,
  DEFAULT_YOUTUBE_PLAYLIST,
} from "@/lib/campusMusicPresets";
import {
  parseSpotifyPlaylistUrl,
  parseYouTubePlaylistUrl,
} from "@/lib/mediaUtils";

export type MusicProvider = "spotify" | "youtube";

export interface CustomPlaylistData {
  id: string;
  url: string;
}

export interface CampusMusicContextType {
  isOpen: boolean;
  isMinimized: boolean;
  openPlayer: () => void;
  closePlayer: () => void;
  minimizePlayer: () => void;
  expandPlayer: () => void;
  togglePlayer: () => void;

  // Active provider: "spotify" | "youtube"
  provider: MusicProvider;
  setProvider: (provider: MusicProvider) => void;

  // Spotify state
  selectedSpotifyPlaylistId: string;
  selectSpotifyPlaylist: (id: string) => void;
  customSpotifyPlaylist: CustomPlaylistData | null;
  saveCustomSpotifyPlaylist: (url: string) => { success: boolean; error?: string };
  removeCustomSpotifyPlaylist: () => void;
  activeSpotifyEmbedUrl: string;

  // YouTube state
  selectedYouTubePlaylistId: string;
  selectYouTubePlaylist: (id: string) => void;
  customYouTubePlaylist: CustomPlaylistData | null;
  saveCustomYouTubePlaylist: (url: string) => { success: boolean; error?: string };
  removeCustomYouTubePlaylist: () => void;
  activeYouTubeEmbedUrl: string;

  // Audio / Mute functionality
  isMuted: boolean;
  toggleMute: () => void;
  spotifyMuteNotice: string | null;
  clearSpotifyMuteNotice: () => void;
}

const SPOTIFY_STORAGE_KEY = "campushub_custom_spotify_playlist";
const YOUTUBE_STORAGE_KEY = "campushub_custom_youtube_playlist";
const PROVIDER_STORAGE_KEY = "campushub_music_provider";

const CampusMusicContext = createContext<CampusMusicContextType | null>(null);

export const CampusMusicProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Global player state: starts minimized/collapsed on load so it's always ready across all pages
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [spotifyMuteNotice, setSpotifyMuteNotice] = useState<string | null>(null);

  // Active provider
  const [provider, setProviderState] = useState<MusicProvider>(() => {
    if (typeof window === "undefined") return "spotify";
    try {
      const saved = localStorage.getItem(PROVIDER_STORAGE_KEY);
      if (saved === "spotify" || saved === "youtube") {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
    return "spotify";
  });

  const setProvider = useCallback((newProvider: MusicProvider) => {
    setProviderState(newProvider);
    try {
      localStorage.setItem(PROVIDER_STORAGE_KEY, newProvider);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // -------------------------------------------------------------
  // Spotify State
  // -------------------------------------------------------------
  const [selectedSpotifyPlaylistId, setSelectedSpotifyPlaylistId] = useState<string>("default-1");

  const [customSpotifyPlaylist, setCustomSpotifyPlaylist] = useState<CustomPlaylistData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(SPOTIFY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.id === "string" && typeof parsed.url === "string") {
          return { id: parsed.id, url: parsed.url };
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    return null;
  });

  const selectSpotifyPlaylist = useCallback((id: string) => {
    setSelectedSpotifyPlaylistId(id);
  }, []);

  const saveCustomSpotifyPlaylist = useCallback(
    (inputUrl: string): { success: boolean; error?: string } => {
      const parsed = parseSpotifyPlaylistUrl(inputUrl);
      if (!parsed.isValid || !parsed.data) {
        return {
          success: false,
          error: parsed.error || "Please enter a valid Spotify playlist URL.",
        };
      }

      const playlistData: CustomPlaylistData = {
        id: parsed.data.id,
        url: parsed.data.originalUrl,
      };

      try {
        localStorage.setItem(SPOTIFY_STORAGE_KEY, JSON.stringify(playlistData));
      } catch {
        // Fallback
      }

      setCustomSpotifyPlaylist(playlistData);
      setSelectedSpotifyPlaylistId("custom");
      return { success: true };
    },
    []
  );

  const removeCustomSpotifyPlaylist = useCallback(() => {
    try {
      localStorage.removeItem(SPOTIFY_STORAGE_KEY);
    } catch {
      // Fallback
    }
    setCustomSpotifyPlaylist(null);
    if (selectedSpotifyPlaylistId === "custom") {
      setSelectedSpotifyPlaylistId("default-1");
    }
  }, [selectedSpotifyPlaylistId]);

  const activeSpotifyEmbedUrl = useMemo(() => {
    let playlistId = DEFAULT_SPOTIFY_PLAYLIST_1.playlistId;

    if (selectedSpotifyPlaylistId === "default-2") {
      playlistId = DEFAULT_SPOTIFY_PLAYLIST_2.playlistId;
    } else if (selectedSpotifyPlaylistId === "custom" && customSpotifyPlaylist) {
      playlistId = customSpotifyPlaylist.id;
    }

    return `https://open.spotify.com/embed/playlist/${encodeURIComponent(
      playlistId
    )}?utm_source=generator&theme=0`;
  }, [selectedSpotifyPlaylistId, customSpotifyPlaylist]);

  // -------------------------------------------------------------
  // YouTube State
  // -------------------------------------------------------------
  const [selectedYouTubePlaylistId, setSelectedYouTubePlaylistId] = useState<string>("default-yt");

  const [customYouTubePlaylist, setCustomYouTubePlaylist] = useState<CustomPlaylistData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(YOUTUBE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.id === "string" && typeof parsed.url === "string") {
          return { id: parsed.id, url: parsed.url };
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    return null;
  });

  const selectYouTubePlaylist = useCallback((id: string) => {
    setSelectedYouTubePlaylistId(id);
  }, []);

  const saveCustomYouTubePlaylist = useCallback(
    (inputUrl: string): { success: boolean; error?: string } => {
      const parsed = parseYouTubePlaylistUrl(inputUrl);
      if (!parsed.isValid || !parsed.data) {
        return {
          success: false,
          error: parsed.error || "Please enter a valid YouTube playlist URL.",
        };
      }

      const playlistData: CustomPlaylistData = {
        id: parsed.data.id,
        url: parsed.data.originalUrl,
      };

      try {
        localStorage.setItem(YOUTUBE_STORAGE_KEY, JSON.stringify(playlistData));
      } catch {
        // Fallback
      }

      setCustomYouTubePlaylist(playlistData);
      setSelectedYouTubePlaylistId("custom-yt");
      return { success: true };
    },
    []
  );

  const removeCustomYouTubePlaylist = useCallback(() => {
    try {
      localStorage.removeItem(YOUTUBE_STORAGE_KEY);
    } catch {
      // Fallback
    }
    setCustomYouTubePlaylist(null);
    if (selectedYouTubePlaylistId === "custom-yt") {
      setSelectedYouTubePlaylistId("default-yt");
    }
  }, [selectedYouTubePlaylistId]);

  const activeYouTubeEmbedUrl = useMemo(() => {
    let playlistId = DEFAULT_YOUTUBE_PLAYLIST.playlistId;

    if (selectedYouTubePlaylistId === "custom-yt" && customYouTubePlaylist) {
      playlistId = customYouTubePlaylist.id;
    }

    return `https://www.youtube.com/embed?listType=playlist&list=${encodeURIComponent(
      playlistId
    )}&enablejsapi=1`;
  }, [selectedYouTubePlaylistId, customYouTubePlaylist]);

  // -------------------------------------------------------------
  // Mute / Unmute Command Execution
  // -------------------------------------------------------------
  const sendYouTubeMuteCommand = useCallback((mute: boolean) => {
    if (typeof window === "undefined") return;
    const iframe = document.getElementById("campus-music-youtube-iframe") as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: mute ? "mute" : "unMute",
          args: [],
        }),
        "*"
      );
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (provider === "youtube") {
        sendYouTubeMuteCommand(nextMuted);
      } else {
        // Inform user about Spotify embed restrictions
        setSpotifyMuteNotice(
          "Spotify restricts external volume control. Please use the volume/mute slider inside the Spotify player."
        );
        setTimeout(() => {
          setSpotifyMuteNotice(null);
        }, 4500);
      }
      return nextMuted;
    });
  }, [provider, sendYouTubeMuteCommand]);

  // Synchronize mute state whenever provider switches to YouTube
  useEffect(() => {
    if (provider === "youtube") {
      sendYouTubeMuteCommand(isMuted);
    }
  }, [provider, isMuted, sendYouTubeMuteCommand]);

  const clearSpotifyMuteNotice = useCallback(() => {
    setSpotifyMuteNotice(null);
  }, []);

  // -------------------------------------------------------------
  // Open / Close / Minimize Handlers
  // -------------------------------------------------------------
  const openPlayer = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closePlayer = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(true);
  }, []);

  const minimizePlayer = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const expandPlayer = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const togglePlayer = useCallback(() => {
    setIsOpen((prevOpen) => {
      if (!prevOpen) {
        setIsMinimized(false);
        return true;
      }
      setIsMinimized((prevMin) => !prevMin);
      return true;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      isOpen,
      isMinimized,
      openPlayer,
      closePlayer,
      minimizePlayer,
      expandPlayer,
      togglePlayer,

      provider,
      setProvider,

      selectedSpotifyPlaylistId,
      selectSpotifyPlaylist,
      customSpotifyPlaylist,
      saveCustomSpotifyPlaylist,
      removeCustomSpotifyPlaylist,
      activeSpotifyEmbedUrl,

      selectedYouTubePlaylistId,
      selectYouTubePlaylist,
      customYouTubePlaylist,
      saveCustomYouTubePlaylist,
      removeCustomYouTubePlaylist,
      activeYouTubeEmbedUrl,

      isMuted,
      toggleMute,
      spotifyMuteNotice,
      clearSpotifyMuteNotice,
    }),
    [
      isOpen,
      isMinimized,
      openPlayer,
      closePlayer,
      minimizePlayer,
      expandPlayer,
      togglePlayer,

      provider,
      setProvider,

      selectedSpotifyPlaylistId,
      selectSpotifyPlaylist,
      customSpotifyPlaylist,
      saveCustomSpotifyPlaylist,
      removeCustomSpotifyPlaylist,
      activeSpotifyEmbedUrl,

      selectedYouTubePlaylistId,
      selectYouTubePlaylist,
      customYouTubePlaylist,
      saveCustomYouTubePlaylist,
      removeCustomYouTubePlaylist,
      activeYouTubeEmbedUrl,

      isMuted,
      toggleMute,
      spotifyMuteNotice,
      clearSpotifyMuteNotice,
    ]
  );

  return (
    <CampusMusicContext.Provider value={contextValue}>
      {children}
    </CampusMusicContext.Provider>
  );
};

export const useCampusMusic = (): CampusMusicContextType => {
  const context = useContext(CampusMusicContext);
  if (!context) {
    throw new Error("useCampusMusic must be used within a CampusMusicProvider");
  }
  return context;
};
