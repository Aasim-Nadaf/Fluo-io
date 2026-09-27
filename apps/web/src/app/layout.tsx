import type { Metadata } from "next";
import { Inter, Manrope, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  variable: "--font-sans",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-display",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Fluo — Subscription Management System",
  description: "Manage customers, subscriptions, plans, renewals, upgrades, cancellations and payments with Wise design system",
  openGraph: {
    title: "Fluo — Subscription Management System",
    description: "Manage customers, subscriptions, plans, renewals, upgrades, cancellations and payments with Wise design system",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        "font-sans",
        inter.variable,
        manrope.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
