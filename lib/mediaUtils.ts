/**
 * Safe, strictly validated Spotify URL parser and embed generator for Campus Music.
 * 
 * SECURITY:
 * - Untrusted inputs are strictly parsed using standard URL parser.
 * - Hostname is whitelisted strictly to open.spotify.com.
 * - Resource IDs are strictly validated using alphanumeric regular expressions.
 * - No arbitrary URLs or protocols (e.g. javascript:) are ever allowed into iframe sources.
 * - Autoplay is disabled.
 */

export type SpotifyContentType = "track" | "album" | "playlist" | "artist";

export interface SpotifyMediaData {
  provider: "spotify";
  type: SpotifyContentType;
  id: string;
  embedUrl: string;
  originalUrl: string;
}

export interface SpotifyPlaylistData {
  id: string;
  embedUrl: string;
  originalUrl: string;
}

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates and converts a general Spotify URL into an official Spotify Embed URL.
 * Supports: track, album, playlist, artist.
 */
export function parseSpotifyUrl(input: string): ValidationResult<SpotifyMediaData> {
  if (!input || typeof input !== "string") {
    return {
      isValid: false,
      error: "Please enter a Spotify URL.",
    };
  }

  const trimmed = input.trim();

  // Support spotify:type:id URI format
  if (trimmed.startsWith("spotify:")) {
    const parts = trimmed.split(":");
    if (parts.length >= 3) {
      const type = parts[1].toLowerCase();
      const id = parts[2];
      if (
        (type === "track" || type === "album" || type === "playlist" || type === "artist") &&
        /^[a-zA-Z0-9]{15,40}$/.test(id)
      ) {
        return {
          isValid: true,
          data: {
            provider: "spotify",
            type,
            id,
            embedUrl: `https://open.spotify.com/embed/${type}/${encodeURIComponent(id)}?utm_source=generator&theme=0`,
            originalUrl: `https://open.spotify.com/${type}/${id}`,
          },
        };
      }
    }
    return {
      isValid: false,
      error: "Invalid Spotify URI format. Expected spotify:track|album|playlist|artist:id",
    };
  }

  // Parse as web URL
  let parsedUrl: URL;
  try {
    const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    parsedUrl = new URL(withProtocol);
  } catch {
    return {
      isValid: false,
      error: "Malformed URL. Please enter a valid web address.",
    };
  }

  // Strict Hostname verification
  const hostname = parsedUrl.hostname.toLowerCase();
  if (hostname !== "open.spotify.com") {
    return {
      isValid: false,
      error: "Invalid domain. Only links from open.spotify.com are supported.",
    };
  }

  // Path matching for: /(intl-[a-z]{2,5}/)?(embed/)?(track|album|playlist|artist)/([a-zA-Z0-9]{15,40})
  const pathname = parsedUrl.pathname;
  const match = pathname.match(
    /^(?:\/intl-[a-z]{2,5})?(?:\/embed)?\/(track|album|playlist|artist)\/([a-zA-Z0-9]{15,40})(?:\/.*)?$/
  );

  if (!match) {
    return {
      isValid: false,
      error:
        "Unsupported Spotify content. Please provide a link to a track, album, playlist, or artist.",
    };
  }

  const type = match[1] as SpotifyContentType;
  const id = match[2];

  if (!["track", "album", "playlist", "artist"].includes(type)) {
    return {
      isValid: false,
      error: "Only Spotify tracks, albums, playlists, and artists can be embedded.",
    };
  }

  const embedUrl = `https://open.spotify.com/embed/${type}/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
  const originalUrl = `https://open.spotify.com/${type}/${encodeURIComponent(id)}`;

  return {
    isValid: true,
    data: {
      provider: "spotify",
      type,
      id,
      embedUrl,
      originalUrl,
    },
  };
}

/**
 * Validates and converts a Spotify playlist URL into an official Spotify playlist embed URL.
 * Only accepts valid Spotify playlist links and extracts the clean playlist ID.
 * Strips tracking parameters like ?si=... and validates the ID format.
 */
export function parseSpotifyPlaylistUrl(input: string): ValidationResult<SpotifyPlaylistData> {
  if (!input || typeof input !== "string" || !input.trim()) {
    return {
      isValid: false,
      error: "Please paste a Spotify playlist URL.",
    };
  }

  const trimmed = input.trim();

  // Support spotify:playlist:id URI format
  if (trimmed.startsWith("spotify:")) {
    const parts = trimmed.split(":");
    if (parts.length >= 3) {
      const type = parts[1].toLowerCase();
      const id = parts[2];
      if (type !== "playlist") {
        return {
          isValid: false,
          error: `This is a Spotify ${type}. Please paste a playlist URL.`,
        };
      }
      if (/^[a-zA-Z0-9]{15,40}$/.test(id)) {
        return {
          isValid: true,
          data: {
            id,
            embedUrl: `https://open.spotify.com/embed/playlist/${encodeURIComponent(id)}`,
            originalUrl: `https://open.spotify.com/playlist/${encodeURIComponent(id)}`,
          },
        };
      }
    }
    return {
      isValid: false,
      error: "Invalid Spotify URI format. Expected spotify:playlist:id",
    };
  }

  let parsedUrl: URL;
  try {
    const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    parsedUrl = new URL(withProtocol);
  } catch {
    return {
      isValid: false,
      error: "Malformed URL. Please paste a valid Spotify playlist address.",
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (hostname !== "open.spotify.com") {
    return {
      isValid: false,
      error: "Invalid domain. Only links from open.spotify.com are supported.",
    };
  }

  const pathname = parsedUrl.pathname;

  // Check if user accidentally pasted track/album/artist
  const nonPlaylistMatch = pathname.match(
    /^(?:\/intl-[a-z]{2,5})?(?:\/embed)?\/(track|album|artist)\/([a-zA-Z0-9]+)/
  );
  if (nonPlaylistMatch) {
    const itemType = nonPlaylistMatch[1];
    return {
      isValid: false,
      error: `This appears to be a Spotify ${itemType}. Please paste a playlist URL.`,
    };
  }

  const match = pathname.match(
    /^(?:\/intl-[a-z]{2,5})?(?:\/embed)?\/playlist\/([a-zA-Z0-9]{15,40})(?:\/.*)?$/
  );

  if (!match) {
    return {
      isValid: false,
      error: "Please paste a valid Spotify playlist URL (e.g. https://open.spotify.com/playlist/...).",
    };
  }

  const id = match[1];
  return {
    isValid: true,
    data: {
      id,
      embedUrl: `https://open.spotify.com/embed/playlist/${encodeURIComponent(id)}`,
      originalUrl: `https://open.spotify.com/playlist/${encodeURIComponent(id)}`,
    },
  };
}

export interface YouTubePlaylistData {
  id: string;
  embedUrl: string;
  originalUrl: string;
}

/**
 * Validates and converts a YouTube playlist URL into an official YouTube playlist embed URL.
 * Strictly extracts the playlist ID and ensures the hostname is legitimate YouTube domain.
 * Supports:
 * - https://www.youtube.com/playlist?list=PLAYLIST_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
 * - https://youtu.be/VIDEO_ID?list=PLAYLIST_ID
 */
export function parseYouTubePlaylistUrl(input: string): ValidationResult<YouTubePlaylistData> {
  if (!input || typeof input !== "string" || !input.trim()) {
    return {
      isValid: false,
      error: "Please paste a YouTube playlist URL.",
    };
  }

  const trimmed = input.trim();
  let parsedUrl: URL;

  try {
    const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
    parsedUrl = new URL(withProtocol);
  } catch {
    return {
      isValid: false,
      error: "Malformed URL. Please paste a valid web address.",
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
  const allowedHostnames = [
    "youtube.com",
    "m.youtube.com",
    "music.youtube.com",
    "youtu.be",
  ];

  if (!allowedHostnames.includes(hostname)) {
    return {
      isValid: false,
      error: "Only YouTube links (youtube.com or youtu.be) are supported.",
    };
  }

  // Extract 'list' parameter
  const playlistId = parsedUrl.searchParams.get("list");

  if (!playlistId) {
    return {
      isValid: false,
      error: "Could not find a playlist ID in this link. Please make sure the URL contains 'list=...'.",
    };
  }

  // Strictly validate playlist ID: alphanumeric, underscores, hyphens (typically 10-60 characters)
  if (!/^[a-zA-Z0-9_-]{10,60}$/.test(playlistId)) {
    return {
      isValid: false,
      error: "Invalid YouTube playlist ID format.",
    };
  }

  return {
    isValid: true,
    data: {
      id: playlistId,
      embedUrl: `https://www.youtube.com/embed?listType=playlist&list=${encodeURIComponent(playlistId)}&enablejsapi=1`,
      originalUrl: `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`,
    },
  };
}

