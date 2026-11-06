"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  PublicOwlPost,
  OwlPostTab,
  OwlReactionType,
  CreateOwlPostInput,
  ReportOwlPostInput,
  PendingOwlPost,
  OwlPostReportRecord,
} from "@/types/owlPost";
import {
  loadStoredOwlPosts,
  loadUserReactions,
  loadUserOwnPostIds,
  dispatchLocalOwlPost,
  toggleLocalReaction,
  submitLocalReport,
  subscribeToOwlPosts,
} from "@/lib/owlPostStorage";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";

export function useOwlPost() {
  const { user, profile, isGuest } = useAuth();
  const [publicPosts, setPublicPosts] = useState<PublicOwlPost[]>([]);
  const [myPosts, setMyPosts] = useState<PublicOwlPost[]>([]);
  const [pendingPosts, setPendingPosts] = useState<PendingOwlPost[]>([]);
  const [approvedPosts, setApprovedPosts] = useState<PendingOwlPost[]>([]);
  const [rejectedPosts, setRejectedPosts] = useState<PendingOwlPost[]>([]);
  const [reports, setReports] = useState<OwlPostReportRecord[]>([]);
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OwlPostTab>("latest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [displayLimit, setDisplayLimit] = useState<number>(6);
  const [usingSupabase, setUsingSupabase] = useState<boolean>(false);

  // Check moderator access through database authorization function public.is_owl_post_moderator()
  // NOTE: We do NOT query owl_post_moderators directly from browser as its table permissions are revoked.
  const checkModeratorAccess = useCallback(async () => {
    if (!user || isGuest) {
      setIsModerator(false);
      return;
    }

    try {
      const supabase = createClient();

      // Verify active authenticated session first
      const {
        data: { session },
        error: sessionErr,
      } = await supabase.auth.getSession();

      if (sessionErr || !session) {
        setIsModerator(false);
        return;
      }

      // Call database authorization RPC function
      const { data: isMod, error: rpcError } = await supabase.rpc(
        "is_owl_post_moderator"
      );

      if (!rpcError && typeof isMod === "boolean") {
        setIsModerator(isMod);
        return;
      }

      // Secondary fallback to profile role if RPC is unavailable in offline mock mode
      const { data: profData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      const userRole = profData?.role || profile?.role;
      if (
        userRole &&
        ["scholar", "prefect", "admin", "moderator"].includes(
          userRole.toLowerCase()
        )
      ) {
        setIsModerator(true);
        return;
      }

      setIsModerator(false);
    } catch {
      setIsModerator(false);
    }
  }, [user, isGuest, profile]);

  // Fetch moderator items: pending scrolls, approved scrolls, rejected scrolls, and reports
  const fetchModerationItems = useCallback(async () => {
    try {
      const supabase = createClient();

      // 1. Pending Posts
      const { data: pendingData } = await supabase
        .from("owl_posts")
        .select("id, content, alias, status, created_at, updated_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (pendingData) {
        setPendingPosts(
          pendingData.map((p) => ({
            id: p.id,
            content: p.content,
            alias: p.alias,
            status: p.status,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          }))
        );
      }

      // 2. Approved Posts (Archival moderation view)
      const { data: approvedData } = await supabase
        .from("owl_posts")
        .select("id, content, alias, status, created_at, updated_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(60);

      if (approvedData) {
        setApprovedPosts(
          approvedData.map((p) => ({
            id: p.id,
            content: p.content,
            alias: p.alias,
            status: p.status,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          }))
        );
      }

      // 3. Rejected Posts (Sealed away scrolls)
      const { data: rejectedData } = await supabase
        .from("owl_posts")
        .select("id, content, alias, status, created_at, updated_at")
        .eq("status", "rejected")
        .order("created_at", { ascending: false })
        .limit(60);

      if (rejectedData) {
        setRejectedPosts(
          rejectedData.map((p) => ({
            id: p.id,
            content: p.content,
            alias: p.alias,
            status: p.status,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          }))
        );
      }

      // 4. Confidential Reports
      const { data: reportsData } = await supabase
        .from("owl_post_reports")
        .select("id, post_id, reason, status, created_at")
        .order("created_at", { ascending: false })
        .limit(60);

      if (reportsData) {
        // Enrich reports with target post content preview
        const reportedPostIds = Array.from(
          new Set(reportsData.map((r) => r.post_id))
        );

        let postDetailsMap: Record<string, { content: string; alias: string }> =
          {};
        if (reportedPostIds.length > 0) {
          const { data: targetPosts } = await supabase
            .from("owl_posts")
            .select("id, content, alias")
            .in("id", reportedPostIds);

          if (targetPosts) {
            postDetailsMap = targetPosts.reduce(
              (acc, post) => {
                acc[post.id] = { content: post.content, alias: post.alias };
                return acc;
              },
              {} as Record<string, { content: string; alias: string }>
            );
          }
        }

        setReports(
          reportsData.map((r) => ({
            id: r.id,
            postId: r.post_id,
            reason: r.reason,
            status: r.status,
            createdAt: r.created_at,
            postContent: postDetailsMap[r.post_id]?.content,
            postAlias: postDetailsMap[r.post_id]?.alias,
          }))
        );
      }
    } catch (err) {
      console.warn("Could not load moderation items:", err);
    }
  }, []);

  // Main feed refresh
  const refreshFeed = useCallback(async () => {
    setError(null);

    try {
      const supabase = createClient();

      // 1. Query public approved posts from safe public view: public.owl_posts_public
      const { data: remoteApproved, error: sbError } = await supabase
        .from("owl_posts_public")
        .select("id, content, alias, created_at")
        .order("created_at", { ascending: false });

      if (!sbError && remoteApproved !== null) {
        setUsingSupabase(true);

        const postIds = remoteApproved.map((p) => p.id);

        // 2. Query public reaction totals from public.owl_reaction_counts
        let reactionCountsRows: Array<{ post_id: string; reaction: string; count: number }> = [];
        if (postIds.length > 0) {
          const { data: cData } = await supabase
            .from("owl_reaction_counts")
            .select("*")
            .in("post_id", postIds);
          if (cData) reactionCountsRows = cData as Array<{ post_id: string; reaction: string; count: number }>;
        }

        // 3. Query authenticated user's own reactions to display active states
        const userReactionMap: Record<string, Partial<Record<OwlReactionType, boolean>>> = {};
        if (user && postIds.length > 0) {
          const { data: userReactions } = await supabase
            .from("owl_post_reactions")
            .select("post_id, reaction")
            .eq("user_id", user.id)
            .in("post_id", postIds);
          if (userReactions) {
            userReactions.forEach((r) => {
              if (!userReactionMap[r.post_id]) userReactionMap[r.post_id] = {};
              userReactionMap[r.post_id][r.reaction as OwlReactionType] = true;
            });
          }
        }

        // 4. Query authenticated user's own submissions from public.owl_posts
        let userSubmissions: PublicOwlPost[] = [];
        const ownIds = new Set<string>();

        if (user) {
          const { data: userOwnRows } = await supabase
            .from("owl_posts")
            .select("id, content, alias, status, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (userOwnRows) {
            userOwnRows.forEach((r) => ownIds.add(r.id));

            // Fetch reaction counts for user's own posts if not already fetched
            const ownPostIds = userOwnRows.map((r) => r.id);
            let ownReactionsData = reactionCountsRows;

            const missingIds = ownPostIds.filter((id) => !postIds.includes(id));
            if (missingIds.length > 0) {
              const { data: extraCounts } = await supabase
                .from("owl_reaction_counts")
                .select("*")
                .in("post_id", missingIds);
              if (extraCounts) {
                ownReactionsData = [...reactionCountsRows, ...(extraCounts as Array<{ post_id: string; reaction: string; count: number }>)];
              }
            }

            userSubmissions = userOwnRows.map((p) => {
              const pCounts = ownReactionsData.filter((r) => r.post_id === p.id);
              const reactions = { heart: 0, owl: 0, sparkle: 0, laugh: 0 };
              pCounts.forEach((c) => {
                const type = c.reaction as OwlReactionType;
                if (reactions[type] !== undefined) {
                  reactions[type] = Number(c.count) || 0;
                }
              });

              return {
                id: p.id,
                content: p.content,
                alias: p.alias,
                status: p.status,
                createdAt: p.created_at,
                reactions,
                userReactions: userReactionMap[p.id] || {},
                isOwn: true,
              };
            });
          }
        }

        // Format approved public posts (ensures NO author user_id exists on object)
        const formattedApproved: PublicOwlPost[] = remoteApproved.map((p) => {
          const pCounts = reactionCountsRows.filter((r) => r.post_id === p.id);
          const reactions = { heart: 0, owl: 0, sparkle: 0, laugh: 0 };
          pCounts.forEach((c) => {
            const type = c.reaction as OwlReactionType;
            if (reactions[type] !== undefined) {
              reactions[type] = Number(c.count) || 0;
            }
          });

          return {
            id: p.id,
            content: p.content,
            alias: p.alias,
            status: "approved",
            createdAt: p.created_at,
            reactions,
            userReactions: userReactionMap[p.id] || {},
            isOwn: ownIds.has(p.id),
          };
        });

        setPublicPosts(formattedApproved);
        setMyPosts(userSubmissions);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Supabase query exception, falling back to local storage:", err);
    }

    // Explicit Fallback: Local Demo Storage (Only used when Supabase is completely unreachable)
    setUsingSupabase(false);
    const localPosts = loadStoredOwlPosts();
    const userReactions = loadUserReactions();
    const userOwnIds = new Set(loadUserOwnPostIds());

    const enriched = localPosts.map((p) => ({
      ...p,
      userReactions: userReactions[p.id] || {},
      isOwn: userOwnIds.has(p.id),
    }));

    setPublicPosts(enriched.filter((p) => p.status === "approved"));
    setMyPosts(enriched.filter((p) => userOwnIds.has(p.id)));
    setIsLoading(false);
  }, [user]);

  // Initial load, moderator check and subscription
  useEffect(() => {
    const timer = setTimeout(() => {
      void checkModeratorAccess();
      void refreshFeed();
    }, 0);

    const unsubscribe = subscribeToOwlPosts(() => {
      void refreshFeed();
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [refreshFeed, checkModeratorAccess]);

  // Load moderation items when moderator accesses moderation tab
  useEffect(() => {
    if (isModerator) {
      const timer = setTimeout(() => {
        void fetchModerationItems();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isModerator, fetchModerationItems]);

  // Dispatch a new letter (inserts into public.owl_posts with status = 'pending')
  const dispatchLetter = useCallback(
    async (input: CreateOwlPostInput): Promise<{ success: boolean; message: string }> => {
      const trimmed = input.content.trim();
      if (!trimmed || trimmed.length === 0) {
        return { success: false, message: "Please scribe your thoughts before sending." };
      }
      if (trimmed.length > 1000) {
        return { success: false, message: "Your scroll exceeds the 1000 character limit." };
      }

      setIsSubmitting(true);

      // Live Supabase insert
      if (user && usingSupabase) {
        try {
          const supabase = createClient();
          const { error: insertError } = await supabase.from("owl_posts").insert({
            user_id: user.id,
            content: trimmed,
            alias: input.alias || "Anonymous",
            status: "pending",
          });

          if (insertError) {
            setIsSubmitting(false);
            return {
              success: false,
              message: `Failed to dispatch scroll: ${insertError.message}`,
            };
          }

          await refreshFeed();
          if (isModerator) await fetchModerationItems();
          setIsSubmitting(false);

          return {
            success: true,
            message: "Your parchment has taken flight! It will appear once reviewed by academy wardens.",
          };
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : "Database error";
          setIsSubmitting(false);
          return {
            success: false,
            message: `Failed to dispatch letter: ${errMsg}`,
          };
        }
      }

      // Unauthenticated requirement check
      if (!user && usingSupabase) {
        setIsSubmitting(false);
        return {
          success: false,
          message: "Please sign in to dispatch an Owl Letter to the campus sanctuary.",
        };
      }

      // Local persistence fallback
      dispatchLocalOwlPost(input);
      await refreshFeed();
      setIsSubmitting(false);

      return {
        success: true,
        message: "Your parchment has taken flight via Owl Post!",
      };
    },
    [user, usingSupabase, isModerator, refreshFeed, fetchModerationItems]
  );

  // Toggle reaction (uses public.owl_post_reactions)
  const toggleReaction = useCallback(
    async (postId: string, reaction: OwlReactionType): Promise<{ success: boolean; message?: string }> => {
      if (usingSupabase) {
        if (!user) {
          return {
            success: false,
            message: "Please sign in with your student account to react to scrolls.",
          };
        }

        try {
          const supabase = createClient();

          // Check if already reacted
          const { data: existing, error: checkErr } = await supabase
            .from("owl_post_reactions")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", user.id)
            .eq("reaction", reaction)
            .maybeSingle();

          if (checkErr) {
            return { success: false, message: checkErr.message };
          }

          if (existing) {
            // Remove reaction
            const { error: delErr } = await supabase
              .from("owl_post_reactions")
              .delete()
              .eq("id", existing.id);

            if (delErr) return { success: false, message: delErr.message };
          } else {
            // Add reaction
            const { error: insErr } = await supabase
              .from("owl_post_reactions")
              .insert({
                post_id: postId,
                user_id: user.id,
                reaction,
              });

            if (insErr) return { success: false, message: insErr.message };
          }

          await refreshFeed();
          return { success: true };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Reaction failed";
          return { success: false, message: msg };
        }
      }

      // Local fallback
      toggleLocalReaction(postId, reaction);
      refreshFeed();
      return { success: true };
    },
    [user, usingSupabase, refreshFeed]
  );

  // Report post (inserts into public.owl_post_reports)
  const reportPost = useCallback(
    async (input: ReportOwlPostInput): Promise<{ success: boolean; message: string }> => {
      if (usingSupabase) {
        if (!user) {
          return {
            success: false,
            message: "Please sign in to file a confidential report with academy wardens.",
          };
        }

        try {
          const supabase = createClient();
          const { error: repError } = await supabase
            .from("owl_post_reports")
            .insert({
              post_id: input.postId,
              reporter_id: user.id,
              reason: input.reason,
              status: "pending",
            });

          if (repError) {
            if (repError.code === "23505") {
              return {
                success: false,
                message: "You have already filed a report for this parchment scroll.",
              };
            }
            return {
              success: false,
              message: `Failed to report scroll: ${repError.message}`,
            };
          }

          if (isModerator) await fetchModerationItems();
          return {
            success: true,
            message: "Parchment reported. Academy wardens will review this scroll.",
          };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Report failed";
          return { success: false, message: msg };
        }
      }

      return submitLocalReport(input);
    },
    [user, usingSupabase, isModerator, fetchModerationItems]
  );

  // Moderator action: Approve post
  const approvePost = useCallback(
    async (postId: string): Promise<{ success: boolean; message: string }> => {
      if (!isModerator) {
        return { success: false, message: "Unauthorized: Wardens only." };
      }

      try {
        const supabase = createClient();
        const { error: appErr } = await supabase
          .from("owl_posts")
          .update({ status: "approved" })
          .eq("id", postId);

        if (appErr) {
          return { success: false, message: `Approval failed: ${appErr.message}` };
        }

        await refreshFeed();
        await fetchModerationItems();
        return {
          success: true,
          message: "Scroll approved and released to the public sanctuary.",
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Approval error";
        return { success: false, message: msg };
      }
    },
    [isModerator, refreshFeed, fetchModerationItems]
  );

  // Moderator action: Reject post
  const rejectPost = useCallback(
    async (postId: string): Promise<{ success: boolean; message: string }> => {
      if (!isModerator) {
        return { success: false, message: "Unauthorized: Wardens only." };
      }

      try {
        const supabase = createClient();
        const { error: rejErr } = await supabase
          .from("owl_posts")
          .update({ status: "rejected" })
          .eq("id", postId);

        if (rejErr) {
          return { success: false, message: `Rejection failed: ${rejErr.message}` };
        }

        await refreshFeed();
        await fetchModerationItems();
        return {
          success: true,
          message: "Scroll rejected and sealed away.",
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Rejection error";
        return { success: false, message: msg };
      }
    },
    [isModerator, refreshFeed, fetchModerationItems]
  );

  // Moderator action: Review report
  const reviewReport = useCallback(
    async (reportId: string, status: "reviewed" | "dismissed"): Promise<void> => {
      if (!isModerator) return;
      try {
        const supabase = createClient();
        await supabase
          .from("owl_post_reports")
          .update({ status })
          .eq("id", reportId);
        await fetchModerationItems();
      } catch (err) {
        console.error("Failed to update report:", err);
      }
    },
    [isModerator, fetchModerationItems]
  );

  // Filtered and sorted posts based on active tab
  const activePostList = activeTab === "my-letters" ? myPosts : publicPosts;

  const filteredPosts = useMemo(() => {
    let result = [...activePostList];

    // Search query filter (content and alias)
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.alias.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (activeTab === "latest" || activeTab === "my-letters") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (activeTab === "popular") {
      result.sort((a, b) => {
        const totalA =
          a.reactions.heart +
          a.reactions.owl +
          a.reactions.sparkle +
          a.reactions.laugh;
        const totalB =
          b.reactions.heart +
          b.reactions.owl +
          b.reactions.sparkle +
          b.reactions.laugh;
        return totalB - totalA;
      });
    }

    return result;
  }, [activePostList, searchQuery, activeTab]);

  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, displayLimit);
  }, [filteredPosts, displayLimit]);

  const hasMore = displayLimit < filteredPosts.length;

  const loadMore = useCallback(() => {
    setDisplayLimit((prev) => prev + 6);
  }, []);

  const totalApprovedCount = useMemo(() => {
    return publicPosts.filter((p) => p.status === "approved").length;
  }, [publicPosts]);

  return {
    posts: displayedPosts,
    totalCount: filteredPosts.length,
    totalApprovedCount,
    myLettersCount: myPosts.length,
    pendingModerationCount: pendingPosts.length,
    pendingPosts,
    approvedPosts,
    rejectedPosts,
    reports,
    isModerator,
    isLoading,
    isSubmitting,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    hasMore,
    loadMore,
    dispatchLetter,
    toggleReaction,
    reportPost,
    approvePost,
    rejectPost,
    reviewReport,
    refreshFeed,
    refetchModeration: fetchModerationItems,
    usingSupabase,
    isGuest,
    user,
  };
}
