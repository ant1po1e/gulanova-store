"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Incorrect email or password.");
      return;
    }

    const redirectTo = searchParams.get("redirectTo") || "/admin/dashboard";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl italic text-ink">Admin Login</h1>
        <p className="mt-1 text-sm text-ink2/80">
          For catalog administrators only.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink2">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink2">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="text-sm text-rose">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-ink px-5 py-2.5 text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}
