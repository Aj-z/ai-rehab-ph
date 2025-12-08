"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


type Log = { logged_at: string; pain_level: number };

export default function PainChart({ data }: { data: Log[] }) {
  if (!data.length)
    return (
      <div className="glass rounded-xl p-6 text-center text-gray-400">
        No logs yet – start tracking!
      </div>
    );

  const rows = data.map((d) => ({
    ...d,
    date: new Date(d.logged_at).toLocaleDateString("en-GB"),
  }));

  return (
    <div className="glass rounded-xl p-6 shadow-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Pain Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={rows}>
          <defs>
            <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis domain={[0, 10]} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              background: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="pain_level"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#paint)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
