"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/");
        return;
      }
      setUserEmail(data.user.email ?? null);
    }
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/");
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 rounded-2xl">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-4">Welcome back{userEmail ? `, ${userEmail}` : ""}.</p>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-sm text-gray-500">Quick stats / widgets can be integrated here.</div>
            </div>

            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
