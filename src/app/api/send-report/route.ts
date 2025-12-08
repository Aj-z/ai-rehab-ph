import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generatePDFReport } from '@/utils/reportGenerator';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  const { email, data } = await request.json();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pdfBuffer = await generatePDFReport(data);
    // Send email with PDF attachment using EmailJS
    const templateParams = {
      to_email: email,
      report_month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    // Logic to attach PDF via EmailJS or other service
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}