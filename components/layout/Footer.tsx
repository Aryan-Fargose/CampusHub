import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#090d13] py-8 text-center text-xs text-slate-500">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-amber-500/80">✨</span>
          <span>CampusHub &mdash; Magical-Academia Student Companion</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Clean Foundation Setup</span>
          <span>&bull;</span>
          <span>Zero Paid APIs</span>
        </div>
      </div>
    </footer>
  );
};
