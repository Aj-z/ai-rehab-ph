import React from "react";

export default function HeroText() {
  return (
    <div className="space-y-6">
      <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
        Professional <span className="gradient-text">Healthcare</span> & Rehabilitation
      </h1>
      <p className="text-lg text-gray-600">
        AI-powered rehabilitation connecting patients with professionals.
      </p>

      <div className="flex gap-4">
        <a href="/assessment" className="btn-primary px-8 py-4 rounded-lg text-lg inline-block">Start Assessment</a>
        <button className="border-2 border-teal-600 text-teal-700 px-8 py-4 rounded-lg hover:bg-teal-50">Watch Demo</button>
      </div>
    </div>
  );
}
