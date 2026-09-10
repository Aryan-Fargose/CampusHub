"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, Sparkles, Trophy, Clock, Footprints } from "lucide-react";
import { animate, stagger } from "animejs";

interface CreatureCard {
  id: number;
  creatureKey: string;
  name: string;
  symbol: string;
  lore: string;
  color: string;
}

const CREATURE_DECK: Omit<CreatureCard, "id">[] = [
  {
    creatureKey: "owl",
    name: "Midnight Owl",
    symbol: "🦉",
    lore: "Messenger of Arcane Letters",
    color: "#E7C56D",
  },
  {
    creatureKey: "fox",
    name: "Golden Fox",
    symbol: "🦊",
    lore: "Cunning Trickster of the Woods",
    color: "#f97316",
  },
  {
    creatureKey: "wolf",
    name: "Silver Wolf",
    symbol: "🐺",
    lore: "Loyal Guardian of the Pack",
    color: "#cbd5e1",
  },
  {
    creatureKey: "snake",
    name: "Emerald Serpent",
    symbol: "🐍",
    lore: "Ancient Whisperer of Serpents",
    color: "#34d399",
  },
  {
    creatureKey: "eagle",
    name: "Storm Eagle",
    symbol: "🦅",
    lore: "Soaring Mind of Wit",
    color: "#60a5fa",
  },
  {
    creatureKey: "stag",
    name: "Prongs Stag",
    symbol: "🦌",
    lore: "Noble Luminescent Patronus",
    color: "#48D1CC",
  },
  {
    creatureKey: "cat",
    name: "Mystic Familiar",
    symbol: "🐈",
    lore: "Prowler of Ancient Corridors",
    color: "#f472b6",
  },
  {
    creatureKey: "dragon",
    name: "Hungarian Dragon",
    symbol: "🐉",
    lore: "Fire-Breathing Titan",
    color: "#ef4444",
  },
];

const createShuffledDeck = (): CreatureCard[] => {
  const pairedDeck: CreatureCard[] = [];
  CREATURE_DECK.forEach((creature, idx) => {
    pairedDeck.push({ ...creature, id: idx * 2 });
    pairedDeck.push({ ...creature, id: idx * 2 + 1 });
  });

  for (let i = pairedDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairedDeck[i], pairedDeck[j]] = [pairedDeck[j], pairedDeck[i]];
  }
  return pairedDeck;
};

export const MatchCreaturesGame: React.FC = () => {
  const [cards, setCards] = useState<CreatureCard[]>(createShuffledDeck);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedKeys, setMatchedKeys] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and shuffle deck
  const initializeGame = useCallback(() => {
    setCards(createShuffledDeck());
    setFlippedIndices([]);
    setMatchedKeys([]);
    setMoves(0);
    setSecondsElapsed(0);
    setIsActive(false);
    setIsLocked(false);

    // Initial stagger reveal animation
    setTimeout(() => {
      try {
        animate(".card-block", {
          scale: [0.7, 1],
          opacity: [0, 1],
          delay: stagger(40),
          duration: 400,
          easing: "easeOutBack",
        });
      } catch {
        // Safe fallback
      }
    }, 50);
  }, []);

  // Game timer
  useEffect(() => {
    if (isActive && matchedKeys.length < CREATURE_DECK.length) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, matchedKeys.length]);

  const handleCardClick = (index: number) => {
    // Prevent clicking if locked, already flipped, or matched
    if (
      isLocked ||
      flippedIndices.includes(index) ||
      matchedKeys.includes(cards[index].creatureKey)
    ) {
      return;
    }

    if (!isActive) {
      setIsActive(true);
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // Animate card flip
    try {
      animate(`#card-inner-${index}`, {
        rotateY: ["0deg", "180deg"],
        duration: 350,
        easing: "easeOutQuad",
      });
    } catch {
      // Safe fallback
    }

    // Check match on second card
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsLocked(true);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.creatureKey === secondCard.creatureKey) {
        // Matched!
        setTimeout(() => {
          setMatchedKeys((prev) => [...prev, firstCard.creatureKey]);
          setFlippedIndices([]);
          setIsLocked(false);

          // Success spark animation
          try {
            animate([`#card-block-${firstIdx}`, `#card-block-${secondIdx}`], {
              scale: [1, 1.1, 1],
              duration: 450,
              easing: "easeOutElastic(1, .6)",
            });
          } catch {
            // Ignored
          }
        }, 400);
      } else {
        // Not matched: flip back after brief pause
        setTimeout(() => {
          try {
            animate([`#card-inner-${firstIdx}`, `#card-inner-${secondIdx}`], {
              rotateY: ["180deg", "0deg"],
              duration: 350,
              easing: "easeOutQuad",
            });
          } catch {
            // Ignored
          }

          setTimeout(() => {
            setFlippedIndices([]);
            setIsLocked(false);
          }, 300);
        }, 850);
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isCompleted = matchedKeys.length === CREATURE_DECK.length;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 bg-[#041520]/80 p-3.5 rounded-xl border border-[#48D1CC]/30 backdrop-blur-md">
        {/* Moves Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#020b12] border border-[#1b3a47]">
          <Footprints className="w-4 h-4 text-[#48D1CC]" />
          <span className="text-xs text-[#9BA9AF] font-serif">Moves:</span>
          <span className="font-mono font-bold text-sm text-[#f1ede4]">
            {moves}
          </span>
        </div>

        {/* Pairs Matched */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#020b12] border border-[#1b3a47]">
          <Sparkles className="w-4 h-4 text-[#E7C56D]" />
          <span className="text-xs text-[#9BA9AF] font-serif">Pairs:</span>
          <span className="font-mono font-bold text-sm text-[#E7C56D]">
            {matchedKeys.length} / {CREATURE_DECK.length}
          </span>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#020b12] border border-[#1b3a47]">
          <Clock className="w-4 h-4 text-[#34d399]" />
          <span className="text-xs text-[#9BA9AF] font-serif">Time:</span>
          <span className="font-mono font-bold text-sm text-[#34d399]">
            {formatTime(secondsElapsed)}
          </span>
        </div>

        {/* Restart Button */}
        <button
          type="button"
          onClick={initializeGame}
          title="Restart and Shuffle Deck"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071924] hover:bg-[#0f3248] border border-[#1b3a47] text-xs text-[#D6D9D4] hover:text-white transition-all shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#48D1CC]" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="w-full mb-6 p-4 rounded-xl bg-gradient-to-r from-[#06241b] via-[#0b3829] to-[#06241b] border-2 border-[#E7C56D] text-center shadow-[0_0_30px_rgba(231,197,109,0.35)] animate-in fade-in zoom-in-95 duration-400">
          <div className="flex items-center justify-center gap-2 text-[#E7C56D] font-cinzel font-bold text-lg mb-1">
            <Trophy className="w-5 h-5 animate-bounce" />
            <span>Master of Arcane Beasts!</span>
          </div>
          <p className="text-xs font-serif text-[#AFC3CF]">
            You uncovered all 8 creature pairs in{" "}
            <span className="text-[#f1ede4] font-bold font-mono">
              {formatTime(secondsElapsed)}
            </span>{" "}
            across{" "}
            <span className="text-[#f1ede4] font-bold font-mono">{moves}</span>{" "}
            moves!
          </p>
          <button
            type="button"
            onClick={initializeGame}
            className="mt-3 px-5 py-1.5 rounded-lg bg-gradient-to-r from-[#E7C56D] to-[#d4aa48] text-[#020509] font-cinzel font-bold text-xs hover:scale-105 transition-transform shadow-md"
          >
            Play Another Trial
          </button>
        </div>
      )}

      {/* 4x4 Grid of Magical Cards (16 total blocks) */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-[#061c27]/90 via-[#030e17]/90 to-[#01060a]/95 border-2 border-[#48D1CC]/40 shadow-[0_0_40px_rgba(4,21,32,0.9),0_0_20px_rgba(72,209,204,0.25)] backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 w-72 h-72 sm:w-96 sm:h-96">
          {cards.map((card, idx) => {
            const isFlipped =
              flippedIndices.includes(idx) ||
              matchedKeys.includes(card.creatureKey);
            const isMatched = matchedKeys.includes(card.creatureKey);

            return (
              <div
                key={card.id}
                id={`card-block-${idx}`}
                className="card-block relative w-full h-full cursor-pointer perspective-800 select-none"
                onClick={() => handleCardClick(idx)}
              >
                <div
                  id={`card-inner-${idx}`}
                  className="w-full h-full rounded-xl transition-transform duration-300 transform-style-3d relative"
                  style={{
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Card Back (Face Down) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl border border-[#48D1CC]/30 bg-gradient-to-br from-[#061924] via-[#04121a] to-[#02080d] flex flex-col items-center justify-center p-2 shadow-md backface-hidden hover:border-[#48D1CC] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full border border-[#48D1CC]/40 flex items-center justify-center bg-[#020b12]">
                      <span className="text-xs font-cinzel font-bold text-[#E7C56D]">
                        ✦
                      </span>
                    </div>
                    <span className="text-[9px] font-cinzel text-[#80949F] mt-1.5 uppercase tracking-wider">
                      Beast
                    </span>
                  </div>

                  {/* Card Front (Face Up) */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-xl border-2 flex flex-col items-center justify-center p-1.5 shadow-lg backface-hidden rotate-y-180 transition-all ${
                      isMatched
                        ? "border-[#E7C56D] bg-[#0c2419]/90 shadow-[0_0_15px_rgba(231,197,109,0.3)]"
                        : "border-[#48D1CC] bg-[#041520]/95 shadow-[0_0_15px_rgba(72,209,204,0.3)]"
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl filter drop-shadow-md">
                      {card.symbol}
                    </div>
                    <span
                      className="text-[10px] sm:text-[11px] font-cinzel font-bold text-center leading-tight mt-1 truncate max-w-full px-1"
                      style={{ color: card.color }}
                    >
                      {card.name.replace(/(Midnight|Golden|Silver|Emerald|Storm|Prongs|Mystic|Hungarian)\s*/, "")}
                    </span>
                    {isMatched && (
                      <span className="text-[8px] font-serif text-[#34d399] leading-none">
                        ✓ Match
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-xs font-serif text-[#80949F] text-center">
        Uncover two identical beast runes sequentially to bind their magical resonance.
      </p>
    </div>
  );
};
