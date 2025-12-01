"use client";
import { useTransition } from "react";

export default function EmailReportButton({ email }: { email: string }) {
  const [isPending, start] = useTransition();

  const send = () =>
    start(async () => {
      const rows = await fetch("/api/logs").then((r) => r.json());
      await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, data: rows }),
      });
      alert("📄 Report sent!");
    });

  return (
    <button
      onClick={send}
      disabled={isPending}
      className="btn-glow w-full max-w-md mx-auto mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg disabled:opacity-70"
    >
      {isPending ? "Sending..." : "Email PDF Report"}
    </button>
  );
}