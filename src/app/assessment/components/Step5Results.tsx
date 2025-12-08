"use client";
import React, { useState } from "react";

export default function Step5Results({ data, update, onPrev }: any) {
  const [email, setEmail] = useState("");
  const [exists, setExists] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  function generateRecommendations() {
    const recs: any[] = [];
    if (data.painLevel >= 7) recs.push({ title: "Seek Immediate Medical Attention", description: "High pain — consider urgent evaluation." });
    else if (data.painLevel >= 4) recs.push({ title: "Consultation Recommended", description: "Moderate pain — consult a clinician." });

    if ((data.symptoms || []).includes("numbness")) recs.push({ title: "Neurological Assessment", description: "May involve nerve issues." });
    if ((data.symptoms || []).includes("swelling")) recs.push({ title: "RICE Protocol", description: "Rest, Ice, Compression, Elevation." });

    if (data.medicalHistory?.activityLevel === "athlete") recs.push({ title: "Sport-specific rehab", description: "You may need tailored training." });

    if (recs.length === 0) {
      recs.push({ title: "Gentle Movement", description: "Light stretching recommended." });
      recs.push({ title: "Monitor Symptoms", description: "Track progress daily." });
    }
    return recs;
  }

  // ---------------------------
  // CHECK IF EMAIL EXISTS
  // ---------------------------
  async function checkEmail() {
    if (!email) return alert("Enter email first.");
    setChecking(true);

    const res = await fetch("/api/saveAssessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        assessment: {},       // required by backend
        forceUpdate: false    // check only
      })
    });

    const j = await res.json();
    setExists(j.exists === true);
    setChecking(false);

    return j.exists;
  }

  // ---------------------------
  // SAVE OR UPDATE RECORD
  // ---------------------------
  async function save(shouldUpdate: boolean) {
    setSaving(true);

    const res = await fetch("/api/saveAssessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        assessment: data,
        forceUpdate: shouldUpdate  // true = update, false = insert
      })
    });

    const j = await res.json();
    setSaving(false);

    if (j.error) alert("Error: " + j.error);
    else alert("Saved successfully!");
  }

  // ---------------------------
  // DOWNLOAD PDF
  // ---------------------------
  async function downloadPDF() {
    if (!email) {
      const proceed = confirm("No email provided. Download PDF anyway?");
      if (!proceed) return;
    }

    const res = await fetch("/api/generatePDF", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email || null,
        assessment: data
      })
    });

    if (!res.ok) return alert("Failed to generate PDF.");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `assessment_${email || "guest"}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  }

  const recs = generateRecommendations();

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Your Assessment Results</h2>
      <p className="text-gray-600 text-center mb-6">Here are your personalized recommendations.</p>

      <div className="max-w-3xl mx-auto space-y-6 mb-4">
        {/* SUMMARY */}
        <div className="recommendation-card rounded-xl p-6">
          <h3 className="font-bold mb-3">Summary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><strong>Affected Area:</strong> {data.bodyRegion?.name || "-"}</div>
            <div><strong>Pain Level:</strong> {data.painLevel}/10</div>
            <div><strong>Symptoms:</strong> {(data.symptoms || []).join(", ") || "-"}</div>
            <div><strong>Activity Level:</strong> {data.medicalHistory?.activityLevel || "-"}</div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="recommendation-card rounded-xl p-6">
          <h3 className="font-bold mb-3">AI Recommendations</h3>
          <div className="space-y-3">
            {recs.map((r, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">✓</div>
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-gray-600">{r.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE / DOWNLOAD */}
        <div className="p-6 border rounded">
          <h4 className="font-semibold mb-2">Save / Download</h4>
          <input
            type="email"
            placeholder="you@example.com"
            className="p-2 border rounded w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              className="btn-primary px-4 py-2 rounded"
              onClick={async () => {
                const exists = await checkEmail();
                if (exists) {
                  const ok = confirm("Email already exists. Overwrite?");
                  if (ok) await save(true);
                } else {
                  await save(false);
                }
              }}
            >
              {checking ? "Checking..." : saving ? "Saving..." : "Save to Database"}
            </button>

            <button className="btn-secondary px-4 py-2 rounded" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="btn-secondary px-8 py-3 rounded-lg" onClick={onPrev}>Previous</button>
      </div>
    </div>
  );
}
