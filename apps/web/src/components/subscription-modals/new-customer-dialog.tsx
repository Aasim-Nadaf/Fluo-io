"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, UserCircle02Icon } from "@hugeicons/core-free-icons";

interface NewCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewCustomerDialog({
  open,
  onClose,
  onSuccess,
}: NewCustomerDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("United States");
  const [cardLast4, setCardLast4] = useState("4242");
  const [cardBrand, setCardBrand] = useState<"visa" | "mastercard" | "amex">("visa");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          country,
          currency: "USD",
          paymentMethod: {
            brand: cardBrand,
            last4: cardLast4,
            expMonth: 12,
            expYear: 2028,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create customer");

      toast.success(`Customer ${data.customer.name} created!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-black/10">
        <div className="flex items-center justify-between pb-4 border-b border-black/10">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-[#e2f6d5] p-2 text-[#054d28]">
              <HugeiconsIcon icon={UserCircle02Icon} strokeWidth={2} className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-[#0e0f0c]">
                Add New Customer
              </h2>
              <p className="text-xs text-muted-foreground">Client profile & payment method</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-black/5 hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Bell"
              required
              className="mt-1 h-10 rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Work Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@company.com"
              required
              className="mt-1 h-10 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="mt-1 h-10 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Country</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="mt-1 h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#f6f8f5] p-3 border border-black/10">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Payment Method on File
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={cardBrand}
                onChange={(e) => setCardBrand(e.target.value as any)}
                className="h-9 rounded-xl border border-black/20 bg-white px-2.5 text-xs font-medium"
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">Amex</option>
              </select>
              <Input
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value.slice(0, 4))}
                placeholder="Last 4 (e.g. 4242)"
                maxLength={4}
                className="h-9 rounded-xl bg-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
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
              {loading ? <Spinner className="size-4" /> : "Save Customer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
