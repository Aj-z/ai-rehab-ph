import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import emailjs from 'emailjs-com';
import { BookingData } from '@/types';

export const formatDate = (date: Date): string => format(date, 'EEEE, MMMM d, yyyy');

export const isEmailJSConfigured = (): boolean => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
  return !!(serviceId && templateId && userId);
};

export const getEmailJSConfigStatus = (): string => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;
  
  const missing: string[] = [];
  if (!serviceId) missing.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
  if (!templateId) missing.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
  if (!userId) missing.push('NEXT_PUBLIC_EMAILJS_USER_ID');
  
  return missing.length > 0 
    ? `Missing: ${missing.join(', ')}`
    : '✅ EmailJS is fully configured';
};

export const generateAppointmentPDF = (booking: BookingData): void => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(20);
    doc.setTextColor(8, 145, 178);
    doc.text('AI Rehab PH', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text('Appointment Confirmation', pageWidth / 2, 35, { align: 'center' });
    
    doc.setDrawColor(8, 145, 178);
    doc.setLineWidth(0.5);
    doc.line(20, 45, pageWidth - 20, 45);

    doc.setFontSize(12);
    const details = [
      `Patient Name: ${booking.userName}`,
      `Professional: ${booking.professional.name}`,
      `Specialty: ${booking.professional.specialty}`,
      `Consultation Type: ${booking.consultationType.name}`,
      `Date: ${formatDate(booking.date)}`,
      `Time: ${booking.time}`,
      `Duration: ${booking.consultationType.duration}`,
      `Price: ${booking.price}`
    ];
    
    let yPosition = 60;
    details.forEach((detail) => {
      doc.text(detail, 20, yPosition);
      yPosition += 10;
    });

    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Please arrive 10 minutes early for your appointment.', pageWidth / 2, 250, { align: 'center' });
    doc.text('Contact: support@airehab.ph | +63 2 1234 5678', pageWidth / 2, 260, { align: 'center' });
    
    const fileName = `appointment-${format(booking.date, 'yyyy-MM-dd')}-${booking.professional.name.replace(/\s+/g, '-')}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const sendAppointmentEmail = async (booking: BookingData, userEmail: string): Promise<boolean> => {
  if (!isEmailJSConfigured()) {
    console.warn('📧 EmailJS Configuration Warning:', getEmailJSConfigStatus());
    console.warn('Email notification skipped.');
    
    // Detailed mock output for development
    if (process.env.NODE_ENV === 'development') {
      console.log('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =');
      console.log('📨 MOCK EMAIL SENT (Development Mode)');
      console.log('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =');
      console.log('To:', userEmail);
      console.log('Subject: Appointment Confirmed - ' + booking.professional.name + ' on ' + formatDate(booking.date));
      console.log('');
      console.log('Patient Name:', booking.userName);
      console.log('Professional:', booking.professional.name);
      console.log('Specialty:', booking.professional.specialty);
      console.log('Consultation Type:', booking.consultationType.name);
      console.log('Date:', formatDate(booking.date));
      console.log('Time:', booking.time);
      console.log('Duration:', booking.consultationType.duration);
      console.log('Price:', booking.price);
      console.log('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =');
      console.log('To send real emails, configure EmailJS credentials in .env.local');
      console.log('= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =');
    }
    
    return process.env.NODE_ENV === 'development';
  }

  try {
    const templateParams = {
      to_email: booking.userEmail,
      patient_name: booking.userName,
      professional_name: booking.professional.name,
      specialty: booking.professional.specialty,
      consultation_type: booking.consultationType.name,
      date: formatDate(booking.date),
      time: booking.time,
      duration: booking.consultationType.duration,
      price: booking.price
    };

    console.log('📧 Sending email with params:', templateParams);
    
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
    );
    
    console.log('✅ EmailJS Response:', response);
    return response.status === 200;
  } catch (error) {
    console.error('❌ EmailJS Error Details:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      status: (error as any)?.status,
      text: (error as any)?.text
    });
    
    // Try to extract more detail from the error
    if ((error as any)?.status === 400) {
      console.error('Bad Request - Check template variables match exactly');
    } else if ((error as any)?.status === 401) {
      console.error('Unauthorized - Check your User ID');
    } else if ((error as any)?.status === 404) {
      console.error('Not Found - Check Service ID or Template ID');
    } else if ((error as any)?.status === 0) {
      console.error('Network Error - Check your internet connection');
    }
    
    return false;
  }
};

export const debugEmailJS = async () => {
  if (!isEmailJSConfigured()) {
    console.error('EmailJS not configured');
    return;
  }

  const testData = {
    to_email: 'test@example.com',
    patient_name: 'Test Patient',
    professional_name: 'Dr. Test',
    specialty: 'Test Specialty',
    consultation_type: 'Test Consultation',
    date: 'Monday, January 1, 2025',
    time: '10:00 AM',
    duration: '60 minutes',
    price: '$100'
  };

  console.log('Testing EmailJS with:', testData);

  try {
    const result = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      testData,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
    );
    console.log('✅ Test successful:', result);
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};