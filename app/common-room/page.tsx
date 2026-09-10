"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CommonRoomScene } from "@/components/common-room/CommonRoomScene";
import { GameModal } from "@/components/common-room/GameModal";
import { mockCurrentUser } from "@/lib/mockData";
import { GameStationConfig } from "@/lib/gamesConfig";

export default function CommonRoomPage() {
  const [currentUser] = useState(mockCurrentUser);
  const [selectedGame, setSelectedGame] = useState<GameStationConfig | null>(
    null
  );

  return (
    <div className="relative min-h-screen bg-[#020509] text-[#f1ede4] overflow-x-hidden">
      {/* 1. Sticky Navigation Header */}
      <Header user={currentUser} />

      {/* 2. Interactive 3D Common Room Exploratory Scene */}
      <CommonRoomScene
        onSelectGame={(game) => {
          setSelectedGame(game);
        }}
      />

      {/* 3. Game Modal & Cinematic Overlay */}
      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </div>
  );
}
