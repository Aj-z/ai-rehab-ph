const features = [
  {
    title: "Personalized Plans",
    desc: "AI crafts progressive exercises based on your injury, pain level, and recovery goals.",
  },
  {
    title: "Track Progress",
    desc: "Daily logs, range-of-motion tracking, and visual charts show improvement over time.",
  },
  {
    title: "Clinician Tools",
    desc: "Therapists can assign programs and monitor multiple patients safely.",
  },
  {
    title: "Local Language Support",
    desc: "Guided instructions in Filipino/Tagalog with culturally-relevant phrasing.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-bold">Built for real recovery</h2>
        <p className="mt-3 text-gray-600">
          Tools your therapist will actually use and a patient experience that
          boosts adherence.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border p-6 bg-white shadow-sm"
          >
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 mx-auto max-w-3xl text-center">
        <h3 className="text-xl font-semibold">Want a demo?</h3>
        <p className="mt-2 text-gray-600">
          Request a clinician walkthrough or try the in-app demo to see results.
        </p>
        <div className="mt-6">
          <a
            href="/onboard"
            className="inline-block rounded-md bg-sky-600 px-6 py-3 text-white font-medium"
          >
            Request demo
          </a>
        </div>
      </div>
    </section>
  );
}
