"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// Section Views
import { OverviewTab } from "@/components/subscription-sections/overview-tab";
import { SubscriptionsTab } from "@/components/subscription-sections/subscriptions-tab";
import { CustomersTab } from "@/components/subscription-sections/customers-tab";
import { PlansTab } from "@/components/subscription-sections/plans-tab";
import { RenewalsTab } from "@/components/subscription-sections/renewals-tab";
import { UpgradesTab } from "@/components/subscription-sections/upgrades-tab";
import { CancellationsTab } from "@/components/subscription-sections/cancellations-tab";
import { PaymentsTab } from "@/components/subscription-sections/payments-tab";

// Modals
import { NewSubscriptionDialog } from "@/components/subscription-modals/new-subscription-dialog";
import { NewCustomerDialog } from "@/components/subscription-modals/new-customer-dialog";
import { NewPlanDialog } from "@/components/subscription-modals/new-plan-dialog";
import { UpgradeModal } from "@/components/subscription-modals/upgrade-modal";
import { CancelModal } from "@/components/subscription-modals/cancel-modal";
import { InvoiceModal } from "@/components/subscription-modals/invoice-modal";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");

  // System Data
  const [metrics, setMetrics] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modal States
  const [newSubOpen, setNewSubOpen] = useState(false);
  const [newCustOpen, setNewCustOpen] = useState(false);
  const [newPlanOpen, setNewPlanOpen] = useState(false);
  const [upgradeSub, setUpgradeSub] = useState<any | null>(null);
  const [cancelSub, setCancelSub] = useState<any | null>(null);
  const [invoiceInv, setInvoiceInv] = useState<any | null>(null);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, authLoading, router]);

  // Fetch all system resources
  const loadSystemData = useCallback(async () => {
    try {
      const [metRes, subRes, custRes, planRes, renRes, payRes] = await Promise.all([
        fetch("/api/metrics"),
        fetch("/api/subscriptions"),
        fetch("/api/customers"),
        fetch("/api/plans"),
        fetch("/api/renewals"),
        fetch("/api/payments"),
      ]);

      const [metData, subData, custData, planData, renData, payData] = await Promise.all([
        metRes.json(),
        subRes.json(),
        custRes.json(),
        planRes.json(),
        renRes.json(),
        payRes.json(),
      ]);

      if (metData.success) setMetrics(metData.metrics);
      if (subData.success) setSubscriptions(subData.subscriptions);
      if (custData.success) setCustomers(custData.customers);
      if (planData.success) setPlans(planData.plans);
      if (renData.success) setRenewals(renData.renewals);
      if (payData.success) setPayments(payData.payments);
    } catch (err) {
      console.error("Error loading subscription system data:", err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadSystemData();
    }
  }, [user, loadSystemData]);

  // Renewal Action
  const handleProcessRenewal = async (subId: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${subId}/renew`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Renewal failed");

      toast.success(
        `Renewal executed successfully for ${data.subscription.customerName}! Invoice ${data.invoice.id} issued.`
      );
      loadSystemData();
    } catch (err: any) {
      toast.error(err.message || "Failed to process renewal");
    }
  };

  if (authLoading || (!user && typeof window !== "undefined")) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#e8ebe6] gap-3">
        <Spinner className="size-8 text-[#0e0f0c]" />
        <p className="text-sm font-semibold text-muted-foreground">
          Verifying JWT credentials...
        </p>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="floating"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickCreate={() => setNewSubOpen(true)}
      />

      <SidebarInset className="bg-[#e8ebe6]">
        <SiteHeader
          activeTab={activeTab}
          onOpenNewSub={() => setNewSubOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {dataLoading ? (
            <div className="flex h-64 w-full items-center justify-center">
              <Spinner className="size-6 text-[#0e0f0c]" />
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  metrics={metrics}
                  subscriptions={subscriptions}
                  renewals={renewals}
                  plans={plans}
                  onNavigate={setActiveTab}
                  onOpenNewSub={() => setNewSubOpen(true)}
                  onOpenUpgrade={(sub) => setUpgradeSub(sub)}
                  onOpenCancel={(sub) => setCancelSub(sub)}
                  onProcessRenewal={handleProcessRenewal}
                />
              )}

              {activeTab === "subscriptions" && (
                <SubscriptionsTab
                  subscriptions={subscriptions}
                  plans={plans}
                  onOpenNewSub={() => setNewSubOpen(true)}
                  onOpenUpgrade={(sub) => setUpgradeSub(sub)}
                  onOpenCancel={(sub) => setCancelSub(sub)}
                  onProcessRenewal={handleProcessRenewal}
                  onRefresh={loadSystemData}
                />
              )}

              {activeTab === "customers" && (
                <CustomersTab
                  customers={customers}
                  subscriptions={subscriptions}
                  onOpenNewCustomer={() => setNewCustOpen(true)}
                  onOpenNewSubForCustomer={() => {
                    setNewSubOpen(true);
                  }}
                />
              )}

              {activeTab === "plans" && (
                <PlansTab
                  plans={plans}
                  subscriptions={subscriptions}
                  onOpenNewPlan={() => setNewPlanOpen(true)}
                  onOpenNewSubWithPlan={() => {
                    setNewSubOpen(true);
                  }}
                />
              )}

              {activeTab === "renewals" && (
                <RenewalsTab
                  renewals={renewals}
                  onProcessRenewal={handleProcessRenewal}
                  onRefresh={loadSystemData}
                />
              )}

              {activeTab === "upgrades" && (
                <UpgradesTab
                  subscriptions={subscriptions}
                  plans={plans}
                  payments={payments}
                  onOpenUpgradeModal={(sub) => setUpgradeSub(sub)}
                />
              )}

              {activeTab === "cancellations" && (
                <CancellationsTab
                  subscriptions={subscriptions}
                  onOpenCancelModal={(sub) => setCancelSub(sub)}
                  onRefresh={loadSystemData}
                />
              )}

              {activeTab === "payments" && (
                <PaymentsTab
                  payments={payments}
                  onOpenInvoiceModal={(inv) => setInvoiceInv(inv)}
                  onRefresh={loadSystemData}
                />
              )}
            </>
          )}
        </main>
      </SidebarInset>

      {/* Interactive Modals */}
      <NewSubscriptionDialog
        open={newSubOpen}
        onClose={() => setNewSubOpen(false)}
        customers={customers}
        plans={plans}
        onSuccess={loadSystemData}
      />

      <NewCustomerDialog
        open={newCustOpen}
        onClose={() => setNewCustOpen(false)}
        onSuccess={loadSystemData}
      />

      <NewPlanDialog
        open={newPlanOpen}
        onClose={() => setNewPlanOpen(false)}
        onSuccess={loadSystemData}
      />

      <UpgradeModal
        open={Boolean(upgradeSub)}
        onClose={() => setUpgradeSub(null)}
        subscription={upgradeSub}
        plans={plans}
        onSuccess={loadSystemData}
      />

      <CancelModal
        open={Boolean(cancelSub)}
        onClose={() => setCancelSub(null)}
        subscription={cancelSub}
        onSuccess={loadSystemData}
      />

      <InvoiceModal
        open={Boolean(invoiceInv)}
        onClose={() => setInvoiceInv(null)}
        invoice={invoiceInv}
        onActionComplete={loadSystemData}
      />
    </SidebarProvider>
  );
}
