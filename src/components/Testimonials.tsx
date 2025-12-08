import React from "react";

export default function Testimonials() {
  const items = [
    {name: "Dr. Sarah Chen", role: "Physical Therapist", quote: "AI Rehab PH has revolutionized how we approach patient care."},
    {name: "Dr. Michael Rodriguez", role: "Sports Medicine", quote: "The exercise library is comprehensive and effective."},
    {name: "Dr. Emily Watson", role: "Rehabilitation Specialist", quote: "Connecting patients with the right specialists has been invaluable."}
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Healthcare Professionals</h2>
          <p className="text-xl text-gray-600">Leading providers trust our platform for comprehensive rehabilitation care.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t, i) => (
            <div key={i} className="testimonial-card rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t.quote}"</p>
              <div className="flex text-yellow-400 mt-4">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
