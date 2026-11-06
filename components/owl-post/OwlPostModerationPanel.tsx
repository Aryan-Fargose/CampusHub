"use client";

import React, { useState } from "react";
import { PendingOwlPost, OwlPostReportRecord } from "@/types/owlPost";
import {
  ShieldCheck,
  Check,
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  RotateCcw,
  EyeOff,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface OwlPostModerationPanelProps {
  pendingPosts: PendingOwlPost[];
  approvedPosts?: PendingOwlPost[];
  rejectedPosts?: PendingOwlPost[];
  reports: OwlPostReportRecord[];
  onApprove: (postId: string) => Promise<{ success: boolean; message: string }>;
  onReject: (postId: string) => Promise<{ success: boolean; message: string }>;
  onReviewReport: (reportId: string, status: "reviewed" | "dismissed") => Promise<void>;
  isLoading?: boolean;
}

type SubTab = "pending" | "approved" | "rejected" | "reports";

interface ConfirmationState {
  isOpen: boolean;
  type: "approve" | "reject" | "dismiss_report" | "review_report";
  targetId: string;
  targetTitle: string;
  snippet?: string;
}

export const OwlPostModerationPanel: React.FC<OwlPostModerationPanelProps> = ({
  pendingPosts,
  approvedPosts = [],
  rejectedPosts = [],
  reports,
  onApprove,
  onReject,
  onReviewReport,
  isLoading = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("pending");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmationState>({
    isOpen: false,
    type: "approve",
    targetId: "",
    targetTitle: "",
  });

  const requestActionConfirm = (
    type: ConfirmationState["type"],
    targetId: string,
    targetTitle: string,
    snippet?: string
  ) => {
    setConfirmDialog({
      isOpen: true,
      type,
      targetId,
      targetTitle,
      snippet,
    });
  };

  const handleExecuteConfirmedAction = async () => {
    const { type, targetId } = confirmDialog;
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    setActionInProgress(targetId);
    setNotification(null);

    try {
      if (type === "approve") {
        const res = await onApprove(targetId);
        setNotification(res);
      } else if (type === "reject") {
        const res = await onReject(targetId);
        setNotification(res);
      } else if (type === "dismiss_report") {
        await onReviewReport(targetId, "dismissed");
        setNotification({
          success: true,
          message: "Report dismissed and archived.",
        });
      } else if (type === "review_report") {
        await onReviewReport(targetId, "reviewed");
        setNotification({
          success: true,
          message: "Report marked as reviewed.",
        });
      }
    } catch {
      setNotification({
        success: false,
        message: "An arcane anomaly prevented completing this moderation action.",
      });
    } finally {
      setActionInProgress(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Sanctum Header Banner (Translucent Glass Effect) */}
      <div className="relative rounded-2xl bg-[#020806]/20 border border-[#B58A45]/40 p-5 sm:p-6 backdrop-blur-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Subtle magical accent aura */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-[#16CFFF]/10 blur-[60px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 left-10 w-60 h-28 bg-[#20C879]/10 blur-[50px] pointer-events-none rounded-full" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B3D28] border border-[#B58A45]/60 text-[#D5AE65] shadow-[0_0_18px_rgba(213,174,101,0.25)]">
              <ShieldCheck className="w-6 h-6 text-[#20C879]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#F0D49A] tracking-wider">
                  Warden&apos;s Sanctum
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#0B3D28] border border-[#20C879]/60 text-[#20C879] font-bold">
                  Verified Warden Access
                </span>
              </div>
              <p className="text-xs font-serif text-[#AFC3CF] mt-0.5">
                High academy chamber &bull; Review incoming confessions, monitor reports, and preserve the sanctuary
              </p>
            </div>
          </div>

          {/* Sub-tab Navigation (Translucent Container) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#020806]/20 border border-[#B58A45]/30 backdrop-blur-[8px]">
            <button
              type="button"
              onClick={() => setActiveSubTab("pending")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer",
                activeSubTab === "pending"
                  ? "bg-[#0B3D28] border border-[#20C879]/70 text-[#20C879] font-bold shadow-[0_0_12px_rgba(32,200,121,0.3)]"
                  : "text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#06140D]/50"
              )}
            >
              <span>Pending</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#20C879]/30 text-[#20C879] font-mono font-bold">
                {pendingPosts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("approved")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer",
                activeSubTab === "approved"
                  ? "bg-[#0B3D28] border border-[#20C879]/70 text-[#20C879] font-bold shadow-[0_0_12px_rgba(32,200,121,0.3)]"
                  : "text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#06140D]/50"
              )}
            >
              <span>Approved</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#B58A45]/30 text-[#D5AE65] font-mono font-bold">
                {approvedPosts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("rejected")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer",
                activeSubTab === "rejected"
                  ? "bg-[#251010] border border-[#ef4444]/70 text-rose-300 font-bold shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                  : "text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#06140D]/50"
              )}
            >
              <span>Rejected</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/30 text-rose-300 font-mono font-bold">
                {rejectedPosts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("reports")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer",
                activeSubTab === "reports"
                  ? "bg-[#351515] border border-rose-500/70 text-rose-200 font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                  : "text-[#AFC3CF] hover:text-[#F0D49A] hover:bg-[#06140D]/50"
              )}
            >
              <span>Reports</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/30 text-rose-300 font-mono font-bold">
                {reports.filter((r) => r.status === "pending").length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Toast */}
      {notification && (
        <div
          className={cn(
            "p-3.5 rounded-xl border text-xs font-serif flex items-center gap-2.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200",
            notification.success
              ? "bg-[#092719]/90 border-[#20C879]/60 text-[#20C879]"
              : "bg-[#251010]/90 border-rose-500/60 text-rose-300"
          )}
        >
          {notification.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#20C879]" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/30 backdrop-blur-[8px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#20C879] mx-auto" />
          <p className="font-cinzel text-xs text-[#AFC3CF]">Accessing Warden Archives...</p>
        </div>
      ) : activeSubTab === "pending" ? (
        /* Sub-tab 1: Pending Confessions */
        <div className="space-y-4">
          {pendingPosts.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/30 backdrop-blur-[8px]">
              <CheckCircle2 className="w-10 h-10 text-[#20C879] mx-auto" />
              <h3 className="font-cinzel text-base font-bold text-[#F0D49A]">
                No Pending Scrolls
              </h3>
              <p className="text-xs font-serif text-[#AFC3CF] max-w-sm mx-auto">
                All submissions have been moderated. The academy skies are tranquil.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl p-5 bg-[#020806]/20 hover:bg-[#06140D]/30 border border-[#B58A45]/35 hover:border-[#B58A45]/70 transition-all space-y-3 shadow-sm backdrop-blur-[8px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#0B3D28]/40">
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-xs font-bold text-[#F0D49A]">
                        {post.alias}
                      </span>
                      <span className="text-[10px] font-mono text-[#768b98] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#16CFFF]" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#B58A45]/20 border border-[#B58A45]/50 text-[#F0D49A] font-semibold">
                      Pending Review
                    </span>
                  </div>

                  <p className="font-cormorant text-base text-[#E8D4A7] whitespace-pre-wrap leading-relaxed select-text">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#0B3D28]/40">
                    <button
                      type="button"
                      disabled={actionInProgress === post.id}
                      onClick={() =>
                        requestActionConfirm(
                          "reject",
                          post.id,
                          `Scroll from ${post.alias}`,
                          post.content
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#251010] hover:bg-[#351515] border border-rose-500/50 text-rose-300 text-xs font-serif transition-colors cursor-pointer disabled:opacity-50 shadow-sm font-semibold"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject &amp; Seal Away</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionInProgress === post.id}
                      onClick={() =>
                        requestActionConfirm(
                          "approve",
                          post.id,
                          `Scroll from ${post.alias}`,
                          post.content
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0B3D28] hover:bg-[#087A48] border border-[#20C879]/80 text-[#20C879] hover:text-white text-xs font-serif font-bold transition-all shadow-[0_0_12px_rgba(32,200,121,0.3)] cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5 text-[#20C879]" />
                      <span>Seal Approval</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeSubTab === "approved" ? (
        /* Sub-tab 2: Approved Confessions */
        <div className="space-y-4">
          {approvedPosts.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/30 backdrop-blur-[8px]">
              <FileText className="w-10 h-10 text-[#D5AE65] mx-auto opacity-50" />
              <h3 className="font-cinzel text-base font-bold text-[#F0D49A]">
                No Approved Scrolls Recorded
              </h3>
              <p className="text-xs font-serif text-[#AFC3CF] max-w-sm mx-auto">
                Approved scrolls will appear here in the Warden archives.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl p-4 bg-[#020806]/20 hover:bg-[#06140D]/30 border border-[#20C879]/35 space-y-2.5 shadow-sm backdrop-blur-[8px]"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#0B3D28]/40">
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-xs font-bold text-[#F0D49A]">
                        {post.alias}
                      </span>
                      <span className="text-[10px] font-mono text-[#768b98]">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#0B3D28] text-[#20C879] border border-[#20C879]/50 font-semibold">
                      Live in Feed
                    </span>
                  </div>

                  <p className="font-cormorant text-sm text-[#E8D4A7] line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      disabled={actionInProgress === post.id}
                      onClick={() =>
                        requestActionConfirm(
                          "reject",
                          post.id,
                          `Revoke approval for ${post.alias}`,
                          post.content
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#251010] hover:bg-[#351515] border border-rose-500/40 text-rose-300 text-[11px] font-serif transition-colors cursor-pointer shadow-sm"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>Revoke &amp; Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeSubTab === "rejected" ? (
        /* Sub-tab 3: Rejected Confessions */
        <div className="space-y-4">
          {rejectedPosts.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/30 backdrop-blur-[8px]">
              <CheckCircle2 className="w-10 h-10 text-[#20C879] mx-auto opacity-50" />
              <h3 className="font-cinzel text-base font-bold text-[#F0D49A]">
                No Rejected Scrolls
              </h3>
              <p className="text-xs font-serif text-[#AFC3CF] max-w-sm mx-auto">
                No scrolls are currently sealed away in the vault.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rejectedPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl p-4 bg-[#020806]/20 hover:bg-[#251010]/30 border border-rose-900/40 space-y-2.5 shadow-sm backdrop-blur-[8px]"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-rose-950/60">
                    <span className="font-cinzel text-xs font-bold text-rose-200">
                      {post.alias}
                    </span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-rose-950/60 text-rose-400 border border-rose-900 font-semibold">
                      Rejected
                    </span>
                  </div>

                  <p className="font-cormorant text-sm text-[#E8D4A7] line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      disabled={actionInProgress === post.id}
                      onClick={() =>
                        requestActionConfirm(
                          "approve",
                          post.id,
                          `Reconsider & Approve ${post.alias}`,
                          post.content
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0B3D28] hover:bg-[#087A48] border border-[#20C879]/60 text-[#20C879] hover:text-white text-[11px] font-serif transition-colors cursor-pointer shadow-sm font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reconsider &amp; Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Sub-tab 4: Confidential Reports */
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl bg-[#020806]/20 border border-[#B58A45]/30 backdrop-blur-[8px]">
              <ShieldCheck className="w-10 h-10 text-[#20C879] mx-auto" />
              <h3 className="font-cinzel text-base font-bold text-[#F0D49A]">
                No Reports On Record
              </h3>
              <p className="text-xs font-serif text-[#AFC3CF] max-w-sm mx-auto">
                No scrolls are currently flagged by students.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl p-4 sm:p-5 bg-[#020806]/20 hover:bg-[#251010]/30 border border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-[8px]"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-300">
                        Reason: {report.reason}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.2 rounded text-[10px] font-mono uppercase font-semibold",
                          report.status === "pending"
                            ? "bg-rose-950/80 text-rose-300 border border-rose-500/50"
                            : "bg-[#0B3D28] text-[#20C879] border border-[#20C879]/50"
                        )}
                      >
                        {report.status}
                      </span>
                    </div>

                    {report.postContent && (
                      <p className="text-xs font-serif text-[#E8D4A7] bg-[#020806]/60 p-2.5 rounded-lg border border-[#B58A45]/20 italic line-clamp-2">
                        &ldquo;{report.postContent}&rdquo;
                      </p>
                    )}

                    <p className="text-[11px] font-mono text-[#768c99]">
                      Target Scroll ID: {report.postId} &bull; Logged:{" "}
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {report.status === "pending" && (
                      <>
                        <button
                          type="button"
                          disabled={actionInProgress === report.id}
                          onClick={() =>
                            requestActionConfirm(
                              "dismiss_report",
                              report.id,
                              `Dismiss Report (${report.reason})`
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#06140D] border border-[#B58A45]/35 text-xs font-serif text-[#AFC3CF] hover:text-white transition-colors cursor-pointer shadow-sm"
                        >
                          Dismiss
                        </button>
                        <button
                          type="button"
                          disabled={actionInProgress === report.id}
                          onClick={() =>
                            requestActionConfirm(
                              "review_report",
                              report.id,
                              `Mark Reviewed (${report.reason})`
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#0B3D28] border border-[#20C879]/70 text-xs font-serif text-[#20C879] hover:brightness-125 transition-all cursor-pointer font-semibold shadow-sm"
                        >
                          Mark Reviewed
                        </button>
                        <button
                          type="button"
                          disabled={actionInProgress === report.postId}
                          onClick={() =>
                            requestActionConfirm(
                              "reject",
                              report.postId,
                              `Reject Reported Scroll #${report.postId.slice(0, 8)}`,
                              report.postContent
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-500/60 text-xs font-serif text-rose-200 transition-colors cursor-pointer shadow-sm font-semibold"
                        >
                          Reject Scroll
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-[#06140D] border border-[#B58A45]/70 p-6 shadow-[0_12px_45px_rgba(0,0,0,0.9)] space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold",
                  confirmDialog.type === "approve"
                    ? "bg-[#0B3D28] border-[#20C879]/60 text-[#20C879]"
                    : "bg-[#251010] border-rose-500/60 text-rose-300"
                )}
              >
                {confirmDialog.type === "approve" ? (
                  <Sparkles className="w-5 h-5 text-[#20C879]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                )}
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#F0D49A]">
                  Confirm Warden Action
                </h3>
                <p className="text-xs font-serif text-[#AFC3CF]">
                  {confirmDialog.targetTitle}
                </p>
              </div>
            </div>

            {confirmDialog.snippet && (
              <div className="p-3 rounded-xl bg-[#020806] border border-[#B58A45]/25 text-xs font-serif text-[#E8D4A7] italic max-h-28 overflow-y-auto">
                &ldquo;{confirmDialog.snippet}&rdquo;
              </div>
            )}

            <p className="text-xs font-serif text-[#AFC3CF] leading-relaxed">
              {confirmDialog.type === "approve"
                ? "This scroll will be formally sealed with approval and released to the public Owl Post sanctuary immediately."
                : confirmDialog.type === "reject"
                ? "This scroll will be rejected and sealed away from public view. It will remain in the Warden vault."
                : "Are you certain you wish to update this confidential report record?"}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#0B3D28]">
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
                }
                className="px-3.5 py-1.5 rounded-lg bg-[#020806] border border-[#B58A45]/30 text-xs font-serif text-[#AFC3CF] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmedAction}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-serif font-bold transition-all shadow-md cursor-pointer",
                  confirmDialog.type === "approve"
                    ? "bg-[#0B3D28] hover:bg-[#087A48] border border-[#20C879] text-[#20C879] hover:text-white"
                    : "bg-rose-950 hover:bg-rose-900 border border-rose-500 text-rose-200"
                )}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
