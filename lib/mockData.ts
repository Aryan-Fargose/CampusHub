import {
  UserProfile,
  AttendanceSummary,
  CanteenPick,
  OwlPostSummary,
  CommonRoomPreview,
  CampusQuote,
  NavigationItem,
} from "@/types";

export const mockCurrentUser: UserProfile = {
  id: "usr_arcane_007",
  displayName: "Aryan",
  fullName: "Aryan F.",
  house: "Ravenclaw",
  campusName: "DJSCE",
  academicYear: "Sophomore • Computer Engineering",
  role: "scholar",
};

export const mockAttendance: AttendanceSummary = {
  percentage: 82.6,
  status: "safe",
  statusLabel: "SAFE",
  safeBunksCount: 4,
  totalLectures: 142,
  attendedLectures: 117,
};

export const mockCanteenPick: CanteenPick = {
  id: "cnt_01",
  itemName: "Paneer Wrap",
  canteenName: "DJ Sanghvi Canteen",
  rating: 4.8,
  tag: "Most Favorited",
  price: "₹80",
};

export const mockOwlPost: OwlPostSummary = {
  unreadCount: 12,
  latestTag: "Campus Secrets",
  totalToday: 48,
};

export const mockCommonRoom: CommonRoomPreview = {
  featuredGame: "Tic-Tac-Toe",
  subtitle: "Challenge a friend!",
  onlinePlayersCount: 14,
  gameType: "tictactoe",
};

export const mockQuotes: CampusQuote[] = [
  {
    id: "q_01",
    text: "Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.",
    author: "Albus Dumbledore",
    source: "Ancient Wisdom",
  },
  {
    id: "q_02",
    text: "Every journey begins when curiosity opens the door.",
    author: "Grand Archivist",
    source: "Campus Lore",
  },
  {
    id: "q_03",
    text: "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.",
    author: "Scholarly Grimoire",
    source: "The Grand Library",
  },
  {
    id: "q_04",
    text: "It is our choices that show what we truly are, far more than our abilities.",
    author: "Academy Headmaster",
    source: "Founders' Arch",
  },
];

export const mainNavigationItems: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    iconName: "Castle",
  },
  {
    id: "attendance",
    label: "Attendance",
    href: "#attendance-preview",
    iconName: "BookOpen",
    badge: "82.6%",
  },
  {
    id: "canteen",
    label: "Canteen",
    href: "#canteen-preview",
    iconName: "Utensils",
  },
  {
    id: "owl-post",
    label: "Owl Post",
    href: "#owlpost-preview",
    iconName: "Mail",
    badge: "12 New",
  },
  {
    id: "common-room",
    label: "Common Room",
    href: "#commonroom-preview",
    iconName: "Gamepad2",
  },
];
