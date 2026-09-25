export interface SpotifyPlaylistPreset {
  id: "default-1" | "default-2" | "custom";
  playlistId: string;
  title: string;
  subtitle: string;
  url: string;
  embedUrl: string;
}

export const DEFAULT_SPOTIFY_PLAYLIST_1: SpotifyPlaylistPreset = {
  id: "default-1",
  playlistId: "7tiBT3o7LZb9GYWLFNhC7j",
  title: "Default Playlist 1",
  subtitle: "Hogwarts Study Session",
  url: "https://open.spotify.com/playlist/7tiBT3o7LZb9GYWLFNhC7j",
  embedUrl: "https://open.spotify.com/embed/playlist/7tiBT3o7LZb9GYWLFNhC7j",
};

export const DEFAULT_SPOTIFY_PLAYLIST_2: SpotifyPlaylistPreset = {
  id: "default-2",
  playlistId: "2JyzkVUVQczFEWbwfCdMiv",
  title: "Default Playlist 2",
  subtitle: "Campus Ambience & Chill",
  url: "https://open.spotify.com/playlist/2JyzkVUVQczFEWbwfCdMiv",
  embedUrl: "https://open.spotify.com/embed/playlist/2JyzkVUVQczFEWbwfCdMiv",
};

export const DEFAULT_PLAYLISTS: SpotifyPlaylistPreset[] = [
  DEFAULT_SPOTIFY_PLAYLIST_1,
  DEFAULT_SPOTIFY_PLAYLIST_2,
];

export interface YouTubePlaylistPreset {
  id: "default-yt" | "custom-yt";
  playlistId: string;
  title: string;
  subtitle: string;
  url: string;
  embedUrl: string;
}

export const DEFAULT_YOUTUBE_PLAYLIST: YouTubePlaylistPreset = {
  id: "default-yt",
  playlistId: "PL788cqrhfEcYf1KsGlpRVm2YFlX5PZJuL",
  title: "Default YouTube Playlist",
  subtitle: "Hogwarts Ambience & Lo-Fi",
  url: "https://www.youtube.com/watch?v=u-YGV5xt-jk&list=PL788cqrhfEcYf1KsGlpRVm2YFlX5PZJuL",
  embedUrl: "https://www.youtube.com/embed?listType=playlist&list=PL788cqrhfEcYf1KsGlpRVm2YFlX5PZJuL&enablejsapi=1",
};
