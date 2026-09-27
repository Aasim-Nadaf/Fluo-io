"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  GiftIcon,
} from "@hugeicons/core-free-icons";

interface Subscription {
  id: string;
  customerName: string;
  planName: string;
  amount: number;
  currency: string;
  nextRenewalDate: string;
}

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onSuccess: () => void;
}

const REASONS = [
  "Pricing / Budget constraints",
  "Missing critical features",
  "Switching to an alternative provider",
  "Temporary project pause / company downsizing",
  "Difficult to integrate / technical blockers",
  "Other / Not specified",
];

export function CancelModal({
  open,
  onClose,
  subscription,
  onSuccess,
}: CancelModalProps) {
  const [reason, setReason] = useState(REASONS[0]);
  const [feedback, setFeedback] = useState("");
  const [immediate, setImmediate] = useState(false);
  const [showRetention, setShowRetention] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!open || !subscription) return null;

  const handleAcceptDiscount = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions/${subscription.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Customer requested cancellation but accepted 25% discount",
          retentionOffered: true,
          retentionAccepted: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply retention discount");

      toast.success(
        `Retention offer accepted! 25% discount applied. New rate: $${data.subscription.amount}/period.`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to process retention offer");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions/${subscription.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          feedback,
          immediate,
          retentionOffered: showRetention,
          retentionAccepted: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel subscription");

      toast.success(
        immediate
          ? `Subscription terminated immediately.`
          : `Subscription will cancel at period end (${new Date(
              subscription.nextRenewalDate
            ).toLocaleDateString()}).`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-black/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-black/10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full">
              Churn Management
            </span>
            <h2 className="mt-1 text-xl font-black font-display text-[#0e0f0c]">
              Cancel Subscription
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customer: <span className="font-semibold text-foreground">{subscription.customerName}</span> ({subscription.planName})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-black/5 hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-5" />
          </button>
        </div>

        {/* Retention Special Offer Box */}
        {showRetention && (
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#e2f6d5] to-[#c5edab] p-4 border border-[#9fe870] text-[#163300]">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#9fe870] p-2 text-[#0e0f0c] shadow-xs">
                <HugeiconsIcon icon={GiftIcon} strokeWidth={2} className="size-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm text-[#0e0f0c]">
                  Retention Counter-Proposal
                </h4>
                <p className="text-xs mt-1 text-[#454745] leading-relaxed">
                  Before canceling, offer this customer a{" "}
                  <strong className="text-[#0e0f0c]">25% discount for the next 3 billing cycles</strong> ($
                  {Math.round(subscription.amount * 0.75)}/period instead of ${subscription.amount}).
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleAcceptDiscount}
                    disabled={loading}
                    className="h-8 rounded-full bg-[#0e0f0c] text-white hover:bg-black text-xs font-bold px-3"
                  >
                    Apply 25% Retention Discount
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowRetention(false)}
                    className="text-xs text-muted-foreground underline hover:text-foreground"
                  >
                    Decline & proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Churn Survey */}
        <div className="mt-5 space-y-4">
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Primary Reason for Leaving
            </Label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-11 rounded-xl border border-black/20 bg-background px-3 text-sm font-medium"
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Customer Feedback / Exit Notes
            </Label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What could we have done better? Any specific missing capability?"
              className="min-h-[80px] rounded-xl text-xs"
            />
          </div>

          {/* Cancellation Timing */}
          <div className="rounded-2xl bg-[#f6f8f5] p-3.5 border border-black/10">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
              Cancellation Timing
            </Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="radio"
                  name="timing"
                  checked={!immediate}
                  onChange={() => setImmediate(false)}
                  className="accent-[#0e0f0c]"
                />
                <span>
                  <strong>Cancel at end of billing cycle</strong> (Recommended — active until{" "}
                  {new Date(subscription.nextRenewalDate).toLocaleDateString()})
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-destructive">
                <input
                  type="radio"
                  name="timing"
                  checked={immediate}
                  onChange={() => setImmediate(true)}
                  className="accent-destructive"
                />
                <span>
                  <strong>Cancel immediately</strong> (Revoke customer access right now)
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-full h-11 border-black/20"
          >
            Keep Subscription Active
          </Button>
          <Button
            type="button"
            onClick={handleConfirmCancel}
            disabled={loading}
            className="flex-1 rounded-full h-11 bg-destructive text-destructive-foreground font-black hover:bg-destructive/90"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" />
                Processing...
              </span>
            ) : (
              "Confirm Cancellation"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
