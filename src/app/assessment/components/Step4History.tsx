"use client";
import React from "react";

export default function Step4History({ data, update, onNext, onPrev }: any) {
  const setHistory = (patch: any) =>
    update({ medicalHistory: { ...(data.medicalHistory || {}), ...patch } });

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Medical History</h2>
      <p className="text-gray-600 text-center mb-6">This helps tailor your recommendations</p>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm mb-2">Age Range</label>
          <select className="w-full p-3 border rounded" value={data.medicalHistory.ageRange || ""} onChange={(e)=> setHistory({ ageRange: e.target.value })}>
            <option value="">Select age range</option>
            <option value="18-25">18-25</option><option value="26-35">26-35</option><option value="36-45">36-45</option>
            <option value="46-55">46-55</option><option value="56-65">56-65</option><option value="65+">65+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Activity Level</label>
          <select className="w-full p-3 border rounded" value={data.medicalHistory.activityLevel || ""} onChange={(e)=> setHistory({ activityLevel: e.target.value })}>
            <option value="">Select</option>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="athlete">Athlete</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">Previous injuries to this area?</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="radio" name="prev-injury" checked={data.medicalHistory.previousInjury === "yes"} onChange={()=> setHistory({ previousInjury: "yes" })} />
              <span className="ml-2">Yes</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="prev-injury" checked={data.medicalHistory.previousInjury === "no"} onChange={()=> setHistory({ previousInjury: "no" })} />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Current medications</label>
          <textarea className="w-full p-3 border rounded" rows={3} value={data.medicalHistory.medications || ""} onChange={(e)=> setHistory({ medications: e.target.value })} />
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button className="btn-secondary px-8 py-3 rounded-lg" onClick={onPrev}>Previous</button>
          <button className="btn-primary px-8 py-3 rounded-lg" onClick={()=>{
            // propagate pain-duration and trigger are already set
            onNext();
          }}>Get Recommendations</button>
        </div>
      </div>
    </div>
  );
}
