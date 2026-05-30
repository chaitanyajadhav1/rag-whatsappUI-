"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, User } from "@/lib/store";

const API_URL = "";

export function useAuth() {
  const router = useRouter();
  const { user, token, setAuth, clearAuth } = useAppStore();

  // Initialize auth from localStorage on mount
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken) {
        try {
          const parsed = JSON.parse(savedUser) as User;
          setAuth(parsed, savedToken);
        } catch {
          clearAuth();
        }
      }
    }
  }, [user, setAuth, clearAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json();
      setAuth(data.user, data.token);
      router.push("/");
      return data;
    },
    [setAuth, router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      const data = await res.json();
      setAuth(data.user, data.token);
      router.push("/");
      return data;
    },
    [setAuth, router]
  );

  const logout = useCallback(() => {
    clearAuth();
    router.push("/login");
  }, [clearAuth, router]);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const currentToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!currentToken) return {};
    return { Authorization: `Bearer ${currentToken}` };
  }, [token]);

  return {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    getAuthHeaders,
  };
}
