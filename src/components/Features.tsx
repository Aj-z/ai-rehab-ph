"use client";
import React from "react";

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Healthcare Solutions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our AI-powered platform provides personalized rehabilitation programs, expert consultations, and continuous progress monitoring for optimal recovery outcomes.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard title="Smart Assessment" href="/assessment" colorFrom="teal" desc="AI-powered injury assessment with interactive body diagrams, pain scale tracking, and personalized recommendations."/>
          <FeatureCard title="Exercise Library" href="/exercises" colorFrom="green" desc="Comprehensive exercise database with video demonstrations, personalized workout plans, and progress tracking."/>
          <FeatureCard title="Expert Consultation" href="/consultation" colorFrom="blue" desc="Connect with certified professionals for personalized treatment plans and ongoing support."/>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc, href, colorFrom }:{
  title:string, desc:string, href:string, colorFrom:string
}) {
  const gradient = colorFrom==="teal"? "from-teal-500 to-teal-600" : colorFrom==="green"? "from-green-500 to-green-600" : "from-blue-500 to-blue-600";
  return (
    <div className="feature-card glass-card rounded-2xl p-8 text-center cursor-pointer" onClick={() => window.location.href = href}>
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/>
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{desc}</p>
      <div className={`${colorFrom==="green"?"text-green-600":colorFrom==="blue"?"text-blue-600":"text-teal-600"} font-semibold`}>Explore →</div>
    </div>
  );
}
