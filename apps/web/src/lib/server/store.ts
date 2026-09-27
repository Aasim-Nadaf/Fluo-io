import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
  maxUsers: number;
  maxProjects: number;
  isPopular?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  currency: string;
  status: "active" | "trialing" | "past_due" | "churned";
  paymentMethod: {
    brand: "visa" | "mastercard" | "amex";
    last4: string;
    expMonth: number;
    expYear: number;
  };
  totalSpent: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  planId: string;
  planName: string;
  status: "active" | "trialing" | "past_due" | "paused" | "canceled";
  billingCycle: "monthly" | "yearly";
  amount: number;
  currency: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextRenewalDate: string;
  autoRenew: boolean;
  cancelAtPeriodEnd: boolean;
  cancellationReason?: string;
  cancellationFeedback?: string;
  pausedUntil?: string;
  createdAt: string;
}

export interface PaymentInvoice {
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

export interface RenewalRecord {
  id: string;
  subscriptionId: string;
  customerId: string;
  customerName: string;
  planName: string;
  scheduledDate: string;
  amount: number;
  currency: string;
  status: "scheduled" | "processing" | "succeeded" | "failed" | "skipped";
  cardLast4: string;
  daysUntil: number;
}

export interface ChurnRecord {
  id: string;
  subscriptionId: string;
  customerId: string;
  customerName: string;
  planName: string;
  mrrLost: number;
  reason: string;
  feedback: string;
  date: string;
  immediate: boolean;
  retentionOffered: boolean;
  retentionAccepted: boolean;
}

interface StoreData {
  users: UserRecord[];
  plans: Plan[];
  customers: Customer[];
  subscriptions: Subscription[];
  payments: PaymentInvoice[];
  renewals: RenewalRecord[];
  churnRecords: ChurnRecord[];
}

const STORE_PATH = path.join("/tmp", "fluo_subscription_store.json");

// Default initial seed data
function getInitialData(): StoreData {
  const adminPasswordHash = bcrypt.hashSync("password123", 10);

  const plans: Plan[] = [
    {
      id: "plan_starter",
      name: "Starter",
      slug: "starter",
      description: "For solopreneurs & early builders kicking off their journey.",
      monthlyPrice: 29,
      yearlyPrice: 290,
      currency: "USD",
      features: [
        "Up to 3 team seats",
        "10,000 monthly API calls",
        "Standard multi-currency accounts",
        "48-hour email support",
        "Weekly reporting",
      ],
      maxUsers: 3,
      maxProjects: 5,
    },
    {
      id: "plan_growth",
      name: "Growth",
      slug: "growth",
      description: "For fast-growing companies scaling transaction volume.",
      monthlyPrice: 79,
      yearlyPrice: 790,
      currency: "USD",
      features: [
        "Up to 15 team seats",
        "100,000 monthly API calls",
        "Global bank accounts (USD, EUR, GBP)",
        "Priority 4-hour support",
        "Real-time webhooks & events",
        "Custom branding & invoicing",
      ],
      maxUsers: 15,
      maxProjects: 25,
      isPopular: true,
    },
    {
      id: "plan_scale",
      name: "Scale",
      slug: "scale",
      description: "For high-volume fintechs and enterprise SaaS platforms.",
      monthlyPrice: 199,
      yearlyPrice: 1990,
      currency: "USD",
      features: [
        "Unlimited team seats",
        "1,000,000 monthly API calls",
        "Dedicated virtual IBANs",
        "24/7 VIP Slack/Phone channel",
        "Custom billing cycles & automated dunning",
        "Automated tax & VAT compliance",
        "SLA 99.99% uptime guarantee",
      ],
      maxUsers: 999,
      maxProjects: 999,
    },
    {
      id: "plan_enterprise",
      name: "Enterprise",
      slug: "enterprise",
      description: "Bespoke infrastructure, dedicated VPC and compliance manager.",
      monthlyPrice: 499,
      yearlyPrice: 4990,
      currency: "USD",
      features: [
        "Dedicated infrastructure & VPC",
        "Unlimited everything",
        "Custom integrations & ERP sync",
        "Dedicated account manager",
        "Custom contractual SLA & MSA",
        "Single Sign-On (SAML / Okta)",
      ],
      maxUsers: 9999,
      maxProjects: 9999,
    },
  ];

  const customers: Customer[] = [
    {
      id: "cust_1",
      name: "Sarah Jenkins",
      email: "sarah@nordicpay.io",
      company: "NordicPay Labs",
      country: "Sweden",
      currency: "USD",
      status: "active",
      paymentMethod: { brand: "visa", last4: "4242", expMonth: 12, expYear: 2028 },
      totalSpent: 948,
      createdAt: "2025-10-15T09:00:00Z",
    },
    {
      id: "cust_2",
      name: "Marcus Vance",
      email: "marcus@vancecapital.co.uk",
      company: "Vance Global",
      country: "United Kingdom",
      currency: "USD",
      status: "active",
      paymentMethod: { brand: "mastercard", last4: "8821", expMonth: 9, expYear: 2027 },
      totalSpent: 1990,
      createdAt: "2025-11-01T14:30:00Z",
    },
    {
      id: "cust_3",
      name: "Elena Rostova",
      email: "elena@berlinfintech.de",
      company: "Klarity AI",
      country: "Germany",
      currency: "USD",
      status: "active",
      paymentMethod: { brand: "visa", last4: "1094", expMonth: 4, expYear: 2029 },
      totalSpent: 632,
      createdAt: "2026-01-10T11:15:00Z",
    },
    {
      id: "cust_4",
      name: "Kenji Sato",
      email: "kenji@tokyosync.jp",
      company: "TokyoSync Inc.",
      country: "Japan",
      currency: "USD",
      status: "trialing",
      paymentMethod: { brand: "amex", last4: "3001", expMonth: 8, expYear: 2026 },
      totalSpent: 0,
      createdAt: "2026-09-20T08:00:00Z",
    },
    {
      id: "cust_5",
      name: "Chloe Dupont",
      email: "chloe@atelierlumiere.fr",
      company: "Atelier Lumiere",
      country: "France",
      currency: "USD",
      status: "past_due",
      paymentMethod: { brand: "visa", last4: "7740", expMonth: 3, expYear: 2026 },
      totalSpent: 237,
      createdAt: "2026-02-18T16:20:00Z",
    },
    {
      id: "cust_6",
      name: "David O'Connor",
      email: "david@dublincloud.ie",
      company: "Emerald Soft",
      country: "Ireland",
      currency: "USD",
      status: "active",
      paymentMethod: { brand: "mastercard", last4: "5512", expMonth: 11, expYear: 2027 },
      totalSpent: 3980,
      createdAt: "2025-08-04T10:00:00Z",
    },
    {
      id: "cust_7",
      name: "Amara Diallo",
      email: "amara@africatech.ng",
      company: "Lagos Logistics",
      country: "Nigeria",
      currency: "USD",
      status: "active",
      paymentMethod: { brand: "visa", last4: "9312", expMonth: 7, expYear: 2028 },
      totalSpent: 790,
      createdAt: "2026-03-01T12:00:00Z",
    },
    {
      id: "cust_8",
      name: "Liam Thorne",
      email: "liam@horizonventures.com",
      company: "Horizon Ventures",
      country: "United States",
      currency: "USD",
      status: "churned",
      paymentMethod: { brand: "visa", last4: "6621", expMonth: 5, expYear: 2026 },
      totalSpent: 474,
      createdAt: "2025-12-05T09:30:00Z",
    },
  ];

  const subscriptions: Subscription[] = [
    {
      id: "sub_101",
      customerId: "cust_1",
      customerName: "Sarah Jenkins",
      customerEmail: "sarah@nordicpay.io",
      planId: "plan_growth",
      planName: "Growth",
      status: "active",
      billingCycle: "monthly",
      amount: 79,
      currency: "USD",
      currentPeriodStart: "2026-09-15T00:00:00Z",
      currentPeriodEnd: "2026-10-15T00:00:00Z",
      nextRenewalDate: "2026-10-15T00:00:00Z",
      autoRenew: true,
      cancelAtPeriodEnd: false,
      createdAt: "2025-10-15T09:00:00Z",
    },
    {
      id: "sub_102",
      customerId: "cust_2",
      customerName: "Marcus Vance",
      customerEmail: "marcus@vancecapital.co.uk",
      planId: "plan_scale",
      planName: "Scale",
      status: "active",
      billingCycle: "yearly",
      amount: 1990,
      currency: "USD",
      currentPeriodStart: "2025-11-01T00:00:00Z",
      currentPeriodEnd: "2026-11-01T00:00:00Z",
      nextRenewalDate: "2026-11-01T00:00:00Z",
      autoRenew: true,
      cancelAtPeriodEnd: false,
      createdAt: "2025-11-01T14:30:00Z",
    },
    {
      id: "sub_103",
      customerId: "cust_3",
      customerName: "Elena Rostova",
      customerEmail: "elena@berlinfintech.de",
      planId: "plan_growth",
      planName: "Growth",
      status: "active",
      billingCycle: "monthly",
      amount: 79,
      currency: "USD",
      currentPeriodStart: "2026-09-10T00:00:00Z",
      currentPeriodEnd: "2026-10-10T00:00:00Z",
      nextRenewalDate: "2026-10-10T00:00:00Z",
      autoRenew: true,
      cancelAtPeriodEnd: false,
      createdAt: "2026-01-10T11:15:00Z",
    },
    {
      id: "sub_104",
      customerId: "cust_4",
      customerName: "Kenji Sato",
      customerEmail: "kenji@tokyosync.jp",
      planId: "plan_starter",
      planName: "Starter",
      status: "trialing",
      billingCycle: "monthly",
      amount: 29,
      currency: "USD",
      currentPeriodStart: "2026-09-20T00:00:00Z",
      currentPeriodEnd: "2026-10-04T00:00:00Z",
      nextRenewalDate: "2026-10-04T00:00:00Z",
      autoRenew: true,
      cancelAtPeriodEnd: false,
      createdAt: "2026-09-20T08:00:00Z",
    },
    {
      id: "sub_105",
      customerId: "cust_5",
      customerName: "Chloe Dupont",
      customerEmail: "chloe@atelierlumiere.fr",
      planId: "plan_growth",
      planName: "Growth",
      status: "past_due",
      billingCycle: "monthly",
      amount: 79,
      currency: "USD",
      currentPeriodStart: "2026-08-18T00:00:00Z",
      currentPeriodEnd: "2026-09-18T00:00:00Z",
      nextRenewalDate: "2026-09-28T00:00:00Z",
      autoRenew: true,
      cancelAtPeriodEnd: false,
      createdAt: "2026-02-18T16:20:00Z",
    },
    {
      id: "sub_106",
      customerId: "cust_6",
      customerName: "David O'Connor",
      customerEmail: "david@dublincloud.ie",
      planId: "plan_scale",
      planName: "Scale",
      status: "active",
      billingCycle: "yearly",
      amount: 1990,
      currency: "USD",
      currentPeriodStart: "2026-08-04T00:00:00Z",
      currentPeriodEnd: "2027-08-04T00:00:00Z",
      nextRenewalDate: "2027-08-04T00:00:00Z",
      autoRenew: true,
      cancelAtPeriodEnd: false,
      createdAt: "2025-08-04T10:00:00Z",
    },
    {
      id: "sub_107",
      customerId: "cust_7",
      customerName: "Amara Diallo",
      customerEmail: "amara@africatech.ng",
      planId: "plan_growth",
      planName: "Growth",
      status: "active",
      billingCycle: "yearly",
      amount: 790,
      currency: "USD",
      currentPeriodStart: "2026-03-01T00:00:00Z",
      currentPeriodEnd: "2027-03-01T00:00:00Z",
      nextRenewalDate: "2027-03-01T00:00:00Z",
      autoRenew: true,
      cancelAtPeriodEnd: false,
      createdAt: "2026-03-01T12:00:00Z",
    },
    {
      id: "sub_108",
      customerId: "cust_8",
      customerName: "Liam Thorne",
      customerEmail: "liam@horizonventures.com",
      planId: "plan_growth",
      planName: "Growth",
      status: "canceled",
      billingCycle: "monthly",
      amount: 79,
      currency: "USD",
      currentPeriodStart: "2026-06-05T00:00:00Z",
      currentPeriodEnd: "2026-07-05T00:00:00Z",
      nextRenewalDate: "2026-07-05T00:00:00Z",
      autoRenew: false,
      cancelAtPeriodEnd: false,
      cancellationReason: "Too expensive for current stage",
      cancellationFeedback: "We are downsizing our engineering team this quarter.",
      createdAt: "2025-12-05T09:30:00Z",
    },
  ];

  const payments: PaymentInvoice[] = [
    {
      id: "INV-2026-9041",
      subscriptionId: "sub_101",
      customerId: "cust_1",
      customerName: "Sarah Jenkins",
      customerEmail: "sarah@nordicpay.io",
      planName: "Growth Plan (Monthly)",
      amount: 79,
      currency: "USD",
      status: "succeeded",
      paymentMethod: "Visa •••• 4242",
      createdAt: "2026-09-15T09:00:00Z",
      description: "Monthly subscription renewal for Growth tier",
      receiptNumber: "REC-940124",
    },
    {
      id: "INV-2026-9038",
      subscriptionId: "sub_103",
      customerId: "cust_3",
      customerName: "Elena Rostova",
      customerEmail: "elena@berlinfintech.de",
      planName: "Growth Plan (Monthly)",
      amount: 79,
      currency: "USD",
      status: "succeeded",
      paymentMethod: "Visa •••• 1094",
      createdAt: "2026-09-10T11:15:00Z",
      description: "Monthly subscription renewal for Growth tier",
      receiptNumber: "REC-938812",
    },
    {
      id: "INV-2026-9030",
      subscriptionId: "sub_105",
      customerId: "cust_5",
      customerName: "Chloe Dupont",
      customerEmail: "chloe@atelierlumiere.fr",
      planName: "Growth Plan (Monthly)",
      amount: 79,
      currency: "USD",
      status: "failed",
      paymentMethod: "Visa •••• 7740",
      failureReason: "Card declined: insufficient_funds",
      createdAt: "2026-09-18T16:20:00Z",
      description: "Failed renewal attempt - dunning sequence active",
      receiptNumber: "REC-FAILED-9030",
    },
    {
      id: "INV-2026-8910",
      subscriptionId: "sub_106",
      customerId: "cust_6",
      customerName: "David O'Connor",
      customerEmail: "david@dublincloud.ie",
      planName: "Scale Plan (Annual)",
      amount: 1990,
      currency: "USD",
      status: "succeeded",
      paymentMethod: "Mastercard •••• 5512",
      createdAt: "2026-08-04T10:00:00Z",
      description: "Annual renewal for Scale Tier (12 months prepaid)",
      receiptNumber: "REC-891004",
    },
    {
      id: "INV-2026-8802",
      subscriptionId: "sub_101",
      customerId: "cust_1",
      customerName: "Sarah Jenkins",
      customerEmail: "sarah@nordicpay.io",
      planName: "Growth Plan (Monthly)",
      amount: 79,
      currency: "USD",
      status: "succeeded",
      paymentMethod: "Visa •••• 4242",
      createdAt: "2026-08-15T09:00:00Z",
      description: "Monthly subscription renewal for Growth tier",
      receiptNumber: "REC-880215",
    },
    {
      id: "INV-2026-8711",
      subscriptionId: "sub_107",
      customerId: "cust_7",
      customerName: "Amara Diallo",
      customerEmail: "amara@africatech.ng",
      planName: "Growth Plan (Annual)",
      amount: 790,
      currency: "USD",
      status: "succeeded",
      paymentMethod: "Visa •••• 9312",
      createdAt: "2026-03-01T12:00:00Z",
      description: "Annual renewal for Growth Tier",
      receiptNumber: "REC-871101",
    },
    {
      id: "INV-2026-8550",
      subscriptionId: "sub_108",
      customerId: "cust_8",
      customerName: "Liam Thorne",
      customerEmail: "liam@horizonventures.com",
      planName: "Growth Plan (Monthly)",
      amount: 79,
      currency: "USD",
      status: "refunded",
      paymentMethod: "Visa •••• 6621",
      refundedAmount: 79,
      createdAt: "2026-06-05T09:30:00Z",
      description: "Full refund issued following service dispute",
      receiptNumber: "REC-REF-8550",
    },
  ];

  const renewals: RenewalRecord[] = [
    {
      id: "ren_1",
      subscriptionId: "sub_105",
      customerId: "cust_5",
      customerName: "Chloe Dupont",
      planName: "Growth",
      scheduledDate: "2026-09-28T00:00:00Z",
      amount: 79,
      currency: "USD",
      status: "scheduled",
      cardLast4: "7740",
      daysUntil: 1,
    },
    {
      id: "ren_2",
      subscriptionId: "sub_104",
      customerId: "cust_4",
      customerName: "Kenji Sato",
      planName: "Starter (End of Trial)",
      scheduledDate: "2026-10-04T00:00:00Z",
      amount: 29,
      currency: "USD",
      status: "scheduled",
      cardLast4: "3001",
      daysUntil: 7,
    },
    {
      id: "ren_3",
      subscriptionId: "sub_103",
      customerId: "cust_3",
      customerName: "Elena Rostova",
      planName: "Growth",
      scheduledDate: "2026-10-10T00:00:00Z",
      amount: 79,
      currency: "USD",
      status: "scheduled",
      cardLast4: "1094",
      daysUntil: 13,
    },
    {
      id: "ren_4",
      subscriptionId: "sub_101",
      customerId: "cust_1",
      customerName: "Sarah Jenkins",
      planName: "Growth",
      scheduledDate: "2026-10-15T00:00:00Z",
      amount: 79,
      currency: "USD",
      status: "scheduled",
      cardLast4: "4242",
      daysUntil: 18,
    },
    {
      id: "ren_5",
      subscriptionId: "sub_102",
      customerId: "cust_2",
      customerName: "Marcus Vance",
      planName: "Scale (Annual)",
      scheduledDate: "2026-11-01T00:00:00Z",
      amount: 1990,
      currency: "USD",
      status: "scheduled",
      cardLast4: "8821",
      daysUntil: 35,
    },
  ];

  const churnRecords: ChurnRecord[] = [
    {
      id: "churn_1",
      subscriptionId: "sub_108",
      customerId: "cust_8",
      customerName: "Liam Thorne",
      planName: "Growth",
      mrrLost: 79,
      reason: "Pricing / budget cuts",
      feedback: "Downsizing engineering team for H2.",
      date: "2026-07-05T09:30:00Z",
      immediate: true,
      retentionOffered: true,
      retentionAccepted: false,
    },
  ];

  return {
    users: [
      {
        id: "usr_admin",
        name: "Alex Morgan",
        email: "demo@fluo.finance",
        passwordHash: adminPasswordHash,
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ],
    plans,
    customers,
    subscriptions,
    payments,
    renewals,
    churnRecords,
  };
}

class Store {
  private data: StoreData;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): StoreData {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading store from disk, initializing fresh:", e);
    }
    const initial = getInitialData();
    this.saveToDisk(initial);
    return initial;
  }

  private saveToDisk(data: StoreData) {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing store to disk:", e);
    }
  }

  private persist() {
    this.saveToDisk(this.data);
  }

  // --- Users ---
  getUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): UserRecord | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(name: string, email: string, passwordHash: string, role = "admin"): UserRecord {
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error("A user with this email already exists");
    }
    const newUser: UserRecord = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  // --- Customers ---
  getCustomers(): Customer[] {
    return this.data.customers;
  }

  getCustomer(id: string): Customer | undefined {
    return this.data.customers.find((c) => c.id === id);
  }

  createCustomer(payload: Omit<Customer, "id" | "totalSpent" | "createdAt">): Customer {
    const newCust: Customer = {
      ...payload,
      id: "cust_" + Math.random().toString(36).substring(2, 9),
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };
    this.data.customers.unshift(newCust);
    this.persist();
    return newCust;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer {
    const idx = this.data.customers.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Customer not found");
    this.data.customers[idx] = { ...this.data.customers[idx]!, ...updates };
    this.persist();
    return this.data.customers[idx]!;
  }

  deleteCustomer(id: string): boolean {
    const initialLen = this.data.customers.length;
    this.data.customers = this.data.customers.filter((c) => c.id !== id);
    if (this.data.customers.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Plans ---
  getPlans(): Plan[] {
    return this.data.plans;
  }

  getPlan(id: string): Plan | undefined {
    return this.data.plans.find((p) => p.id === id);
  }

  createPlan(payload: Omit<Plan, "id">): Plan {
    const newPlan: Plan = {
      ...payload,
      id: "plan_" + Math.random().toString(36).substring(2, 9),
    };
    this.data.plans.push(newPlan);
    this.persist();
    return newPlan;
  }

  updatePlan(id: string, updates: Partial<Plan>): Plan {
    const idx = this.data.plans.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Plan not found");
    this.data.plans[idx] = { ...this.data.plans[idx]!, ...updates };
    this.persist();
    return this.data.plans[idx]!;
  }

  // --- Subscriptions ---
  getSubscriptions(): Subscription[] {
    return this.data.subscriptions;
  }

  getSubscription(id: string): Subscription | undefined {
    return this.data.subscriptions.find((s) => s.id === id);
  }

  createSubscription(params: {
    customerId: string;
    planId: string;
    billingCycle: "monthly" | "yearly";
    status?: "active" | "trialing";
    autoRenew?: boolean;
  }): { subscription: Subscription; invoice: PaymentInvoice } {
    const customer = this.getCustomer(params.customerId);
    if (!customer) throw new Error("Customer not found");
    const plan = this.getPlan(params.planId);
    if (!plan) throw new Error("Plan not found");

    const now = new Date();
    const cycle = params.billingCycle;
    const amount = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    const periodEnd = new Date(now);
    if (params.status === "trialing") {
      periodEnd.setDate(periodEnd.getDate() + 14);
    } else if (cycle === "yearly") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const subId = "sub_" + Math.random().toString(36).substring(2, 9);
    const newSub: Subscription = {
      id: subId,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      planId: plan.id,
      planName: plan.name,
      status: params.status || "active",
      billingCycle: cycle,
      amount,
      currency: plan.currency,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      nextRenewalDate: periodEnd.toISOString(),
      autoRenew: params.autoRenew !== false,
      cancelAtPeriodEnd: false,
      createdAt: now.toISOString(),
    };

    this.data.subscriptions.unshift(newSub);
    customer.status = newSub.status === "trialing" ? "trialing" : "active";

    // Generate Invoice
    const invoiceId = "INV-2026-" + Math.floor(1000 + Math.random() * 9000);
    const invoice: PaymentInvoice = {
      id: invoiceId,
      subscriptionId: subId,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      planName: `${plan.name} (${cycle === "yearly" ? "Annual" : "Monthly"})`,
      amount: newSub.status === "trialing" ? 0 : amount,
      currency: plan.currency,
      status: newSub.status === "trialing" ? "succeeded" : "succeeded",
      paymentMethod: `${customer.paymentMethod.brand.toUpperCase()} •••• ${customer.paymentMethod.last4}`,
      createdAt: now.toISOString(),
      description: newSub.status === "trialing" ? "14-day free trial activated" : `New subscription payment for ${plan.name}`,
      receiptNumber: "REC-" + Math.floor(100000 + Math.random() * 900000),
    };

    this.data.payments.unshift(invoice);
    customer.totalSpent += invoice.amount;

    // Add scheduled renewal
    this.data.renewals.unshift({
      id: "ren_" + Math.random().toString(36).substring(2, 9),
      subscriptionId: subId,
      customerId: customer.id,
      customerName: customer.name,
      planName: plan.name,
      scheduledDate: periodEnd.toISOString(),
      amount,
      currency: plan.currency,
      status: "scheduled",
      cardLast4: customer.paymentMethod.last4,
      daysUntil: Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    });

    this.persist();
    return { subscription: newSub, invoice };
  }

  // Upgrade or Downgrade Subscription with real prorated calculation
  upgradeSubscription(
    subId: string,
    targetPlanId: string,
    targetCycle?: "monthly" | "yearly"
  ): {
    subscription: Subscription;
    proratedAmount: number;
    adjustmentInvoice: PaymentInvoice;
    isUpgrade: boolean;
  } {
    const sub = this.getSubscription(subId);
    if (!sub) throw new Error("Subscription not found");
    const currentPlan = this.getPlan(sub.planId);
    const targetPlan = this.getPlan(targetPlanId);
    if (!targetPlan) throw new Error("Target plan not found");

    const newCycle = targetCycle || sub.billingCycle;
    const currentPrice = sub.amount;
    const targetPrice = newCycle === "yearly" ? targetPlan.yearlyPrice : targetPlan.monthlyPrice;

    // Calculate proration
    const now = new Date();
    const periodStart = new Date(sub.currentPeriodStart);
    const periodEnd = new Date(sub.currentPeriodEnd);
    const totalPeriodDays = Math.max(1, Math.round((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)));
    const remainingDays = Math.max(0, Math.round((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const fractionRemaining = remainingDays / totalPeriodDays;

    const unusedCurrentCredit = Math.round(currentPrice * fractionRemaining * 100) / 100;
    const newPlanProratedCharge = Math.round(targetPrice * fractionRemaining * 100) / 100;
    const proratedDelta = Math.round((newPlanProratedCharge - unusedCurrentCredit) * 100) / 100;
    const isUpgrade = targetPrice >= currentPrice;

    // Update subscription
    sub.planId = targetPlan.id;
    sub.planName = targetPlan.name;
    sub.billingCycle = newCycle;
    sub.amount = targetPrice;
    sub.status = "active";
    sub.cancelAtPeriodEnd = false;

    // Create adjustment invoice
    const customer = this.getCustomer(sub.customerId);
    const invoiceId = "INV-2026-" + Math.floor(1000 + Math.random() * 9000);
    const adjustmentInvoice: PaymentInvoice = {
      id: invoiceId,
      subscriptionId: sub.id,
      customerId: sub.customerId,
      customerName: sub.customerName,
      customerEmail: sub.customerEmail,
      planName: `${isUpgrade ? "Upgrade" : "Plan Switch"} to ${targetPlan.name}`,
      amount: Math.max(0, proratedDelta),
      currency: sub.currency,
      status: "succeeded",
      paymentMethod: customer ? `${customer.paymentMethod.brand.toUpperCase()} •••• ${customer.paymentMethod.last4}` : "Card on file",
      createdAt: now.toISOString(),
      description: `Prorated adjustment: switched from ${currentPlan?.name || "previous plan"} to ${targetPlan.name} (${remainingDays} days remaining in cycle)`,
      receiptNumber: "REC-ADJ-" + Math.floor(100000 + Math.random() * 900000),
    };

    if (customer && proratedDelta > 0) {
      customer.totalSpent += proratedDelta;
    }
    this.data.payments.unshift(adjustmentInvoice);

    // Update renewal record
    const renIdx = this.data.renewals.findIndex((r) => r.subscriptionId === sub.id && r.status === "scheduled");
    if (renIdx !== -1) {
      this.data.renewals[renIdx]!.amount = targetPrice;
      this.data.renewals[renIdx]!.planName = targetPlan.name;
    }

    this.persist();
    return {
      subscription: sub,
      proratedAmount: proratedDelta,
      adjustmentInvoice,
      isUpgrade,
    };
  }

  // Cancel subscription with reason and period-end option
  cancelSubscription(
    subId: string,
    reason: string,
    feedback?: string,
    immediate: boolean = false,
    retentionOffered: boolean = false,
    retentionAccepted: boolean = false
  ): { subscription: Subscription; churnRecord?: ChurnRecord } {
    const sub = this.getSubscription(subId);
    if (!sub) throw new Error("Subscription not found");
    const customer = this.getCustomer(sub.customerId);

    const now = new Date();
    sub.cancellationReason = reason;
    sub.cancellationFeedback = feedback;

    if (retentionAccepted) {
      // User accepted discount retention offer: reduce amount by 25% for 3 months
      sub.amount = Math.round(sub.amount * 0.75);
      sub.cancelAtPeriodEnd = false;
      this.persist();
      return { subscription: sub };
    }

    if (immediate) {
      sub.status = "canceled";
      sub.autoRenew = false;
      sub.cancelAtPeriodEnd = false;
      if (customer) customer.status = "churned";

      // Remove scheduled renewal
      this.data.renewals = this.data.renewals.filter(
        (r) => !(r.subscriptionId === sub.id && r.status === "scheduled")
      );
    } else {
      sub.cancelAtPeriodEnd = true;
      sub.autoRenew = false;
    }

    // Record churn analytics
    const monthlyMRR = sub.billingCycle === "yearly" ? Math.round(sub.amount / 12) : sub.amount;
    const churnRecord: ChurnRecord = {
      id: "churn_" + Math.random().toString(36).substring(2, 9),
      subscriptionId: sub.id,
      customerId: sub.customerId,
      customerName: sub.customerName,
      planName: sub.planName,
      mrrLost: monthlyMRR,
      reason,
      feedback: feedback || "No feedback given",
      date: now.toISOString(),
      immediate,
      retentionOffered,
      retentionAccepted,
    };
    this.data.churnRecords.unshift(churnRecord);

    this.persist();
    return { subscription: sub, churnRecord };
  }

  // Reactivate a canceled or pending-cancellation subscription
  reactivateSubscription(subId: string): Subscription {
    const sub = this.getSubscription(subId);
    if (!sub) throw new Error("Subscription not found");
    const customer = this.getCustomer(sub.customerId);

    sub.status = "active";
    sub.autoRenew = true;
    sub.cancelAtPeriodEnd = false;
    sub.cancellationReason = undefined;
    sub.cancellationFeedback = undefined;

    if (customer) {
      customer.status = "active";
    }

    // Ensure scheduled renewal exists
    const existingRenewal = this.data.renewals.find(
      (r) => r.subscriptionId === sub.id && r.status === "scheduled"
    );
    if (!existingRenewal) {
      const renewalDate = new Date(sub.nextRenewalDate);
      const now = new Date();
      this.data.renewals.unshift({
        id: "ren_" + Math.random().toString(36).substring(2, 9),
        subscriptionId: sub.id,
        customerId: sub.customerId,
        customerName: sub.customerName,
        planName: sub.planName,
        scheduledDate: sub.nextRenewalDate,
        amount: sub.amount,
        currency: sub.currency,
        status: "scheduled",
        cardLast4: customer?.paymentMethod.last4 || "4242",
        daysUntil: Math.max(0, Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))),
      });
    }

    this.persist();
    return sub;
  }

  // Process Renewal action
  processRenewal(subId: string): {
    subscription: Subscription;
    invoice: PaymentInvoice;
    renewal: RenewalRecord;
  } {
    const sub = this.getSubscription(subId);
    if (!sub) throw new Error("Subscription not found");
    const customer = this.getCustomer(sub.customerId);
    if (!customer) throw new Error("Customer not found");

    const now = new Date();
    const oldEnd = new Date(sub.currentPeriodEnd);
    const newStart = oldEnd > now ? oldEnd : now;
    const newEnd = new Date(newStart);

    if (sub.billingCycle === "yearly") {
      newEnd.setFullYear(newEnd.getFullYear() + 1);
    } else {
      newEnd.setMonth(newEnd.getMonth() + 1);
    }

    sub.currentPeriodStart = newStart.toISOString();
    sub.currentPeriodEnd = newEnd.toISOString();
    sub.nextRenewalDate = newEnd.toISOString();
    sub.status = "active";

    // Mark customer active
    customer.status = "active";
    customer.totalSpent += sub.amount;

    // Create payment invoice
    const invoiceId = "INV-2026-" + Math.floor(1000 + Math.random() * 9000);
    const invoice: PaymentInvoice = {
      id: invoiceId,
      subscriptionId: sub.id,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      planName: `${sub.planName} (${sub.billingCycle === "yearly" ? "Annual" : "Monthly"})`,
      amount: sub.amount,
      currency: sub.currency,
      status: "succeeded",
      paymentMethod: `${customer.paymentMethod.brand.toUpperCase()} •••• ${customer.paymentMethod.last4}`,
      createdAt: now.toISOString(),
      description: `Automated renewal execution for ${sub.planName}`,
      receiptNumber: "REC-REN-" + Math.floor(100000 + Math.random() * 900000),
    };
    this.data.payments.unshift(invoice);

    // Update old renewal status and push next one
    const renIdx = this.data.renewals.findIndex(
      (r) => r.subscriptionId === sub.id && r.status === "scheduled"
    );
    if (renIdx !== -1) {
      this.data.renewals[renIdx]!.status = "succeeded";
    }

    const nextRenewal: RenewalRecord = {
      id: "ren_" + Math.random().toString(36).substring(2, 9),
      subscriptionId: sub.id,
      customerId: customer.id,
      customerName: customer.name,
      planName: sub.planName,
      scheduledDate: newEnd.toISOString(),
      amount: sub.amount,
      currency: sub.currency,
      status: "scheduled",
      cardLast4: customer.paymentMethod.last4,
      daysUntil: Math.ceil((newEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    };
    this.data.renewals.unshift(nextRenewal);

    this.persist();
    return { subscription: sub, invoice, renewal: nextRenewal };
  }

  // Retry failed payment
  retryPayment(paymentId: string): PaymentInvoice {
    const payment = this.data.payments.find((p) => p.id === paymentId);
    if (!payment) throw new Error("Payment record not found");
    if (payment.status !== "failed") throw new Error("Payment is not in failed state");

    payment.status = "succeeded";
    payment.failureReason = undefined;

    // Reactivate subscription if it was past due
    if (payment.subscriptionId) {
      const sub = this.getSubscription(payment.subscriptionId);
      if (sub && sub.status === "past_due") {
        sub.status = "active";
      }
      const cust = this.getCustomer(payment.customerId);
      if (cust && cust.status === "past_due") {
        cust.status = "active";
        cust.totalSpent += payment.amount;
      }
    }

    this.persist();
    return payment;
  }

  // Issue full or partial refund
  refundPayment(paymentId: string, refundAmount?: number, reason?: string): PaymentInvoice {
    const payment = this.data.payments.find((p) => p.id === paymentId);
    if (!payment) throw new Error("Payment record not found");
    if (payment.status !== "succeeded") throw new Error("Only succeeded payments can be refunded");

    const amountToRefund = refundAmount !== undefined ? Math.min(refundAmount, payment.amount) : payment.amount;
    payment.status = "refunded";
    payment.refundedAmount = amountToRefund;
    payment.description += ` [Refunded $${amountToRefund}: ${reason || "Customer request"}]`;

    const cust = this.getCustomer(payment.customerId);
    if (cust) {
      cust.totalSpent = Math.max(0, cust.totalSpent - amountToRefund);
    }

    this.persist();
    return payment;
  }

  // Pause / Resume subscription
  pauseSubscription(subId: string, pauseDurationDays: number = 30): Subscription {
    const sub = this.getSubscription(subId);
    if (!sub) throw new Error("Subscription not found");

    const resumeDate = new Date();
    resumeDate.setDate(resumeDate.getDate() + pauseDurationDays);

    sub.status = "paused";
    sub.pausedUntil = resumeDate.toISOString();
    this.persist();
    return sub;
  }

  resumeSubscription(subId: string): Subscription {
    const sub = this.getSubscription(subId);
    if (!sub) throw new Error("Subscription not found");

    sub.status = "active";
    sub.pausedUntil = undefined;
    this.persist();
    return sub;
  }

  // --- Payments ---
  getPayments(): PaymentInvoice[] {
    return this.data.payments;
  }

  // --- Renewals ---
  getRenewals(): RenewalRecord[] {
    const now = new Date().getTime();
    return this.data.renewals.map((r) => {
      const scheduled = new Date(r.scheduledDate).getTime();
      const daysUntil = Math.ceil((scheduled - now) / (1000 * 60 * 60 * 24));
      return { ...r, daysUntil };
    });
  }

  // --- Churn records ---
  getChurnRecords(): ChurnRecord[] {
    return this.data.churnRecords;
  }

  // --- Aggregated System Metrics ---
  getMetrics() {
    const subs = this.data.subscriptions;
    const activeSubs = subs.filter((s) => s.status === "active");
    const trialingSubs = subs.filter((s) => s.status === "trialing");
    const pastDueSubs = subs.filter((s) => s.status === "past_due");
    const canceledSubs = subs.filter((s) => s.status === "canceled");

    // Calculate MRR
    let mrr = 0;
    for (const sub of activeSubs) {
      if (sub.billingCycle === "yearly") {
        mrr += Math.round(sub.amount / 12);
      } else {
        mrr += sub.amount;
      }
    }

    const arr = mrr * 12;
    const totalCustomers = this.data.customers.length;
    const arpu = activeSubs.length > 0 ? Math.round(mrr / activeSubs.length) : 0;
    const churnRate = (totalCustomers > 0 ? (canceledSubs.length / totalCustomers) * 100 : 0).toFixed(1);

    // Recent 6 months revenue points
    const revenueTrend = [
      { month: "May", mrr: Math.round(mrr * 0.72), newSubs: 2, netRevenue: 2840 },
      { month: "Jun", mrr: Math.round(mrr * 0.78), newSubs: 3, netRevenue: 3420 },
      { month: "Jul", mrr: Math.round(mrr * 0.85), newSubs: 4, netRevenue: 4180 },
      { month: "Aug", mrr: Math.round(mrr * 0.92), newSubs: 3, netRevenue: 4890 },
      { month: "Sep", mrr: mrr, newSubs: 5, netRevenue: 5930 },
      { month: "Oct (Proj)", mrr: Math.round(mrr * 1.12), newSubs: 6, netRevenue: 6750 },
    ];

    return {
      mrr,
      arr,
      arpu,
      churnRate: Number(churnRate),
      totalSubscribers: subs.length,
      activeSubscribers: activeSubs.length,
      trialingSubscribers: trialingSubs.length,
      pastDueSubscribers: pastDueSubs.length,
      canceledSubscribers: canceledSubs.length,
      totalCustomers,
      upcomingRenewalsCount: this.data.renewals.filter((r) => r.status === "scheduled" && r.daysUntil <= 30).length,
      revenueTrend,
    };
  }
}

// Global singleton instance
const globalForStore = global as unknown as { fluoStore?: Store };
export const fluoStore = globalForStore.fluoStore || new Store();
if (process.env.NODE_ENV !== "production") globalForStore.fluoStore = fluoStore;
export default fluoStore;
