"use client";

import React from "react";
import Link from "next/link";
import { OwlPostTab } from "@/types/owlPost";
import { Feather, Search, Sparkles, Plus, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export interface OwlPostEmptyStateProps {
  activeTab: OwlPostTab;
  searchQuery: string;
  onClearSearch: () => void;
  onOpenCompose: () => void;
}

export const OwlPostEmptyState: React.FC<OwlPostEmptyStateProps> = ({
  activeTab,
  searchQuery,
  onClearSearch,
  onOpenCompose,
}) => {
  const { isAuthenticated, isGuest } = useAuth();
  const isTrulyAuthenticated = isAuthenticated && !isGuest;

  if (searchQuery.trim().length > 0) {
    return (
      <div className="py-16 px-4 text-center space-y-4 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/35 backdrop-blur-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0B3D28]/80 border border-[#20C879]/60 text-[#20C879]">
          <Search className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-cinzel text-base font-bold text-[#F0D49A]">
            No Scrolls Found
          </h3>
          <p className="text-xs font-serif text-[#AFC3CF] max-w-sm mx-auto">
            No owl letters match the incantation &ldquo;{searchQuery}&rdquo;. Try another phrase or alias.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearSearch}
          className="px-4 py-2 rounded-xl bg-[#06140D] border border-[#20C879]/50 text-xs font-serif text-[#20C879] hover:bg-[#0B3D28] hover:text-white transition-colors cursor-pointer shadow-sm font-semibold"
        >
          Clear Query
        </button>
      </div>
    );
  }

  if (activeTab === "my-letters") {
    if (!isTrulyAuthenticated) {
      return (
        <div className="py-16 px-4 text-center space-y-4 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/35 backdrop-blur-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#251b0a] border border-[#D5AE65]/60 text-[#F0D49A]">
            <LogIn className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-cinzel text-base font-bold text-[#F0D49A]">
              Sign In to View Your Dispatched Scrolls
            </h3>
            <p className="text-xs font-serif text-[#AFC3CF] max-w-sm mx-auto">
              Please sign in with your student account to inspect your private submissions and track their Warden review status.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B3D28] hover:bg-[#087A48] border border-[#20C879]/70 text-xs font-serif text-[#F0D49A] hover:text-white transition-all cursor-pointer shadow-md font-semibold"
          >
            <LogIn className="w-3.5 h-3.5 text-[#20C879]" />
            <span>Sign In to CampusHub</span>
          </Link>
        </div>
      );
    }

    return (
      <div className="py-16 px-4 text-center space-y-4 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/35 backdrop-blur-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#251b0a] border border-[#D5AE65]/60 text-[#F0D49A]">
          <Feather className="w-6 h-6 text-[#20C879]" />
        </div>
        <div className="space-y-1">
          <h3 className="font-cinzel text-base font-bold text-[#F0D49A]">
            No Dispatched Scrolls Yet
          </h3>
          <p className="text-xs font-serif text-[#AFC3CF] max-w-sm mx-auto">
            You haven&apos;t sent any letters into the night sky yet. Your identity will always remain completely anonymous.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCompose}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B3D28] hover:bg-[#087A48] border border-[#20C879]/70 text-xs font-serif text-[#F0D49A] hover:text-white transition-all cursor-pointer shadow-md font-semibold"
        >
          <Plus className="w-3.5 h-3.5 text-[#20C879]" />
          <span>Scribe Your First Letter</span>
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 text-center space-y-4 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/35 backdrop-blur-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0B3D28]/80 border border-[#20C879]/60 text-[#20C879]">
        <Sparkles className="w-6 h-6 animate-pulse text-[#20C879]" />
      </div>
      <div className="space-y-1">
        <h3 className="font-cinzel text-base font-bold text-[#F0D49A]">
          The Owl Sanctuary is Silent
        </h3>
        <p className="text-xs font-serif text-[#AFC3CF] max-w-sm mx-auto">
          No confessions have landed in this chamber yet. Be the first student to send a parchment on wing.
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenCompose}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B3D28] hover:bg-[#087A48] border border-[#20C879]/70 text-xs font-serif text-[#F0D49A] hover:text-white transition-all cursor-pointer shadow-md font-semibold"
      >
        <Feather className="w-3.5 h-3.5 text-[#20C879]" />
        <span>Compose Letter</span>
      </button>
    </div>
  );
};
