import {
  PublicOwlPost,
  OwlPostAlias,
  OwlReactionType,
  CreateOwlPostInput,
  ReportOwlPostInput,
} from "@/types/owlPost";

const STORAGE_KEYS = {
  POSTS: "campushub_owl_posts_v1",
  USER_REACTIONS: "campushub_owl_user_reactions_v1",
  USER_OWN_POSTS: "campushub_owl_user_own_posts_v1",
  REPORTS: "campushub_owl_reports_v1",
};

export const OWL_POST_CHANGE_EVENT = "campushub:owl_post_updated";

export const DEFAULT_INITIAL_OWL_POSTS: PublicOwlPost[] = [
  {
    id: "owl_01",
    content:
      "To whoever left their enchanted notes in the Library restricted section on Friday evening: your cursive is illegible, but your spell diagrams saved my Operating Systems assignment. May the owls favor you.",
    alias: "The Midnight Messenger",
    status: "approved",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    reactions: { heart: 24, owl: 18, sparkle: 12, laugh: 3 },
  },
  {
    id: "owl_02",
    content:
      "Confession: I pretend to study in the Astronomy Tower just to hear the rain hitting the glass domes and the low hum of the campus orchestra tuning below.",
    alias: "The Silent Owl",
    status: "approved",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    reactions: { heart: 42, owl: 31, sparkle: 28, laugh: 1 },
  },
  {
    id: "owl_03",
    content:
      "If the canteen serves cold samosas again tomorrow morning, I am casting an Incendio charm directly on the heating rack. Consider this an official scroll of warning.",
    alias: "The Wandering Wizard",
    status: "approved",
    createdAt: new Date(Date.now() - 9 * 3600000).toISOString(),
    reactions: { heart: 15, owl: 8, sparkle: 5, laugh: 56 },
  },
  {
    id: "owl_04",
    content:
      "Third year in Computer Engineering and I still don't know whether our algorithms professor is a brilliant archmage or an ancient ghost bound to the blackboard.",
    alias: "The Curious Raven",
    status: "approved",
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    reactions: { heart: 33, owl: 14, sparkle: 19, laugh: 41 },
  },
  {
    id: "owl_05",
    content:
      "To the person wearing the emerald scarf who handed me their spare quill during the Data Structures mid-semester exam: you have my eternal gratitude and 50 house points.",
    alias: "The Unknown Witch",
    status: "approved",
    createdAt: new Date(Date.now() - 28 * 3600000).toISOString(),
    reactions: { heart: 61, owl: 22, sparkle: 45, laugh: 4 },
  },
  {
    id: "owl_06",
    content:
      "Rumor has it if you sit in the 4th row of the Central Amphitheatre at midnight, you can still hear the echoes of 2012 seniors debugging their final year projects.",
    alias: "Anonymous",
    status: "approved",
    createdAt: new Date(Date.now() - 44 * 3600000).toISOString(),
    reactions: { heart: 19, owl: 27, sparkle: 34, laugh: 16 },
  },
];

function notifyChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OWL_POST_CHANGE_EVENT));
  }
}

export function subscribeToOwlPosts(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(OWL_POST_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(OWL_POST_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function loadStoredOwlPosts(): PublicOwlPost[] {
  if (typeof window === "undefined") return DEFAULT_INITIAL_OWL_POSTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      localStorage.setItem(
        STORAGE_KEYS.POSTS,
        JSON.stringify(DEFAULT_INITIAL_OWL_POSTS)
      );
      return DEFAULT_INITIAL_OWL_POSTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_INITIAL_OWL_POSTS;
  } catch {
    return DEFAULT_INITIAL_OWL_POSTS;
  }
}

export function saveStoredOwlPosts(posts: PublicOwlPost[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    notifyChange();
  } catch (err) {
    console.error("Failed to save owl posts to localStorage", err);
  }
}

export function loadUserReactions(): Record<string, Partial<Record<OwlReactionType, boolean>>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_REACTIONS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveUserReactions(
  reactions: Record<string, Partial<Record<OwlReactionType, boolean>>>
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_REACTIONS, JSON.stringify(reactions));
    notifyChange();
  } catch (err) {
    console.error("Failed to save user reactions", err);
  }
}

export function loadUserOwnPostIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_OWN_POSTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserOwnPostId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const ids = loadUserOwnPostIds();
    if (!ids.includes(id)) {
      localStorage.setItem(
        STORAGE_KEYS.USER_OWN_POSTS,
        JSON.stringify([...ids, id])
      );
    }
  } catch (err) {
    console.error("Failed to track user own post id", err);
  }
}

/**
 * Dispatch a new anonymous letter locally.
 * Enforces strict anonymous boundaries: no author identity is stored on the post object.
 */
export function dispatchLocalOwlPost(
  input: CreateOwlPostInput
): PublicOwlPost {
  const posts = loadStoredOwlPosts();
  const trimmed = input.content.trim();
  const alias: OwlPostAlias | string = input.alias || "Anonymous";

  const newPost: PublicOwlPost = {
    id: `owl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    content: trimmed,
    alias,
    status: "approved", // In local mode, immediately approved so user can test
    createdAt: new Date().toISOString(),
    reactions: { heart: 0, owl: 0, sparkle: 0, laugh: 0 },
    isOwn: true,
  };

  saveUserOwnPostId(newPost.id);
  saveStoredOwlPosts([newPost, ...posts]);
  return newPost;
}

/**
 * Toggle a reaction on a post locally.
 */
export function toggleLocalReaction(
  postId: string,
  reaction: OwlReactionType
): { counts: { heart: number; owl: number; sparkle: number; laugh: number }; userActive: boolean } {
  const posts = loadStoredOwlPosts();
  const userReactions = loadUserReactions();
  const postReactions = userReactions[postId] || {};
  const isCurrentlyActive = Boolean(postReactions[reaction]);

  const postIndex = posts.findIndex((p) => p.id === postId);
  if (postIndex === -1) {
    return {
      counts: { heart: 0, owl: 0, sparkle: 0, laugh: 0 },
      userActive: false,
    };
  }

  const post = posts[postIndex];
  const delta = isCurrentlyActive ? -1 : 1;
  const newCount = Math.max(0, (post.reactions[reaction] || 0) + delta);

  const updatedReactions = {
    ...post.reactions,
    [reaction]: newCount,
  };

  posts[postIndex] = {
    ...post,
    reactions: updatedReactions,
  };

  userReactions[postId] = {
    ...postReactions,
    [reaction]: !isCurrentlyActive,
  };

  saveStoredOwlPosts(posts);
  saveUserReactions(userReactions);

  return {
    counts: updatedReactions,
    userActive: !isCurrentlyActive,
  };
}

/**
 * Submit a report locally.
 */
export function submitLocalReport(input: ReportOwlPostInput): { success: boolean; message: string } {
  if (typeof window === "undefined") return { success: false, message: "Client only" };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    const reports = raw ? JSON.parse(raw) : [];
    
    // Check duplicate
    const alreadyReported = reports.some(
      (r: { postId: string }) => r.postId === input.postId
    );
    if (alreadyReported) {
      return {
        success: false,
        message: "You have already submitted a report for this parchment scroll.",
      };
    }

    reports.push({
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      postId: input.postId,
      reason: input.reason,
      createdAt: new Date().toISOString(),
      status: "pending",
    });

    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return {
      success: true,
      message: "Parchment reported. Academy wardens will review this scroll.",
    };
  } catch {
    return {
      success: false,
      message: "Failed to log report. Please try again later.",
    };
  }
}

