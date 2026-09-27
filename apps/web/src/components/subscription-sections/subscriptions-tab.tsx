"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SearchIcon,
  PlusSignCircleIcon,
  RepeatIcon,
} from "@hugeicons/core-free-icons";

interface SubscriptionsTabProps {
  subscriptions: any[];
  plans?: any[];
  onOpenNewSub: () => void;
  onOpenUpgrade: (sub: any) => void;
  onOpenCancel: (sub: any) => void;
  onProcessRenewal: (subId: string) => void;
  onRefresh: () => void;
}

export function SubscriptionsTab({
  subscriptions,
  onOpenNewSub,
  onOpenUpgrade,
  onOpenCancel,
  onProcessRenewal,
  onRefresh,
}: SubscriptionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filteredSubs = subscriptions.filter((s) => {
    const matchesSearch =
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && s.status === "active") ||
      (statusFilter === "trialing" && s.status === "trialing") ||
      (statusFilter === "past_due" && s.status === "past_due") ||
      (statusFilter === "paused" && s.status === "paused") ||
      (statusFilter === "canceled" && s.status === "canceled");

    return matchesSearch && matchesStatus;
  });

  const handlePauseResume = async (sub: any) => {
    setLoadingAction(sub.id);
    const isPaused = sub.status === "paused";
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}/pause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isPaused ? "resume" : "pause",
          durationDays: 30,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Pause/Resume failed");

      toast.success(
        isPaused
          ? `Subscription resumed for ${sub.customerName}`
          : `Subscription paused for 30 days for ${sub.customerName}`
      );
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update pause state");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReactivate = async (sub: any) => {
    setLoadingAction(sub.id);
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}/reactivate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reactivate failed");

      toast.success(`Subscription reactivated for ${sub.customerName}!`);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to reactivate");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#0e0f0c]">
            Subscription Lifecycle
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage active memberships, tier upgrades, renewals and status changes
          </p>
        </div>
        <Button
          onClick={onOpenNewSub}
          className="rounded-full bg-[#9fe870] text-[#0e0f0c] font-black hover:bg-[#cdffad] h-10 px-4 text-xs gap-1.5 self-start sm:self-auto"
        >
          <HugeiconsIcon icon={PlusSignCircleIcon} strokeWidth={2.5} className="size-4" />
          Create Subscription
        </Button>
      </div>

      <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs">
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 border-b border-black/10">
          <div className="relative flex-1 max-w-md">
            <HugeiconsIcon
              icon={SearchIcon}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, email, plan or subscription ID..."
              className="h-9 pl-9 rounded-xl border-black/20 text-xs"
            />
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {["all", "active", "trialing", "past_due", "paused", "canceled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-full px-3 py-1 text-xs font-bold capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-[#0e0f0c] text-white"
                    : "bg-[#f6f8f5] text-muted-foreground hover:text-foreground"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Plan Tier</th>
                <th className="pb-3">Cycle & MRR</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Current Period & Renewal</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No subscriptions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => {
                  const mrr =
                    sub.billingCycle === "yearly"
                      ? Math.round(sub.amount / 12)
                      : sub.amount;

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-[#f6f8f5]/60 transition-colors"
                    >
                      <td className="py-3.5 pr-3">
                        <div className="font-bold text-foreground text-sm">
                          {sub.customerName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {sub.customerEmail}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground/80 mt-0.5">
                          ID: {sub.id}
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <span className="font-bold text-foreground">{sub.planName}</span>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          ${sub.amount} {sub.currency} billed {sub.billingCycle}
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <div className="font-mono font-bold text-foreground">
                          ${mrr}/mo MRR
                        </div>
                        <span className="text-[11px] text-muted-foreground capitalize">
                          {sub.billingCycle}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              sub.status === "active"
                                ? "bg-[#9fe870] text-[#0e0f0c] hover:bg-[#9fe870]"
                                : sub.status === "trialing"
                                ? "bg-[#38c8ff]/20 text-[#0070a0]"
                                : sub.status === "past_due"
                                ? "bg-[#ffd11a]/20 text-[#b86700]"
                                : sub.status === "paused"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {sub.status.toUpperCase()}
                          </Badge>

                          {sub.cancelAtPeriodEnd && (
                            <span className="text-[10px] font-semibold text-destructive">
                              Pending cancel
                            </span>
                          )}

                          {sub.status === "paused" && sub.pausedUntil && (
                            <span className="text-[10px] text-muted-foreground">
                              until {new Date(sub.pausedUntil).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <div className="text-foreground">
                          {new Date(sub.currentPeriodStart).toLocaleDateString()} –{" "}
                          {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <HugeiconsIcon icon={RepeatIcon} strokeWidth={2} className="size-3" />
                          <span>Renews: {new Date(sub.nextRenewalDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {sub.status === "canceled" ? (
                            <Button
                              size="sm"
                              onClick={() => handleReactivate(sub)}
                              disabled={loadingAction === sub.id}
                              className="h-7 rounded-full bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad] text-[11px] font-black"
                            >
                              Reactivate
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onOpenUpgrade(sub)}
                                className="h-7 rounded-full border-black/20 text-[11px] font-bold"
                              >
                                Upgrade
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onProcessRenewal(sub.id)}
                                className="h-7 rounded-full border-black/20 text-[11px] font-bold"
                              >
                                Renew
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handlePauseResume(sub)}
                                disabled={loadingAction === sub.id}
                                className="h-7 rounded-full text-[11px] text-muted-foreground"
                              >
                                {sub.status === "paused" ? "Resume" : "Pause"}
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onOpenCancel(sub)}
                                className="h-7 rounded-full text-[11px] text-destructive hover:bg-destructive/10"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
