export interface GradeEntry {
  courseCode: string;
  courseName: string;
  term?: string;
  credits: number;
  grade: string;
  gradeValue: number;
}

export interface GradeResult {
  entries: GradeEntry[];
  average: number;
  totalCredits: number;
  totalGradePoints: number;
}

/**
 * Converts letter grades to numerical values
 */
function getGradeValue(grade: string): number {
  switch (grade.trim()) {
    case 'A': return 5.0;
    case 'B': return 4.0;
    case 'C': return 3.0;
    case 'D': return 2.0;
    case 'E': return 1.0;
    case 'F': return 0.0;
    // Pass grades
    case 'Pass':
    case 'Passed':
    case 'P':
    case 'Bestått': 
    case 'Godkjent': 
      return -1; // Pass/fail courses don't affect GPA
    // Fail grades
    case 'Fail':
    case 'Failed':
    case 'Ikke bestått': 
    case 'Ikke godkjent':
    case 'ikke godkjent':
      return 0.0;
    default: return 0.0;
  }
}

/**
 * Parse grades data from text and calculate GPA
 */
export function parseGrades(text: string): GradeResult {
  // Convert raw grades data to structured format
  const entries: GradeEntry[] = [];
  
  // Modified regex to match NTNU format
  // Look for course code, name, term (year + semester), credits, and grade
  const lines = text.split('\n');
  
  // NTNU pattern: courseCode, courseName, term, studiepoeng, grade
  for (let i = 0; i < lines.length; i++) {
    // Look for lines that start with course codes (e.g., HMS0002, IDATT1001, CS101)
    const courseCodeMatch = lines[i].match(/([A-Z]{2,5}\d{3,4})/);
    
    if (courseCodeMatch) {
      const courseCode = courseCodeMatch[1];
      const lineText = lines[i];
      
      // Try to extract other information from this line and next lines
      const courseName = lineText.replace(courseCode, '').trim();
      
      // Next line might contain term, credits, and grade
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        // Handle both Norwegian and English date formats
        const termMatch = nextLine.match(/(\d{4}\s+(?:høst|vår|spring|fall|autumn|summer|winter))/i) 
          || nextLine.match(/((?:Spring|Fall|Autumn|Summer|Winter)\s+\d{4})/i);
        const creditsMatch = nextLine.match(/(\d+(?:\.\d+)?)/); // Handle decimal credits too
        // Handle different grade formats
        const gradeMatch = nextLine.match(/([ABCDEF]|Pass(?:ed)?|Fail(?:ed)?|Bestått|Godkjent|Ikke\s+bestått|ikke\s+godkjent)/i);
        
        if ((termMatch || nextLine.includes('semester')) && creditsMatch) {
          const term = termMatch ? termMatch[1] : 'Unknown';
          const credits = parseFloat(creditsMatch[1]);
          const grade = gradeMatch ? gradeMatch[1] : 'Unknown';
          const gradeValue = getGradeValue(grade);
          
          entries.push({
            courseCode,
            courseName,
            term,
            credits,
            grade,
            gradeValue
          });
        }
      }
    }
  }
  
  // If the pattern approach doesn't work well, try a more targeted approach for NTNU transcript
  if (entries.length === 0) {
    // Look for the section with course data
    const tableStartIndex = text.indexOf('Emne');
    const tableEndIndex = text.indexOf('Sum:');
    
    if (tableStartIndex > -1 && tableEndIndex > -1) {
      const tableContent = text.substring(tableStartIndex, tableEndIndex);
      const tableLines = tableContent.split('\n').filter(line => line.trim() !== '');
      
      // Skip the header line
      for (let i = 1; i < tableLines.length; i++) {
        const line = tableLines[i];
        
        // Try to extract using position or segments
        const parts = line.split(/\s{2,}/).filter(part => part.trim() !== '');
        
        if (parts.length >= 5) {
          const courseCode = parts[0].trim();
          const courseName = parts[1].trim();
          const term = parts[2].trim();
          const creditsMatch = parts[3].match(/\d+/);
          const credits = creditsMatch ? parseInt(creditsMatch[0], 10) : 0;
          const grade = parts[4].trim();
          const gradeValue = getGradeValue(grade);
          
          if (courseCode.match(/[A-Z]{3,5}\d{4}/)) {
            entries.push({
              courseCode,
              courseName,
              term,
              credits,
              grade,
              gradeValue
            });
          }
        }
      }
    }
  }
  
  // Calculate GPA
  let totalCredits = 0;
  let totalGradePoints = 0;
  let countableCredits = 0;
  
  entries.forEach(entry => {
    totalCredits += entry.credits;
    
    // Skip pass/fail courses in GPA calculation
    if (entry.gradeValue >= 0) {
      totalGradePoints += entry.credits * entry.gradeValue;
      countableCredits += entry.credits;
    }
  });
  
  // Calculate weighted average (GPA)
  const average = countableCredits > 0 ? totalGradePoints / countableCredits : 0;
  
  return {
    entries,
    average,
    totalCredits,
    totalGradePoints
  };
} 