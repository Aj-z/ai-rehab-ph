"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function DashboardPreview() {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const option = {
      color: ['#0891b2', '#84cc16', '#f97316'],
      tooltip: { trigger: 'axis' },
      legend: { data: ['Pain Level', 'Mobility', 'Exercise Compliance'], bottom: 0 },
      xAxis: { type: 'category', boundaryGap: false, data: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6'] },
      yAxis: { type: 'value' },
      series: [
        { name: 'Pain Level', type: 'line', smooth: true, data: [8,7,6,5,4,3] },
        { name: 'Mobility', type: 'line', smooth: true, data: [3,4,5,6,7,8] },
        { name: 'Exercise Compliance', type: 'line', smooth: true, data: [60,70,75,80,85,90] }
      ]
    };
    chart.setOption(option);
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      chart.dispose();
    };
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Real-Time Progress Dashboard</h2>
            <p className="text-xl text-gray-600 mb-8">Monitor your recovery journey with comprehensive analytics and milestone celebrations.</p>

            <div className="space-y-6">
              <small className="font-semibold">Pain Level Tracking</small>
              <small className="font-semibold">Progress Analytics</small>
              <small className="font-semibold">Achievement System</small>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
              <div id="progress-chart" ref={chartRef} style={{height:200}}/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-teal-600 mb-1">85%</div>
                <div className="text-sm text-gray-600">Exercise Compliance</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">-2.4</div>
                <div className="text-sm text-gray-600">Avg Pain Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
