"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserProfile } from "@/types";
import {
  Castle,
  BookOpen,
  Utensils,
  Mail,
  Gamepad2,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", href: "/", icon: Castle },
    { id: "attendance", label: "Attendance", href: "#attendance-preview", icon: BookOpen },
    { id: "canteen", label: "Canteen", href: "#canteen-preview", icon: Utensils },
    { id: "owl-post", label: "Owl Post", href: "#owlpost-preview", icon: Mail },
    { id: "common-room", label: "Common Room", href: "#commonroom-preview", icon: Gamepad2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/15 bg-[#040810]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Left: Campus Emblem & Title */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1 select-none"
        >
          {/* Ornate Gold Castle Crest Badge */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-[#1f1508] to-[#0a0703] border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:border-amber-400 transition-all">
            <span className="text-xl">🏰</span>
            <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-widest text-amber-100 uppercase group-hover:text-amber-200 transition-colors">
              CampusHub
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 font-mono">
              Your Magic. Your Campus.
            </span>
          </div>
        </Link>

        {/* Center: Floating Navigation Pill Bar */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-2 rounded-full bg-[#03060c]/85 border border-amber-500/20 px-3 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "group relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-serif transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 select-none",
                  isActive
                    ? "bg-gradient-to-r from-amber-950/60 to-amber-900/40 text-amber-200 font-semibold border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                    : "text-slate-300 hover:text-amber-100 hover:bg-slate-900/50"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    isActive
                      ? "text-amber-300 scale-110"
                      : "text-slate-400 group-hover:text-amber-300 group-hover:scale-110"
                  )}
                />
                <span>{item.label}</span>

                {/* Subtle active glowing indicator */}
                {isActive && (
                  <span className="h-1 w-1 rounded-full bg-amber-400 shadow-[0_0_6px_#fde047]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Dynamic User Profile Crest & Close Icon */}
        <div className="flex items-center gap-3">
          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-2.5 rounded-full bg-[#050912]/90 border border-amber-500/30 px-3 py-1.5 shadow-sm hover:border-amber-400/60 transition-colors cursor-pointer select-none">
            {/* Ornate Gold Circular Portrait */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-amber-900/50 to-amber-950 border border-amber-400/60 text-amber-300 text-xs font-serif shadow-sm">
              🦅
            </div>

            {/* User Name & House */}
            <div className="flex flex-col text-left">
              <span className="font-serif text-xs font-bold text-amber-100">
                {user.fullName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-none">
                {user.house}
              </span>
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              aria-label="Toggle mobile menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#050a12]/95 px-4 py-4 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-sm font-serif">
              🦅
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-amber-100">
                {user.fullName}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {user.house} &bull; {user.campusName}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-serif transition-colors",
                    isActive
                      ? "bg-amber-950/60 text-amber-200 border border-amber-500/40"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4 text-amber-400" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
