import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { ChatCompletion } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      return NextResponse.json({ 
        error: 'OpenAI API is not configured',
        message: 'The OpenAI API key is missing. Please configure it to use this feature.'
      }, { status: 503 });
    }
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if image is too large - increase limit for better OCR quality
    const imageSizeKB = buffer.length / 1024;
    if (imageSizeKB > 4000) {
      return NextResponse.json({
        error: 'Image too large',
        details: 'Please upload an image smaller than 4MB to avoid processing timeouts.'
      }, { status: 400 });
    }

    // Optimize image format for faster processing
    let base64Image: string;
    let mimeType = 'image/jpeg';
    
    // Convert to JPEG if it's PNG to reduce size for OpenAI processing
    if (fileType === 'image/png') {
      // For now, just use the original base64. In a production app, you might want to convert PNG to JPEG
      base64Image = buffer.toString('base64');
      mimeType = 'image/png';
    } else {
      base64Image = buffer.toString('base64');
      mimeType = 'image/jpeg';
    }

    // Send image to OpenAI API with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI API timeout after 25 seconds')), 25000);
    });

    const openaiPromise = openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract ALL course information from this Norwegian university transcript. You MUST extract EVERY single course listed in the document - do not skip any rows or sections. Return ONLY valid JSON with this exact schema: {university: string|null, country: string|null, courses: Array<{course: string, title: string, term: string, credits: number|null, grade: string}>}.\n\nCRITICAL INSTRUCTIONS:\n1. Extract ALL courses from the ENTIRE document - scan every section including 'Obligatoriske emner', 'Valgfag', 'Valgbaar', 'Bacheloroppgave'\n2. Course codes: Copy exactly as shown (e.g., IDATT1001, IMAT2021, ISTT1003) - be precise with letters and numbers\n3. Norwegian terms: Keep 'høst' and 'vår' as-is, do NOT translate to English\n4. Credits: From 'Studiepoeng' column - if '-' then use null, otherwise use the exact number (including decimals like 7.5)\n5. Grades: 'Bestått' stays as 'Bestått', letter grades A-F stay as-is\n6. Course titles: Extract complete titles, including multi-line ones\n7. Verify you have extracted EVERY row from the course table\n8. Pay special attention to course codes - they must be EXACTLY as shown in the image\n\nExample format: {\"course\": \"IDATT2202\", \"title\": \"Operativsystemer\", \"term\": \"2023 høst\", \"credits\": 7.5, \"grade\": \"A\"}"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 2500,
      temperature: 0,
      response_format: { type: "json_object" }
    });

    const response = await Promise.race([openaiPromise, timeoutPromise]) as ChatCompletion;

    // Extract JSON from the response
    const responseText = response.choices[0]?.message?.content || '';
    
    let jsonData;
    try {
      // Since we're using json_object response format, parse directly
      jsonData = JSON.parse(responseText);
      console.log(`OCR extracted ${jsonData.courses?.length || 0} courses`);
    } catch (error) {
      return NextResponse.json({
        error: 'Failed to parse JSON from API response',
        details: error instanceof Error ? error.message : 'Unknown parsing error',
        rawText: responseText
      }, { status: 400 });
    }
    
    if (!jsonData || !jsonData.courses || !Array.isArray(jsonData.courses) || jsonData.courses.length === 0) {
      return NextResponse.json({
        error: 'No course data could be extracted from the image',
        rawText: responseText
      }, { status: 400 });
    }
    
    // Extract university and country info
    const university = jsonData.university || null;
    const country = jsonData.country || null;
    
    // Process the courses and calculate GPA
    let totalGradePoints = 0;
    let totalCredits = 0;
    let countableCredits = 0;
    
    const processedCourses = jsonData.courses
      .filter((course: {
        course?: string | null;
        title?: string | null;
        term?: string | null;
        credits?: number | null;
        grade?: string | null;
      }) => {
        // Filter out completely invalid courses
        return course && (course.course || course.title);
      })
      .map((course: {
        course?: string | null;
        title?: string | null;
        term?: string | null;
        credits?: number | null;
        grade?: string | null;
      }) => {
        const credits = course.credits || 0;
        const grade = course.grade ? course.grade.trim() : 'Unknown';
      
      // Check if course should be excluded from GPA calculation
      const passFailGrades = ['Passed', 'Failed', 'Bestått', 'ikke godkjent', 'Godkjent', 'Pass', 'Fail'];
      const isPassFail = passFailGrades.some(pfGrade => 
        grade.toLowerCase() === pfGrade.toLowerCase()
      );
      const hasNullCredits = course.credits === null;
      
      // Exclude from GPA if credits is null or it's a pass/fail grade
      const includedInGpa = !hasNullCredits && !isPassFail && credits > 0;
      
      let gradeValue = 0;
      if (includedInGpa) {
        // Calculate grade value for letter grades (Norwegian system)
        switch (grade.toUpperCase()) {
          case 'A': gradeValue = 5.0; break;
          case 'B': gradeValue = 4.0; break;
          case 'C': gradeValue = 3.0; break;
          case 'D': gradeValue = 2.0; break;
          case 'E': gradeValue = 1.0; break;
          case 'F': gradeValue = 0.0; break;
          default: gradeValue = 0.0; break;
        }
        
        // Add to GPA calculation
        totalGradePoints += credits * gradeValue;
        countableCredits += credits;
      }
      
      // Add to total credits (all courses, including pass/fail)
      if (credits > 0) {
        totalCredits += credits;
      }
      
      return {
        courseCode: course.course || 'Unknown',
        courseName: course.title || 'Unknown Course',
        term: course.term || 'Unknown',
        credits: credits,
        grade: grade,
        gradeValue: gradeValue,
        includedInGpa: includedInGpa
      };
    });
    
    // Check if we have any valid courses after processing
    if (processedCourses.length === 0) {
      return NextResponse.json({
        error: 'No valid course data found',
        details: 'The uploaded image did not contain any recognizable course information. Please ensure the image is clear and contains a valid transcript.'
      }, { status: 400 });
    }

    // Calculate GPA average
    const average = countableCredits > 0 ? totalGradePoints / countableCredits : 0;
    
    // Return data in the format expected by the client
    const responseData = {
      success: true,
      result: {
        university,
        country,
        entries: processedCourses,
        average,
        totalCredits,
        totalGradePoints
      }
    };
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('OCR processing error:', error);
    
    // Handle timeout errors specifically
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json({ 
        error: 'Processing timeout',
        details: 'The image processing took too long. Please try with a smaller image or simpler transcript format.'
      }, { status: 408 });
    }
    
    return NextResponse.json({ 
      error: 'Error processing image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  if (!openai) {
    return NextResponse.json({ 
      status: 'OCR API is not available',
      message: 'The OpenAI API key is missing. Please configure it to use this feature.'
    });
  }
  
  return NextResponse.json({ status: 'OCR API is working' });
}

// Configure the runtime and maximum duration for this API route
export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds timeout 