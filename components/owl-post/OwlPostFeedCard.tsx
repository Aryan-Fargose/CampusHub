"use client";

import React, { useState } from "react";
import { PublicOwlPost, OwlReactionType } from "@/types/owlPost";
import { Flag, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OwlPostFeedCardProps {
  post: PublicOwlPost;
  onReact: (postId: string, reaction: OwlReactionType) => void;
  onReport: (post: PublicOwlPost) => void;
}

// Friendly relative time formatter
function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
    }
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    }
    if (diffMin > 0) {
      return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  } catch {
    return "Recently";
  }
}

export const OwlPostFeedCard: React.FC<OwlPostFeedCardProps> = ({
  post,
  onReact,
  onReport,
}) => {
  const [reactionAnim, setReactionAnim] = useState<OwlReactionType | null>(null);

  const handleReactionClick = (type: OwlReactionType) => {
    setReactionAnim(type);
    setTimeout(() => setReactionAnim(null), 400);
    onReact(post.id, type);
  };

  const reactionConfigs: Array<{
    type: OwlReactionType;
    emoji: string;
    label: string;
    activeBorder: string;
    activeBg: string;
  }> = [
    {
      type: "heart",
      emoji: "❤️",
      label: "Charm",
      activeBorder: "border-rose-500/70",
      activeBg: "bg-[#251010] text-rose-300 font-bold",
    },
    {
      type: "owl",
      emoji: "🦉",
      label: "Owl Mail",
      activeBorder: "border-[#16CFFF]/70",
      activeBg: "bg-[#063A9B]/60 text-[#8BEAFF] font-bold",
    },
    {
      type: "sparkle",
      emoji: "✨",
      label: "Enchantment",
      activeBorder: "border-[#20C879]/70",
      activeBg: "bg-[#0B3D28] text-[#20C879] font-bold",
    },
    {
      type: "laugh",
      emoji: "😂",
      label: "Jinx",
      activeBorder: "border-[#D5AE65]/70",
      activeBg: "bg-[#251b0a] text-[#F0D49A] font-bold",
    },
  ];

  return (
    <article
      className={cn(
        "owl-card-item group relative flex flex-col justify-between rounded-xl p-5 sm:p-6 transition-all duration-300",
        "bg-[#020806]/20 hover:bg-[#06140D]/30 border border-[#B58A45]/35 hover:border-[#20C879]/60",
        "shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_rgba(32,200,121,0.25)]",
        "backdrop-blur-[8px]"
      )}
    >
      {/* Corner Runes */}
      <span className="absolute top-2 left-2 text-[10px] text-[#20C879]/40 group-hover:text-[#20C879]/80 select-none transition-colors">⌜</span>
      <span className="absolute top-2 right-2 text-[10px] text-[#20C879]/40 group-hover:text-[#20C879]/80 select-none transition-colors">⌝</span>
      <span className="absolute bottom-2 left-2 text-[10px] text-[#B58A45]/40 group-hover:text-[#B58A45]/80 select-none transition-colors">⌞</span>
      <span className="absolute bottom-2 right-2 text-[10px] text-[#B58A45]/40 group-hover:text-[#B58A45]/80 select-none transition-colors">⌟</span>

      {/* Top Meta Bar */}
      <div className="flex items-start justify-between gap-3 mb-3 pb-2.5 border-b border-[#0B3D28]/40">
        <div className="flex items-center gap-2.5">
          {/* Wax Seal Badge with quill */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#782B25] border border-[#D5AE65]/70 text-xs shadow-[0_0_10px_rgba(120,43,37,0.4)] group-hover:rotate-6 transition-transform">
            🪶
          </div>

          <div className="flex flex-col text-left">
            <span className="font-cinzel text-xs sm:text-sm font-bold text-[#F0D49A] tracking-wide">
              {post.alias}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-[#AFC3CF] font-mono">
              <Clock className="w-3 h-3 text-[#16CFFF]" />
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right Badges & Report */}
        <div className="flex items-center gap-2">
          {/* Status badge for My Letters */}
          {post.isOwn && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold",
                post.status === "approved"
                  ? "bg-[#0B3D28] border border-[#20C879]/60 text-[#20C879]"
                  : "bg-[#251b0a] border border-[#B58A45]/60 text-[#F0D49A]"
              )}
            >
              {post.status === "approved" ? (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#20C879]" />
                  <span>Approved</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-2.5 h-2.5 text-[#D5AE65]" />
                  <span>Pending</span>
                </>
              )}
            </span>
          )}

          {/* Report Button (Solid & clearly clickable) */}
          <button
            type="button"
            onClick={() => onReport(post)}
            title="Report this scroll"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#06140D]/90 border border-[#B58A45]/35 text-[#AFC3CF] hover:text-rose-400 hover:border-rose-500/60 hover:bg-[#251010] transition-colors cursor-pointer shadow-sm"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Confession Content (Readable warm ivory text) */}
      <div className="my-2 text-left">
        <p className="font-cormorant text-base sm:text-lg text-[#E8D4A7] leading-relaxed whitespace-pre-wrap select-text">
          {post.content}
        </p>
      </div>

      {/* Bottom Reactions Bar */}
      <div className="mt-4 pt-3 border-t border-[#0B3D28]/40 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {reactionConfigs.map((config) => {
            const count = post.reactions[config.type] || 0;
            const isUserReacted = Boolean(post.userReactions?.[config.type]);
            const isAnimating = reactionAnim === config.type;

            return (
              <button
                key={config.type}
                type="button"
                onClick={() => handleReactionClick(config.type)}
                className={cn(
                  "group/reaction flex items-center gap-1.5 px-2.5 py-1.5 min-h-[38px] sm:min-h-[36px] rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer select-none",
                  isUserReacted
                    ? `${config.activeBg} ${config.activeBorder} border shadow-md`
                    : "bg-[#06140D]/90 border border-[#B58A45]/35 text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#0B3D28] hover:border-[#20C879]/60",
                  isAnimating && "scale-110"
                )}
                title={`${config.label} (${count})`}
              >
                <span className={cn("text-sm transition-transform duration-200 group-hover/reaction:scale-125")}>
                  {config.emoji}
                </span>
                <span className="font-semibold">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Lore watermark */}
        <span className="hidden sm:inline text-[10px] text-[#B58A45]/70 font-mono tracking-widest uppercase">
          Sealed Parchment
        </span>
      </div>
    </article>
  );
};
