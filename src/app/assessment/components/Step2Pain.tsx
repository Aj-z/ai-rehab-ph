"use client";
import React from "react";
import anime from "animejs";

export default function Step2Pain({ data, update, onNext, onPrev }: any) {
  const painDescriptions = [
    "No pain","Very mild pain","Mild pain","Moderate pain","Somewhat strong pain",
    "Strong pain","Very strong pain","Intense pain","Very intense pain","Excruciating pain","Unbearable pain"
  ];

  const onSlider = (e: any) => {
    const value = parseInt(e.target.value, 10);
    update({ painLevel: value });
    // small animation—for the value
    anime({ targets: ".pain-value", scale: [1, 1.15, 1], duration: 200, easing: "easeOutQuad" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Rate Your Pain Level</h2>
      <p className="text-gray-600 text-center mb-6">0 = No pain, 10 = Severe pain</p>

      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>No Pain</span>
            <span>Severe Pain</span>
          </div>

          <div className="pain-scale mb-4 h-2 rounded bg-gradient-to-r from-green-400 via-yellow-300 to-orange-500 relative">
            <input type="range" min="0" max="10" value={data.painLevel} className="pain-slider w-full absolute left-0 top-0" onChange={onSlider} />
          </div>

          <div className="text-center">
            <div className="pain-value text-4xl font-bold text-teal-600 mb-2">{data.painLevel}</div>
            <div className="text-gray-600">{painDescriptions[data.painLevel]}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">When did the pain start?</label>
            <select value={data.painDuration} onChange={(e)=> update({ painDuration: e.target.value })} className="w-full p-3 border rounded">
              <option value="">Select duration</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="months">Several months</option>
              <option value="year">Over a year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What triggered the pain?</label>
            <select value={data.painTrigger} onChange={(e)=> update({ painTrigger: e.target.value })} className="w-full p-3 border rounded">
              <option value="">Select trigger</option>
              <option value="exercise">Exercise/Sports</option>
              <option value="work">Work-related</option>
              <option value="accident">Accident</option>
              <option value="gradual">Gradual onset</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <button className="btn-secondary px-8 py-3 rounded-lg" onClick={onPrev}>Previous</button>
          <button className="btn-primary px-8 py-3 rounded-lg" onClick={onNext}>Next: Symptoms</button>
        </div>
      </div>
    </div>
  );
}
