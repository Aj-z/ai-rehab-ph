'use client';
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/dashboard` },
    });

    if (!error) alert("📬 Check your mail for the magic link!");
    else alert(error.message);
  };

  return (
    <form onSubmit={handleMagicLink} className="space-y-4 w-full">
      <input
        name="email"
        type="email"
        placeholder="your@email.com"
        required
        className="w-full px-4 py-2 border rounded-lg"
      />
      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
        Send Magic Link
      </button>
    </form>
  );
}