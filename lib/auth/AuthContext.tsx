"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { AuthUser, LoginCredentials, SignUpCredentials } from "@/types/auth";
import { UserProfile } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  needsUsernameSetup: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; needsUsername?: boolean }>;
  signup: (credentials: SignUpCredentials) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: () => Promise<void>;
  setUsername: (username: string) => Promise<{ success: boolean; error?: string }>;
  changeUsername: (username: string) => Promise<{ success: boolean; error?: string; usernameChangedAt?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_STORAGE_SESSION = "campushub_auth_session_v1";
const LOCAL_STORAGE_USERS = "campushub_auth_users_v1";

function mapAuthUserToUserProfile(authUser: AuthUser): UserProfile {
  if (authUser.isGuest) {
    return {
      id: authUser.id,
      displayName: "Guest",
      fullName: "Guest Explorer",
      house: "Campus Visitor",
      campusName: "CampusHub (Guest Mode)",
      academicYear: "Visitor Access",
      role: "student",
      avatarUrl: undefined,
      usernameChangedAt: null,
    };
  }

  const name = authUser.username || authUser.email.split("@")[0] || "Scholar";
  return {
    id: authUser.id,
    displayName: name,
    fullName: name,
    house: authUser.house || "Ravenclaw",
    campusName: "DJSCE",
    academicYear: "Sophomore • Computer Engineering",
    role: authUser.role === "guest" ? "student" : authUser.role,
    avatarUrl: authUser.avatarUrl,
    usernameChangedAt: authUser.usernameChangedAt,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = useMemo(() => createClient(), []);

  const isSupabaseConfigured = useMemo(() => {
    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "";
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_KEY ||
      "";
    return Boolean(
      url &&
        url.trim() &&
        !url.includes("placeholder") &&
        key &&
        key.trim() &&
        !key.includes("placeholder")
    );
  }, []);

  // Hydrate auth session on mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        // 1. Check guest cookie
        if (typeof document !== "undefined" && document.cookie.includes("campushub_guest=true")) {
          const guestUser: AuthUser = {
            id: "guest_session",
            email: "guest@campushub.local",
            username: "Guest",
            isGuest: true,
            role: "guest",
            house: "Campus Visitor",
            createdAt: new Date().toISOString(),
            provider: "guest",
          };
          if (isMounted) {
            setUser(guestUser);
            setIsLoading(false);
          }
          return;
        }

        // 2. If Supabase is configured, check Supabase auth
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Load profile from Supabase profiles table
            let username: string | null = null;
            let usernameChangedAt: string | null = null;
            let house = "Ravenclaw";

            try {
              const { data: profile } = await supabase
                .from("profiles")
                .select("username, username_changed_at, house")
                .eq("id", session.user.id)
                .single();

              if (profile) {
                if (profile.username) username = profile.username;
                if (profile.username_changed_at) usernameChangedAt = profile.username_changed_at;
                if (profile.house) house = profile.house;
              }
            } catch {
              // Profiles table might not exist yet
            }

            // Fallback to Supabase auth user metadata
            if (!username && session.user.user_metadata?.username) {
              username = session.user.user_metadata.username;
            }
            if (!usernameChangedAt && session.user.user_metadata?.username_changed_at) {
              usernameChangedAt = session.user.user_metadata.username_changed_at;
            }

            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || "scholar@campus.edu",
              username,
              isGuest: false,
              role: "student",
              house,
              createdAt: session.user.created_at || new Date().toISOString(),
              provider: session.user.app_metadata?.provider === "google" ? "google" : "email",
              avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              usernameChangedAt,
            };

            if (isMounted) {
              setUser(authUser);
              setIsLoading(false);
            }
            return;
          }
        }

        // 3. Fallback: check localStorage session
        const rawLocal = localStorage.getItem(LOCAL_STORAGE_SESSION);
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          if (parsed?.user) {
            if (isMounted) {
              setUser(parsed.user);
              setIsLoading(false);
            }
            return;
          }
        }

        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth hydration error:", err);
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    }

    initSession();

    let authSubscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          let username: string | null = null;
          let usernameChangedAt: string | null = null;
          let house = "Ravenclaw";

          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, username_changed_at, house")
              .eq("id", session.user.id)
              .single();

            if (profile) {
              if (profile.username) username = profile.username;
              if (profile.username_changed_at) usernameChangedAt = profile.username_changed_at;
              if (profile.house) house = profile.house;
            }
          } catch {
            // Profiles table fallback
          }

          if (!username && session.user.user_metadata?.username) {
            username = session.user.user_metadata.username;
          }
          if (!usernameChangedAt && session.user.user_metadata?.username_changed_at) {
            usernameChangedAt = session.user.user_metadata.username_changed_at;
          }

          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || "scholar@campus.edu",
            username,
            isGuest: false,
            role: "student",
            house,
            createdAt: session.user.created_at || new Date().toISOString(),
            provider: session.user.app_metadata?.provider === "google" ? "google" : "email",
            avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
            usernameChangedAt,
          };

          setUser(authUser);
          setIsLoading(false);
          if (typeof document !== "undefined") {
            document.cookie = "campushub_auth=true; path=/; max-age=604800";
            document.cookie = "campushub_guest=; path=/; max-age=0";
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setIsLoading(false);
        }
      });
      authSubscription = data.subscription;
    }

    return () => {
      isMounted = false;
      authSubscription?.unsubscribe();
    };
  }, [supabase, isSupabaseConfigured]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const cleanEmail = credentials.email.trim().toLowerCase();

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: credentials.password || "",
        });

        if (error || !data.user) {
          return { success: false, error: error?.message || "Invalid credentials." };
        }

        let username: string | null = null;
        let usernameChangedAt: string | null = null;
        let house = "Ravenclaw";
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, username_changed_at, house")
            .eq("id", data.user.id)
            .single();

          if (profile) {
            if (profile.username) username = profile.username;
            if (profile.username_changed_at) usernameChangedAt = profile.username_changed_at;
            if (profile.house) house = profile.house;
          }
        } catch {
          // profiles table fallback
        }

        if (!username && data.user.user_metadata?.username) {
          username = data.user.user_metadata.username;
        }
        if (!usernameChangedAt && data.user.user_metadata?.username_changed_at) {
          usernameChangedAt = data.user.user_metadata.username_changed_at;
        }

        const authUser: AuthUser = {
          id: data.user.id,
          email: cleanEmail,
          username,
          isGuest: false,
          role: "student",
          house,
          createdAt: data.user.created_at || new Date().toISOString(),
          provider: "email",
          usernameChangedAt,
        };

        setUser(authUser);
        localStorage.setItem(LOCAL_STORAGE_SESSION, JSON.stringify({ user: authUser }));
        // Clear guest cookie
        document.cookie = "campushub_guest=; path=/; max-age=0";
        document.cookie = "campushub_auth=true; path=/; max-age=604800";
        return { success: true, needsUsername: !username };
      }

      // Local storage fallback when Supabase keys are not yet entered
      const rawAccounts = localStorage.getItem(LOCAL_STORAGE_USERS);
      const accounts = rawAccounts ? JSON.parse(rawAccounts) : [
        {
          id: "usr_aryan_01",
          email: "aryan@campushub.edu",
          passwordHash: btoa("password123"),
          user: {
            id: "usr_aryan_01",
            email: "aryan@campushub.edu",
            username: "Aryan",
            isGuest: false,
            role: "scholar",
            house: "Ravenclaw",
            createdAt: new Date().toISOString(),
            provider: "email",
          },
        },
      ];

      const found = accounts.find(
        (a: { email: string; passwordHash: string }) =>
          a.email.toLowerCase() === cleanEmail && a.passwordHash === btoa(credentials.password || "")
      );

      if (!found) {
        return { success: false, error: "Invalid email or password." };
      }

      setUser(found.user);
      localStorage.setItem(LOCAL_STORAGE_SESSION, JSON.stringify({ user: found.user }));
      document.cookie = "campushub_guest=; path=/; max-age=0";
      // Set auth indicator cookie for middleware
      document.cookie = `campushub_auth=true; path=/; max-age=604800`;
      return { success: true, needsUsername: !found.user.username };
    },
    [supabase, isSupabaseConfigured]
  );

  const signup = useCallback(
    async (credentials: SignUpCredentials) => {
      const cleanEmail = credentials.email.trim().toLowerCase();

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: credentials.password || "",
        });

        if (error || !data.user) {
          return { success: false, error: error?.message || "Sign up failed." };
        }

        const authUser: AuthUser = {
          id: data.user.id,
          email: cleanEmail,
          username: null,
          isGuest: false,
          role: "student",
          house: "Ravenclaw",
          createdAt: new Date().toISOString(),
          provider: "email",
        };

        setUser(authUser);
        document.cookie = "campushub_guest=; path=/; max-age=0";
        return { success: true };
      }

      // Local storage fallback
      const rawAccounts = localStorage.getItem(LOCAL_STORAGE_USERS);
      const accounts = rawAccounts ? JSON.parse(rawAccounts) : [];

      if (accounts.some((a: { email: string }) => a.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: "An account with this email already exists." };
      }

      const userId = "usr_" + Math.random().toString(36).substring(2, 9);
      const newUser: AuthUser = {
        id: userId,
        email: cleanEmail,
        username: null,
        isGuest: false,
        role: "student",
        house: "Ravenclaw",
        createdAt: new Date().toISOString(),
        provider: "email",
      };

      accounts.push({
        id: userId,
        email: cleanEmail,
        passwordHash: btoa(credentials.password || ""),
        user: newUser,
      });

      localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(accounts));
      localStorage.setItem(LOCAL_STORAGE_SESSION, JSON.stringify({ user: newUser }));
      document.cookie = "campushub_guest=; path=/; max-age=0";
      document.cookie = `campushub_auth=true; path=/; max-age=604800`;

      setUser(newUser);
      return { success: true };
    },
    [supabase, isSupabaseConfigured]
  );

  const continueAsGuest = useCallback(async () => {
    const guestUser: AuthUser = {
      id: "guest_" + Date.now(),
      email: "guest@campushub.local",
      username: "Guest",
      isGuest: true,
      role: "guest",
      house: "Campus Visitor",
      createdAt: new Date().toISOString(),
      provider: "guest",
    };

    // Set cookie for Next.js App Router middleware
    if (typeof document !== "undefined") {
      document.cookie = "campushub_guest=true; path=/; max-age=604800"; // 7 days
    }

    localStorage.setItem(LOCAL_STORAGE_SESSION, JSON.stringify({ user: guestUser }));
    setUser(guestUser);
  }, []);

  const setUsername = useCallback(
    async (username: string) => {
      if (!user) {
        return { success: false, error: "No active session." };
      }

      const cleanUsername = username.trim();

      // If Supabase is configured, save to both user_metadata and public.profiles table
      if (isSupabaseConfigured && !user.isGuest) {
        // 1. Dual-persistence: Update Supabase auth user metadata directly with auth.uid()
        try {
          const { error: metaError } = await supabase.auth.updateUser({
            data: {
              username: cleanUsername,
              // First username creation during onboarding does NOT count as a change and does not start cooldown
              username_changed_at: null,
            },
          });
          if (metaError) {
            console.warn("Could not update auth user metadata:", metaError.message);
          }
        } catch (err) {
          console.warn("Error updating auth user metadata:", err);
        }

        // 2. Dual-persistence: Upsert to profiles table if present
        try {
          const { error } = await supabase.from("profiles").upsert({
            id: user.id,
            username: cleanUsername,
            username_changed_at: null,
            house: user.house || "Ravenclaw",
            updated_at: new Date().toISOString(),
          });

          if (error) {
            console.warn("Could not save to Supabase profiles table directly:", error.message);
          }
        } catch (err) {
          console.warn("Supabase profiles table upsert error:", err);
        }
      }

      // Update in local accounts if present
      const rawAccounts = localStorage.getItem(LOCAL_STORAGE_USERS);
      if (rawAccounts) {
        const accounts = JSON.parse(rawAccounts);
        const idx = accounts.findIndex((a: { id: string }) => a.id === user.id);
        if (idx !== -1) {
          accounts[idx].user.username = cleanUsername;
          accounts[idx].user.usernameChangedAt = null;
          localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(accounts));
        }
      }

      const updatedUser: AuthUser = {
        ...user,
        username: cleanUsername,
        usernameChangedAt: null,
      };

      localStorage.setItem(LOCAL_STORAGE_SESSION, JSON.stringify({ user: updatedUser }));
      setUser(updatedUser);
      return { success: true };
    },
    [user, supabase, isSupabaseConfigured]
  );

  const changeUsername = useCallback(
    async (newUsername: string) => {
      if (!user) {
        return { success: false, error: "No active session." };
      }

      const trimmed = newUsername.trim();

      if (user.isGuest) {
        const updatedUser: AuthUser = {
          ...user,
          username: trimmed,
        };
        setUser(updatedUser);
        return { success: true };
      }

      try {
        const res = await fetch("/api/profile/username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: trimmed }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          return {
            success: false,
            error: data.error || "Unable to change username.",
          };
        }

        const updatedUser: AuthUser = {
          ...user,
          username: data.username,
          usernameChangedAt: data.username_changed_at,
        };

        setUser(updatedUser);
        localStorage.setItem(LOCAL_STORAGE_SESSION, JSON.stringify({ user: updatedUser }));
        return {
          success: true,
          usernameChangedAt: data.username_changed_at,
        };
      } catch (err) {
        console.error("Change username network error:", err);
        return {
          success: false,
          error: "An unexpected network error occurred.",
        };
      }
    },
    [user]
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.url && typeof window !== "undefined") {
        window.location.href = data.url;
      }

      return { success: true };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to initiate Google sign-in.";
      return {
        success: false,
        error: message,
      };
    }
  }, [supabase]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    if (typeof document !== "undefined") {
      document.cookie = "campushub_guest=; path=/; max-age=0";
      document.cookie = "campushub_auth=; path=/; max-age=0";
      document.cookie = "sb-access-token=; path=/; max-age=0";
    }
    localStorage.removeItem(LOCAL_STORAGE_SESSION);
    setUser(null);
  }, [supabase, isSupabaseConfigured]);

  const isAuthenticated = useMemo(() => Boolean(user && !user.isGuest), [user]);
  const isGuest = useMemo(() => Boolean(user && user.isGuest), [user]);
  const needsUsernameSetup = useMemo(() => Boolean(user && !user.isGuest && !user.username), [user]);
  const profile = useMemo(() => (user ? mapAuthUserToUserProfile(user) : null), [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated,
      isGuest,
      isLoading,
      needsUsernameSetup,
      login,
      signup,
      loginWithGoogle,
      continueAsGuest,
      setUsername,
      changeUsername,
      logout,
    }),
    [
      user,
      profile,
      isAuthenticated,
      isGuest,
      isLoading,
      needsUsernameSetup,
      login,
      signup,
      loginWithGoogle,
      continueAsGuest,
      setUsername,
      changeUsername,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
