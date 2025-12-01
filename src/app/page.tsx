"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthForm from "@/components/AuthForm"; 


export default function Home() {
  const [pain, setPain] = useState(5);
  const [msg, setMsg] = useState("");

  const submitPain = async () => {
    // 1) Ensure user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMsg("Please sign in first");
      return;
    }
    // 2) Insert / update log
    const { error } = await supabase.from("daily_logs").insert({
      injury_id: user.id, // stub: we’ll use real injury row later
      pain_level: pain,
      note: "",
    });
    if (error) {
      console.error(error);
      setMsg("DB error");
    } else {
      setMsg(`Pain ${pain}/10 saved!`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
  <h1 className="text-2xl font-bold text-gray-800 mb-2">AI-Rehab PH</h1>
  <p className="text-sm text-gray-600 mb-6">Sign in to track your recovery</p>
  <AuthForm />
  
</div>
  );
}