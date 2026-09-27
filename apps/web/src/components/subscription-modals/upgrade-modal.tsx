"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Calculator01Icon,
} from "@hugeicons/core-free-icons";

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
}

interface Subscription {
  id: string;
  customerName: string;
  planId: string;
  planName: string;
  billingCycle: "monthly" | "yearly";
  amount: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  plans: Plan[];
  onSuccess: () => void;
}

export function UpgradeModal({
  open,
  onClose,
  subscription,
  plans,
  onSuccess,
}: UpgradeModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [targetCycle, setTargetCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (subscription) {
      // Default to next tier or first different plan
      const currentIdx = plans.findIndex((p) => p.id === subscription.planId);
      const nextPlan = plans[currentIdx + 1] || plans.find((p) => p.id !== subscription.planId) || plans[0];
      if (nextPlan) {
        setSelectedPlanId(nextPlan.id);
      }
      setTargetCycle(subscription.billingCycle);
    }
  }, [subscription, plans]);

  if (!open || !subscription) return null;

  const targetPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  // Calculate live proration preview
  const now = new Date().getTime();
  const start = new Date(subscription.currentPeriodStart).getTime();
  const end = new Date(subscription.currentPeriodEnd).getTime();
  const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  const remainingDays = Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24)));
  const fraction = remainingDays / totalDays;

  const currentPrice = subscription.amount;
  const targetPrice = targetPlan
    ? targetCycle === "yearly"
      ? targetPlan.yearlyPrice
      : targetPlan.monthlyPrice
    : 0;

  const unusedCredit = Math.round(currentPrice * fraction * 100) / 100;
  const targetProratedCost = Math.round(targetPrice * fraction * 100) / 100;
  const proratedAdjustment = Math.round((targetProratedCost - unusedCredit) * 100) / 100;
  const isUpgrade = targetPrice >= currentPrice;

  const handleUpgrade = async () => {
    if (!targetPlan) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/subscriptions/${subscription.id}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetPlanId: targetPlan.id,
          targetCycle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upgrade failed");

      toast.success(
        `Subscription successfully changed to ${targetPlan.name}! ${
          proratedAdjustment > 0
            ? `Prorated charge: $${proratedAdjustment.toFixed(2)}`
            : "Credit applied."
        }`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-black/10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-black/10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#054d28] bg-[#e2f6d5] px-2.5 py-0.5 rounded-full">
              Proration Engine
            </span>
            <h2 className="mt-1 text-xl font-black font-display text-[#0e0f0c]">
              Change Subscription Plan
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customer: <span className="font-semibold text-foreground">{subscription.customerName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-black/5 hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-5" />
          </button>
        </div>

        {/* Current vs New comparison */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-black/10 bg-[#f6f8f5] p-3.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">Current Plan</span>
            <div className="mt-1 text-base font-black text-[#0e0f0c]">{subscription.planName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              ${subscription.amount} / {subscription.billingCycle}
            </div>
            <div className="mt-2 text-[11px] text-[#054d28] font-medium">
              {remainingDays} days left in cycle
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#0e0f0c] bg-[#e2f6d5]/40 p-3.5 ring-2 ring-[#9fe870]">
            <span className="text-[11px] font-bold text-[#054d28] uppercase">Target Tier</span>
            <div className="mt-1 text-base font-black text-[#0e0f0c]">{targetPlan?.name}</div>
            <div className="text-xs font-semibold text-[#0e0f0c] mt-0.5">
              ${targetPrice} / {targetCycle}
            </div>
            <div className="mt-2 text-[11px] font-bold text-[#163300]">
              {isUpgrade ? "▲ Instant Upgrade" : "▼ Instant Downgrade"}
            </div>
          </div>
        </div>

        {/* Select Target Plan */}
        <div className="mt-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
            Select New Plan
          </Label>
          <div className="space-y-2">
            {plans.map((p) => {
              const isSelected = selectedPlanId === p.id;
              const isCurrent = p.id === subscription.planId;
              const pPrice = targetCycle === "yearly" ? p.yearlyPrice : p.monthlyPrice;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`flex items-center justify-between cursor-pointer rounded-2xl p-3 border transition-all ${
                    isSelected
                      ? "border-[#0e0f0c] bg-white ring-2 ring-[#9fe870]"
                      : "border-black/10 bg-[#f6f8f5] hover:bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0e0f0c]">{p.name}</span>
                      {isCurrent && (
                        <span className="rounded-md bg-black/10 px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {p.features.slice(0, 2).join(" • ")}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-[#0e0f0c]">${pPrice}</span>
                    <span className="text-xs text-muted-foreground">/{targetCycle === "yearly" ? "yr" : "mo"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cycle Toggle */}
        <div className="mt-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
            Target Billing Cycle
          </Label>
          <div className="flex rounded-xl bg-[#f6f8f5] p-1 border border-black/10">
            <button
              type="button"
              onClick={() => setTargetCycle("monthly")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${
                targetCycle === "monthly"
                  ? "bg-[#0e0f0c] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setTargetCycle("yearly")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${
                targetCycle === "yearly"
                  ? "bg-[#0e0f0c] text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly (Annual discount)
            </button>
          </div>
        </div>

        {/* Proration Breakdown */}
        <div className="mt-4 rounded-2xl bg-[#e8ebe6] p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-foreground mb-1">
            <HugeiconsIcon icon={Calculator01Icon} strokeWidth={2} className="size-4 text-[#054d28]" />
            <span>Automated Proration Calculation</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Unused credit on current {subscription.planName}:</span>
            <span className="text-[#054d28] font-medium">-${unusedCredit.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Prorated cost of {targetPlan?.name} ({remainingDays} days):</span>
            <span className="font-medium text-foreground">+${targetProratedCost.toFixed(2)} USD</span>
          </div>
          <div className="pt-2 border-t border-black/10 flex justify-between text-sm font-bold text-[#0e0f0c]">
            <span>Net adjustment charged today:</span>
            <span className="text-base text-[#054d28]">
              {proratedAdjustment > 0
                ? `$${proratedAdjustment.toFixed(2)} USD`
                : `$0.00 USD (Credit of $${Math.abs(proratedAdjustment).toFixed(2)})`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-full h-11 border-black/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={loading || selectedPlanId === subscription.planId && targetCycle === subscription.billingCycle}
            className="flex-1 rounded-full h-11 bg-[#9fe870] text-[#0e0f0c] font-black hover:bg-[#cdffad]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4 text-[#0e0f0c]" />
                Processing...
              </span>
            ) : isUpgrade ? (
              "Confirm Upgrade →"
            ) : (
              "Confirm Plan Switch →"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
