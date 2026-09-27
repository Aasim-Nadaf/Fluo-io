"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SearchIcon,
  EyeIcon,
} from "@hugeicons/core-free-icons";

interface PaymentsTabProps {
  payments: any[];
  onOpenInvoiceModal: (inv: any) => void;
  onRefresh?: () => void;
}

export function PaymentsTab({
  payments,
  onOpenInvoiceModal,
}: PaymentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.planName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments
    .filter((p) => p.status === "succeeded")
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalFailed = payments.filter((p) => p.status === "failed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#0e0f0c]">
            Payments & Invoice Ledger
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit-ready multi-currency billing invoices, retry failed charges and issue refunds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-[#e2f6d5] text-[#163300] hover:bg-[#e2f6d5] rounded-full px-3 py-1 text-xs font-bold">
            Total Invoiced: ${totalCollected.toLocaleString()} USD
          </Badge>
          {totalFailed > 0 && (
            <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 rounded-full px-3 py-1 text-xs font-bold">
              {totalFailed} Failed Charges
            </Badge>
          )}
        </div>
      </div>

      <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-black/10">
          <div className="relative flex-1 max-w-md">
            <HugeiconsIcon
              icon={SearchIcon}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by invoice ID, customer, plan or email..."
              className="h-9 pl-9 rounded-xl border-black/20 text-xs"
            />
          </div>

          <div className="flex items-center gap-1">
            {["all", "succeeded", "failed", "refunded"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-full px-3 py-1 text-xs font-bold capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-[#0e0f0c] text-white"
                    : "bg-[#f6f8f5] text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3">Invoice ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Plan / Description</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Date & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#f6f8f5]/60 transition-colors">
                    <td className="py-3.5 pr-2 font-mono font-bold text-foreground">
                      {inv.id}
                      <span className="block text-[10px] font-normal text-muted-foreground">
                        {inv.receiptNumber}
                      </span>
                    </td>

                    <td className="py-3.5 pr-2">
                      <div className="font-bold text-foreground">{inv.customerName}</div>
                      <div className="text-[11px] text-muted-foreground">{inv.customerEmail}</div>
                    </td>

                    <td className="py-3.5 pr-2">
                      <div className="font-semibold text-foreground">{inv.planName}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                        {inv.description}
                      </div>
                    </td>

                    <td className="py-3.5 pr-2 font-mono font-bold text-sm text-foreground">
                      ${inv.amount.toFixed(2)} {inv.currency}
                    </td>

                    <td className="py-3.5 pr-2 font-mono text-muted-foreground text-xs">
                      {inv.paymentMethod}
                    </td>

                    <td className="py-3.5 pr-2">
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          inv.status === "succeeded"
                            ? "bg-[#9fe870] text-[#0e0f0c] hover:bg-[#9fe870]"
                            : inv.status === "failed"
                            ? "bg-destructive text-white hover:bg-destructive"
                            : "bg-black/10 text-foreground"
                        }`}
                      >
                        {inv.status.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-muted-foreground text-[11px] mr-2">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onOpenInvoiceModal(inv)}
                          className="h-7 rounded-full text-[11px] font-bold border-black/20 gap-1"
                        >
                          <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-3" />
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
