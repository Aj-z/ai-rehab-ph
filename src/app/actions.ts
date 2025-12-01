"use server";

import { createClient } from "@/lib/supabase-server";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import ReportPDF from "@/components/Re

export async function createInjury(userId: string, bodyPart: string) {
  const supabase = createClient(); // server-side client
  const { data, error } = await supabase
    .from("injuries")
    .insert({ user_id: userId, body_part: bodyPart })
    .select()
    .single();
  if (error) throw error;
  return data;
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function emailReport(to: string, painData: any[]) {
  const buffer = await renderToBuffer(ReportPDF({ data: painData }));
  await resend.emails.send({
    from: "reports@ai-rehab.ph",
    to,
    subject: "Your Recovery Report",
    attachments: [{ filename: "report.pdf", content: buffer }],
  });
}