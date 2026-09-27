"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  PlusSignCircleIcon,
} from "@hugeicons/core-free-icons";

interface PlansTabProps {
  plans: any[];
  subscriptions: any[];
  onOpenNewPlan: () => void;
  onOpenNewSubWithPlan?: (planId: string) => void;
}

export function PlansTab({
  plans,
  subscriptions,
  onOpenNewPlan,
  onOpenNewSubWithPlan,
}: PlansTabProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="space-y-6">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#0e0f0c]">
            Plans & Pricing Architecture
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure subscription tiers, limits, features and pricing models
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Monthly / Annual Toggle */}
          <div className="flex rounded-full bg-white p-1 border border-black/10 shadow-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[#0e0f0c] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-[#0e0f0c] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Annual</span>
              <span className="rounded-full bg-[#9fe870] px-1.5 py-0.2 text-[9px] font-black text-[#0e0f0c]">
                -17%
              </span>
            </button>
          </div>

          <Button
            onClick={onOpenNewPlan}
            className="rounded-full bg-[#9fe870] text-[#0e0f0c] font-black hover:bg-[#cdffad] h-10 px-4 text-xs gap-1.5"
          >
            <HugeiconsIcon icon={PlusSignCircleIcon} strokeWidth={2.5} className="size-4" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => {
          const subscriberCount = subscriptions.filter(
            (s) => s.planId === p.id && s.status !== "canceled"
          ).length;

          const price = billingCycle === "yearly" ? p.yearlyPrice : p.monthlyPrice;

          return (
            <Card
              key={p.id}
              className={`rounded-3xl p-6 transition-all flex flex-col justify-between ${
                p.isPopular
                  ? "border-2 border-[#0e0f0c] bg-white ring-2 ring-[#9fe870] shadow-md relative"
                  : "border-black/10 bg-white hover:border-black/25 shadow-xs"
              }`}
            >
              <div>
                {p.isPopular && (
                  <div className="absolute -top-3 left-6 rounded-full bg-[#9fe870] px-3 py-0.5 text-[10px] font-black text-[#0e0f0c] uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black font-display text-[#0e0f0c]">
                    {p.name}
                  </h3>
                  <Badge variant="outline" className="rounded-full bg-[#f6f8f5] text-[10px] font-bold">
                    {subscriberCount} active
                  </Badge>
                </div>

                <p className="mt-2 text-xs text-muted-foreground min-h-[32px]">
                  {p.description}
                </p>

                <div className="mt-4 pt-4 border-t border-black/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-display text-[#0e0f0c]">
                      ${price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      /{billingCycle === "yearly" ? "year" : "month"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <div className="text-[11px] text-[#054d28] font-bold mt-0.5">
                      Billed annually ($
                      {Math.round(p.yearlyPrice / 12)}/mo equivalent)
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Included Capabilities
                  </span>
                  {p.features?.map((feat: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                      <div className="rounded-full bg-[#e2f6d5] p-0.5 text-[#054d28] mt-0.5 shrink-0">
                        <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-3" />
                      </div>
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-black/10">
                <Button
                  onClick={() => onOpenNewSubWithPlan?.(p.id)}
                  className={`w-full rounded-full h-10 text-xs font-bold ${
                    p.isPopular
                      ? "bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad]"
                      : "bg-[#0e0f0c] text-white hover:bg-black"
                  }`}
                >
                  Assign to Customer →
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
