import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
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

    // Send image to OpenAI API
    const response = await openai.responses.create({
      model: "gpt-4.1-nano-2025-04-14",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "I want a JSON list of all the courses and grades from this transcript image. Be accurate about term/semester information and credit values. Handle both English and Norwegian transcripts. For pass/fail courses, use 'Pass'/'Passed' or 'Fail'/'Failed' consistently. Return ONLY valid JSON without any explanations. The schema should be an array of objects with {course, title, term, credits, grade} properties. If credits are not available, use null." },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${base64Image}`,
              detail: "high",
            },
          ],
        },
      ],
    });

    // Log the response for debugging
    console.log('OpenAI API response:', response.output_text);

    // Extract JSON from the response
    let jsonData;
    
    // First, try to extract JSON from markdown code blocks
    const jsonMatch = response.output_text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        jsonData = JSON.parse(jsonMatch[1]);
        console.log('Successfully parsed JSON from code block:', jsonData);
      } catch (parseError) {
        console.error('Failed to parse extracted JSON:', parseError);
        return NextResponse.json({
          error: 'Failed to parse JSON from API response',
          rawText: response.output_text
        }, { status: 400 });
      }
    } else {
      // If no code blocks found, try to parse the entire response as JSON
      try {
        jsonData = JSON.parse(response.output_text);
        console.log('Successfully parsed raw JSON response:', jsonData);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        return NextResponse.json({
          error: 'No valid JSON found in API response',
          rawText: response.output_text
        }, { status: 400 });
      }
    }
    
    if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
      return NextResponse.json({
        error: 'No course data could be extracted from the image',
        rawText: response.output_text
      }, { status: 400 });
    }
    
    // Calculate GPA and totals
    let totalCredits = 0;
    let totalGradePoints = 0;
    let countableCredits = 0;
    
    // Process the courses to calculate GPA
    const processedCourses = jsonData.map(course => {
      // Handle different credit formats and convert to number
      const creditsRaw = course.credits;
      console.log(`Processing course: ${course.course}, raw credits: ${creditsRaw}, type: ${typeof creditsRaw}`);
      
      // Handle null, undefined, empty string, or dash
      let credits = 0;
      if (creditsRaw !== null && creditsRaw !== undefined && creditsRaw !== '' && creditsRaw !== '-') {
        credits = typeof creditsRaw === 'string' ? parseFloat(creditsRaw) : Number(creditsRaw);
      }
      
      console.log(`After conversion: credits = ${credits}, type: ${typeof credits}, isNaN: ${isNaN(credits)}`);
      
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
      
      console.log(`Final processed course: ${processedCourse.courseCode}, credits: ${processedCourse.credits}, type: ${typeof processedCourse.credits}`);
      return processedCourse;
    });
    
    // Calculate GPA
    const average = countableCredits > 0 ? totalGradePoints / countableCredits : 0;
    
    // Recalculate total credits by summing all processed entries
    totalCredits = processedCourses.reduce((sum, course) => sum + (course.credits || 0), 0);
    
    // Final response data object
    const responseData = {
      success: true,
      result: {
        entries: processedCourses,
        average,
        totalCredits,
        totalGradePoints
      }
    };
    
    // Debug the final response data
    console.log("Final API response data:", JSON.stringify(responseData, null, 2));
    console.log("Total credits:", totalCredits, "type:", typeof totalCredits);
    
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
  return NextResponse.json({ status: 'OCR API is working' });
} 