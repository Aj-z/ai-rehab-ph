import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Recover faster with AI-guided rehab
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Personalized exercise plans, progress tracking, and AI coach
              suggestions — all in one app designed for Filipino patients and
              therapists.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/onboard"
                className="inline-flex items-center justify-center rounded-md bg-sky-600 px-5 py-3 text-white font-medium shadow hover:opacity-95"
              >
                Start free
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-md border border-gray-200 px-5 py-3 text-sm"
              >
                Learn more
              </a>
            </div>
            <ul className="mt-8 flex gap-6 text-sm text-gray-600">
              <li>✅ Home & clinic friendly</li>
              <li>✅ Clinically-informed routines</li>
              <li>✅ Localized for the Philippines</li>
            </ul>
          </div>
          <div className="relative">
            <div className="rounded-2xl bg-gradient-to-tr from-sky-100 to-white p-6 shadow-lg">
              <img
                src="/mockup-exercise.png"
                alt="Exercise mockup"
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              App preview: exercise instructions, video, and progress graph
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
