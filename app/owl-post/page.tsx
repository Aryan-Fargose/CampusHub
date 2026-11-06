"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OwlPostHeader } from "@/components/owl-post/OwlPostHeader";
import { OwlPostFeedCard } from "@/components/owl-post/OwlPostFeedCard";
import { ComposeLetterModal } from "@/components/owl-post/ComposeLetterModal";
import { ReportLetterModal } from "@/components/owl-post/ReportLetterModal";
import { OwlPostEmptyState } from "@/components/owl-post/OwlPostEmptyState";
import { OwlPostModerationPanel } from "@/components/owl-post/OwlPostModerationPanel";
import { SpectralDragon } from "@/components/effects/SpectralDragon";
import { useOwlPost } from "@/lib/useOwlPost";
import { PublicOwlPost } from "@/types/owlPost";
import { animate, stagger } from "animejs";
import { Feather, RefreshCw, ChevronDown, Sparkles, AlertCircle } from "lucide-react";

export default function OwlPostPage() {
  const {
    posts,
    totalCount,
    totalApprovedCount,
    myLettersCount,
    pendingModerationCount,
    pendingPosts,
    approvedPosts,
    rejectedPosts,
    reports,
    isModerator,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    hasMore,
    loadMore,
    dispatchLetter,
    toggleReaction,
    reportPost,
    approvePost,
    rejectPost,
    reviewReport,
    refreshFeed,
  } = useOwlPost();

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [reportingPost, setReportingPost] = useState<PublicOwlPost | null>(null);

  // Subtle staggered reveal animation for confession cards
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isLoading && posts.length > 0 && activeTab !== "moderation") {
      try {
        animate(".owl-card-item", {
          opacity: [0, 1],
          translateY: [15, 0],
          delay: stagger(45),
          duration: 350,
          easing: "easeOutQuad",
        });
      } catch {
        // Safe fallback if Anime.js encounters non-DOM environment
      }
    }
  }, [isLoading, posts, activeTab]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#020806] text-[#E8D4A7] overflow-x-hidden">
      {/* 1. Static Gothic Hall Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/images/owl-post-bg.jpg')`,
          backgroundPosition: "center 25%",
        }}
      />

      {/* 2. Dark Emerald Atmosphere & Readability Overlay (around 28-35%) */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-[#020806]/80 via-[#06140D]/75 to-[#020806]/92 pointer-events-none" />

      {/* 3. Subtle Ambient Emerald Mist & Stained Glass Radiance */}
      <div className="fixed inset-0 z-[2] pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
        <div
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#087A48]/20 blur-[130px] rounded-full animate-pulse"
          style={{ animationDuration: "9s" }}
        />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#092719]/40 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[350px] bg-[#0B3D28]/30 blur-[150px] rounded-full" />
      </div>

      {/* 4. Independent Moving Blue Spectral Dragon Component */}
      <SpectralDragon />

      {/* Top Header */}
      <Header />

      {/* Main Sanctuary Container */}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero & Navigation Header */}
        <OwlPostHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCompose={() => setIsComposeOpen(true)}
          totalLetters={totalApprovedCount}
          myLettersCount={myLettersCount}
          isModerator={isModerator}
          pendingModerationCount={pendingModerationCount}
        />

        {error && (
          <div className="p-3.5 rounded-xl bg-[#251010]/30 border border-rose-500/50 text-rose-300 text-xs font-serif flex items-center gap-2 backdrop-blur-[8px]">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State (Translucent Glass Effect) */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/35 backdrop-blur-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B3D28] border border-[#20C879]/70 text-[#20C879] shadow-[0_0_20px_rgba(32,200,121,0.4)] animate-pulse">
              <Feather className="w-6 h-6 animate-spin text-[#20C879]" />
            </div>
            <p className="font-cinzel text-xs text-[#F0D49A] tracking-widest uppercase">
              Summoning Owl Scrolls...
            </p>
          </div>
        ) : activeTab === "moderation" && isModerator ? (
          /* Warden's Sanctum Chamber */
          <OwlPostModerationPanel
            pendingPosts={pendingPosts}
            approvedPosts={approvedPosts}
            rejectedPosts={rejectedPosts}
            reports={reports}
            onApprove={approvePost}
            onReject={rejectPost}
            onReviewReport={reviewReport}
          />
        ) : posts.length === 0 ? (
          /* Empty State */
          <OwlPostEmptyState
            activeTab={activeTab}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
            onOpenCompose={() => setIsComposeOpen(true)}
          />
        ) : (
          /* Feed Cards Grid */
          <div ref={cardsContainerRef} className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#AFC3CF] font-mono px-1">
              <span>
                Showing {posts.length} of {totalCount} scroll{totalCount === 1 ? "" : "s"}
              </span>
              <button
                type="button"
                onClick={refreshFeed}
                title="Refresh feed"
                className="inline-flex items-center gap-1 text-[#AFC3CF] hover:text-[#20C879] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {posts.map((post) => (
                <OwlPostFeedCard
                  key={post.id}
                  post={post}
                  onReact={toggleReaction}
                  onReport={(p) => setReportingPost(p)}
                />
              ))}
            </div>

            {/* Incremental Loading: "Summon More Letters" */}
            {hasMore && (
              <div className="pt-6 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B3D28] hover:bg-[#087A48] border border-[#20C879]/70 hover:border-[#20C879] text-xs font-serif text-[#F0D49A] hover:text-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(32,200,121,0.35)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#20C879] group-hover:rotate-12 transition-transform" />
                  <span>Summon More Scrolls</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#D5AE65] group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Compose Modal */}
      <ComposeLetterModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSubmit={dispatchLetter}
      />

      {/* Report Modal */}
      <ReportLetterModal
        isOpen={Boolean(reportingPost)}
        post={reportingPost}
        onClose={() => setReportingPost(null)}
        onSubmit={reportPost}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
