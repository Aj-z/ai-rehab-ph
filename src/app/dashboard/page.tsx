import { createClient } from "@/lib/supabase-server";
import PainChart from "@/components/PainChart";
import SquatCounter from "@/components/SquatCounter";
import EmailReportButton from "@/components/EmailReportButton";
import QuickPainButtons from "@/components/QuickPainButtons";
import { redirect } from "next/navigation";


export default async function Dashboard() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: injuries } = await supabase
    .from("injuries")
    .select("id")
    .eq("user_id", user.id);
  const injuryIds = injuries?.map((i) => i.id) ?? [];

  const { data } = await supabase
    .from("daily_logs")
    .select("logged_at, pain_level")
    .in("injury_id", injuryIds)
    .order("logged_at", { ascending: true });

  return (
    <main className="min-h-screen text-white p-6 md:p-12">
      <QuickPainButtons /> 
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Recovery Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <PainChart data={data ?? []} />
          <SquatCounter />
        </div>

        <EmailReportButton email={user.email} />
      </div>
    </main>
  );
}