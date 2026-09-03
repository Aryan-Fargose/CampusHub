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
  ChevronDown,
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
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-2.5 select-none bg-gradient-to-b from-[#020509]/90 via-[#020509]/60 to-transparent backdrop-blur-sm border-b border-[#142834]/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left: CampusHub Logo with Gold Shield Crest */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none"
        >
          {/* Ornate Gold Castle Shield Emblem */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-[#2a1e0c] via-[#150f06] to-[#0a0703] border border-[#E7C56D]/70 text-[#E7C56D] shadow-[0_0_12px_rgba(231,197,109,0.3)] group-hover:border-[#F6E6AE] group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(231,197,109,0.5)] transition-all duration-200">
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current text-[#E7C56D]">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
            </svg>
            <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-[#48D1CC] animate-pulse shadow-[0_0_6px_#48D1CC]" />
          </div>

          <div className="flex flex-col">
            <span className="font-cinzel text-base sm:text-lg font-bold tracking-[0.2em] text-[#D6D9D4] group-hover:text-[#F6E6AE] transition-colors drop-shadow-sm">
              CAMPUSHUB
            </span>
            <span className="text-[9px] tracking-[0.18em] text-[#9BA9AF] font-serif uppercase">
              Your Magic. Your Campus.
            </span>
          </div>
        </Link>

        {/* Center: Minimalist Nav Items with Active Cyan Indicator */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8"
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
                  "group relative flex items-center gap-1.5 py-1 text-xs font-serif tracking-wide transition-all duration-200 focus:outline-none select-none",
                  isActive
                    ? "text-[#48D1CC] font-medium drop-shadow-[0_0_8px_rgba(72,209,204,0.4)]"
                    : "text-[#AFC3CF] hover:text-[#D6D9D4]"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    isActive
                      ? "text-[#48D1CC] scale-105 drop-shadow-[0_0_6px_#48D1CC]"
                      : "text-[#9BA9AF] group-hover:text-[#AFC3CF]"
                  )}
                />
                <span>{item.label}</span>

                {/* Glowing Cyan Diamond Dot below Active Home */}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] text-[#48D1CC] drop-shadow-[0_0_6px_#48D1CC]">
                    ✦
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Aryan F. Ravenclaw Profile Badge with Caret */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 cursor-pointer group">
            {/* Ornate Circular Ravenclaw Shield Portrait */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#14233c] to-[#08101d] border border-[#E7C56D]/70 text-[#93c5fd] shadow-[0_0_10px_rgba(231,197,109,0.25)] group-hover:border-[#F6E6AE] transition-all">
              <span className="text-xs">🦅</span>
            </div>

            {/* Name & House */}
            <div className="flex flex-col text-left">
              <span className="font-cinzel text-xs font-bold text-[#D6D9D4] group-hover:text-[#F6E6AE] transition-colors">
                {user.displayName} F.
              </span>
              <span className="text-[10px] text-[#9BA9AF] font-cormorant italic leading-none">
                {user.house}
              </span>
            </div>

            {/* Downward Chevron */}
            <ChevronDown className="h-3 w-3 text-[#9BA9AF] group-hover:text-[#D6D9D4] transition-colors" />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#07131e] border border-[#1b3b48] text-slate-300 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2.5 pt-2.5 border-t border-[#142834] bg-[#030810]/95 rounded-xl p-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 pb-2 mb-2 border-b border-[#142834]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#14233c] border border-amber-500/50 text-amber-300 text-xs">
              🦅
            </div>
            <div>
              <p className="font-cinzel text-xs font-bold text-[#D6D9D4]">{user.displayName} F.</p>
              <p className="text-[10px] text-[#9BA9AF] font-cormorant italic">{user.house} &bull; CampusHub</p>
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
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-serif transition-colors",
                    isActive
                      ? "bg-[#0c2432] text-[#48D1CC] border border-[#48D1CC]/40"
                      : "text-[#AFC3CF] hover:bg-slate-900"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 text-[#48D1CC]" />
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
