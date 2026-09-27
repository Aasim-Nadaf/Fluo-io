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
import { Tick02Icon, AlertCircleIcon, SparklesIcon } from "@hugeicons/core-free-icons";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error || "Invalid credentials. Please verify and try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@fluo.finance");
    setPassword("password123");
    setError(null);
    setLoading(true);
    try {
      const res = await login("demo@fluo.finance", "password123");
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error || "Demo login failed");
      }
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
              Real JWT Authentication
            </span>
            <h1 className="mt-2 font-display text-2xl font-black text-[#0e0f0c]">
              Sign in to Fluo
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Access your full-stack subscription management hub
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
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="demo@fluo.finance"
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
                Verifying Credentials...
              </span>
            ) : (
              "Sign In to Dashboard →"
            )}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <hr className="flex-1 border-black/10" />
          <span className="text-muted-foreground text-xs uppercase font-medium">or quick test</span>
          <hr className="flex-1 border-black/10" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full h-11 rounded-full border-black/15 bg-[#f6f8f5] hover:bg-[#e2f6d5] hover:border-[#9fe870] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} className="size-4 text-[#054d28]" />
          Instant Demo Sign-in (Alex Morgan)
        </Button>

        <div className="mt-4 rounded-xl bg-[#f6f8f5] p-3 text-xs text-muted-foreground">
          <div className="font-semibold text-foreground">Pre-seeded Credentials:</div>
          <div className="mt-0.5 flex justify-between font-mono">
            <span>demo@fluo.finance</span>
            <span>password123</span>
          </div>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#0e0f0c] font-bold underline hover:text-[#054d28]"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </section>
  );
}
