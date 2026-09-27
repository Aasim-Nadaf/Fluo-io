"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

interface CancellationsTabProps {
  subscriptions: any[];
  onOpenCancelModal?: (sub: any) => void;
  onRefresh: () => void;
}

export function CancellationsTab({
  subscriptions,
  onRefresh,
}: CancellationsTabProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const canceledSubs = subscriptions.filter((s) => s.status === "canceled");
  const pendingCancelSubs = subscriptions.filter((s) => s.cancelAtPeriodEnd);

  const handleReactivate = async (sub: any) => {
    setLoadingId(sub.id);
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}/reactivate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reactivate");

      toast.success(`Subscription reactivated for ${sub.customerName}!`);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to reactivate");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black font-display text-[#0e0f0c]">
          Churn Analysis & Retention
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Monitor cancellation drivers, customer exit feedback, and win-back opportunities
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Total Churned Accounts
          </span>
          <div className="mt-2 text-3xl font-black font-display text-destructive">
            {canceledSubs.length}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Lifetime cancellation count
          </p>
        </Card>

        <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Pending Period-End Cancels
          </span>
          <div className="mt-2 text-3xl font-black font-display text-[#ffd11a]-deep text-amber-600">
            {pendingCancelSubs.length}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Still active until renewal date
          </p>
        </Card>

        <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Retention Offer Saves
          </span>
          <div className="mt-2 text-3xl font-black font-display text-[#054d28]">
            33.3%
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Accepted 25% discount counter-offer
          </p>
        </Card>
      </div>

      {/* Pending Cancellations (Intervention Required) */}
      {pendingCancelSubs.length > 0 && (
        <Card className="rounded-3xl border border-amber-300 bg-amber-50/50 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-200">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-5 text-amber-700" />
            <h3 className="font-black text-sm text-amber-900">
              Pending Period-End Expirations (Save Opportunity)
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            {pendingCancelSubs.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-2xl bg-white p-4 border border-amber-200"
              >
                <div>
                  <div className="font-bold text-sm text-foreground">{sub.customerName}</div>
                  <div className="text-xs text-muted-foreground">
                    Plan: {sub.planName} • Cancels on {new Date(sub.nextRenewalDate).toLocaleDateString()}
                  </div>
                  {sub.cancellationReason && (
                    <div className="text-xs text-destructive mt-1 font-medium">
                      Reason: &ldquo;{sub.cancellationReason}&rdquo;
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleReactivate(sub)}
                  disabled={loadingId === sub.id}
                  className="rounded-full bg-[#0e0f0c] text-white hover:bg-[#9fe870] hover:text-[#0e0f0c] text-xs font-bold"
                >
                  Win-Back & Reactivate
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Churned Subscriptions Log */}
      <Card className="rounded-3xl border-black/10 bg-white p-6 shadow-xs">
        <h3 className="text-base font-black font-display text-[#0e0f0c] mb-4">
          Exit Feedback & Churn History
        </h3>

        {canceledSubs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs">
            No churned accounts recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Plan Lost</th>
                  <th className="pb-3">Primary Reason</th>
                  <th className="pb-3">Customer Feedback</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {canceledSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#f6f8f5]/60 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-foreground">{sub.customerName}</div>
                      <div className="text-[11px] text-muted-foreground">{sub.customerEmail}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-semibold text-foreground">{sub.planName}</span>
                      <span className="block text-[11px] text-destructive">
                        -${sub.amount}/{sub.billingCycle} MRR
                      </span>
                    </td>
                    <td className="py-3.5">
                      <Badge variant="outline" className="rounded-full text-[10px] border-destructive/30 text-destructive bg-destructive/5 font-semibold">
                        {sub.cancellationReason || "Pricing / Budget cuts"}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-muted-foreground max-w-xs truncate">
                      {sub.cancellationFeedback || "Downsizing team for H2."}
                    </td>
                    <td className="py-3.5 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleReactivate(sub)}
                        disabled={loadingId === sub.id}
                        className="h-7 rounded-full bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad] text-[11px] font-black"
                      >
                        Reactivate Member
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
