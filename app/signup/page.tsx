"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { animate } from "animejs";
import { ArrowLeft, UserPlus, Lock, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signup, loginWithGoogle, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      animate(".signup-card", {
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
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrors({});

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const res = await signup({ email: email.trim(), password });

      if (!res.success) {
        setErrors({ general: res.error || "Could not register account. Try again." });
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Account created! Directing to choose your username...");
      // Redirect to username onboarding
      setTimeout(() => {
        router.push("/onboarding/username");
      }, 600);
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
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
      console.error("Google sign-in error:", err);
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
          style={{ background: "radial-gradient(circle, #059669 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-10 right-[20%] w-[350px] h-[250px] rounded-full blur-[100px] opacity-15"
          style={{ background: "radial-gradient(circle, #E7C56D 0%, transparent 70%)" }}
        />
      </div>

      <main className="signup-card relative z-10 w-full max-w-md">
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
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#052822] border border-[#10b981]/50 text-[#10b981] shadow-[0_0_16px_rgba(16,185,129,0.3)] mb-3">
              <UserPlus className="w-6 h-6" />
            </div>

            <h1
              className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-b from-[#F6E6AE] via-[#E7C56D] to-[#9A6A1F]"
              style={{ fontFamily: 'var(--font-cinzel), "Cinzel Decorative", serif' }}
            >
              CREATE AN ACCOUNT
            </h1>
            <p className="font-cormorant italic text-sm text-[#AFC3CF] mt-1">
              Begin your scholarly journey in CampusHub
            </p>
          </div>

          {/* Error Banner */}
          {errors.general && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-xs font-serif animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs font-serif animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
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
                  placeholder="scholar@campus.edu"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full bg-[#020810]/90 border border-[#1b3b48] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-[#E2E8F0] placeholder-[#475569] outline-none transition-all"
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
              <label className="block text-xs font-cinzel tracking-wider text-[#D6D9D4] mb-1.5 text-left">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="At least 6 characters"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full bg-[#020810]/90 border border-[#1b3b48] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-[#E2E8F0] placeholder-[#475569] outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#64748b]" />
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 font-serif text-left mt-1 flex items-center gap-1">
                  <span>•</span> {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-cinzel tracking-wider text-[#D6D9D4] mb-1.5 text-left">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Re-enter your password"
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="w-full bg-[#020810]/90 border border-[#1b3b48] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-[#E2E8F0] placeholder-[#475569] outline-none transition-all"
                />
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#64748b]" />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400 font-serif text-left mt-1 flex items-center gap-1">
                  <span>•</span> {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="group relative flex items-center justify-center gap-2 w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] text-[#FFFFFF] font-cinzel font-bold text-xs sm:text-sm tracking-[0.18em] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_28px_rgba(16,185,129,0.55)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>CREATING ACCOUNT...</span>
                </>
              ) : (
                <span>CREATE ACCOUNT</span>
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

          {/* Footer Back to Login */}
          <div className="text-center mt-5 pt-4 border-t border-[#142834]/80">
            <p className="text-xs text-[#9BA9AF] font-serif">
              Already possess an account?{" "}
              <Link href="/login" className="text-[#E7C56D] hover:underline font-medium">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
