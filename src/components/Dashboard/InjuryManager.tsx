// src/components/Dashboard/InjuryManager.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { Injury } from "@/types";
import { useSupabase } from "@/lib/supabase-context"; // ✅ NEW
interface Props {
  userId: string;
}

export function InjuryManager({ userId }: Props) {
  const supabase = useSupabase();
  const [injuries, setInjuries] = useState<Injury[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    injury_type: "",
    description: "",
    body_part: "unspecified",
    severity: 5,
    status: "active" as const,
  });

  useEffect(() => {
    fetchInjuries();
  }, [userId]); // ✅ Add userId dependency

  const fetchInjuries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("injuries")
        .select("*")
        .eq("user_id", userId) // ✅ Use prop
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInjuries(data || []);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.from("injuries").insert([
        {
          ...formData,
          user_id: userId, // ✅ Use prop
        },
      ]);

      if (error) throw error;

      toast.success("Injury added successfully");
      setShowForm(false);
      setFormData({
        injury_type: "",
        description: "",
        severity: 5,
        status: "active",
      });
      fetchInjuries();
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of component ...

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("injuries").delete().eq("id", id);
      if (error) throw error;
      toast.success("Injury deleted");
      fetchInjuries();
    } catch (error) {
      toast.error("Failed to delete injury");
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "healing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "recovered":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 7) return "bg-red-500";
    if (severity >= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-teal-100 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Injury Manager</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Injury
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Body part (e.g., Knee)"
              value={formData.body_part}
              onChange={(e) =>
                setFormData({ ...formData, body_part: e.target.value })
              }
              className="px-4 py-2 bg-white border border-teal-200 rounded-lg"
              required
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="px-4 py-2 bg-white border border-teal-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="active">Active</option>
              <option value="healing">Healing</option>
              <option value="recovered">Recovered</option>
            </select>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="col-span-2 px-4 py-2 bg-white border border-teal-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-2">
                Severity:{" "}
                <span className="text-gray-900">{formData.severity}</span>/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.severity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    severity: parseInt(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-white transition"
            >
              {isLoading ? "Saving..." : "Save Injury"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {injuries.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No injuries recorded. Add your first injury!
          </p>
        ) : (
          injuries.map((injury) => (
            <div
              key={injury.id}
              className="p-4 bg-white rounded-lg border border-teal-100 hover:border-teal-200 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-gray-900 font-semibold">
                      {injury.injury_type}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        injury.status
                      )}`}
                    >
                      {injury.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${getSeverityColor(
                          injury.severity
                        )}`}
                      ></div>
                      <span className="text-xs text-gray-600">
                        {injury.severity}/10
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{injury.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Added: {new Date(injury.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(injury.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
