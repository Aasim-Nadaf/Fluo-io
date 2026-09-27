"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  RepeatIcon,
  UserGroupIcon,
  Tag01Icon,
  Calendar03Icon,
  ArrowUp02Icon,
  Cancel01Icon,
  Invoice01Icon,
  PlusSignCircleIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { Logo } from "@/components/logo";

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onQuickCreate?: () => void;
}

export function AppSidebar({
  activeTab = "overview",
  onTabChange,
  onQuickCreate,
  ...props
}: AppSidebarProps) {
  const mainNav = [
    {
      id: "overview",
      title: "Overview",
      badge: "MRR",
      icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} className="size-4" />,
    },
    {
      id: "subscriptions",
      title: "Subscriptions",
      badge: "Live",
      icon: <HugeiconsIcon icon={RepeatIcon} strokeWidth={2} className="size-4" />,
    },
    {
      id: "customers",
      title: "Customers",
      icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-4" />,
    },
    {
      id: "plans",
      title: "Plans & Pricing",
      icon: <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="size-4" />,
    },
  ];

  const lifecycleNav = [
    {
      id: "renewals",
      title: "Renewals & Dunning",
      badge: "Action",
      icon: <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} className="size-4" />,
    },
    {
      id: "upgrades",
      title: "Upgrades & Proration",
      icon: <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2} className="size-4" />,
    },
    {
      id: "cancellations",
      title: "Cancellations & Churn",
      icon: <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4" />,
    },
    {
      id: "payments",
      title: "Payments & Invoices",
      icon: <HugeiconsIcon icon={Invoice01Icon} strokeWidth={2} className="size-4" />,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo className="h-6 w-fit" />
                <span className="rounded-full bg-[#e2f6d5] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#163300]">
                  Wise Engine
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {/* Quick Action button */}
        <div className="px-2 pb-3">
          <button
            onClick={() => onQuickCreate?.()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#9fe870] px-4 py-2.5 text-xs font-black text-[#0e0f0c] shadow-sm transition-all hover:bg-[#cdffad] hover:shadow active:scale-98"
          >
            <HugeiconsIcon icon={PlusSignCircleIcon} strokeWidth={2.5} className="size-4" />
            <span className="truncate">New Subscription</span>
          </button>
        </div>

        {/* Core Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Management Core
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange?.(item.id)}
                      isActive={isActive}
                      className={`gap-3 rounded-xl font-medium transition-colors ${
                        isActive
                          ? "bg-[#0e0f0c] text-white hover:bg-[#0e0f0c] hover:text-white dark:bg-[#9fe870] dark:text-[#0e0f0c]"
                          : "text-foreground hover:bg-[#e8ebe6]"
                      }`}
                    >
                      {item.icon}
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span
                          className={`ml-auto text-[10px] font-bold rounded-md px-1.5 py-0.5 ${
                            isActive
                              ? "bg-[#9fe870] text-[#0e0f0c]"
                              : "bg-[#e2f6d5] text-[#163300]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Lifecycle Operations */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Lifecycle & Billing
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {lifecycleNav.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange?.(item.id)}
                      isActive={isActive}
                      className={`gap-3 rounded-xl font-medium transition-colors ${
                        isActive
                          ? "bg-[#0e0f0c] text-white hover:bg-[#0e0f0c] hover:text-white dark:bg-[#9fe870] dark:text-[#0e0f0c]"
                          : "text-foreground hover:bg-[#e8ebe6]"
                      }`}
                    >
                      {item.icon}
                      <span className="truncate">{item.title}</span>
                      {item.badge && (
                        <span
                          className={`ml-auto text-[10px] font-bold rounded-md px-1.5 py-0.5 ${
                            isActive
                              ? "bg-[#ffd11a] text-[#4a3b1c]"
                              : "bg-[#ffd11a]/20 text-[#b86700]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick status callout */}
        <div className="mx-2 mt-auto rounded-2xl bg-[#e2f6d5] p-3 text-xs text-[#163300] border border-[#9fe870]/30">
          <div className="flex items-center gap-1.5 font-bold">
            <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="size-3.5 text-[#054d28]" />
            <span>Full-Stack Live</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-[#454745]">
            JWT secured session active. Multi-currency USD, EUR & GBP proration engine ready.
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
