export interface GameStationConfig {
  id: string;
  title: string;
  stationName: string;
  tagline: string;
  description: string;
  landmark: string;
  badge: string;
  accentColor: string;
  stageProgress: number; // 0.0 to 1.0
  stageAngle: number; // 0 to 360 degrees
  status: "available" | "coming-soon";
  playersText: string;
  timeEstimate: string;
}

export const GAME_STATIONS: GameStationConfig[] = [
  {
    id: "match-creatures",
    title: "Match the Creatures",
    stationName: "The Arcane Bestiary",
    tagline: "Test Your Memory of the 8 Mythical Beasts",
    description:
      "16 enchanted parchment cards conceal the noble beasts of Hogwarts. Uncover pairs before time runs out.",
    landmark: "The Roaring Emerald Hearth",
    badge: "Memory Trial",
    accentColor: "#E7C56D",
    stageProgress: 0.25,
    stageAngle: 90,
    status: "available",
    playersText: "Solo Trial",
    timeEstimate: "1 - 3 mins",
  },
  {
    id: "dino-run",
    title: "Forbidden Forest Run",
    stationName: "The Midnight Sprint",
    tagline: "Leap Through the Shadowed Thickets",
    description:
      "Sprint through the moonlit depths of the Forbidden Forest. Leap over thorny roots, evade shadow wraiths, and keep your timer burning.",
    landmark: "Black Lake Underwater Arches & Giant Squid",
    badge: "Endless Runner",
    accentColor: "#34d399",
    stageProgress: 0.50,
    stageAngle: 180,
    status: "available",
    playersText: "High Score Sprint",
    timeEstimate: "Endless",
  },
  {
    id: "x-and-o",
    title: "X & O",
    stationName: "Duel of Wizards",
    tagline: "Outwit the Arcane Minimax Intelligence",
    description:
      "A battle of tactical wit etched in glowing emerald and antique gold runes. Face fellow students or test your mind against three AI tiers.",
    landmark: "The Carved Mahogany Chess Alcove & Study",
    badge: "Tactical Duel",
    accentColor: "#48D1CC",
    stageProgress: 0.75,
    stageAngle: 270,
    status: "available",
    playersText: "1 - 2 Players",
    timeEstimate: "2 - 5 mins",
  },
  {
    id: "wizard-chess",
    title: "Wizard's Chess",
    stationName: "Grandmaster's Gambit",
    tagline: "Animated Stone Knights & Royal Strategy",
    description:
      "Full animated battle chess where pieces clash under royal medieval edicts.",
    landmark: "The Grand Library Table",
    badge: "Coming Soon",
    accentColor: "#93c5fd",
    stageProgress: 0.98,
    stageAngle: 350,
    status: "coming-soon",
    playersText: "In Development",
    timeEstimate: "Coming Soon",
  },
];
