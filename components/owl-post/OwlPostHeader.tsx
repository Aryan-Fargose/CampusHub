"use client";

import React from "react";
import { OwlPostTab } from "@/types/owlPost";
import { Feather, Flame, Sparkles, User, Search, X, Plus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OwlPostHeaderProps {
  activeTab: OwlPostTab;
  onTabChange: (tab: OwlPostTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCompose: () => void;
  totalLetters: number;
  myLettersCount: number;
  isModerator?: boolean;
  pendingModerationCount?: number;
}

export const OwlPostHeader: React.FC<OwlPostHeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenCompose,
  totalLetters,
  myLettersCount,
  isModerator = false,
  pendingModerationCount = 0,
}) => {
  return (
    <div className="w-full space-y-6 select-none">
      {/* 1. Magical Header & Action Banner (Translucent Glass Effect) */}
      <div className="relative rounded-2xl bg-[#020806]/20 border border-[#B58A45]/40 p-6 sm:p-8 backdrop-blur-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Arcane Corner Runes */}
        <span className="absolute top-2 left-3 text-xs text-[#20C879]/40 select-none">᚛</span>
        <span className="absolute top-2 right-3 text-xs text-[#20C879]/40 select-none">᚜</span>
        <span className="absolute bottom-2 left-3 text-xs text-[#B58A45]/40 select-none">ᛞ</span>
        <span className="absolute bottom-2 right-3 text-xs text-[#B58A45]/40 select-none">ᛟ</span>

        {/* Ambient atmospheric auras */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#087A48]/15 blur-[75px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-20 right-10 w-72 h-36 bg-[#D5AE65]/10 blur-[65px] pointer-events-none rounded-full" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Title & Lore */}
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D28]/80 border border-[#20C879]/40 text-[#20C879] text-[11px] font-mono tracking-wider uppercase shadow-sm">
              <Feather className="w-3.5 h-3.5 animate-pulse text-[#20C879]" />
              <span>Campus Confessions & Secrets</span>
              <span className="text-[#D5AE65]">&bull;</span>
              <span className="text-[#F0D49A]">{totalLetters} Scrolls In Flight</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black tracking-[0.16em] text-[#F0D49A] drop-shadow-[0_2px_14px_rgba(32,200,121,0.3)]">
              OWL POST
            </h1>

            <p className="font-cormorant italic text-sm sm:text-base text-[#E8D4A7] max-w-xl leading-relaxed">
              &ldquo;Whispers carried by wings. Secrets sealed in parchment.&rdquo;
            </p>
          </div>

          {/* Action: Compose Letter Button (Solid, fully visible & distinguishable) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenCompose}
              className="group relative flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0B3D28] via-[#092719] to-[#0B3D28] hover:from-[#087A48] hover:to-[#092719] border border-[#20C879]/80 hover:border-[#20C879] text-[#F0D49A] hover:text-white text-xs sm:text-sm font-serif tracking-wider shadow-[0_0_24px_rgba(32,200,121,0.35)] hover:shadow-[0_0_35px_rgba(32,200,121,0.55)] transition-all duration-300 cursor-pointer active:scale-95"
            >
              {/* Wax Seal badge */}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#782B25] border border-[#D5AE65]/80 text-[#F0D49A] text-[11px] group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                🪶
              </span>
              <span className="font-bold">Compose Letter</span>
              <Plus className="w-4 h-4 text-[#20C879] group-hover:scale-125 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls Bar: Search Field & Navigation Tabs (Translucent Containers) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Navigation Tabs Container */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#020806]/20 border border-[#B58A45]/30 backdrop-blur-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            onClick={() => onTabChange("latest")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-serif transition-all duration-200 cursor-pointer",
              activeTab === "latest"
                ? "bg-[#0B3D28] text-[#20C879] border border-[#20C879]/70 shadow-[0_0_14px_rgba(32,200,121,0.3)] font-bold"
                : "text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#06140D]/50"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#20C879]" />
            <span>Latest</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("popular")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-serif transition-all duration-200 cursor-pointer",
              activeTab === "popular"
                ? "bg-[#0B3D28] text-[#20C879] border border-[#20C879]/70 shadow-[0_0_14px_rgba(32,200,121,0.3)] font-bold"
                : "text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#06140D]/50"
            )}
          >
            <Flame className="w-3.5 h-3.5 text-[#D5AE65]" />
            <span>Popular</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("my-letters")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-serif transition-all duration-200 cursor-pointer",
              activeTab === "my-letters"
                ? "bg-[#0B3D28] text-[#20C879] border border-[#20C879]/70 shadow-[0_0_14px_rgba(32,200,121,0.3)] font-bold"
                : "text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#06140D]/50"
            )}
          >
            <User className="w-3.5 h-3.5 text-[#D5AE65]" />
            <span>My Letters</span>
            {myLettersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#B58A45]/30 text-[#D5AE65] border border-[#B58A45]/50 font-mono">
                {myLettersCount}
              </span>
            )}
          </button>

          {isModerator && (
            <button
              type="button"
              onClick={() => onTabChange("moderation")}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-serif transition-all duration-200 cursor-pointer",
                activeTab === "moderation"
                  ? "bg-[#0B3D28] text-[#F0D49A] border border-[#B58A45] shadow-[0_0_14px_rgba(213,174,101,0.35)] font-bold"
                  : "text-[#D5AE65]/80 hover:text-[#F0D49A] hover:bg-[#06140D]/50"
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#20C879]" />
              <span>Warden&apos;s Sanctum</span>
              {pendingModerationCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#20C879]/30 text-[#20C879] border border-[#20C879]/50 font-mono">
                  {pendingModerationCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Search Field Container */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AFC3CF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search scrolls & aliases..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#020806]/20 border border-[#B58A45]/35 focus:border-[#20C879]/80 focus:ring-1 focus:ring-[#20C879]/80 text-xs font-serif text-[#E8D4A7] placeholder-[#8fa2ad] outline-none backdrop-blur-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
