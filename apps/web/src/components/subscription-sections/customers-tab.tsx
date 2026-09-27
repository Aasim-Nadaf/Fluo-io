"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SearchIcon,
  PlusSignCircleIcon,
  CreditCardIcon,
  Globe02Icon,
  Building01Icon,
} from "@hugeicons/core-free-icons";

interface CustomersTabProps {
  customers: any[];
  subscriptions: any[];
  onOpenNewCustomer: () => void;
  onOpenNewSubForCustomer?: (customerId: string) => void;
}

export function CustomersTab({
  customers,
  subscriptions,
  onOpenNewCustomer,
  onOpenNewSubForCustomer,
}: CustomersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#0e0f0c]">
            Customer Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Profiles, payment methods on file, and lifetime billing spend
          </p>
        </div>
        <Button
          onClick={onOpenNewCustomer}
          className="rounded-full bg-[#9fe870] text-[#0e0f0c] font-black hover:bg-[#cdffad] h-10 px-4 text-xs gap-1.5 self-start sm:self-auto"
        >
          <HugeiconsIcon icon={PlusSignCircleIcon} strokeWidth={2.5} className="size-4" />
          Add Customer
        </Button>
      </div>

      <Card className="rounded-3xl border-black/10 bg-white p-5 shadow-xs">
        {/* Search */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10">
          <div className="relative flex-1 max-w-md">
            <HugeiconsIcon
              icon={SearchIcon}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers by name, company, email or country..."
              className="h-9 pl-9 rounded-xl border-black/20 text-xs"
            />
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            Total Accounts: <strong className="text-foreground">{customers.length}</strong>
          </div>
        </div>

        {/* Customer Directory Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-black/10 text-muted-foreground uppercase text-[10px] tracking-wider">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Company & Location</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Active Subscription</th>
                <th className="pb-3 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const custSub = subscriptions.find(
                    (s) => s.customerId === cust.id && s.status !== "canceled"
                  );

                  return (
                    <tr key={cust.id} className="hover:bg-[#f6f8f5]/60 transition-colors">
                      <td className="py-3.5 pr-3">
                        <div className="font-bold text-foreground text-sm">{cust.name}</div>
                        <div className="text-[11px] text-muted-foreground">{cust.email}</div>
                        <div className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">
                          {cust.id}
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <HugeiconsIcon icon={Building01Icon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                          <span>{cust.company}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} className="size-3" />
                          <span>{cust.country}</span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-foreground">
                          <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} className="size-3.5 text-muted-foreground" />
                          <span className="capitalize">{cust.paymentMethod?.brand || "Visa"}</span>
                          <span>•••• {cust.paymentMethod?.last4 || "4242"}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          Exp: {cust.paymentMethod?.expMonth || 12}/{cust.paymentMethod?.expYear || 2028}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3">
                        <Badge
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            cust.status === "active"
                              ? "bg-[#9fe870] text-[#0e0f0c] hover:bg-[#9fe870]"
                              : cust.status === "trialing"
                              ? "bg-[#38c8ff]/20 text-[#0070a0]"
                              : cust.status === "past_due"
                              ? "bg-[#ffd11a]/20 text-[#b86700]"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {cust.status.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3.5 pr-3">
                        {custSub ? (
                          <div>
                            <span className="font-bold text-foreground">{custSub.planName}</span>
                            <span className="block text-[11px] text-muted-foreground">
                              ${custSub.amount}/{custSub.billingCycle === "yearly" ? "yr" : "mo"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">
                            No active plan
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 text-right font-mono font-bold text-sm text-foreground">
                        ${cust.totalSpent?.toLocaleString() || 0} USD
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
