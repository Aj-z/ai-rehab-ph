"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCard() {
  const [loading, setLoading] = useState(false);

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const email = new FormData(e.currentTarget).get("email") as string;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);
    if (!error) {
      alert("📬 Check your email for the login link!");
    } else {
      alert(error.message);
    }
  }

  return (
    <div className="glass-card p-10 rounded-2xl shadow-2xl backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login • Secure Access Link</h2>

      <form onSubmit={handleMagicLink} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
        />
        <button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Access Link"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-3">No password required — login fast.</p>
    </div>
  );
}
