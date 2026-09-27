"use client";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreVerticalCircle01Icon,
  UserCircle02Icon,
  CreditCardIcon,
  Logout01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/context/auth-context";

export function NavUser({
  user: initialUser,
}: {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { user: authUser, logout } = useAuth();

  const user = authUser || initialUser || {
    name: "Alex Morgan",
    email: "demo@fluo.finance",
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AM";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="size-8 rounded-lg bg-[#9fe870] text-[#0e0f0c] font-bold">
              <AvatarFallback className="rounded-lg bg-[#9fe870] text-[#0e0f0c]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs text-foreground/70">
                {user.email}
              </span>
            </div>
            <HugeiconsIcon
              icon={MoreVerticalCircle01Icon}
              strokeWidth={2}
              className="ml-auto size-4"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-2xl p-1.5 shadow-xl border-black/10"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                  <Avatar className="size-8 bg-[#9fe870] text-[#0e0f0c] font-bold">
                    <AvatarFallback className="bg-[#9fe870] text-[#0e0f0c]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-xl text-xs font-medium">
                <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} className="size-4" />
                <span>JWT Session: Active (7d)</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-xl text-xs font-medium">
                <HugeiconsIcon icon={UserCircle02Icon} strokeWidth={2} className="size-4" />
                <span>Account Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-xl text-xs font-medium">
                <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} className="size-4" />
                <span>Wise Payout Engine</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer gap-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
