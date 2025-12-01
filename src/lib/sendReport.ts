import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import ReportPDF from "@/components/ReportPDF"; // React component

const resend = new Resend(process.env.RESEND_API_KEY);
export async function emailReport(to: string, painData: any[]) {
  const buffer = await renderToBuffer(ReportPDF({ data: painData }));
  await resend.emails.send({
    from: "reports@ai-rehab.ph",
    to,
    subject: "AI-Rehab Progress Report",
    attachments: [{ filename: "report.pdf", content: buffer }],
  });
}