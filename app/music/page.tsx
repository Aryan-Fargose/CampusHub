"use client";

import React, { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/lib/auth/AuthContext";
import { mockCurrentUser } from "@/lib/mockData";
import Link from "next/link";
import { ArrowLeft, Sparkles, Music, Volume2, VolumeX, Wand2 } from "lucide-react";
import { useCampusMusic } from "@/components/music/CampusMusicContext";

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function MusicPage() {
  const { profile } = useAuth();
  const currentUser = profile || mockCurrentUser;
  const {
    expandPlayer,
    provider,
    setProvider,
    selectedSpotifyPlaylistId,
    selectSpotifyPlaylist,
    selectedYouTubePlaylistId,
    selectYouTubePlaylist,
    isMuted,
    toggleMute,
  } = useCampusMusic();

  // Expand the global player when entering the music chamber
  useEffect(() => {
    expandPlayer();
  }, [expandPlayer]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#020509] text-[#f1ede4] overflow-x-hidden">
      {/* Ambient mystical background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#48D1CC]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[350px] bg-[#E7C56D]/5 rounded-full blur-[120px]" />
      </div>

      {/* 1. Header Navigation */}
      <Header user={currentUser} />

      {/* 2. Main Content Chamber */}
      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 sm:px-8 py-6 sm:py-10 flex flex-col items-center">
        {/* Navigation Breadcrumb */}
        <div className="w-full flex items-center justify-between mb-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#04131d] hover:bg-[#0a2638] border border-[#1b3a47] hover:border-[#48D1CC]/70 text-xs font-serif text-[#D6D9D4] hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#48D1CC] transition-transform group-hover:-translate-x-1" />
            <span className="font-cinzel text-[11px] font-semibold tracking-wider">
              Return to Campus
            </span>
          </Link>

          <div className="flex items-center gap-1.5 text-[10px] font-cinzel text-[#E7C56D] uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" />
            <span>Grand Hall Radio</span>
          </div>
        </div>

        {/* Grand Hall Music Hub Card */}
        <div className="w-full rounded-2xl bg-[#030a10]/90 border border-[#E7C56D]/60 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071924] border border-[#48D1CC]/70 text-[#48D1CC] shadow-[0_0_20px_rgba(72,209,204,0.3)]">
              <Music className="w-6 h-6 animate-pulse" />
            </div>

            <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#F6E6AE] via-[#E7C56D] to-[#caa76a]">
              GRAND HALL RADIO
            </h1>

            <p className="font-cormorant italic text-sm text-[#AFC3CF] max-w-md">
              Your enchanted soundscape plays globally across every tab and chamber of CampusHub.
              Navigate anywhere — your study session continues uninterrupted.
            </p>
          </div>

          {/* Quick Audio Summon & Mute Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={expandPlayer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d9be85] via-[#e5cf9e] to-[#caa76a] text-[#1e1507] border border-[#8f6d33] hover:border-[#fef08a] font-cinzel text-xs font-bold tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_18px_rgba(231,197,109,0.4)]"
            >
              <Wand2 className="w-4 h-4 text-[#1e1507]" />
              <span>Summon Music Controls</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#04131d] hover:bg-[#071f2e] border border-[#1b3a47] hover:border-[#48D1CC]/60 text-xs font-serif text-[#D6D9D4] transition-all cursor-pointer shadow-sm"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-amber-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#48D1CC]" />
              )}
              <span>{isMuted ? "Unmute" : "Mute"}</span>
            </button>
          </div>

          {/* Quick Playlist Selector */}
          <div className="pt-4 border-t border-[#142834]">
            <p className="text-[11px] font-cinzel tracking-wider text-[#80949F] uppercase mb-3">
              Switch Enchantment
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setProvider("spotify");
                  selectSpotifyPlaylist("default-1");
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-serif transition-all cursor-pointer ${
                  provider === "spotify" && selectedSpotifyPlaylistId === "default-1"
                    ? "bg-[#072418] border-[#1DB954] text-[#1DB954] shadow-[0_0_10px_rgba(29,185,84,0.3)]"
                    : "bg-[#04121c] border-[#142834] text-[#80949F] hover:text-white"
                }`}
              >
                Spotify: Hogwarts Study
              </button>
              <button
                type="button"
                onClick={() => {
                  setProvider("spotify");
                  selectSpotifyPlaylist("default-2");
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-serif transition-all cursor-pointer ${
                  provider === "spotify" && selectedSpotifyPlaylistId === "default-2"
                    ? "bg-[#072418] border-[#1DB954] text-[#1DB954] shadow-[0_0_10px_rgba(29,185,84,0.3)]"
                    : "bg-[#04121c] border-[#142834] text-[#80949F] hover:text-white"
                }`}
              >
                Spotify: Campus Chill
              </button>
              <button
                type="button"
                onClick={() => {
                  setProvider("youtube");
                  selectYouTubePlaylist("default-yt");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-serif transition-all cursor-pointer ${
                  provider === "youtube" && selectedYouTubePlaylistId === "default-yt"
                    ? "bg-[#250d0d] border-[#ff4d4d] text-[#ff6b6b] shadow-[0_0_10px_rgba(255,77,77,0.3)]"
                    : "bg-[#04121c] border-[#142834] text-[#80949F] hover:text-white"
                }`}
              >
                <YouTubeIcon className="w-3.5 h-3.5 text-[#ff4d4d]" />
                <span>YouTube: Lo-Fi Beats</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Scholarly Footer Note */}
      <footer className="relative z-10 w-full text-center py-4 text-[11px] text-[#80949F] font-serif border-t border-[#142834]/40 bg-[#020509]/80 backdrop-blur-sm">
        <p>✦ CampusHub Enchanted Soundscapes • Official Spotify &amp; YouTube Embeds • DJSCE ✦</p>
      </footer>
    </div>
  );
}
