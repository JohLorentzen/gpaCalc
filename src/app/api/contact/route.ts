import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is initialized
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Database connection not available' },
        { status: 503 }
      ); 
    }

    const formData = await request.json();
    const { name, email, subject, message } = formData;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store the contact information in Supabase
    const { error } = await supabase
      .from('contacts')
      .insert([
        { 
          name, 
          email, 
          subject, 
          message,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to save contact information' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contact information saved successfully' 
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 