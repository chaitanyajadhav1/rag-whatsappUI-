"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { MessageSquare, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-gradient min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md p-8 animate-[scale-in_0.3s_ease-out]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--accent)" }}
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            HeidalAI
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-400 bg-red-400/10 border border-red-400/20">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2"
              style={{
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
                border: "1px solid var(--border-color)",
              }}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all focus:ring-2 pr-12"
                style={{
                  background: "var(--bg-input)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "var(--accent)" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
