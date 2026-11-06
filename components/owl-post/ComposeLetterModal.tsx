"use client";

import React, { useState } from "react";
import { OwlPostAlias, OWL_POST_ALIASES } from "@/types/owlPost";
import { Feather, X, Send, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComposeLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; alias: OwlPostAlias }) => Promise<{
    success: boolean;
    message: string;
  }>;
}

export const ComposeLetterModal: React.FC<ComposeLetterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [content, setContent] = useState("");
  const [selectedAlias, setSelectedAlias] = useState<OwlPostAlias>("Anonymous");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const charCount = content.length;
  const isOverLimit = charCount > 1000;
  const isValid = content.trim().length > 0 && !isOverLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    const result = await onSubmit({
      content: content.trim(),
      alias: selectedAlias,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmittedSuccess(true);
      setStatusMessage(result.message);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setContent("");
        setSelectedAlias("Anonymous");
        onClose();
      }, 1600);
    } else {
      setStatusMessage(result.message);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="compose-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#06140D] via-[#040E09] to-[#020806] border border-[#B58A45]/60 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Ornate Gold Corners */}
        <span className="absolute top-2 left-2 text-xs text-[#B58A45]/60 select-none">⌜</span>
        <span className="absolute top-2 right-2 text-xs text-[#B58A45]/60 select-none">⌝</span>
        <span className="absolute bottom-2 left-2 text-xs text-[#20C879]/50 select-none">⌞</span>
        <span className="absolute bottom-2 right-2 text-xs text-[#20C879]/50 select-none">⌟</span>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B3D28]/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#782B25] border border-[#D5AE65]/70 text-xs shadow-sm">
              🪶
            </div>
            <div>
              <h2
                id="compose-modal-title"
                className="font-cinzel text-base sm:text-lg font-bold text-[#F0D49A] tracking-wide"
              >
                Dispatch an Owl Letter
              </h2>
              <p className="text-[11px] font-cormorant italic text-[#AFC3CF]">
                Whispers carried through the emerald night skies
              </p>
            </div>
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

        {/* Status / Success Alert */}
        {statusMessage && (
          <div
            className={cn(
              "mb-4 p-3 rounded-xl border text-xs font-serif flex items-center gap-2",
              submittedSuccess
                ? "bg-[#092719] border-[#20C879]/60 text-[#20C879]"
                : "bg-[#251010] border-rose-500/60 text-rose-300"
            )}
          >
            {submittedSuccess ? (
              <Sparkles className="w-4 h-4 shrink-0 text-[#20C879] animate-spin" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identity / Alias Selection */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-cinzel text-[#D5AE65] font-semibold tracking-wider flex items-center gap-1.5">
              <span>Choose Anonymous Persona</span>
              <span className="text-[10px] font-mono text-[#8fa2ad] font-normal">
                (Real identity is never revealed)
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OWL_POST_ALIASES.map((alias) => (
                <button
                  key={alias}
                  type="button"
                  onClick={() => setSelectedAlias(alias)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-[11px] font-serif text-left truncate transition-all cursor-pointer",
                    selectedAlias === alias
                      ? "bg-[#0B3D28] border border-[#20C879]/70 text-[#20C879] font-bold shadow-sm"
                      : "bg-[#020806] border border-[#B58A45]/25 text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#06140D]"
                  )}
                >
                  {alias}
                </button>
              ))}
            </div>
          </div>

          {/* Parchment Message Area */}
          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="letter-content"
                className="font-cinzel text-[#D5AE65] font-semibold tracking-wider"
              >
                Parchment Inscription
              </label>
              <span
                className={cn(
                  "font-mono text-[11px]",
                  isOverLimit ? "text-rose-400 font-bold" : "text-[#8fa2ad]"
                )}
              >
                {charCount} / 1000
              </span>
            </div>

            <div className="relative rounded-xl bg-[#020806]/95 border border-[#B58A45]/35 p-3 focus-within:border-[#20C879]/70 focus-within:ring-1 focus-within:ring-[#20C879]/70 transition-all">
              <textarea
                id="letter-content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Scribe your secret, thought, or whispered confession here..."
                className="w-full bg-transparent text-[#E8D4A7] font-cormorant text-base sm:text-lg placeholder-[#526a77] outline-none resize-none leading-relaxed"
                maxLength={1100}
              />
            </div>
          </div>

          {/* Privacy Seal Notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#06140D] border border-[#0B3D28] text-[11px] text-[#AFC3CF] font-serif">
            <ShieldCheck className="w-4 h-4 text-[#20C879] shrink-0" />
            <span>
              Your letter will be reviewed by the Academy Wardens before it takes flight across the public skies.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-[#020806] border border-[#B58A45]/30 text-xs font-serif text-[#AFC3CF] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={cn(
                "group relative flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-serif font-bold tracking-wider transition-all cursor-pointer shadow-md",
                isValid && !isSubmitting
                  ? "bg-gradient-to-r from-[#0B3D28] to-[#087A48] hover:from-[#087A48] hover:to-[#20C879] border border-[#20C879]/70 text-[#F0D49A] hover:text-white shadow-[0_0_15px_rgba(32,200,121,0.3)] active:scale-95"
                  : "bg-[#06140D] border border-[#0B3D28] text-gray-500 cursor-not-allowed opacity-60"
              )}
            >
              <Feather className="w-3.5 h-3.5 text-[#20C879] group-hover:rotate-12 transition-transform" />
              <span>{isSubmitting ? "Dispatching..." : "Send With Owl"}</span>
              <Send className="w-3 h-3 text-[#20C879]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
