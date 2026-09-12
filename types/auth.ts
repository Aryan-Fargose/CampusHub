/**
 * CampusHub - Authentication & User Types
 * Structured for Supabase Auth & public.profiles migration.
 */

export interface AuthUser {
  id: string;
  email: string;
  username: string | null;
  isGuest: boolean;
  role: "student" | "prefect" | "scholar" | "guest";
  house: string;
  createdAt: string;
  provider: "email" | "google" | "guest";
  avatarUrl?: string;
}

export interface AuthSession {
  token: string;
  expiresAt: number;
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  needsUsernameSetup: boolean;
}

export interface SupabaseProfileRow {
  id: string;
  username: string | null;
  house?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignUpCredentials {
  email: string;
  password?: string;
  confirmPassword?: string;
}
