"use client";
import React from "react";
import anime from "animejs";

const symptomList = [
  { id: "swelling", label: "Swelling" },
  { id: "stiffness", label: "Stiffness" },
  { id: "numbness", label: "Numbness/Tingling" },
  { id: "weakness", label: "Weakness" },
  { id: "burning", label: "Burning Sensation" },
  { id: "cramping", label: "Cramping" },
  { id: "clicking", label: "Clicking/Popping" },
  { id: "instability", label: "Instability" }
];

export default function Step3Symptoms({ data, update, onNext, onPrev }: any) {
  const toggle = (symptom: string, e: any) => {
    const existing = data.symptoms || [];
    let updated;

    // Multi-select: add/remove independently
    if (existing.includes(symptom)) {
      updated = existing.filter((s: string) => s !== symptom);
    } else {
      updated = [...existing, symptom];
    }

    update({ symptoms: updated });

    anime({
      targets: e.currentTarget,
      scale: [1, 1.05, 1],
      duration: 200,
      easing: "easeOutQuad"
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Select Your Symptoms</h2>
      <p className="text-gray-600 text-center mb-6">Choose all that apply</p>

      <div className="max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {symptomList.map(s => {
            const isSelected = data.symptoms?.includes(s.id);

            return (
              <div
                key={s.id}
                onClick={(e) => toggle(s.id, e)}
                className={`
                  symptom-tag px-4 py-3 rounded-lg text-center font-medium cursor-pointer transition-all border
                  ${isSelected
                    ? "bg-blue-500 text-white border-blue-600 shadow-md"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                  }
                `}
              >
                {s.label}
              </div>
            );
          })}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            rows={4}
            value={data.additionalNotes}
            onChange={(e) => update({ additionalNotes: e.target.value })}
            className="w-full p-3 border rounded"
            placeholder="Describe any additional symptoms..."
          />
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button className="btn-secondary px-8 py-3 rounded-lg" onClick={onPrev}>
            Previous
          </button>
          <button className="btn-primary px-8 py-3 rounded-lg" onClick={onNext}>
            Next: Medical History
          </button>
        </div>
      </div>
    </div>
  );
}
