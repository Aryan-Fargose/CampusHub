"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { RotateCcw, Bot, User, Sparkles, Trophy } from "lucide-react";
import { animate } from "animejs";

type CellValue = "X" | "O" | null;
type GameMode = "pvp" | "ai";
type AiDifficulty = "easy" | "medium" | "hard";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

function checkBoardWinner(currentBoard: CellValue[]) {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (
      currentBoard[a] &&
      currentBoard[a] === currentBoard[b] &&
      currentBoard[a] === currentBoard[c]
    ) {
      return { winner: currentBoard[a], line: combination };
    }
  }
  if (currentBoard.every((cell) => cell !== null)) {
    return { winner: "draw" as const, line: null };
  }
  return null;
}

function evaluateMinimax(
  tempBoard: CellValue[],
  depth: number,
  isMaximizing: boolean
): { score: number; move?: number } {
  const result = checkBoardWinner(tempBoard);
  if (result) {
    if (result.winner === "O") return { score: 10 - depth }; // AI is O
    if (result.winner === "X") return { score: depth - 10 }; // Player is X
    return { score: 0 };
  }

  const availableMoves: number[] = [];
  tempBoard.forEach((cell, idx) => {
    if (cell === null) availableMoves.push(idx);
  });

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];
    for (const move of availableMoves) {
      tempBoard[move] = "O";
      const evaluation = evaluateMinimax(tempBoard, depth + 1, false);
      tempBoard[move] = null;
      if (evaluation.score > bestScore) {
        bestScore = evaluation.score;
        bestMove = move;
      }
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = availableMoves[0];
    for (const move of availableMoves) {
      tempBoard[move] = "X";
      const evaluation = evaluateMinimax(tempBoard, depth + 1, true);
      tempBoard[move] = null;
      if (evaluation.score < bestScore) {
        bestScore = evaluation.score;
        bestMove = move;
      }
    }
    return { score: bestScore, move: bestMove };
  }
}

export const XandOGame: React.FC = () => {
  const [, startTransition] = useTransition();
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<GameMode>("ai");
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>("hard");
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Scores tracking
  const [scores, setScores] = useState({
    playerX: 0,
    playerO: 0,
    draws: 0,
  });

  // Make Move logic defined before effects
  const makeMove = useCallback(
    (index: number, player: "X" | "O") => {
      setBoard((prevBoard) => {
        if (prevBoard[index] !== null) return prevBoard;
        const newBoard = [...prevBoard];
        newBoard[index] = player;

        try {
          animate(`#rune-cell-${index}`, {
            scale: [0.6, 1.15, 1],
            opacity: [0, 1],
            duration: 350,
            easing: "easeOutBack",
          });
        } catch {
          // Ignored
        }

        const gameResult = checkBoardWinner(newBoard);
        if (gameResult) {
          setWinner(gameResult.winner);
          setWinningLine(gameResult.line);
          if (gameResult.winner === "X") {
            setScores((prev) => ({ ...prev, playerX: prev.playerX + 1 }));
          } else if (gameResult.winner === "O") {
            setScores((prev) => ({ ...prev, playerO: prev.playerO + 1 }));
          } else if (gameResult.winner === "draw") {
            setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
          }
        } else {
          setIsXNext(player === "O");
        }
        return newBoard;
      });
    },
    []
  );

  // Trigger Anime.js winning-cells effect
  useEffect(() => {
    if (winningLine && winningLine.length > 0) {
      try {
        animate(".winning-cell", {
          scale: [1, 1.1, 1.05],
          backgroundColor: [
            "rgba(72, 209, 204, 0.2)",
            "rgba(231, 197, 109, 0.35)",
            "rgba(72, 209, 204, 0.25)",
          ],
          duration: 900,
          loop: true,
          easing: "easeInOutQuad",
        });
      } catch {
        // Fallback gracefully
      }
    }
  }, [winningLine]);

  // AI Move Handler
  useEffect(() => {
    if (gameMode !== "ai" || isXNext || winner) return;

    const availableMoves: number[] = [];
    board.forEach((cell, idx) => {
      if (cell === null) availableMoves.push(idx);
    });

    if (availableMoves.length === 0) return;

    const thinkingTimer = setTimeout(() => {
      setIsAiThinking(true);
    }, 40);

    const timer = setTimeout(() => {
      let chosenMove: number;

      if (aiDifficulty === "easy") {
        chosenMove =
          availableMoves[Math.floor(Math.random() * availableMoves.length)];
      } else if (aiDifficulty === "medium") {
        if (Math.random() > 0.45) {
          const result = evaluateMinimax([...board], 0, true);
          chosenMove = result.move ?? availableMoves[0];
        } else {
          chosenMove =
            availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
      } else {
        const result = evaluateMinimax([...board], 0, true);
        chosenMove = result.move ?? availableMoves[0];
      }

      makeMove(chosenMove, "O");
      setIsAiThinking(false);
    }, 450);

    return () => {
      clearTimeout(thinkingTimer);
      clearTimeout(timer);
    };
  }, [isXNext, gameMode, winner, board, aiDifficulty, makeMove]);

  const handleCellClick = (index: number) => {
    if (winner || board[index] !== null) return;
    if (gameMode === "ai" && (!isXNext || isAiThinking)) return;
    makeMove(index, isXNext ? "X" : "O");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
    setIsAiThinking(false);
  };

  const resetScores = () => {
    resetGame();
    setScores({ playerX: 0, playerO: 0, draws: 0 });
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Game Header Controls & Modes */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#041520]/80 p-3.5 rounded-xl border border-[#48D1CC]/30 backdrop-blur-md">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#020b12] p-1 rounded-lg border border-[#1b3a47]">
          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                setGameMode("ai");
                resetGame();
              });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif transition-all ${
              gameMode === "ai"
                ? "bg-[#48D1CC]/20 text-[#48D1CC] border border-[#48D1CC]/50 shadow-[0_0_10px_rgba(72,209,204,0.3)]"
                : "text-[#9BA9AF] hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>vs AI</span>
          </button>
          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                setGameMode("pvp");
                resetGame();
              });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif transition-all ${
              gameMode === "pvp"
                ? "bg-[#E7C56D]/20 text-[#E7C56D] border border-[#E7C56D]/50 shadow-[0_0_10px_rgba(231,197,109,0.3)]"
                : "text-[#9BA9AF] hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>2 Players</span>
          </button>
        </div>

        {/* AI Difficulty Selector (if in AI mode) */}
        {gameMode === "ai" && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[#AFC3CF] text-[11px] mr-1">Spell Tier:</span>
            {(["easy", "medium", "hard"] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setAiDifficulty(tier);
                    resetGame();
                  });
                }}
                className={`px-2 py-1 rounded text-[10px] font-cinzel uppercase tracking-wider transition-all ${
                  aiDifficulty === tier
                    ? "bg-[#0c2e36] text-[#48D1CC] border border-[#48D1CC]/60 font-bold"
                    : "text-[#80949F] hover:text-[#D6D9D4]"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        )}

        {/* Reset Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetGame}
            title="Replay Current Match"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#071924] hover:bg-[#0f3248] border border-[#1b3a47] text-[11px] text-[#D6D9D4] hover:text-white transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#48D1CC]" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Scoreboard Panel */}
      <div className="w-full grid grid-cols-3 gap-3 mb-6">
        <div
          className={`p-3 rounded-xl border text-center transition-all ${
            isXNext && !winner
              ? "bg-[#051d24]/90 border-[#48D1CC] shadow-[0_0_15px_rgba(72,209,204,0.35)] scale-[1.02]"
              : "bg-[#030e16]/80 border-[#152e3b]"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#48D1CC] font-cinzel font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{gameMode === "ai" ? "You (X)" : "Player 1 (X)"}</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#f1ede4] mt-1">
            {scores.playerX}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-[#152e3b] bg-[#030e16]/80 text-center">
          <div className="text-xs text-[#AFC3CF] font-cinzel font-semibold">
            Draws
          </div>
          <div className="text-2xl font-bold font-mono text-[#D6D9D4] mt-1">
            {scores.draws}
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border text-center transition-all ${
            !isXNext && !winner
              ? "bg-[#1f1707]/90 border-[#E7C56D] shadow-[0_0_15px_rgba(231,197,109,0.35)] scale-[1.02]"
              : "bg-[#030e16]/80 border-[#152e3b]"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#E7C56D] font-cinzel font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{gameMode === "ai" ? "Arcane AI (O)" : "Player 2 (O)"}</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#f1ede4] mt-1">
            {scores.playerO}
          </div>
        </div>
      </div>

      {/* Live Turn & Status Plaque */}
      <div className="mb-6 h-9 flex items-center justify-center">
        {winner ? (
          <div className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#051f1c] border border-[#48D1CC] text-sm font-cinzel font-bold text-[#E7C56D] shadow-[0_0_20px_rgba(72,209,204,0.4)] animate-in fade-in zoom-in-95 duration-300">
            {winner === "draw" ? (
              <span>⚖ Stalemate! The duel is drawn.</span>
            ) : winner === "X" ? (
              <span>✨ {gameMode === "ai" ? "Victory is yours!" : "Player 1 Wins the Duel!"}</span>
            ) : (
              <span>⚡ {gameMode === "ai" ? "The Arcane AI Triumphed!" : "Player 2 Wins the Duel!"}</span>
            )}
          </div>
        ) : isAiThinking ? (
          <div className="flex items-center gap-2 text-xs font-serif text-[#48D1CC] animate-pulse">
            <Bot className="w-4 h-4 animate-spin" />
            <span>Arcane Intelligence is calculating leylines...</span>
          </div>
        ) : (
          <div className="text-xs font-serif text-[#AFC3CF]">
            Current Turn:{" "}
            <span
              className={`font-bold font-cinzel ${
                isXNext ? "text-[#48D1CC]" : "text-[#E7C56D]"
              }`}
            >
              {isXNext
                ? gameMode === "ai"
                  ? "Your Cast (X)"
                  : "Player 1 (X)"
                : gameMode === "ai"
                ? "AI Thinking..."
                : "Player 2 (O)"}
            </span>
          </div>
        )}
      </div>

      {/* The 3x3 Enchanted Grid */}
      <div className="relative p-4 rounded-2xl bg-gradient-to-b from-[#061c27]/90 via-[#030e17]/90 to-[#01060a]/95 border-2 border-[#48D1CC]/40 shadow-[0_0_40px_rgba(4,21,32,0.9),0_0_20px_rgba(72,209,204,0.25)] backdrop-blur-xl">
        {/* Ornate corner accents */}
        <span className="absolute top-2 left-2 text-xs text-[#E7C56D]/60 select-none">
          ✦
        </span>
        <span className="absolute top-2 right-2 text-xs text-[#E7C56D]/60 select-none">
          ✦
        </span>
        <span className="absolute bottom-2 left-2 text-xs text-[#E7C56D]/60 select-none">
          ✦
        </span>
        <span className="absolute bottom-2 right-2 text-xs text-[#E7C56D]/60 select-none">
          ✦
        </span>

        <div className="grid grid-cols-3 gap-3 w-72 h-72 sm:w-84 sm:h-84">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine?.includes(idx);
            return (
              <button
                key={idx}
                id={`cell-${idx}`}
                type="button"
                onClick={() => handleCellClick(idx)}
                disabled={cell !== null || !!winner || (gameMode === "ai" && !isXNext)}
                className={`relative rounded-xl border flex items-center justify-center text-4xl sm:text-5xl font-cinzel font-bold transition-all duration-200 cursor-pointer select-none ${
                  isWinningCell
                    ? "winning-cell border-[#E7C56D] text-[#E7C56D] shadow-[0_0_20px_rgba(231,197,109,0.5)] z-10"
                    : cell === null
                    ? "bg-[#03131c]/60 hover:bg-[#072433]/80 border-[#1c4152]/60 hover:border-[#48D1CC]/70 hover:scale-[1.03]"
                    : "bg-[#03131c]/90 border-[#1c4152]"
                } ${
                  cell === "X"
                    ? "text-[#48D1CC] drop-shadow-[0_0_12px_rgba(72,209,204,0.7)]"
                    : cell === "O"
                    ? "text-[#E7C56D] drop-shadow-[0_0_12px_rgba(231,197,109,0.7)]"
                    : ""
                }`}
              >
                {cell && (
                  <span id={`rune-cell-${idx}`} className="will-change-transform">
                    {cell === "X" ? "✕" : "◯"}
                  </span>
                )}
                {!cell && !winner && (
                  <span className="opacity-0 hover:opacity-20 text-xs font-serif text-[#48D1CC] transition-opacity">
                    {isXNext ? "✕" : "◯"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Game Reset Button */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={resetScores}
          className="text-xs text-[#80949F] hover:text-[#D6D9D4] underline underline-offset-4 decoration-[#1b3a47] transition-colors"
        >
          Reset All Scores
        </button>
      </div>
    </div>
  );
};
