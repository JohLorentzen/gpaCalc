import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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

    // Convert buffer to base64
    const base64Image = buffer.toString('base64');
    
    // Check if image is too large and might cause timeout
    const imageSizeKB = buffer.length / 1024;
    if (imageSizeKB > 4000) { // If larger than 4MB
      return NextResponse.json({
        error: 'Image too large',
        details: 'Please upload an image smaller than 4MB to avoid processing timeouts. You can resize or compress the image before uploading.'
      }, { status: 400 });
    }

    // Send image to OpenAI API
    const response = await openai.responses.create({
      model: "gpt-4o-mini", // Using faster model
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Extract course information from this transcript image. Return ONLY valid JSON with this exact schema: {university: string|null, country: string|null, courses: Array<{course: string, title: string, term: string, credits: number|null, grade: string}>}. For pass/fail courses, use 'Pass' or 'Fail'. If information cannot be determined, use null." },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${base64Image}`,
              detail: "low", // Reduced detail for faster processing
            },
          ],
        },
      ],
    });

    // Extract JSON from the response
    let jsonData;
    
    // Helper function to extract and parse JSON from text
    const extractAndParseJson = (text: string) => {
      // First try to parse the entire text as JSON
      try {
        return JSON.parse(text.trim());
      } catch {
        // If that fails, try to find JSON by looking for { and }
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
          try {
            const extractedJson = text.substring(jsonStart, jsonEnd + 1);
            return JSON.parse(extractedJson);
          } catch (innerError) {
            throw new Error(`Failed to parse extracted JSON: ${innerError instanceof Error ? innerError.message : 'Unknown error'}`);
          }
        } else {
          throw new Error('No valid JSON structure found in response');
        }
      }
    };
    
    // First, try to extract JSON from markdown code blocks
    const jsonMatch = response.output_text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        jsonData = extractAndParseJson(jsonMatch[1]);
      } catch (error) {
        return NextResponse.json({
          error: 'Failed to parse JSON from markdown code block',
          details: error instanceof Error ? error.message : 'Unknown parsing error',
          rawText: response.output_text,
          extractedText: jsonMatch[1]
        }, { status: 400 });
      }
    } else {
      // If no code blocks found, try to extract JSON from the entire response
      try {
        jsonData = extractAndParseJson(response.output_text);
      } catch (error) {
        return NextResponse.json({
          error: 'No valid JSON found in API response',
          details: error instanceof Error ? error.message : 'Unknown parsing error',
          rawText: response.output_text
        }, { status: 400 });
      }
    }
    
    if (!jsonData || !jsonData.courses || !Array.isArray(jsonData.courses) || jsonData.courses.length === 0) {
      return NextResponse.json({
        error: 'No course data could be extracted from the image',
        rawText: response.output_text
      }, { status: 400 });
    }
    
    // Extract university and country info
    const university = jsonData.university || null;
    const country = jsonData.country || null;
    
    // Calculate GPA and totals
    let totalCredits = 0;
    let totalGradePoints = 0;
    let countableCredits = 0;
    
    // Process the courses to calculate GPA
    const processedCourses = jsonData.courses.map((course: {
      course: string;
      title: string;
      term: string;
      credits: string | number | null;
      grade: string;
    }) => {
      // Handle different credit formats and convert to number
      const creditsRaw = course.credits;
      
      // Handle null, undefined, empty string, or dash
      let credits = 0;
      if (creditsRaw !== null && creditsRaw !== undefined && creditsRaw !== '' && creditsRaw !== '-') {
        credits = typeof creditsRaw === 'string' ? parseFloat(creditsRaw) : Number(creditsRaw);
      }
      
      // Normalize grade values for different formats
      let normalizedGrade = course.grade;
      // Handle English and Norwegian pass/fail variations
      if (['Bestått', 'Godkjent', 'Pass', 'Passed', 'P'].includes(course.grade)) {
        normalizedGrade = 'Pass';
      } else if (['Ikke bestått', 'ikke godkjent', 'Ikke godkjent', 'Fail', 'Failed', 'F'].includes(course.grade)) {
        normalizedGrade = 'F'; // Count as failed
      }
      
      const gradeValue = getGradeValue(normalizedGrade);
      
      // Only include in GPA calculation if credits are valid and not a Pass grade
      const validForGpa = !isNaN(credits) && credits > 0 && normalizedGrade !== 'Pass';
      
      if (validForGpa) {
        totalCredits += credits;
        
        // Add to GPA calculation
        totalGradePoints += credits * gradeValue;
        countableCredits += credits;
      }
      
      const processedCourse = {
        courseCode: course.course,
        courseName: course.title,
        term: course.term,
        credits: !isNaN(credits) ? credits : 0,
        grade: course.grade,
        gradeValue: gradeValue,
        includedInGpa: validForGpa
      };
      
      return processedCourse;
    });
    
    // Calculate GPA
    const average = countableCredits > 0 ? totalGradePoints / countableCredits : 0;
    
    // Recalculate total credits by summing all processed entries
    totalCredits = processedCourses.reduce((sum: number, course: { credits: number | null }) => sum + (course.credits || 0), 0);
    
    // Final response data object
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
    
    // Return data in the format expected by the client
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('OCR processing error:', error);
    return NextResponse.json({ 
      error: 'Error processing image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function for grade calculation
function getGradeValue(grade: string): number {
  switch (grade.trim()) {
    case 'A': return 5.0;
    case 'B': return 4.0;
    case 'C': return 3.0;
    case 'D': return 2.0;
    case 'E': return 1.0;
    case 'F': return 0.0;
    // Pass grades in various languages
    case 'Pass': 
    case 'Passed':
    case 'P':
    case 'Bestått': 
    case 'Godkjent': 
      return -1; // Pass grades don't affect GPA
    // Fail grades in various languages
    case 'Fail':
    case 'Failed':
    case 'Ikke bestått': 
    case 'Ikke godkjent':
    case 'ikke godkjent':
      return 0.0; // Fail grades count as F
    default: return 0.0;
  }
}

// This function allows us to check API status
export async function GET() {
  // Check if OpenAI client is initialized
  if (!openai) {
    return NextResponse.json({ 
      status: 'OCR API is not available',
      message: 'The OpenAI API key is missing. Please configure it to use this feature.'
    });
  }
  
  return NextResponse.json({ status: 'OCR API is working' });
} 