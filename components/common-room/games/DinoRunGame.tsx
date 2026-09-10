"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, Clock, Trophy, Flame, Zap } from "lucide-react";

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "root" | "rune_stone" | "wraith";
  passed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export const DinoRunGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game states
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">(
    "idle"
  );
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem("campushub_forestrun_highscore");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const saved = localStorage.getItem("campushub_forestrun_besttime");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // References for live game loop
  const requestRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Gameplay variables
  const playerRef = useRef({
    x: 50,
    y: 190,
    width: 24,
    height: 38,
    vy: 0,
    isGrounded: true,
    jumpPower: -11.5,
    gravity: 0.6,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const gameSpeedRef = useRef<number>(5.5);
  const distanceRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const groundY = 220;

  // Timer logic
  useEffect(() => {
    if (gameState === "playing") {
      timerIntervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState]);

  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setSecondsElapsed(0);
    gameSpeedRef.current = 5.5;
    distanceRef.current = 0;
    obstaclesRef.current = [];
    particlesRef.current = [];
    playerRef.current.y = groundY - playerRef.current.height;
    playerRef.current.vy = 0;
    playerRef.current.isGrounded = true;
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Jump trigger
  const handleJump = useCallback(() => {
    if (gameState === "idle") {
      startGame();
      return;
    }
    if (gameState === "gameover") {
      restartGame();
      return;
    }
    const player = playerRef.current;
    if (player.isGrounded) {
      player.vy = player.jumpPower;
      player.isGrounded = false;

      // Spawn magical wand sparks
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push({
          x: player.x + player.width / 2,
          y: player.y + player.height,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * -3,
          color: Math.random() > 0.5 ? "#48D1CC" : "#E7C56D",
          size: Math.random() * 3 + 1,
          alpha: 1,
        });
      }
    }
  }, [gameState, startGame, restartGame]);

  // Global keydown handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleJump]);

  // Main 60fps Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (time: number) => {
      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const player = playerRef.current;
      const obstacles = obstaclesRef.current;
      const particles = particlesRef.current;

      // 1. Draw Deep Forest Parallax Night Sky
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, "#01070d");
      bgGrad.addColorStop(0.6, "#031522");
      bgGrad.addColorStop(1, "#01080d");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glowing Crescent Moon & Stars
      ctx.fillStyle = "rgba(231, 197, 109, 0.15)";
      ctx.beginPath();
      ctx.arc(580, 50, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#E7C56D";
      ctx.beginPath();
      ctx.arc(580, 50, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#020f1a";
      ctx.beginPath();
      ctx.arc(572, 45, 20, 0, Math.PI * 2);
      ctx.fill();

      // Distant Silhouetted Gothic Trees
      ctx.fillStyle = "#020c15";
      for (let i = 0; i < 9; i++) {
        const treeX =
          ((i * 90 - (distanceRef.current * 0.25)) % (canvas.width + 120)) - 40;
        ctx.beginPath();
        ctx.moveTo(treeX, groundY);
        ctx.lineTo(treeX + 16, groundY - 70);
        ctx.lineTo(treeX + 32, groundY);
        ctx.fill();
      }

      // 2. Draw Enchanted Forest Ground Path
      ctx.strokeStyle = "#48D1CC";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(72, 209, 204, 0.4)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Earth below ground
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height);
      groundGrad.addColorStop(0, "#03111b");
      groundGrad.addColorStop(1, "#01050a");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

      // Ground runes drifting left
      ctx.fillStyle = "rgba(72, 209, 204, 0.3)";
      for (let i = 0; i < 14; i++) {
        const runeX =
          ((i * 55 - (distanceRef.current % 55)) % canvas.width);
        ctx.fillRect(runeX, groundY + 4, 18, 2);
      }

      // 3. Gameplay Updates (if running)
      if (gameState === "playing") {
        distanceRef.current += gameSpeedRef.current;
        setScore((prev) => prev + 1);

        // Gently scale speed over distance
        gameSpeedRef.current = 5.5 + Math.min(distanceRef.current / 3000, 4.5);

        // Player Gravity & Jump Physics
        player.y += player.vy;
        player.vy += player.gravity;

        if (player.y >= groundY - player.height) {
          player.y = groundY - player.height;
          player.vy = 0;
          player.isGrounded = true;
        }

        // Running Trail Particles
        if (player.isGrounded && Math.random() > 0.4) {
          particles.push({
            x: player.x + 4,
            y: groundY - 2,
            vx: -gameSpeedRef.current * 0.4,
            vy: (Math.random() - 0.5) * 1.5,
            color: "rgba(72, 209, 204, 0.6)",
            size: Math.random() * 2 + 1,
            alpha: 0.8,
          });
        }

        // Spawn Obstacles
        spawnTimerRef.current += 1;
        if (spawnTimerRef.current > 75 + Math.random() * 45) {
          spawnTimerRef.current = 0;
          const typeRoll = Math.random();

          if (typeRoll < 0.45) {
            // Enchanted Thorny Root
            obstacles.push({
              x: canvas.width + 20,
              y: groundY - 28,
              width: 18,
              height: 28,
              type: "root",
              passed: false,
            });
          } else if (typeRoll < 0.75) {
            // Ancient Runestone
            obstacles.push({
              x: canvas.width + 20,
              y: groundY - 36,
              width: 24,
              height: 36,
              type: "rune_stone",
              passed: false,
            });
          } else {
            // Floating Shadow Wraith
            obstacles.push({
              x: canvas.width + 20,
              y: groundY - 56,
              width: 26,
              height: 24,
              type: "wraith",
              passed: false,
            });
          }
        }

        // Move Obstacles & Collision Check
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obs = obstacles[i];
          obs.x -= gameSpeedRef.current;

          // Collision Detection (AABB with inner hitbox tolerance)
          const tolerance = 4;
          const playerHitbox = {
            left: player.x + tolerance,
            right: player.x + player.width - tolerance,
            top: player.y + tolerance,
            bottom: player.y + player.height - tolerance,
          };
          const obsHitbox = {
            left: obs.x + tolerance,
            right: obs.x + obs.width - tolerance,
            top: obs.y + tolerance,
            bottom: obs.y + obs.height - tolerance,
          };

          if (
            playerHitbox.right > obsHitbox.left &&
            playerHitbox.left < obsHitbox.right &&
            playerHitbox.bottom > obsHitbox.top &&
            playerHitbox.top < obsHitbox.bottom
          ) {
            // GAME OVER!
            setGameState("gameover");

            // Check high scores
            setScore((finalScore) => {
              if (finalScore > highScore) {
                setHighScore(finalScore);
                try {
                  localStorage.setItem(
                    "campushub_forestrun_highscore",
                    finalScore.toString()
                  );
                } catch {
                  // Safe fallback
                }
              }
              return finalScore;
            });

            setSecondsElapsed((finalSeconds) => {
              if (finalSeconds > bestTime) {
                setBestTime(finalSeconds);
                try {
                  localStorage.setItem(
                    "campushub_forestrun_besttime",
                    finalSeconds.toString()
                  );
                } catch {
                  // Safe fallback
                }
              }
              return finalSeconds;
            });

            // Burst particles on impact
            for (let p = 0; p < 24; p++) {
              particles.push({
                x: player.x + player.width / 2,
                y: player.y + player.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: Math.random() > 0.5 ? "#ef4444" : "#E7C56D",
                size: Math.random() * 4 + 2,
                alpha: 1,
              });
            }
          }

          // Off-screen removal
          if (obs.x + obs.width < -30) {
            obstacles.splice(i, 1);
          }
        }
      }

      // 4. Draw Obstacles
      obstacles.forEach((obs) => {
        if (obs.type === "root") {
          // Twisted Thorn Root
          ctx.fillStyle = "#1e3a2b";
          ctx.strokeStyle = "#34d399";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(obs.x, groundY);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, groundY);
          ctx.fill();
          ctx.stroke();

          // Thorn spike
          ctx.strokeStyle = "#48D1CC";
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width / 2 - 4, obs.y + 8);
          ctx.stroke();
        } else if (obs.type === "rune_stone") {
          // Standing Monolith Runestone
          const runeGrad = ctx.createLinearGradient(
            obs.x,
            obs.y,
            obs.x + obs.width,
            obs.y + obs.height
          );
          runeGrad.addColorStop(0, "#1f2a33");
          runeGrad.addColorStop(1, "#0d1419");
          ctx.fillStyle = runeGrad;
          ctx.strokeStyle = "#E7C56D";
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 4);
          ctx.fill();
          ctx.stroke();

          // Glowing ancient glyph
          ctx.fillStyle = "#E7C56D";
          ctx.font = "12px serif";
          ctx.fillText("ᚱ", obs.x + 6, obs.y + 22);
        } else {
          // Flying Shadow Wraith
          ctx.fillStyle = "rgba(72, 209, 204, 0.25)";
          ctx.beginPath();
          ctx.arc(
            obs.x + obs.width / 2,
            obs.y + obs.height / 2,
            obs.width / 2 + 4,
            0,
            Math.PI * 2
          );
          ctx.fill();

          ctx.fillStyle = "#0c1f26";
          ctx.strokeStyle = "#48D1CC";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.height / 2);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height / 2);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Wraith eye
          ctx.fillStyle = "#48D1CC";
          ctx.beginPath();
          ctx.arc(obs.x + 10, obs.y + obs.height / 2, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 5. Draw Running Magical Student / Wizard Character
      // Cloak & Body
      const wizardX = player.x;
      const wizardY = player.y;

      // Wand light aura
      ctx.fillStyle = "rgba(72, 209, 204, 0.2)";
      ctx.beginPath();
      ctx.arc(wizardX + player.width + 6, wizardY + 12, 16, 0, Math.PI * 2);
      ctx.fill();

      // Billowing Emerald Cloak
      const cloakWave = Math.sin(time * 0.015) * 4;
      ctx.fillStyle = "#062e24";
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(wizardX + 12, wizardY + 10);
      ctx.lineTo(wizardX - 8 + (player.isGrounded ? cloakWave : -8), wizardY + 34);
      ctx.lineTo(wizardX + 16, wizardY + 32);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Wizard Robe / Body
      ctx.fillStyle = "#091c18";
      ctx.fillRect(wizardX + 4, wizardY + 12, 14, 22);

      // Student Head / Hair
      ctx.fillStyle = "#E7C56D";
      ctx.beginPath();
      ctx.arc(wizardX + 12, wizardY + 6, 6, 0, Math.PI * 2);
      ctx.fill();

      // Wand outstretched
      ctx.strokeStyle = "#d4aa48";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wizardX + 14, wizardY + 16);
      ctx.lineTo(wizardX + player.width + 6, wizardY + 12);
      ctx.stroke();

      // Wand tip star spark
      ctx.fillStyle = "#48D1CC";
      ctx.shadowColor = "#48D1CC";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(wizardX + player.width + 6, wizardY + 12, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 6. Draw & Update Particle Sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Loop frame
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, highScore, bestTime]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Ornate Hogwarts Status Bar: TIME 00:00, SCORE, HIGH SCORE */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-4 bg-[#041520]/80 p-3.5 rounded-xl border border-[#48D1CC]/30 backdrop-blur-md">
        {/* Prominent Live Timer */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#020b12] border border-[#48D1CC]/40 shadow-[0_0_12px_rgba(72,209,204,0.2)]">
          <Clock className="w-4 h-4 text-[#48D1CC] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#AFC3CF] font-cinzel uppercase tracking-wider">
              Time
            </span>
            <span className="font-mono font-bold text-base text-[#48D1CC] leading-none mt-0.5">
              {formatTime(secondsElapsed)}
            </span>
          </div>
        </div>

        {/* Current Score */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#020b12] border border-[#1b3a47]">
          <Zap className="w-4 h-4 text-[#E7C56D]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#9BA9AF] font-cinzel uppercase tracking-wider">
              Score
            </span>
            <span className="font-mono font-bold text-base text-[#f1ede4] leading-none mt-0.5">
              {score}
            </span>
          </div>
        </div>

        {/* High Score */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#020b12] border border-[#1b3a47]">
          <Trophy className="w-4 h-4 text-[#E7C56D]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#9BA9AF] font-cinzel uppercase tracking-wider">
              High Score
            </span>
            <span className="font-mono font-bold text-base text-[#E7C56D] leading-none mt-0.5">
              {highScore}
            </span>
          </div>
        </div>

        {/* Best Time */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#020b12] border border-[#1b3a47]">
          <Flame className="w-4 h-4 text-[#34d399]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#9BA9AF] font-cinzel uppercase tracking-wider">
              Best Time
            </span>
            <span className="font-mono font-bold text-base text-[#34d399] leading-none mt-0.5">
              {formatTime(bestTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Canvas Viewport with Touch/Click to Jump */}
      <div
        onClick={handleJump}
        className="relative w-full overflow-hidden rounded-2xl border-2 border-[#48D1CC]/40 bg-[#01070d] shadow-[0_0_40px_rgba(4,21,32,0.9),0_0_20px_rgba(72,209,204,0.25)] cursor-pointer select-none"
      >
        <canvas
          ref={canvasRef}
          width={650}
          height={260}
          className="w-full h-auto block"
        />

        {/* Idle Start Overlay */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-[#020b12]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full border border-[#48D1CC] flex items-center justify-center bg-[#051c24] mb-3 shadow-[0_0_20px_rgba(72,209,204,0.5)]">
              <Play className="w-5 h-5 text-[#48D1CC] ml-0.5" />
            </div>
            <h4 className="font-cinzel font-bold text-lg text-[#E7C56D] mb-1">
              Forbidden Forest Run
            </h4>
            <p className="text-xs font-serif text-[#AFC3CF] max-w-sm mb-4">
              Press <kbd className="px-1.5 py-0.5 rounded bg-[#09222c] border border-[#48D1CC]/40 font-mono text-[#48D1CC]">Space</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-[#09222c] border border-[#48D1CC]/40 font-mono text-[#48D1CC]">↑</kbd>, or tap screen to leap over thorny roots and shadow wraiths.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#0c3938] via-[#10534c] to-[#0c3938] border border-[#48D1CC] text-[#f1ede4] font-cinzel font-bold text-xs hover:scale-105 transition-all shadow-[0_0_15px_rgba(72,209,204,0.3)]"
            >
              Begin Forest Sprint
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-[#020b12]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <h4 className="font-cinzel font-bold text-xl text-[#ef4444] mb-1 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              Ensnared in the Thickets!
            </h4>
            <p className="text-xs font-serif text-[#AFC3CF] mb-4">
              You survived for{" "}
              <span className="font-mono text-white font-bold">
                {formatTime(secondsElapsed)}
              </span>{" "}
              and attained a score of{" "}
              <span className="font-mono text-[#E7C56D] font-bold">
                {score}
              </span>
              .
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={restartGame}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-[#E7C56D] to-[#d4aa48] text-[#020509] font-cinzel font-bold text-xs hover:scale-105 transition-all shadow-[0_0_20px_rgba(231,197,109,0.4)] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sprint Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Instruction Hint */}
      <div className="mt-4 flex items-center justify-between w-full px-2 text-[11px] font-serif text-[#80949F]">
        <span>✦ Press Space / Up Arrow or Tap Screen to Jump</span>
        <span>✦ Dodge Thorns &amp; Wraiths</span>
      </div>
    </div>
  );
};
