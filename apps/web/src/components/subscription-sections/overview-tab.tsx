"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartUpIcon,
  Calendar03Icon,
  PlusSignCircleIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface OverviewTabProps {
  metrics: any;
  subscriptions: any[];
  renewals: any[];
  plans?: any[];
  onNavigate: (tab: string) => void;
  onOpenNewSub: () => void;
  onOpenUpgrade: (sub: any) => void;
  onOpenCancel: (sub: any) => void;
  onProcessRenewal: (subId: string) => void;
}

export function OverviewTab({
  metrics,
  subscriptions,
  renewals,
  onNavigate,
  onOpenNewSub,
  onOpenUpgrade,
  onOpenCancel,
  onProcessRenewal,
}: OverviewTabProps) {
  const chartData = metrics?.revenueTrend || [
    { month: "May", mrr: 2980, netRevenue: 3400 },
    { month: "Jun", mrr: 3450, netRevenue: 4100 },
    { month: "Jul", mrr: 4120, netRevenue: 4950 },
    { month: "Aug", mrr: 4890, netRevenue: 5600 },
    { month: "Sep", mrr: metrics?.mrr || 5420, netRevenue: 6400 },
  ];

  const upcomingRenewals = renewals
    .filter((r) => r.status === "scheduled")
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-[#0e0f0c] p-6 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#9fe870] px-2.5 py-0.5 text-xs font-black text-[#0e0f0c]">
              LIVE METRICS
            </span>
            <span className="text-xs text-white/70">
              Wise Multi-Currency Subscription Core
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            Subscription Engine Dashboard
          </h1>
          <p className="mt-1 text-sm text-white/70 max-w-xl">
            Real-time management for customers, tier proration, automated dunning renewals, and payment collection.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={onOpenNewSub}
            className="rounded-full bg-[#9fe870] text-[#0e0f0c] font-black hover:bg-[#cdffad] h-11 px-5 gap-2 text-sm shadow-sm"
          >
            <HugeiconsIcon icon={PlusSignCircleIcon} strokeWidth={2.5} className="size-4" />
            + New Subscription
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* MRR */}
        <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs hover:border-[#9fe870] transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
            <span>Monthly Recurring (MRR)</span>
            <Badge variant="outline" className="rounded-full border-[#9fe870] bg-[#e2f6d5] text-[#054d28] font-bold gap-1 text-[11px]">
              <HugeiconsIcon icon={ChartUpIcon} strokeWidth={2.5} className="size-3" />
              +14.2%
            </Badge>
          </div>
          <div className="mt-3 text-3xl font-black font-display text-[#0e0f0c] tracking-tight">
            ${metrics?.mrr?.toLocaleString() || "0"}
            <span className="text-xs font-normal text-muted-foreground ml-1">/mo</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            ARR Run-rate: <strong className="text-foreground">${metrics?.arr?.toLocaleString() || "0"}</strong>
          </div>
        </Card>

        {/* Active Subscribers */}
        <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs hover:border-[#9fe870] transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
            <span>Active Subscribers</span>
            <Badge variant="outline" className="rounded-full bg-[#f6f8f5] text-foreground font-bold text-[11px]">
              {metrics?.trialingSubscribers || 0} trialing
            </Badge>
          </div>
          <div className="mt-3 text-3xl font-black font-display text-[#0e0f0c] tracking-tight">
            {metrics?.activeSubscribers || 0}
            <span className="text-xs font-normal text-muted-foreground ml-1">accounts</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Total lifetime customers: <strong className="text-foreground">{metrics?.totalCustomers || 0}</strong>
          </div>
        </Card>

        {/* Churn Rate */}
        <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs hover:border-[#9fe870] transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
            <span>Gross Churn Rate</span>
            <Badge variant="outline" className="rounded-full border-black/10 bg-white text-muted-foreground font-bold text-[11px]">
              Past 30d
            </Badge>
          </div>
          <div className="mt-3 text-3xl font-black font-display text-[#0e0f0c] tracking-tight">
            {metrics?.churnRate || "0.0"}%
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Retention offer active: <strong className="text-[#054d28]">25% counter-discount</strong>
          </div>
        </Card>

        {/* ARPU */}
        <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs hover:border-[#9fe870] transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold uppercase tracking-wider">
            <span>Avg Revenue / User (ARPU)</span>
            <Badge variant="outline" className="rounded-full bg-[#e2f6d5] text-[#163300] font-bold text-[11px]">
              Global
            </Badge>
          </div>
          <div className="mt-3 text-3xl font-black font-display text-[#0e0f0c] tracking-tight">
            ${metrics?.arpu || 0}
            <span className="text-xs font-normal text-muted-foreground ml-1">/seat</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Across Starter, Growth & Scale
          </div>
        </Card>
      </div>

      {/* Main Graph & Upcoming Renewals split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive MRR Growth Chart */}
        <Card className="lg:col-span-2 rounded-3xl border-black/10 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/10">
            <div>
              <CardTitle className="text-lg font-black font-display text-[#0e0f0c]">
                Recurring Revenue & MRR Growth
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Historical trajectory and forecast projection (USD)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#0e0f0c]">
                <span className="size-2.5 rounded-full bg-[#9fe870]" /> MRR
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground ml-2">
                <span className="size-2.5 rounded-full bg-[#38c8ff]" /> Net Invoiced
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9fe870" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#9fe870" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38c8ff" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#38c8ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8ebe6" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#868685" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#868685" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0e0f0c",
                    color: "#ffffff",
                    borderRadius: "16px",
                    border: "none",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  }}
                  formatter={(value: any) => [`$${value}`, "Amount"]}
                />
                <Area type="monotone" dataKey="netRevenue" stroke="#38c8ff" strokeWidth={2} fillOpacity={1} fill="url(#colorNet)" />
                <Area type="monotone" dataKey="mrr" stroke="#9fe870" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Actionable Upcoming Renewals List */}
        <Card className="rounded-3xl border-black/10 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-[#ffd11a]/20 p-2 text-[#b86700]">
                  <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />
                </div>
                <div>
                  <h3 className="font-black font-display text-sm text-[#0e0f0c]">
                    Upcoming Renewals
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Next 30 days pipeline</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate("renewals")}
                className="text-xs font-bold text-[#054d28] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingRenewals.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-black/10 bg-[#f6f8f5] p-3 text-xs hover:border-[#9fe870] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0e0f0c]">{r.customerName}</span>
                    <Badge variant="outline" className="rounded-full bg-white text-[10px] font-bold">
                      in {r.daysUntil}d
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-muted-foreground">
                    <span>{r.planName}</span>
                    <span className="font-black text-[#0e0f0c]">${r.amount} USD</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Card: •••• {r.cardLast4}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => onProcessRenewal(r.subscriptionId)}
                      className="h-6 rounded-full bg-[#0e0f0c] text-white hover:bg-[#9fe870] hover:text-[#0e0f0c] text-[10px] font-black px-2.5 transition-colors"
                    >
                      Process Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => onNavigate("renewals")}
            variant="outline"
            className="w-full mt-4 rounded-full h-10 border-black/15 text-xs font-bold gap-1"
          >
            <span>Open Dunning & Renewal Center</span>
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
          </Button>
        </Card>
      </div>

      {/* Active Subscriptions Quick Table */}
      <Card className="rounded-3xl border-black/10 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/10">
          <div>
            <h3 className="text-base font-black font-display text-[#0e0f0c]">
              Recent Subscriptions Overview
            </h3>
            <p className="text-xs text-muted-foreground">
              Current active, trialing and paused subscriptions
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate("subscriptions")}
            className="rounded-full text-xs font-bold gap-1 self-start sm:self-auto"
          >
            <span>Manage All ({subscriptions.length})</span>
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-3.5" />
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-2">Customer</th>
                <th className="pb-2">Plan</th>
                <th className="pb-2">Billing Cycle</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Next Renewal</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {subscriptions.slice(0, 5).map((sub) => (
                <tr key={sub.id} className="hover:bg-[#f6f8f5]/60 transition-colors">
                  <td className="py-3">
                    <div className="font-bold text-foreground">{sub.customerName}</div>
                    <div className="text-[11px] text-muted-foreground">{sub.customerEmail}</div>
                  </td>
                  <td className="py-3 font-semibold text-foreground">
                    {sub.planName}
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      ${sub.amount}/{sub.billingCycle === "yearly" ? "yr" : "mo"}
                    </span>
                  </td>
                  <td className="py-3 capitalize text-muted-foreground">
                    {sub.billingCycle}
                  </td>
                  <td className="py-3">
                    <Badge
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        sub.status === "active"
                          ? "bg-[#9fe870] text-[#0e0f0c] hover:bg-[#9fe870]"
                          : sub.status === "trialing"
                          ? "bg-[#38c8ff]/20 text-[#0070a0]"
                          : sub.status === "past_due"
                          ? "bg-[#ffd11a]/20 text-[#b86700]"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {sub.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(sub.nextRenewalDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenUpgrade(sub)}
                        className="h-7 rounded-full text-[11px] font-bold border-black/15"
                      >
                        Upgrade
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenCancel(sub)}
                        className="h-7 rounded-full text-[11px] text-muted-foreground hover:text-destructive"
                      >
                        Cancel
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
