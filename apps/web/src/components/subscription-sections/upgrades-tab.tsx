"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calculator01Icon,
} from "@hugeicons/core-free-icons";

interface UpgradesTabProps {
  subscriptions: any[];
  plans: any[];
  payments: any[];
  onOpenUpgradeModal: (sub: any) => void;
}

export function UpgradesTab({
  subscriptions,
  plans,
  payments,
  onOpenUpgradeModal,
}: UpgradesTabProps) {
  const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trialing");
  const [selectedSubId, setSelectedSubId] = useState(activeSubs[0]?.id || "");
  const [targetPlanId, setTargetPlanId] = useState(plans[1]?.id || plans[0]?.id || "");
  const [targetCycle, setTargetCycle] = useState<"monthly" | "yearly">("monthly");

  const selectedSub = activeSubs.find((s) => s.id === selectedSubId) || activeSubs[0];
  const targetPlan = plans.find((p) => p.id === targetPlanId) || plans[0];

  // Calculation
  let unusedCredit = 0;
  let targetProratedCost = 0;
  let netDelta = 0;
  let remainingDays = 0;

  if (selectedSub && targetPlan) {
    const now = new Date().getTime();
    const start = new Date(selectedSub.currentPeriodStart).getTime();
    const end = new Date(selectedSub.currentPeriodEnd).getTime();
    const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    remainingDays = Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24)));
    const fraction = remainingDays / totalDays;

    const currentPrice = selectedSub.amount;
    const targetPrice = targetCycle === "yearly" ? targetPlan.yearlyPrice : targetPlan.monthlyPrice;

    unusedCredit = Math.round(currentPrice * fraction * 100) / 100;
    targetProratedCost = Math.round(targetPrice * fraction * 100) / 100;
    netDelta = Math.round((targetProratedCost - unusedCredit) * 100) / 100;
  }

  // Filter adjustment invoices
  const upgradeInvoices = payments.filter(
    (p) =>
      p.planName?.toLowerCase().includes("upgrade") ||
      p.description?.toLowerCase().includes("prorated")
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black font-display text-[#0e0f0c]">
          Upgrades & Proration Engine
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Simulate and execute tier switches with real-time pro-rata day calculation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proration Interactive Simulator */}
        <Card className="lg:col-span-2 rounded-3xl border-black/10 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-black/10">
            <div className="rounded-xl bg-[#e2f6d5] p-2 text-[#054d28]">
              <HugeiconsIcon icon={Calculator01Icon} strokeWidth={2} className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-black font-display text-[#0e0f0c]">
                Live Proration Simulator
              </h3>
              <p className="text-xs text-muted-foreground">
                Select a member and compare plans to preview instantaneous pro-rata adjustments
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Select Customer Subscription
              </label>
              <select
                value={selectedSubId}
                onChange={(e) => setSelectedSubId(e.target.value)}
                className="w-full h-11 rounded-xl border border-black/20 bg-background px-3 text-sm font-medium"
              >
                {activeSubs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.customerName} — currently on {s.planName} (${s.amount}/{s.billingCycle})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Target Tier
                </label>
                <select
                  value={targetPlanId}
                  onChange={(e) => setTargetPlanId(e.target.value)}
                  className="w-full h-11 rounded-xl border border-black/20 bg-background px-3 text-sm font-medium"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${targetCycle === "yearly" ? p.yearlyPrice : p.monthlyPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                  Target Cycle
                </label>
                <div className="flex rounded-xl bg-[#f6f8f5] p-1 border border-black/10">
                  <button
                    type="button"
                    onClick={() => setTargetCycle("monthly")}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                      targetCycle === "monthly" ? "bg-[#0e0f0c] text-white" : "text-muted-foreground"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetCycle("yearly")}
                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                      targetCycle === "yearly" ? "bg-[#0e0f0c] text-white" : "text-muted-foreground"
                    }`}
                  >
                    Annual
                  </button>
                </div>
              </div>
            </div>

            {/* Visualizer Math Box */}
            <div className="rounded-2xl bg-[#e8ebe6] p-5 text-xs space-y-2 mt-4">
              <div className="flex items-center justify-between font-bold text-foreground">
                <span>Cycle Duration Analysis:</span>
                <span className="text-[#054d28] font-bold">{remainingDays} days remaining</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Credit for unused portion of {selectedSub?.planName}:</span>
                <span className="text-[#054d28] font-medium">-${unusedCredit.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Prorated cost for remainder on {targetPlan?.name}:</span>
                <span className="font-medium text-foreground">+${targetProratedCost.toFixed(2)} USD</span>
              </div>
              <div className="mt-3 pt-3 border-t border-black/10 flex justify-between items-center text-sm font-black text-[#0e0f0c]">
                <span>Immediate Charge to Customer:</span>
                <span className="text-lg text-[#054d28]">
                  {netDelta > 0 ? `$${netDelta.toFixed(2)} USD` : `$0.00 (Credit of $${Math.abs(netDelta).toFixed(2)})`}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => selectedSub && onOpenUpgradeModal(selectedSub)}
                className="w-full rounded-full h-11 bg-[#9fe870] text-[#0e0f0c] font-black hover:bg-[#cdffad] text-sm"
              >
                Open Upgrade Wizard for {selectedSub?.customerName} →
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Plan Switch Trigger List */}
        <Card className="rounded-3xl border-black/10 bg-white p-6 shadow-xs">
          <h3 className="text-base font-black font-display text-[#0e0f0c] pb-3 border-b border-black/10">
            Quick Upgrade Shortcuts
          </h3>
          <div className="mt-4 space-y-3">
            {activeSubs.slice(0, 5).map((sub) => (
              <div
                key={sub.id}
                className="rounded-2xl border border-black/10 bg-[#f6f8f5] p-3 text-xs flex items-center justify-between hover:border-[#9fe870] transition-colors"
              >
                <div>
                  <div className="font-bold text-foreground">{sub.customerName}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Current: <strong>{sub.planName}</strong> (${sub.amount}/{sub.billingCycle})
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onOpenUpgradeModal(sub)}
                  className="rounded-full bg-[#0e0f0c] text-white hover:bg-[#9fe870] hover:text-[#0e0f0c] text-[11px] font-bold h-7 px-3"
                >
                  Upgrade
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Proration Adjustment Log */}
      <Card className="rounded-3xl border-black/10 bg-white p-6 shadow-xs">
        <h3 className="text-base font-black font-display text-[#0e0f0c] mb-4">
          Prorated Adjustments & Tier Switch Records
        </h3>

        {upgradeInvoices.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            No upgrade proration invoices recorded yet. Test an upgrade above to generate one!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Adjustment Description</th>
                  <th className="pb-3">Net Charged</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {upgradeInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-3 font-mono font-bold">{inv.id}</td>
                    <td className="py-3 font-semibold">{inv.customerName}</td>
                    <td className="py-3 text-muted-foreground">{inv.description}</td>
                    <td className="py-3 font-mono font-bold text-[#054d28]">${inv.amount} USD</td>
                    <td className="py-3 text-right text-muted-foreground">
                      {new Date(inv.createdAt).toLocaleDateString()}
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
