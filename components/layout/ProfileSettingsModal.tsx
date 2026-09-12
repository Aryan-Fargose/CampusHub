"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  X,
  User,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Edit3,
} from "lucide-react";
import { animate } from "animejs";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, profile, changeUsername } = useAuth();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Entrance animation
  useEffect(() => {
    if (isOpen && modalRef.current) {
      try {
        animate(modalRef.current, {
          opacity: [0, 1],
          scale: [0.95, 1],
          duration: 250,
          ease: "outQuad",
        });
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
      setNewUsername("");
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  // Cooldown calculation based on server timestamp
  const cooldownInfo = useMemo(() => {
    const timestamp = user?.usernameChangedAt;
    if (!timestamp) {
      return {
        canChange: true,
        daysRemaining: 0,
        nextAllowedDate: null,
      };
    }

    const lastChanged = new Date(timestamp).getTime();
    if (isNaN(lastChanged)) {
      return {
        canChange: true,
        daysRemaining: 0,
        nextAllowedDate: null,
      };
    }

    const now = Date.now();
    const diff = now - lastChanged;

    if (diff >= SEVEN_DAYS_MS) {
      return {
        canChange: true,
        daysRemaining: 0,
        nextAllowedDate: null,
      };
    }

    const remainingMs = SEVEN_DAYS_MS - diff;
    const daysRemaining = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    const nextAllowedDate = new Date(lastChanged + SEVEN_DAYS_MS);

    return {
      canChange: false,
      daysRemaining,
      nextAllowedDate,
    };
  }, [user?.usernameChangedAt]);

  if (!isOpen) return null;

  const currentUsername = user?.username || profile?.displayName || "Scholar";
  const userHouse = user?.house || profile?.house || "Ravenclaw";
  const userEmail = user?.email || "";

  const handleStartEditing = () => {
    if (!cooldownInfo.canChange) return;
    setError(null);
    setSuccess(null);
    setNewUsername(currentUsername);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setNewUsername("");
    setError(null);
  };

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = newUsername.trim();

    if (!trimmed) {
      setError("Username cannot be empty.");
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

    if (trimmed.toLowerCase() === currentUsername.toLowerCase()) {
      setError("This is already your current scholar username.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await changeUsername(trimmed);

      if (!res.success) {
        setError(res.error || "Failed to change username.");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Your scholar username has been updated!");
      setIsEditing(false);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Error changing username:", err);
      setError("An unexpected error occurred while saving your username.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-2xl bg-[#040f19]/95 border border-[#1b3b48] p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-[#D6D9D4]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#9BA9AF] hover:text-[#F6E6AE] hover:bg-[#0c1f30] transition-colors cursor-pointer"
          aria-label="Close Profile Settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#142834]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081520] border border-[#E7C56D]/50 text-[#E7C56D] shadow-[0_0_15px_rgba(231,197,109,0.25)]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2
              className="font-cinzel text-lg sm:text-xl font-bold uppercase tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-b from-[#F6E6AE] via-[#E7C56D] to-[#9A6A1F]"
              style={{ fontFamily: 'var(--font-cinzel), "Cinzel Decorative", serif' }}
            >
              Scholar Profile
            </h2>
            <p className="font-cormorant italic text-xs text-[#9BA9AF]">
              Manage your academic credentials and scholar identity
            </p>
          </div>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-serif animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs font-serif animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Profile Details Grid */}
        <div className="space-y-4 text-xs font-serif">
          {/* Email and House row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#030910] border border-[#142834]">
              <span className="text-[10px] font-cinzel text-[#64748b] uppercase tracking-wider block mb-0.5">
                Campus Email
              </span>
              <span className="text-[#E2E8F0] truncate block">{userEmail || "guest@campushub.local"}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#030910] border border-[#142834]">
              <span className="text-[10px] font-cinzel text-[#64748b] uppercase tracking-wider block mb-0.5">
                House Affiliation
              </span>
              <span className="text-[#E7C56D] flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5" />
                {userHouse}
              </span>
            </div>
          </div>

          {/* Username Section */}
          <div className="p-4 rounded-xl bg-[#030910] border border-[#1b3b48]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-cinzel text-[#9BA9AF] uppercase tracking-wider">
                Scholar Username
              </span>

              {/* Cooldown Status Badge */}
              {cooldownInfo.canChange ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#10b981] font-serif">
                  <Sparkles className="w-3 h-3 text-[#10b981]" />
                  <span>You can change your username now.</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#E7C56D] font-serif">
                  <Clock className="w-3 h-3 text-[#E7C56D]" />
                  <span>
                    Username can be changed again in {cooldownInfo.daysRemaining}{" "}
                    {cooldownInfo.daysRemaining === 1 ? "day" : "days"}.
                  </span>
                </span>
              )}
            </div>

            {!isEditing ? (
              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <span className="font-cinzel text-base sm:text-lg font-bold text-[#F6E6AE] tracking-wide block">
                    {currentUsername}
                  </span>
                  <span className="text-[11px] text-[#64748b] font-cormorant italic">
                    Appears across CampusHub greeting, attendance, and social cards
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleStartEditing}
                  disabled={!cooldownInfo.canChange}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0c1f30] hover:bg-[#13304a] border border-[#1b3b48] hover:border-[#E7C56D]/60 text-[#D6D9D4] hover:text-[#F6E6AE] text-xs font-cinzel tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Change Username</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveUsername} className="space-y-3 pt-1">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => {
                        setNewUsername(e.target.value);
                        if (error) setError(null);
                      }}
                      maxLength={20}
                      placeholder="Enter new scholar name"
                      autoFocus
                      disabled={isSubmitting}
                      className="w-full bg-[#020509] border border-[#E7C56D]/60 focus:border-[#E7C56D] focus:ring-1 focus:ring-[#E7C56D] rounded-lg px-3 py-2 text-sm font-cinzel font-semibold text-[#F6E6AE] placeholder-[#475569] outline-none transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-[#64748b]">
                      {newUsername.length}/20
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 rounded-lg text-xs font-serif text-[#9BA9AF] hover:text-white hover:bg-[#0c1f30] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#E7C56D] via-[#deb655] to-[#c59a3f] text-[#07131e] font-cinzel font-bold text-xs tracking-wider shadow-[0_0_12px_rgba(231,197,109,0.35)] hover:shadow-[0_0_18px_rgba(231,197,109,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#07131e]" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Optional Change Guidance Notice */}
            <div className="mt-3 pt-2.5 border-t border-[#142834] text-[11px] text-[#64748b] leading-relaxed">
              <span className="text-[#AFC3CF] font-medium">Note: </span>
              Changing your username is completely optional. You may keep your current username indefinitely. If you choose to change it, a 7-day cooldown begins before you may change it again.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[#142834] flex items-center justify-between text-xs text-[#64748b] font-serif">
          <span>CampusHub Scholar Registry</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[#E7C56D] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
