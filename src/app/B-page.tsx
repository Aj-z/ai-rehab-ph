"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // make sure this exists
import { useState } from "react";


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const email = new FormData(e.currentTarget).get("email") as string;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    });

    setLoading(false);
    if (!error) alert("📬 Check your email for the login link!");
    else alert(error.message);
  }

  return (
    <main className="font-inter bg-gradient-to-br from-slate-100 to-teal-50 min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center text-white font-semibold">
              AI
            </div>
            <span className="text-xl font-bold">AI Rehab PH</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a className="nav-link hover:text-teal-600">Home</a>
            <a href="/assessment" className="nav-link hover:text-teal-600">Assessment</a>
            <a href="/exercises" className="nav-link hover:text-teal-600">Exercises</a>
            <a href="/consultation" className="nav-link hover:text-teal-600">Consultation</a>
          </div>

          <button className="btn-primary px-6 py-2 font-semibold rounded-lg">
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* TEXT LEFT */}
          <div className="space-y-6">
            <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
              Professional <span className="text-teal-600">Healthcare</span> & Rehabilitation
            </h1>
            <p className="text-lg text-gray-600">
              AI-powered rehabilitation connecting patients with professionals.
            </p>

            <div className="flex gap-4">
              <button className="btn-primary px-8 py-4 rounded-lg text-lg">
                Start Assessment
              </button>
              <button className="border-2 border-teal-600 text-teal-700 px-8 py-4 rounded-lg hover:bg-teal-50">
                Watch Demo
              </button>
            </div>
          </div>

          {/* RIGHT – Supabase Auth Form 💚 */}
          <div className="glass-card p-10 rounded-2xl shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Login • Secure Access Link
            </h2>
            
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

            <p className="text-center text-sm text-gray-500 mt-3">
              No password required — login fast.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
