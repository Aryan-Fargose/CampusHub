export interface GameStationConfig {
  id: string;
  title: string;
  stationName: string;
  tagline: string;
  description: string;
  landmark: string;
  badge: string;
  accentColor: string;
  stageProgress: number; // 0 to 1 point of maximum focus
  camera: {
    panX: number; // percentage offset
    panY: number;
    zoom: number; // scale multiplier
    rotateY: number; // degrees
    rotateX: number; // degrees
    perspective: number;
  };
  status: "available" | "coming-soon";
  playersText: string;
  timeEstimate: string;
}

export const GAME_STATIONS: GameStationConfig[] = [
  {
    id: "x-and-o",
    title: "X & O",
    stationName: "Duel of Wizards",
    tagline: "Outwit the Arcane Minimax Intelligence",
    description:
      "A battle of tactical wit etched in glowing emerald and antique gold runes. Face off against fellow students or test your mind against three tiers of cunning Hogwarts AI.",
    landmark: "The Carved Mahogany Chess Alcove",
    badge: "Tactical Duel",
    accentColor: "#48D1CC",
    stageProgress: 0.35,
    camera: {
      panX: -22, // Pan towards the right side where chess table & portrait reside
      panY: 6,
      zoom: 1.25,
      rotateY: -8,
      rotateX: 3,
      perspective: 1100,
    },
    status: "available",
    playersText: "1 - 2 Players",
    timeEstimate: "2 - 5 mins",
  },
  {
    id: "match-creatures",
    title: "Match the Creatures",
    stationName: "The Arcane Bestiary",
    tagline: "Test Your Memory of the 8 Mythical Beasts",
    description:
      "16 enchanted parchment cards conceal the noble beasts of Hogwarts. Uncover pairs of Owls, Stags, Serpents, and Dragons before time runs out.",
    landmark: "The Roaring Emerald Hearth",
    badge: "Memory Trial",
    accentColor: "#E7C56D",
    stageProgress: 0.65,
    camera: {
      panX: 20, // Pan towards the left side where the green fireplace burns
      panY: -4,
      zoom: 1.28,
      rotateY: 9,
      rotateX: 2,
      perspective: 1100,
    },
    status: "available",
    playersText: "Solo Challenge",
    timeEstimate: "1 - 3 mins",
  },
  {
    id: "dino-run",
    title: "Forbidden Forest Run",
    stationName: "The Midnight Sprint",
    tagline: "Leap Through the Shadowed Thickets",
    description:
      "Sprint through the moonlit depths of the Forbidden Forest. Leap over enchanted thorn roots, evade swooping shadow wraiths, and keep your survival timer burning bright.",
    landmark: "The Dark Vault Archway",
    badge: "Endless Runner",
    accentColor: "#34d399",
    stageProgress: 0.95,
    camera: {
      panX: 32, // Zoom deep toward the dark archway / exit corridor
      panY: 8,
      zoom: 1.35,
      rotateY: 13,
      rotateX: -2,
      perspective: 1200,
    },
    status: "available",
    playersText: "High Score Sprint",
    timeEstimate: "Endless",
  },
  {
    id: "wizard-chess",
    title: "Wizard's Chess",
    stationName: "Grandmaster's Gambit",
    tagline: "Animated Stone Knights & Royal Strategy",
    description:
      "Full animated battle chess where pieces clash under royal medieval edicts. Currently being transcribed by the ancient scribes.",
    landmark: "The Grand Library Table",
    badge: "Coming Soon",
    accentColor: "#93c5fd",
    stageProgress: 1.0,
    camera: {
      panX: 0,
      panY: 0,
      zoom: 1.1,
      rotateY: 0,
      rotateX: 0,
      perspective: 1000,
    },
    status: "coming-soon",
    playersText: "In Development",
    timeEstimate: "Coming Soon",
  },
];
