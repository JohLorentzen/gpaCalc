/**
 * Converts numerical grade to letter grade
 */
export function getLetterGrade(gradeValue: number): string {
  if (gradeValue >= 4.5) return 'A';
  if (gradeValue >= 3.5) return 'B';
  if (gradeValue >= 2.5) return 'C';
  if (gradeValue >= 1.5) return 'D';
  if (gradeValue >= 1.0) return 'E';
  return 'F';
}

/**
 * Returns a color for the grade display
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return '#22c55e'; // Green
    case 'B': return '#84cc16'; // Light green
    case 'C': return '#eab308'; // Yellow
    case 'D': return '#f97316'; // Orange
    case 'E': return '#ef4444'; // Red
    case 'F': return '#7f1d1d'; // Dark red
    case 'Bestått': return '#60a5fa'; // Blue
    case 'Ikke bestått': return '#7f1d1d'; // Dark red
    default: return '#6b7280'; // Gray
  }
} 