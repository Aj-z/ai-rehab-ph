"use client";
import React, { useRef, useState } from "react";
import anime from "animejs";

export default function Step1Region({ data, update, onNext }: any) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(data.bodyRegion?.region || null);

  const selectPart = (e: any) => {
    const el = e.target;
    if (!el) return;

    const region = el.getAttribute("data-region");
    const name = el.getAttribute("data-name");

    // Update state
    setSelectedRegion(region);
    update({ bodyRegion: { region, name } });

    // Bounce animation
    anime({
      targets: el,
      scale: [1, 1.08, 1],
      duration: 300,
      easing: "easeOutQuad",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">Select Affected Body Region</h2>
      <p className="text-gray-600 text-center mb-6">Click the area where you feel pain or discomfort.</p>

      <div className="body-diagram max-w-xs mx-auto">
        <svg ref={svgRef as any} viewBox="0 0 200 400" className="w-full h-auto">
          {[
            { cx: 100, cy: 40, rx: 25, ry: 30, type: "ellipse", region: "head", name: "Head/Neck" },
            { cx: 70, cy: 80, rx: 15, ry: 10, type: "ellipse", region: "left-shoulder", name: "Left Shoulder" },
            { cx: 130, cy: 80, rx: 15, ry: 10, type: "ellipse", region: "right-shoulder", name: "Right Shoulder" },
            { x: 45, y: 90, width: 15, height: 60, rx: 7, type: "rect", region: "left-arm", name: "Left Arm" },
            { x: 140, y: 90, width: 15, height: 60, rx: 7, type: "rect", region: "right-arm", name: "Right Arm" },
            { x: 75, y: 70, width: 50, height: 100, rx: 10, type: "rect", region: "torso", name: "Torso/Back" },
            { cx: 100, cy: 190, rx: 30, ry: 15, type: "ellipse", region: "hips", name: "Hips/Pelvis" },
            { x: 75, y: 205, width: 20, height: 70, rx: 10, type: "rect", region: "left-thigh", name: "Left Thigh" },
            { x: 105, y: 205, width: 20, height: 70, rx: 10, type: "rect", region: "right-thigh", name: "Right Thigh" },
            { cx: 85, cy: 285, rx: 10, ry: 8, type: "ellipse", region: "left-knee", name: "Left Knee" },
            { cx: 115, cy: 285, rx: 10, ry: 8, type: "ellipse", region: "right-knee", name: "Right Knee" },
            { x: 75, y: 295, width: 20, height: 60, rx: 10, type: "rect", region: "left-calf", name: "Left Calf" },
            { x: 105, y: 295, width: 20, height: 60, rx: 10, type: "rect", region: "right-calf", name: "Right Calf" },
            { cx: 85, cy: 370, rx: 12, ry: 8, type: "ellipse", region: "left-foot", name: "Left Foot" },
            { cx: 115, cy: 370, rx: 12, ry: 8, type: "ellipse", region: "right-foot", name: "Right Foot" },
          ].map((part) => {
            // Determine if this part is selected
            const isSelected = selectedRegion === part.region;

            const classes = `body-part transition-all duration-200 cursor-pointer fill-transparent stroke-gray-400 
                             hover:fill-blue-500/40 hover:stroke-blue-500/40 hover:scale-105 
                             ${isSelected ? "fill-blue-500 stroke-blue-500 scale-100" : ""}`;

            if (part.type === "ellipse") {
              return (
                <ellipse
                  key={part.region}
                  cx={part.cx}
                  cy={part.cy}
                  rx={part.rx}
                  ry={part.ry}
                  className={classes}
                  data-region={part.region}
                  data-name={part.name}
                  onClick={selectPart}
                />
              );
            } else {
              return (
                <rect
                  key={part.region}
                  x={part.x}
                  y={part.y}
                  width={part.width}
                  height={part.height}
                  rx={part.rx}
                  className={classes}
                  data-region={part.region}
                  data-name={part.name}
                  onClick={selectPart}
                />
              );
            }
          })}
        </svg>
      </div>

      <div className="text-center mt-6">
        <div className="text-teal-600 font-semibold h-8">
          {data.bodyRegion ? `Selected: ${data.bodyRegion.name}` : "Please select a body region"}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          className="btn-primary px-8 py-3 rounded-lg font-semibold"
          disabled={!data.bodyRegion}
          onClick={() => onNext()}
        >
          Next: Pain Assessment
        </button>
      </div>
    </div>
  );
}
