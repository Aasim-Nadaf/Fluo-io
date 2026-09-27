"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  PrinterIcon,
  RepeatIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { Logo } from "@/components/logo";

interface PaymentInvoice {
  id: string;
  subscriptionId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "refunded" | "pending";
  paymentMethod: string;
  failureReason?: string;
  refundedAmount?: number;
  createdAt: string;
  description: string;
  receiptNumber: string;
}

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: PaymentInvoice | null;
  onActionComplete: () => void;
}

export function InvoiceModal({
  open,
  onClose,
  invoice,
  onActionComplete,
}: InvoiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [showRefundInput, setShowRefundInput] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");

  if (!open || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleRetry = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: invoice.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retry failed");

      toast.success("Payment successfully reprocessed and marked as succeeded!");
      onActionComplete();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to retry charge");
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: invoice.id,
          refundAmount: refundAmount ? Number(refundAmount) : invoice.amount,
          reason: "Merchant refund via dashboard",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refund failed");

      toast.success(`Refund of $${refundAmount || invoice.amount} processed!`);
      onActionComplete();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to process refund");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl border border-black/10 max-h-[90vh] overflow-y-auto">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-black/10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-muted-foreground uppercase">
              Official Tax Invoice
            </span>
            <Badge
              variant={
                invoice.status === "succeeded"
                  ? "default"
                  : invoice.status === "failed"
                  ? "destructive"
                  : "outline"
              }
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                invoice.status === "succeeded"
                  ? "bg-[#9fe870] text-[#0e0f0c] hover:bg-[#9fe870]"
                  : ""
              }`}
            >
              {invoice.status.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="rounded-full gap-1.5 text-xs font-semibold"
            >
              <HugeiconsIcon icon={PrinterIcon} strokeWidth={2} className="size-3.5" />
              Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-black/5 hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <Logo className="h-8 w-fit" />
              <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground">Fluo Payments Ltd.</p>
                <p>56 Shoreditch High St, Tea Building</p>
                <p>London E1 6JJ, United Kingdom</p>
                <p>VAT ID: GB 924 102 884</p>
              </div>
            </div>

            <div className="text-right">
              <h3 className="font-mono text-xl font-black text-[#0e0f0c]">
                {invoice.id}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Receipt: <span className="font-mono text-foreground">{invoice.receiptNumber}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Issued: {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Method: <span className="font-medium text-foreground">{invoice.paymentMethod}</span>
              </p>
            </div>
          </div>

          {/* Billed to */}
          <div className="mt-8 rounded-2xl bg-[#f6f8f5] p-4 border border-black/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Billed To
            </span>
            <div className="mt-1 text-sm font-bold text-foreground">
              {invoice.customerName}
            </div>
            <div className="text-xs text-muted-foreground">{invoice.customerEmail}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Subscription ID: <span className="font-mono">{invoice.subscriptionId || "N/A"}</span>
            </div>
          </div>

          {/* Failed reason banner */}
          {invoice.status === "failed" && invoice.failureReason && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs font-semibold text-destructive border border-destructive/20">
              <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-4 shrink-0" />
              <span>Payment Failure Reason: {invoice.failureReason}</span>
            </div>
          )}

          {/* Itemized Table */}
          <div className="mt-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Unit Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                <tr>
                  <td className="py-3">
                    <div className="font-bold text-sm text-foreground">{invoice.planName}</div>
                    <div className="text-muted-foreground text-xs">{invoice.description}</div>
                  </td>
                  <td className="py-3 text-center font-medium">1</td>
                  <td className="py-3 text-right font-medium">${invoice.amount.toFixed(2)}</td>
                  <td className="py-3 text-right font-bold">${invoice.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 border-t border-black/10 pt-4 flex flex-col items-end gap-1.5 text-xs">
              <div className="flex w-60 justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-medium text-foreground">${invoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex w-60 justify-between text-muted-foreground">
                <span>VAT / Tax (0% B2B):</span>
                <span className="font-medium text-foreground">$0.00</span>
              </div>
              {invoice.refundedAmount ? (
                <div className="flex w-60 justify-between text-destructive font-bold">
                  <span>Refunded:</span>
                  <span>-${invoice.refundedAmount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex w-60 justify-between border-t border-black/10 pt-2 text-base font-black text-[#0e0f0c]">
                <span>Total Paid:</span>
                <span className="text-[#054d28]">
                  ${(invoice.status === "refunded" ? 0 : invoice.amount).toFixed(2)} {invoice.currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons for Merchant */}
        <div className="mt-8 border-t border-black/10 pt-5 print:hidden">
          {invoice.status === "failed" && (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRetry}
                disabled={loading}
                className="w-full rounded-full h-11 bg-[#9fe870] text-[#0e0f0c] font-black hover:bg-[#cdffad] gap-2"
              >
                {loading ? <Spinner className="size-4" /> : <HugeiconsIcon icon={RepeatIcon} strokeWidth={2} className="size-4" />}
                Retry Failed Payment Now
              </Button>
            </div>
          )}

          {invoice.status === "succeeded" && (
            <div>
              {showRefundInput ? (
                <div className="rounded-2xl bg-[#f6f8f5] p-3 border border-black/10 space-y-2">
                  <div className="text-xs font-bold">Issue Refund</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder={`Max: $${invoice.amount}`}
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="h-9 flex-1 rounded-xl border border-black/20 bg-white px-3 text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={handleRefund}
                      disabled={loading}
                      className="bg-destructive text-white hover:bg-destructive/90 rounded-xl text-xs font-bold"
                    >
                      Confirm Refund
                    </Button>
                    <button
                      type="button"
                      onClick={() => setShowRefundInput(false)}
                      className="text-xs text-muted-foreground underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRefundInput(true)}
                    className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-semibold"
                  >
                    Issue Refund
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
