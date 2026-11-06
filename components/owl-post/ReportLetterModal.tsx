"use client";

import React, { useState } from "react";
import {
  PublicOwlPost,
  OwlReportReason,
  OWL_REPORT_REASONS,
} from "@/types/owlPost";
import { Flag, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReportLetterModalProps {
  post: PublicOwlPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    postId: string;
    reason: OwlReportReason;
  }) => Promise<{ success: boolean; message: string }>;
}

export const ReportLetterModal: React.FC<ReportLetterModalProps> = ({
  post,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState<OwlReportReason>(
    "Harassment or bullying"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen || !post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    const res = await onSubmit({
      postId: post.id,
      reason: selectedReason,
    });

    setIsSubmitting(false);
    setFeedback(res);

    if (res.success) {
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1800);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#06140D] via-[#040E09] to-[#020806] border border-rose-900/50 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B3D28]">
          <div className="flex items-center gap-2 text-rose-400">
            <Flag className="w-4 h-4 text-rose-400" />
            <h2
              id="report-modal-title"
              className="font-cinzel text-sm sm:text-base font-bold text-[#F0D49A] tracking-wide"
            >
              Report Parchment Scroll
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#020806] border border-[#B58A45]/30 text-[#AFC3CF] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {feedback?.success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#20C879] mx-auto" />
            <h3 className="font-cinzel text-base font-bold text-[#20C879]">
              Report Logged With Wardens
            </h3>
            <p className="text-xs font-serif text-[#AFC3CF]">
              {feedback.message}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {feedback && !feedback.success && (
              <div className="p-3 rounded-xl bg-[#251010] border border-rose-500/50 text-rose-300 text-xs font-serif flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Target Snippet */}
            <div className="p-3 rounded-xl bg-[#020806] border border-[#B58A45]/20 text-xs font-serif text-[#E8D4A7] italic max-h-24 overflow-y-auto">
              &ldquo;{post.content}&rdquo;
            </div>

            {/* Reason Radio Group */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-cinzel text-[#D5AE65] font-semibold tracking-wider">
                Select Reason for Wardens
              </label>

              <div className="space-y-1.5">
                {OWL_REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={cn(
                      "flex items-center gap-2.5 p-2 rounded-lg text-xs font-serif transition-colors cursor-pointer border",
                      selectedReason === reason
                        ? "bg-[#251010] border-rose-500/60 text-rose-200"
                        : "bg-[#020806] border-[#B58A45]/20 text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#06140D]"
                    )}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="accent-rose-500 text-rose-500 focus:ring-rose-500 h-3.5 w-3.5"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <p className="text-[11px] font-serif text-[#8fa2ad]">
              Confidential report. Your name is never exposed to the author of the scroll.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#0B3D28]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 rounded-xl bg-[#020806] border border-[#B58A45]/30 text-xs font-serif text-[#AFC3CF] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-500 text-rose-200 text-xs font-serif font-bold transition-all cursor-pointer shadow-md"
              >
                {isSubmitting ? "Filing Report..." : "Submit to Wardens"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
