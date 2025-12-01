"use client";
import { useState } from "react";

export default function Home() {
  const [pain, setPain] = useState<number>(5);
  const [msg, setMsg] = useState<string>("");

  const submitPain = async () => {
    // stub – will wire to Supabase later
    setMsg(`Pain logged: ${pain}/10`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI-Rehab PH</h1>
        <p className="text-sm text-gray-600 mb-6">ACL recovery tracker</p>

        <label className="block mb-2 text-sm font-medium">Pain level (1-10)</label>
        <input
          type="range"
          min="1"
          max="10"
          value={pain}
          onChange={(e) => setPain(Number(e.target.value))}
          className="w-full mb-4 accent-indigo-600"
        />
        <div className="text-center text-lg font-semibold mb-4">{pain}</div>

        <button
          onClick={submitPain}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Log Pain
        </button>

        {msg && <p className="mt-4 text-green-600 text-center">{msg}</p>}
      </div>
    </main>
  );
}