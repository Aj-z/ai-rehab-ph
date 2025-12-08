"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { format, isSameDay, addDays, startOfWeek } from "date-fns";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import type { Appointment } from "@/types";
import { useSupabase } from "@/lib/supabase-context"; // ✅ NEW

interface Props {
  userId: string;
}

export function AppointmentCalendar({ userId }: Props) {
  const supabase = useSupabase();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    appointment_date: "",
    location: "",
    notes: "",
    professional_name: "",
    appointment_type: "consultation",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", userId)
        .gte("appointment_date", new Date().toISOString())
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      toast.error("Failed to load appointments");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("appointments").insert([
        {
          ...formData,
          user_id: userId,
          status: "scheduled",
          professional_name: formData.professional_name || "Unassigned",
          appointment_type: formData.appointment_type || "consultation",
        },
      ]);

      if (error) throw error;

      toast.success("Appointment scheduled successfully");
      setShowForm(false);
      setFormData({
        title: "",
        appointment_date: "",
        location: "",
        notes: "",
        professional_name: "",
        appointment_type: "consultation",
      });
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((apt) =>
      isSameDay(new Date(apt.appointment_date), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "border-l-4 border-teal-600";
      case "completed":
        return "border-l-4 border-green-600";
      case "cancelled":
        return "border-l-4 border-red-600";
      default:
        return "";
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-teal-100 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" />
          Upcoming Appointments
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition-all"
        >
          <Plus className="w-4 h-4" />
          Schedule
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100"
        >
          {" "}
          <select
            value={formData.appointment_type}
            onChange={(e) =>
              setFormData({ ...formData, appointment_type: e.target.value })
            }
            className="px-4 py-2 bg-white border border-teal-200 rounded-lg"
          >
            <option value="consultation">Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="assessment">Assessment</option>
          </select>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Appointment title (e.g., Physiotherapy)"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="px-4 py-2 bg-white border border-teal-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <input
              type="datetime-local"
              value={formData.appointment_date}
              onChange={(e) =>
                setFormData({ ...formData, appointment_date: e.target.value })
              }
              className="px-4 py-2 bg-white border border-teal-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="px-4 py-2 bg-white border border-teal-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="col-span-2 px-4 py-2 bg-white border border-teal-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
            <input
              type="text"
              placeholder="Professional name (e.g., Dr. Smith)"
              value={formData.professional_name}
              onChange={(e) =>
                setFormData({ ...formData, professional_name: e.target.value })
              }
              className="px-4 py-2 bg-white border border-teal-200 rounded-lg"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition"
            >
              Schedule Appointment
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {appointments.length === 0 ? (
          <p className="text-gray-600 text-center py-8 col-span-full">
            No upcoming appointments. Schedule your next visit!
          </p>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className={`p-4 bg-white rounded-lg hover:bg-gray-50 transition ${getStatusColor(
                apt.status
              )} border border-teal-100`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-gray-900 font-semibold">{apt.title}</h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    apt.status === "scheduled"
                      ? "bg-teal-100 text-teal-700"
                      : apt.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(apt.appointment_date), "MMM dd, yyyy")}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4" />
                  {format(new Date(apt.appointment_date), "h:mm a")}
                </div>
                {apt.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    {apt.location}
                  </div>
                )}
              </div>
              {apt.notes && (
                <p className="text-gray-600 text-xs mt-3 pt-3 border-t border-teal-100">
                  {apt.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
