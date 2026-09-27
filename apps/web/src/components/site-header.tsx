"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";

const TAB_TITLES: Record<string, string> = {
  overview: "Subscription Overview & MRR",
  subscriptions: "Subscriptions Lifecycle",
  customers: "Customer Accounts & Cards",
  plans: "Pricing Tiers & Plans",
  renewals: "Renewals & Dunning Pipeline",
  upgrades: "Upgrades & Proration Engine",
  cancellations: "Churn & Retention Management",
  payments: "Payments & Invoicing Ledger",
};

export function SiteHeader({
  activeTab = "overview",
  onOpenNewSub,
}: {
  activeTab?: string;
  onOpenNewSub?: () => void;
}) {
  const currentTitle = TAB_TITLES[activeTab] || "Subscription Hub";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-black/10 bg-white/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Dashboard</span>
          <span className="text-xs text-muted-foreground">/</span>
          <h1 className="text-sm font-black text-[#0e0f0c]">{currentTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#e2f6d5] px-2.5 py-1 text-[11px] font-bold text-[#163300]">
          <span className="size-2 rounded-full bg-[#2ead4b] animate-pulse" />
          <span>JWT Authenticated</span>
        </div>

        {onOpenNewSub && (
          <Button
            size="sm"
            onClick={onOpenNewSub}
            className="rounded-full bg-[#9fe870] text-[#0e0f0c] font-black hover:bg-[#cdffad] text-xs h-8 px-3 gap-1 shadow-xs"
          >
            <HugeiconsIcon icon={PlusSignCircleIcon} strokeWidth={2.5} className="size-3.5" />
            <span className="hidden sm:inline">New Subscription</span>
            <span className="sm:hidden">New</span>
          </Button>
        )}
      </div>
    </header>
  );
}
