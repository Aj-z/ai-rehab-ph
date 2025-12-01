import { createClient } from "@/lib/supabase-server";
import { createInjury } from "@/app/actions";
import { redirect } from "next/navigation";

const PARTS = ["Left ACL", "Right ACL", "Left Shoulder", "Right Shoulder", "Lower Back"];

export default async function Onboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  async function save(formData: FormData) {
    "use server";
    const part = formData.get("part") as string;
    await createInjury(user.id, part);
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen grid place-content-center p-6 bg-gradient-to-br from-gray-900 via-indigo-900 to-black">
      <div className="glass rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/10">
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
          Let’s get you started
        </h1>
        <p className="text-gray-300 mb-6">Pick the body part you want to track.</p>

        <form action={save} className="space-y-6">
          <select
            name="part"
            required
            className="w-full bg-gray-800/60 text-white border-0 rounded-lg px-4 py-3 ring-1 ring-white/20 focus:ring-indigo-400 focus:outline-none transition"
          >
            {PARTS.map((p) => (
              <option key={p} value={p} className="bg-gray-900">
                {p}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full btn-glow bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transition transform"
          >
            Start Tracking →
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-center">
          You can add more injuries later inside the dashboard.
        </p>
      </div>
    </main>
  );
}