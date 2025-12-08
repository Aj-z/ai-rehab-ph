import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(req: Request) {
  try {
    const { email, assessment } = await req.json();

    if (!assessment) {
      return NextResponse.json(
        { error: "Missing assessment data" },
        { status: 400 }
      );
    }

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([600, 800]);

    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);

    let y = 760;

    // Title
    page.drawText("AI Rehab PH – Assessment Report", {
      x: 30,
      y,
      size: 20,
      font: titleFont,
      color: rgb(0, 0.4, 0.5),
    });

    y -= 40;

    // Insert email
    if (email) {
      page.drawText(`Email: ${email}`, {
        x: 30,
        y,
        size: 12,
        font,
      });
      y -= 30;
    }

    // Section
    function write(label: string, value: string | number) {
      page.drawText(`${label}: ${value}`, {
        x: 30,
        y,
        size: 12,
        font,
      });
      y -= 22;
    }

    write("Affected Body Region", assessment.bodyRegion?.name);
    write("Pain Level", `${assessment.painLevel}/10`);
    write("Symptoms", assessment.symptoms?.join(", ") || "None");

    page.drawText("Medical History:", {
      x: 30,
      y,
      size: 14,
      font: titleFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 25;

    // Medical History details
    Object.entries(assessment.medicalHistory || {}).forEach(([key, val]) => {
      write(key, val || "—");
    });

    const pdfData = await pdf.save();

    return new NextResponse(pdfData, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=assessment.pdf",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
