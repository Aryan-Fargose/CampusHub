"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { animate } from "animejs";
import {
  ArrowLeft,
  LogIn,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  HelpCircle,
  X,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        setErrors((prev) => ({
          ...prev,
          general:
            err === "oauth"
              ? "Google authentication failed. Please try again."
              : decodeURIComponent(err),
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.username) {
        router.push("/");
      } else {
        router.push("/onboarding/username");
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    try {
      animate(".login-card", {
        opacity: [0, 1],
        translateY: [25, 0],
        duration: 650,
        ease: "outQuad",
      });
    } catch {
      // Fallback
    }
  }, []);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      newErrors.email = "Campus email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = "Please enter a valid email format.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const res = await login({ email: email.trim(), password });

      if (!res.success) {
        setErrors({ general: res.error || "Invalid credentials." });
        setIsSubmitting(false);
        return;
      }

      if (res.needsUsername) {
        router.push("/onboarding/username");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ general: "An unexpected error occurred during login." });
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrors({});
    setIsGoogleSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setErrors({ general: res.error || "Failed to initiate Google sign-in." });
        setIsGoogleSubmitting(false);
      }
    } catch (err) {
      console.error("Google login error:", err);
      setErrors({ general: "An unexpected error occurred during Google sign-in." });
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#020509] overflow-hidden select-none">
      {/* Background Lighting Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, #E7C56D 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-10 right-[20%] w-[350px] h-[250px] rounded-full blur-[100px] opacity-15"
          style={{ background: "radial-gradient(circle, #48D1CC 0%, transparent 70%)" }}
        />
      </div>

      <main className="login-card relative z-10 w-full max-w-md">
        {/* Back Link to Gateway */}
        <div className="mb-4">
          <Link
            href="/auth"
            className="inline-flex items-center gap-1.5 text-xs font-serif text-[#9BA9AF] hover:text-[#E7C56D] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Gateway</span>
          </Link>
        </div>

        {/* Card Container */}
        <div className="w-full bg-[#040f19]/90 border border-[#1b3b48]/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_16px_50px_rgba(0,0,0,0.85)]">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2a1e0c] border border-[#E7C56D]/60 text-[#E7C56D] shadow-[0_0_16px_rgba(231,197,109,0.3)] mb-3">
              <LogIn className="w-6 h-6" />
            </div>

            <h1
              className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-b from-[#F6E6AE] via-[#E7C56D] to-[#9A6A1F]"
              style={{ fontFamily: 'var(--font-cinzel), "Cinzel Decorative", serif' }}
            >
              STUDENT LOGIN
            </h1>
            <p className="font-cormorant italic text-sm text-[#AFC3CF] mt-1">
              Welcome back to your collegiate sanctuary
            </p>
          </div>

          {/* General Error Banner */}
          {errors.general && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-xs font-serif animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-cinzel tracking-wider text-[#D6D9D4] mb-1.5 text-left">
                CAMPUS EMAIL
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="e.g. aryan@campushub.edu"
                  disabled={isSubmitting}
                  className="w-full bg-[#020810]/90 border border-[#1b3b48] focus:border-[#E7C56D] focus:ring-1 focus:ring-[#E7C56D] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-[#E2E8F0] placeholder-[#475569] outline-none transition-all"
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#64748b]" />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-400 font-serif text-left mt-1 flex items-center gap-1">
                  <span>•</span> {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-cinzel tracking-wider text-[#D6D9D4]">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-serif text-[#E7C56D] hover:underline focus:outline-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  className="w-full bg-[#020810]/90 border border-[#1b3b48] focus:border-[#E7C56D] focus:ring-1 focus:ring-[#E7C56D] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-[#E2E8F0] placeholder-[#475569] outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#64748b]" />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 font-serif text-left mt-1 flex items-center gap-1">
                  <span>•</span> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="group relative flex items-center justify-center gap-2 w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#E7C56D] via-[#deb655] to-[#c59a3f] text-[#07131e] font-cinzel font-bold text-xs sm:text-sm tracking-[0.18em] shadow-[0_0_20px_rgba(231,197,109,0.35)] hover:shadow-[0_0_28px_rgba(231,197,109,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#07131e]" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <span>LOG IN</span>
              )}
            </button>
          </form>

          {/* Google OAuth Section */}
          <div className="mt-4">
            <div className="relative flex items-center justify-center mb-3.5">
              <div className="border-t border-[#142834] w-full" />
              <span className="bg-[#040f19] px-3 text-[10px] font-serif text-[#64748b] uppercase tracking-widest absolute">
                or
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting || isGoogleSubmitting}
              className="group relative flex items-center justify-center gap-2.5 w-full py-3 px-6 rounded-xl bg-[#081520]/80 hover:bg-[#0c1f30] border border-[#1b3b48] hover:border-[#E7C56D]/60 text-[#D6D9D4] hover:text-[#F6E6AE] font-cinzel font-semibold text-xs sm:text-sm tracking-[0.16em] shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(231,197,109,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGoogleSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E7C56D]" />
                  <span>CONNECTING TO GOOGLE...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>CONTINUE WITH GOOGLE</span>
                </>
              )}
            </button>
          </div>

          {/* Footer Back to Sign Up */}
          <div className="text-center mt-5 pt-4 border-t border-[#142834]/80">
            <p className="text-xs text-[#9BA9AF] font-serif">
              New to CampusHub?{" "}
              <Link href="/signup" className="text-[#10b981] hover:underline font-medium">
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Helper Callout */}
        <div className="mt-4 p-3 rounded-xl bg-[#030b14]/70 border border-[#142834] text-center">
          <p className="text-[11px] text-[#64748b] font-serif">
            <Sparkles className="w-3 h-3 inline text-[#E7C56D] mr-1" />
            Quick demo credentials: <code className="text-[#9BA9AF]">aryan@campushub.edu</code> /{" "}
            <code className="text-[#9BA9AF]">password123</code>
          </p>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#040f19] border border-[#E7C56D]/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(231,197,109,0.25)] text-center">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-[#64748b] hover:text-[#E2E8F0] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-10 w-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#2a1e0c] border border-[#E7C56D]/60 text-[#E7C56D]">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="font-cinzel text-base font-bold text-[#F6E6AE] mb-2">
              PASSWORD RECOVERY
            </h3>

            <p className="font-cormorant text-xs text-[#AFC3CF] leading-relaxed mb-4">
              Password recovery dispatch is staged for your college mail server. If you have forgotten your credentials, please sign up with a new email address or use the demo credentials provided below.
            </p>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 px-4 rounded-xl bg-[#081520] hover:bg-[#0c1f30] border border-[#1b3b48] text-xs font-cinzel text-[#E7C56D] tracking-wider transition-colors cursor-pointer"
            >
              UNDERSTOOD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
