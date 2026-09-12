"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { animate, stagger } from "animejs";
import { Compass, LogIn, UserPlus, Sparkles } from "lucide-react";

export default function AuthGatewayPage() {
  const router = useRouter();
  const { continueAsGuest, isAuthenticated, isGuest } = useAuth();
  const [isContinuingGuest, setIsContinuingGuest] = useState(false);

  // If already authenticated with username or guest, allow entrance to home
  useEffect(() => {
    if (isAuthenticated || isGuest) {
      router.push("/");
    }
  }, [isAuthenticated, isGuest, router]);

  // Entrance animations with anime.js
  useEffect(() => {
    try {
      animate(".auth-portal-crest", {
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 800,
        ease: "outBack",
      });

      animate(".auth-portal-title", {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 700,
        delay: 150,
        ease: "outQuad",
      });

      animate(".auth-portal-panel", {
        opacity: [0, 1],
        translateY: [25, 0],
        duration: 700,
        delay: 250,
        ease: "outQuad",
      });

      animate(".auth-portal-btn", {
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 500,
        delay: stagger(90, { start: 350 }),
        ease: "outQuad",
      });
    } catch {
      // Fallback
    }
  }, []);

  const handleGuestEntry = async () => {
    try {
      setIsContinuingGuest(true);
      await continueAsGuest();
      router.push("/");
    } catch (err) {
      console.error("Failed to continue as guest:", err);
      setIsContinuingGuest(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#020509] overflow-hidden select-none">
      {/* Background Lighting Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[110px] opacity-25"
          style={{ background: "radial-gradient(circle, #E7C56D 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 left-[15%] w-[450px] h-[320px] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, #059669 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-[15%] w-[450px] h-[320px] rounded-full blur-[120px] opacity-15"
          style={{ background: "radial-gradient(circle, #48D1CC 0%, transparent 70%)" }}
        />
      </div>

      <main className="relative z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* Ornate Gold Castle Shield Emblem */}
        <div className="auth-portal-crest relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-b from-[#2a1e0c] via-[#150f06] to-[#0a0703] border-2 border-[#E7C56D]/80 text-[#E7C56D] shadow-[0_0_28px_rgba(231,197,109,0.35)] mb-5">
          <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10 fill-current text-[#E7C56D]">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full bg-[#48D1CC] animate-pulse shadow-[0_0_10px_#48D1CC]" />
        </div>

        {/* Headings */}
        <div className="auth-portal-title space-y-1.5 mb-8">
          <h1
            className="font-cinzel text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-b from-[#F6E6AE] via-[#E7C56D] to-[#9A6A1F] drop-shadow-[0_4px_24px_rgba(231,197,109,0.4)]"
            style={{ fontFamily: 'var(--font-cinzel), "Cinzel Decorative", serif' }}
          >
            CAMPUSHUB
          </h1>

          {/* Glowing Star Ray Line */}
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#48D1CC]/70" />
            <span className="text-[#48D1CC] text-xs drop-shadow-[0_0_8px_#48D1CC] animate-[starTwinkle_3s_ease-in-out_infinite]">
              ✦
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#48D1CC]/70" />
          </div>

          <p className="font-cormorant italic text-base sm:text-lg text-[#AFC3CF] tracking-wide">
            Your college. Your community. Your space.
          </p>
        </div>

        {/* Translucent Arcane Action Panel */}
        <div className="auth-portal-panel w-full bg-[#040f19]/85 border border-[#1b3b48]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_16px_45px_rgba(0,0,0,0.85)] flex flex-col gap-4">
          {/* Button 1: LOG IN */}
          <Link
            href="/login"
            className="auth-portal-btn group relative flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E7C56D] via-[#deb655] to-[#c59a3f] text-[#07131e] font-cinzel font-bold text-xs sm:text-sm tracking-[0.18em] shadow-[0_0_20px_rgba(231,197,109,0.35)] hover:shadow-[0_0_28px_rgba(231,197,109,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
          >
            <LogIn className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>LOG IN</span>
          </Link>

          {/* Button 2: SIGN UP */}
          <Link
            href="/signup"
            className="auth-portal-btn group relative flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-[#052822]/90 hover:bg-[#07362d] border border-[#10b981]/60 hover:border-[#10b981] text-[#A7F3D0] hover:text-[#ECFDF5] font-cinzel font-bold text-xs sm:text-sm tracking-[0.18em] shadow-[0_0_18px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>SIGN UP</span>
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="h-[1px] flex-1 bg-[#152e3b]/80" />
            <span className="text-[10px] tracking-widest text-[#64748b] font-serif uppercase">or</span>
            <div className="h-[1px] flex-1 bg-[#152e3b]/80" />
          </div>

          {/* Button 3: CONTINUE AS GUEST */}
          <button
            type="button"
            onClick={handleGuestEntry}
            disabled={isContinuingGuest}
            className="auth-portal-btn group flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-[#081520]/75 hover:bg-[#0d2233] border border-[#1c3848]/70 hover:border-[#48D1CC]/70 text-[#9BA9AF] hover:text-[#E2E8F0] font-cinzel font-medium text-xs tracking-[0.15em] hover:shadow-[0_0_16px_rgba(72,209,204,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#48D1CC] transition-transform group-hover:rotate-45 duration-300" />
            <span>{isContinuingGuest ? "Entering Gates..." : "CONTINUE AS GUEST"}</span>
          </button>
        </div>

        {/* Footer Lore */}
        <p className="font-cormorant italic text-xs text-[#64748b] mt-6 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#E7C56D]/70" />
          <span>Enter the sanctuary of collegiate wisdom &amp; camaraderie</span>
        </p>
      </main>
    </div>
  );
}
