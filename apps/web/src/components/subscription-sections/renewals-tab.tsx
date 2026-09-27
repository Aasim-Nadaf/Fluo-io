"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";

interface RenewalsTabProps {
  renewals: any[];
  onProcessRenewal: (subId: string) => void;
  onRefresh?: () => void;
}

export function RenewalsTab({
  renewals,
  onProcessRenewal,
}: RenewalsTabProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleProcess = async (r: any) => {
    setProcessingId(r.id);
    try {
      await onProcessRenewal(r.subscriptionId);
    } finally {
      setProcessingId(null);
    }
  };

  const dueSoon = renewals.filter((r) => r.status === "scheduled" && r.daysUntil <= 14);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#0e0f0c]">
            Renewals & Automated Dunning
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time renewal tracking, upcoming charges, and instant billing execution
          </p>
        </div>
        <div className="rounded-full bg-[#ffd11a]/20 px-3.5 py-1 text-xs font-bold text-[#b86700] border border-[#ffd11a]/40 self-start sm:self-auto flex items-center gap-1.5">
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-3.5" />
          <span>{dueSoon.length} renewals due within 14 days</span>
        </div>
      </div>

      {/* Urgent Renewals List */}
      <Card className="rounded-3xl border-black/10 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-black/10">
          <div>
            <h3 className="text-base font-black font-display text-[#0e0f0c]">
              Urgent Renewals Queue (&le; 14 Days)
            </h3>
            <p className="text-xs text-muted-foreground">
              Subscriptions approaching period expiration. Card will auto-charge on scheduled date.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dueSoon.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-black/10 bg-[#f6f8f5] p-4 flex flex-col justify-between hover:border-[#9fe870] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0e0f0c]">{r.customerName}</span>
                  <Badge
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      r.daysUntil <= 3
                        ? "bg-destructive text-white"
                        : "bg-[#ffd11a] text-[#4a3b1c]"
                    }`}
                  >
                    in {r.daysUntil} days
                  </Badge>
                </div>

                <div className="mt-2 text-xs text-muted-foreground">
                  Plan: <strong className="text-foreground">{r.planName}</strong>
                </div>

                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Scheduled Date:</span>
                  <span className="font-semibold text-foreground">
                    {new Date(r.scheduledDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Renewal Amount:</span>
                  <span className="font-black text-[#0e0f0c] text-sm">${r.amount} USD</span>
                </div>

                <div className="mt-2 pt-2 border-t border-black/10 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} className="size-3.5" />
                  <span>Card •••• {r.cardLast4}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/10">
                <Button
                  onClick={() => handleProcess(r)}
                  disabled={processingId === r.id}
                  className="w-full rounded-full h-9 bg-[#0e0f0c] text-white hover:bg-[#9fe870] hover:text-[#0e0f0c] text-xs font-bold transition-all"
                >
                  {processingId === r.id ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="size-3.5" /> Processing Charge...
                    </span>
                  ) : (
                    "Execute Renewal Charge Now"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* All Scheduled Renewals Table */}
      <Card className="rounded-3xl border-black/10 bg-white p-6 shadow-xs">
        <h3 className="text-base font-black font-display text-[#0e0f0c] mb-4">
          Complete Scheduled Renewal Pipeline
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Scheduled Date</th>
                <th className="pb-3">Days Until</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {renewals.map((r) => (
                <tr key={r.id} className="hover:bg-[#f6f8f5]/60 transition-colors">
                  <td className="py-3 font-bold text-foreground">{r.customerName}</td>
                  <td className="py-3 font-semibold text-foreground">{r.planName}</td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(r.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <Badge variant="outline" className="rounded-full bg-white text-[11px] font-bold">
                      {r.daysUntil > 0 ? `${r.daysUntil} days` : "Due today"}
                    </Badge>
                  </td>
                  <td className="py-3 font-mono font-bold text-foreground">${r.amount} USD</td>
                  <td className="py-3 font-mono text-muted-foreground">•••• {r.cardLast4}</td>
                  <td className="py-3 text-right">
                    <Button
                      size="sm"
                      onClick={() => handleProcess(r)}
                      disabled={processingId === r.id}
                      className="h-7 rounded-full bg-[#0e0f0c] text-white hover:bg-[#9fe870] hover:text-[#0e0f0c] text-[11px] font-bold"
                    >
                      {processingId === r.id ? <Spinner className="size-3" /> : "Process"}
                    </Button>
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
