/**
 * GPA Conversion scales for different countries
 */

export type CountryScale = {
  name: string;
  scale: {
    min: number;
    max: number;
    decimalPlaces: number;
  };
  description: string;
  conversion: (norwegianGPA: number) => number;
};

export const countryScales: CountryScale[] = [
  {
    name: "Norway",
    scale: {
      min: 1,
      max: 5,
      decimalPlaces: 2
    },
    description: "Norwegian grading scale (A-F)",
    conversion: (norwegianGPA: number) => norwegianGPA // No conversion needed
  },
  {
    name: "US",
    scale: {
      min: 0,
      max: 4,
      decimalPlaces: 2
    },
    description: "US GPA scale (0-4.0)",
    conversion: (norwegianGPA: number) => {
      // Convert 1-5 Norwegian scale to 0-4 US scale
      return (norwegianGPA - 1) * 0.8;
    }
  },
  {
    name: "UK",
    scale: {
      min: 0,
      max: 100,
      decimalPlaces: 0
    },
    description: "UK percentage scale (0-100)",
    conversion: (norwegianGPA: number) => {
      // Map Norwegian grades to UK percentages
      if (norwegianGPA >= 4.5) return 80; // First (70-100)
      if (norwegianGPA >= 3.5) return 65; // Upper Second (60-69)
      if (norwegianGPA >= 2.5) return 55; // Lower Second (50-59)
      if (norwegianGPA >= 1.5) return 45; // Third (40-49)
      return 30; // Fail (0-39)
    }
  },
  {
    name: "Germany",
    scale: {
      min: 1,
      max: 6,
      decimalPlaces: 1
    },
    description: "German grade scale (1-6, lower is better)",
    conversion: (norwegianGPA: number) => {
      // Convert 1-5 Norwegian scale to 6-1 German scale (inverted)
      return 6 - ((norwegianGPA - 1) * 1);
    }
  },
  {
    name: "France",
    scale: {
      min: 0,
      max: 20,
      decimalPlaces: 1
    },
    description: "French grade scale (0-20)",
    conversion: (norwegianGPA: number) => {
      // Convert 1-5 Norwegian scale to 0-20 French scale
      return (norwegianGPA - 1) * 4 + 4;
    }
  },
  {
    name: "Australia",
    scale: {
      min: 0,
      max: 7,
      decimalPlaces: 1
    },
    description: "Australian grade scale (0-7)",
    conversion: (norwegianGPA: number) => {
      // Convert 1-5 Norwegian scale to 0-7 Australian scale
      return (norwegianGPA - 1) * 1.4;
    }
  }
];

/**
 * Converts a Norwegian GPA to a specified country's scale
 */
export function convertGPA(norwegianGPA: number, countryName: string): number | null {
  const country = countryScales.find(c => c.name === countryName);
  if (!country) return null;
  
  const convertedValue = country.conversion(norwegianGPA);
  
  // Round to specified decimal places
  const factor = Math.pow(10, country.scale.decimalPlaces);
  return Math.round(convertedValue * factor) / factor;
}

/**
 * Get letter grade equivalents for different countries
 */
export function getCountryLetterGrade(norwegianGPA: number, countryName: string): string {
  const convertedGPA = convertGPA(norwegianGPA, countryName);
  if (convertedGPA === null) return "N/A";
  
  switch (countryName) {
    case "Norway":
      // Standard Norwegian letter grades
      if (norwegianGPA >= 4.5) return 'A';
      if (norwegianGPA >= 3.5) return 'B';
      if (norwegianGPA >= 2.5) return 'C';
      if (norwegianGPA >= 1.5) return 'D';
      if (norwegianGPA >= 1.0) return 'E';
      return 'F';
    
    case "US":
      // US letter grades
      if (convertedGPA >= 3.7) return 'A';
      if (convertedGPA >= 3.3) return 'A-';
      if (convertedGPA >= 3.0) return 'B+';
      if (convertedGPA >= 2.7) return 'B';
      if (convertedGPA >= 2.3) return 'B-';
      if (convertedGPA >= 2.0) return 'C+';
      if (convertedGPA >= 1.7) return 'C';
      if (convertedGPA >= 1.3) return 'C-';
      if (convertedGPA >= 1.0) return 'D';
      return 'F';
    
    case "UK":
      // UK classification
      if (convertedGPA >= 70) return 'First';
      if (convertedGPA >= 60) return 'Upper Second';
      if (convertedGPA >= 50) return 'Lower Second';
      if (convertedGPA >= 40) return 'Third';
      return 'Fail';
    
    case "Germany":
      // Just return the numeric grade for Germany (no letter equivalent)
      return convertedGPA?.toString() || "N/A";
    
    case "France":
      // French mentions
      if (convertedGPA >= 16) return 'Très Bien';
      if (convertedGPA >= 14) return 'Bien';
      if (convertedGPA >= 12) return 'Assez Bien';
      if (convertedGPA >= 10) return 'Passable';
      return 'Insuffisant';
    
    case "Australia":
      // Australian grades
      if (convertedGPA >= 6.0) return 'HD';
      if (convertedGPA >= 5.0) return 'D';
      if (convertedGPA >= 4.0) return 'CR';
      if (convertedGPA >= 3.0) return 'P';
      return 'F';
    
    default:
      return "N/A";
  }
} 