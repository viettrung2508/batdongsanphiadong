"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { adminApiBaseUrl } from "@/components/admin/admin-api";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const [frontendResponse, backendResponse] = await Promise.all([
        fetch("/api/admin-auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        }),
        fetch(`${adminApiBaseUrl}/api/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        })
      ]);

      if (!frontendResponse.ok || !backendResponse.ok) {
        throw new Error("LOGIN_FAILED");
      }

      router.replace("/dashboard/projects");
      router.refresh();
    } catch {
      setErrorMessage("Sai tên đăng nhập hoặc mật khẩu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <label className="grid gap-2 text-sm font-medium text-ink">
        Tên đăng nhập
        <input
          type="text"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="h-12 rounded-2xl border border-line px-4 text-sm outline-none transition focus:border-ink"
          placeholder="Nhập tên đăng nhập"
          autoComplete="username"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-ink">
        Mật khẩu
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-2xl border border-line px-4 text-sm outline-none transition focus:border-ink"
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          required
        />
      </label>

      {errorMessage ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}

      <button type="submit" disabled={isSubmitting} className="mt-2 h-12 rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-70">
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
