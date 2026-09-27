"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tag01Icon } from "@hugeicons/core-free-icons";

interface NewPlanDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewPlanDialog({
  open,
  onClose,
  onSuccess,
}: NewPlanDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [yearlyPrice, setYearlyPrice] = useState("");
  const [features, setFeatures] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const featArray = features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          monthlyPrice: Number(monthlyPrice),
          yearlyPrice: yearlyPrice ? Number(yearlyPrice) : Number(monthlyPrice) * 10,
          features: featArray.length ? featArray : ["Standard platform access"],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create plan");

      toast.success(`Plan ${data.plan.name} created!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create plan");
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
              <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-[#0e0f0c]">
                Create Pricing Tier
              </h2>
              <p className="text-xs text-muted-foreground">New SaaS subscription plan</p>
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
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pro Unlimited"
              required
              className="mt-1 h-10 rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Designed for mid-market teams"
              className="mt-1 h-10 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Monthly ($)</Label>
              <Input
                type="number"
                value={monthlyPrice}
                onChange={(e) => {
                  setMonthlyPrice(e.target.value);
                  if (!yearlyPrice && e.target.value) {
                    setYearlyPrice(String(Number(e.target.value) * 10));
                  }
                }}
                placeholder="49"
                required
                className="mt-1 h-10 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Annual ($)</Label>
              <Input
                type="number"
                value={yearlyPrice}
                onChange={(e) => setYearlyPrice(e.target.value)}
                placeholder="490"
                className="mt-1 h-10 rounded-xl"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Features List</Label>
              <span className="text-[10px] text-muted-foreground">One per line</span>
            </div>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Up to 10 team seats&#10;50,000 API requests&#10;Priority chat support"
              className="mt-1 w-full rounded-xl border border-black/20 p-2.5 text-xs h-24 focus:border-[#9fe870] focus:ring-[#9fe870]"
            />
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
              {loading ? <Spinner className="size-4" /> : "Publish Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
