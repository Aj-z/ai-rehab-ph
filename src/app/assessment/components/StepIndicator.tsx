export default function StepIndicator({ current, total }: { current:number, total:number }) {
  const indicators = Array.from({length: total}, (_,i)=>i+1);
  return (
    <div className="flex items-center space-x-4">
      {indicators.map(i => (
        <div key={i} className="flex items-center space-x-2">
          <div className={`step-indicator w-10 h-10 rounded-full flex items-center justify-center font-semibold ${i<current?'completed':''} ${i===current?'active':''}`}>
            {i}
          </div>
          {i < total && <div className="w-12 h-1 bg-gray-200 rounded"></div>}
        </div>
      ))}
    </div>
  );
}
