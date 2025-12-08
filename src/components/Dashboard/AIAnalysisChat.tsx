'use client';

import { useState } from 'react';
import { Send, Bot, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  data: any;
}

export function AIAnalysisChat({ data }: Props) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.details || result.error || 'Analysis failed');
      }
      
      if (result.analysis) {
        setAnalysis(result.analysis);
      }
    } catch (error: any) {
      console.error('Client error:', error);
      setError(error.message);
      toast.error(`Analysis failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={analyzeData}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white transition"
      >
        <Bot className="w-5 h-5" />
        {isLoading ? 'Analyzing data...' : 'Analyze My Data with AI'}
      </button>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {analysis && (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <Bot className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-gray-700 whitespace-pre-line">{analysis}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800">
              ⚠️ This AI analysis is for informational purposes only and does not replace professional medical advice. Always consult with a qualified healthcare provider.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}