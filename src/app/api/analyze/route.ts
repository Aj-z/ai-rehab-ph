// src/components/Dashboard/AIAnalysisChat.tsx
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN || process.env.HUGGING_FACE_API_KEY,
});

async function analyzeData(prompt: string): Promise<string> {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await client.chat.completions.create({
        model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('Empty response from AI model');
      }
      return content;
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        // Implement exponential backoff
        const backoffTime = Math.pow(2, retries) * 1000; // 2^retries * 1000ms
        console.warn(`Rate limited. Retrying in ${backoffTime / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        retries++;
      } else {
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data) {
      console.error('Missing data in request body');
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    console.log('🤖 Analyzing data for user:', data.profile?.id);

    const prompt = `You are a medical AI assistant for a rehabilitation platform. Analyze this patient data and provide insights, recommendations, doctor suggestions, and first aid advice.

PATIENT DATA:
Pain Levels: ${JSON.stringify(data.dailyLogs?.slice(-7))}
Exercise Sessions: ${JSON.stringify(data.exerciseSessions)}
Injuries: ${JSON.stringify(data.injuries)}
Appointments: ${JSON.stringify(data.appointments)}
Profile: ${JSON.stringify(data.profile)}

INSTRUCTIONS:
1. Provide a brief medical analysis (2-3 sentences)
2. Recommend specific type of doctor/specialist to see
3. Give first aid/self-care advice
4. Suggest exercise modifications if needed
5. Add a medical disclaimer

Format as:
🔍 ANALYSIS: [your analysis]
👨‍⚕️ DOCTOR RECOMMENDATION: [doctor type]
🚑 FIRST AID: [specific advice]
💪 EXERCISE TIPS: [modifications]
⚠️ DISCLAIMER: This is not medical advice.`;

    const analysis = await analyzeData(prompt);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('❌ AI Error:', error.message);
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: error.message 
    }, { status: 500 });
  }
}