"use client";
export default function QuickPainButtons() {
  const logPain = async (n: number) => {
    const res = await fetch("/api/quick-pain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pain: n }),
    });
    if (res.ok) location.reload();
  };

  return (
    <div className="flex gap-2 mb-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <button
          key={n}
          onClick={() => logPain(n)}
          className="w-12 h-12 rounded-full bg-gray-800/60 text-white hover:bg-indigo-600 transition border border-white/10"
        >
          {n}
        </button>
      ))}
    </div>
  );
}