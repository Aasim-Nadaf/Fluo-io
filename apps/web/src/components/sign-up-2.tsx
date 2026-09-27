"use client";

import React, { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await register(name, email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error || "Failed to create account. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#e8ebe6] flex min-h-screen w-full items-center justify-center px-4 py-16 md:py-24">
      <div className="bg-white w-full max-w-md rounded-3xl border border-black/10 p-8 shadow-xl">
        <div className="flex flex-col items-start">
          <Link href="/" aria-label="go home">
            <Logo className="h-7 w-fit" />
          </Link>
          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e2f6d5] px-2.5 py-0.5 text-xs font-semibold text-[#163300]">
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.5} className="size-3" />
              Secure Registration
            </span>
            <h1 className="mt-2 font-display text-2xl font-black text-[#0e0f0c]">
              Create your account
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Start managing subscriptions, renewals and payments
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-11 rounded-xl border-[#0e0f0c]/20 bg-background focus:border-[#9fe870] focus:ring-[#9fe870]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Work Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-xl border-[#0e0f0c]/20 bg-background focus:border-[#9fe870] focus:ring-[#9fe870]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <span className="text-xs text-muted-foreground">min. 6 characters</span>
            </div>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 rounded-xl border-[#0e0f0c]/20 bg-background focus:border-[#9fe870] focus:ring-[#9fe870]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full bg-[#9fe870] text-[#0e0f0c] font-bold text-base hover:bg-[#cdffad] transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4 text-[#0e0f0c]" />
                Creating Account...
              </span>
            ) : (
              "Complete Signup & Enter Dashboard →"
            )}
          </Button>
        </form>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-[#0e0f0c] font-bold underline hover:text-[#054d28]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
