"use client";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Step1Region from "./components/Step1Region";
import Step2Pain from "./components/Step2Pain";
import Step3Symptoms from "./components/Step3Symptoms";
import Step4History from "./components/Step4History";
import Step5Results from "./components/Step5Results";
import StepIndicator from "./components/StepIndicator";

export default function AssessmentContainer() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [assessmentData, setAssessmentData] = useState<any>({
    bodyRegion: null,
    painLevel: 0,
    painDuration: "",
    painTrigger: "",
    symptoms: [] as string[],
    additionalNotes: "",
    medicalHistory: {
      ageRange: "",
      activityLevel: "",
      previousInjury: "",
      medications: ""
    }
  });

  useEffect(() => {
    // simple scroll to step top on step change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const update = (patch: any) => setAssessmentData((s:any) => ({ ...s, ...patch }));

  return (
    <main className="pt-24 pb-16">
           <NavBar />
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Intelligent Injury Assessment</h1>
          <p className="text-gray-600">AI-powered tool — answer a few questions for personalized recommendations.</p>
        </div>

        <div className="flex justify-center mb-8">
          <StepIndicator current={currentStep} total={5} />
        </div>

        <div className="glass-card rounded-2xl p-8">
          {currentStep === 1 && (
            <Step1Region
              data={assessmentData}
              onNext={() => setCurrentStep(2)}
              update={update}
            />
          )}
          {currentStep === 2 && (
            <Step2Pain
              data={assessmentData}
              onNext={() => setCurrentStep(3)}
              onPrev={() => setCurrentStep(1)}
              update={update}
            />
          )}
          {currentStep === 3 && (
            <Step3Symptoms
              data={assessmentData}
              onNext={() => setCurrentStep(4)}
              onPrev={() => setCurrentStep(2)}
              update={update}
            />
          )}
          {currentStep === 4 && (
            <Step4History
              data={assessmentData}
              onNext={() => setCurrentStep(5)}
              onPrev={() => setCurrentStep(3)}
              update={update}
            />
          )}
          {currentStep === 5 && (
            <Step5Results
              data={assessmentData}
              onPrev={() => setCurrentStep(4)}
              update={update}
            />
          )}
        </div>
      </div>
    </main>
  );
}
