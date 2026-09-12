"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { animate } from "animejs";
import { Sparkles, ArrowRight, AlertCircle, Loader2, Feather } from "lucide-react";

export default function UsernameOnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isGuest, setUsername } = useAuth();

  const [usernameInput, setUsernameInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessExiting, setIsSuccessExiting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isGuest && user === null) {
      const timer = setTimeout(() => {
        if (!isAuthenticated && !isGuest) {
          router.push("/auth");
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isGuest, user, router]);

  useEffect(() => {
    try {
      animate(".onboarding-crest", {
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 700,
        ease: "outBack",
      });

      animate(".onboarding-card", {
        opacity: [0, 1],
        translateY: [25, 0],
        duration: 650,
        delay: 150,
        ease: "outQuad",
      });
    } catch {
      // Fallback
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = usernameInput.trim();

    if (!trimmed) {
      setError("Please choose a username to continue.");
      return;
    }

    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters long.");
      return;
    }

    if (trimmed.length > 20) {
      setError("Username cannot exceed 20 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9_\- ]+$/.test(trimmed)) {
      setError("Only letters, numbers, spaces, underscores, and hyphens are permitted.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await setUsername(trimmed);

      if (!res.success) {
        setError(res.error || "Unable to save username.");
        setIsSubmitting(false);
        return;
      }

      setIsSuccessExiting(true);

      // Smooth Anime.js exit transition into CampusHub homepage
      try {
        animate(".onboarding-card", {
          opacity: [1, 0],
          scale: [1, 0.96],
          translateY: [0, -20],
          duration: 400,
          ease: "inQuad",
        });
      } catch {
        // Fallback
      }

      setTimeout(() => {
        router.push("/");
      }, 350);
    } catch (err) {
      console.error("Failed to update username:", err);
      setError("An unexpected error occurred while saving your username.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#020509] overflow-hidden select-none">
      {/* Background Magical Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[380px] rounded-full blur-[130px] opacity-25"
          style={{ background: "radial-gradient(circle, #E7C56D 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-12 left-1/4 w-[400px] h-[300px] rounded-full blur-[110px] opacity-15"
          style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)" }}
        />
      </div>

      <main className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* Enchanted Feather Quill Emblem */}
        <div className="onboarding-crest relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-[#2a1e0c] via-[#150f06] to-[#0a0703] border-2 border-[#E7C56D]/80 text-[#E7C56D] shadow-[0_0_24px_rgba(231,197,109,0.35)] mb-5">
          <Feather className="w-7 h-7 sm:w-8 sm:h-8 text-[#E7C56D]" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#48D1CC] animate-pulse shadow-[0_0_8px_#48D1CC]" />
        </div>

        {/* Card */}
        <div className="onboarding-card w-full bg-[#040f19]/90 border border-[#1b3b48]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_16px_50px_rgba(0,0,0,0.85)]">
          <h1
            className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-[#F6E6AE] via-[#E7C56D] to-[#9A6A1F]"
            style={{ fontFamily: 'var(--font-cinzel), "Cinzel Decorative", serif' }}
          >
            WHAT SHOULD WE CALL YOU?
          </h1>

          <p className="font-cormorant italic text-sm sm:text-base text-[#AFC3CF] mt-2 mb-6">
            This name will appear around your CampusHub.
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-xs font-serif animate-in fade-in duration-200 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Aryan"
                  maxLength={24}
                  autoFocus
                  disabled={isSubmitting || isSuccessExiting}
                  className="w-full bg-[#020810]/95 border-2 border-[#E7C56D]/60 focus:border-[#E7C56D] focus:ring-2 focus:ring-[#E7C56D]/30 rounded-xl px-4 py-3 text-center text-lg sm:text-xl font-cinzel font-semibold text-[#F6E6AE] placeholder-[#475569] outline-none shadow-[0_0_15px_rgba(231,197,109,0.15)] transition-all tracking-wide"
                />
              </div>
              <p className="text-[11px] text-[#64748b] font-serif mt-2">
                e.g. Aryan, Rahul, Hermione, Scholar
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSuccessExiting}
              className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E7C56D] via-[#deb655] to-[#c59a3f] text-[#07131e] font-cinzel font-bold text-xs sm:text-sm tracking-[0.2em] shadow-[0_0_22px_rgba(231,197,109,0.35)] hover:shadow-[0_0_30px_rgba(231,197,109,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting || isSuccessExiting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#07131e]" />
                  <span>PREPARING SANCTUARY...</span>
                </>
              ) : (
                <>
                  <span>ENTER CAMPUSHUB</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-3 border-t border-[#142834]/80 flex items-center justify-center gap-1.5 text-[11px] text-[#64748b] font-serif">
            <Sparkles className="w-3 h-3 text-[#48D1CC]" />
            <span>You can modify your scholar title later in profile settings</span>
          </div>
        </div>
      </main>
    </div>
  );
}
