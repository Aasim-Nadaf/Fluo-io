"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
}

interface NewSubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  plans: Plan[];
  onSuccess: () => void;
}

export function NewSubscriptionDialog({
  open,
  onClose,
  customers,
  plans,
  onSuccess,
}: NewSubscriptionDialogProps) {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]?.id || "");
  const [selectedPlan, setSelectedPlan] = useState(plans[0]?.id || "");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [status, setStatus] = useState<"active" | "trialing">("active");
  const [autoRenew, setAutoRenew] = useState(true);
  const [loading, setLoading] = useState(false);

  // Quick inline customer addition if desired
  const [isCreatingNewCustomer, setIsCreatingNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustCompany, setNewCustCompany] = useState("");

  if (!open) return null;

  const activePlan = plans.find((p) => p.id === selectedPlan) || plans[0];
  const price = activePlan
    ? billingCycle === "yearly"
      ? activePlan.yearlyPrice
      : activePlan.monthlyPrice
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let customerId = selectedCustomer;

      // Create new customer first if selected
      if (isCreatingNewCustomer) {
        if (!newCustName || !newCustEmail) {
          toast.error("Please fill name and email for the new customer");
          setLoading(false);
          return;
        }
        const custRes = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newCustName,
            email: newCustEmail,
            company: newCustCompany,
          }),
        });
        const custData = await custRes.json();
        if (!custRes.ok) throw new Error(custData.error || "Failed to create customer");
        customerId = custData.customer.id;
      }

      if (!customerId) {
        toast.error("Please select or create a customer");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          planId: selectedPlan || plans[0]?.id,
          billingCycle,
          status,
          autoRenew,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create subscription");

      toast.success(
        `Subscription created successfully for ${data.subscription.customerName}!`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create subscription");
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
              Full-Stack Provisioning
            </span>
            <h2 className="mt-1 text-xl font-black font-display text-[#0e0f0c]">
              Create New Subscription
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-black/5 hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Customer Selection or New */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Customer
              </Label>
              <button
                type="button"
                onClick={() => setIsCreatingNewCustomer(!isCreatingNewCustomer)}
                className="text-xs font-semibold text-[#054d28] underline"
              >
                {isCreatingNewCustomer ? "Select existing customer" : "+ Add new customer"}
              </button>
            </div>

            {isCreatingNewCustomer ? (
              <div className="space-y-3 rounded-2xl bg-[#f6f8f5] p-3.5 border border-black/10">
                <div>
                  <Label className="text-xs">Full Name</Label>
                  <Input
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Jordan Bell"
                    className="h-9 mt-1 rounded-xl bg-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input
                    type="email"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    placeholder="jordan@apex.co"
                    className="h-9 mt-1 rounded-xl bg-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Company (Optional)</Label>
                  <Input
                    value={newCustCompany}
                    onChange={(e) => setNewCustCompany(e.target.value)}
                    placeholder="Apex Holdings"
                    className="h-9 mt-1 rounded-xl bg-white"
                  />
                </div>
              </div>
            ) : (
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full h-11 rounded-xl border border-black/20 bg-background px-3 text-sm font-medium focus:border-[#9fe870] focus:ring-[#9fe870]"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company} ({c.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Plan Selection */}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Subscription Plan
            </Label>
            <div className="grid grid-cols-2 gap-2.5">
              {plans.map((p) => {
                const isSelected = (selectedPlan || plans[0]?.id) === p.id;
                const pPrice = billingCycle === "yearly" ? p.yearlyPrice : p.monthlyPrice;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`cursor-pointer rounded-2xl p-3.5 border transition-all text-left ${
                      isSelected
                        ? "border-[#0e0f0c] bg-[#e2f6d5]/50 ring-2 ring-[#9fe870]"
                        : "border-black/10 bg-white hover:border-black/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#0e0f0c]">{p.name}</span>
                      {isSelected && (
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2.5} className="size-4 text-[#054d28]" />
                      )}
                    </div>
                    <div className="mt-1 text-base font-black text-[#0e0f0c]">
                      ${pPrice}
                      <span className="text-xs font-normal text-muted-foreground">
                        /{billingCycle === "yearly" ? "yr" : "mo"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Billing Cycle */}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Billing Cycle
            </Label>
            <div className="flex rounded-xl bg-[#f6f8f5] p-1 border border-black/10">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-[#0e0f0c] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-[#0e0f0c] text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Annual Billing</span>
                <span className="rounded-full bg-[#9fe870] px-1.5 py-0.2 text-[10px] text-[#0e0f0c] font-black">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Status & Trial Option */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Initial Status
              </Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 rounded-xl border border-black/20 bg-background px-3 text-xs font-medium"
              >
                <option value="active">Active (Charge Immediately)</option>
                <option value="trialing">14-Day Free Trial ($0 initial)</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Auto-Renewal
              </Label>
              <select
                value={autoRenew ? "yes" : "no"}
                onChange={(e) => setAutoRenew(e.target.value === "yes")}
                className="w-full h-10 rounded-xl border border-black/20 bg-background px-3 text-xs font-medium"
              >
                <option value="yes">Enabled (Auto-charge card)</option>
                <option value="no">Manual renewal only</option>
              </select>
            </div>
          </div>

          {/* Summary Box */}
          <div className="rounded-2xl bg-[#e8ebe6] p-4 text-xs">
            <div className="flex justify-between font-medium text-muted-foreground">
              <span>Plan selected:</span>
              <span className="font-bold text-foreground">{activePlan?.name}</span>
            </div>
            <div className="mt-1 flex justify-between font-medium text-muted-foreground">
              <span>Billing frequency:</span>
              <span className="capitalize text-foreground">{billingCycle}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-black/10 flex justify-between text-sm font-bold text-foreground">
              <span>Total charged today:</span>
              <span className="text-base text-[#054d28]">
                {status === "trialing" ? "$0.00 (Trial)" : `$${price}.00 USD`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-full h-11 border-black/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full h-11 bg-[#9fe870] text-[#0e0f0c] font-black hover:bg-[#cdffad]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4 text-[#0e0f0c]" />
                  Provisioning...
                </span>
              ) : (
                "Confirm & Activate →"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
