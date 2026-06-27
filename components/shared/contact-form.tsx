"use client";

import { FormEvent, useState } from "react";

const contactApiUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  (process.env.NODE_ENV === "production" ? "/api/backend" : "http://127.0.0.1:4000");

const initialForm = {
  name: "",
  phone: "",
  email: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(`${contactApiUrl}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          source: "website"
        })
      });

      if (!response.ok) {
        throw new Error("SUBMIT_FAILED");
      }

      setForm(initialForm);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Chưa thể gửi yêu cầu lúc này. Vui lòng thử lại sau.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
      <input
        value={form.name}
        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        className="h-12 rounded-full border border-line px-5 text-sm outline-none"
        placeholder="Họ và tên"
        required
      />
      <input
        value={form.phone}
        onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
        className="h-12 rounded-full border border-line px-5 text-sm outline-none"
        placeholder="Số điện thoại"
        required
      />
      <input
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        className="h-12 rounded-full border border-line px-5 text-sm outline-none"
        placeholder="Email"
        type="email"
      />
      <textarea
        value={form.message}
        onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        className="min-h-36 rounded-[24px] border border-line px-5 py-4 text-sm outline-none"
        placeholder="Nhu cầu của bạn"
      />
      <button
        disabled={status === "submitting"}
        className="h-12 rounded-full bg-ink text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Đang gửi..." : "Gửi thông tin"}
      </button>

      {status === "success" ? (
        <p className="text-sm font-medium text-green-700">Thông tin của anh/chị đã được gửi thành công.</p>
      ) : null}

      {status === "error" ? <p className="text-sm font-medium text-red-600">{errorMessage}</p> : null}
    </form>
  );
}
