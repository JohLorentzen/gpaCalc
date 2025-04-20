type course = {
    courseCode?: string;
    courseName?: string;
    term?: string;
    credits: number;
    grade?: string;
  };
  
  export type Grades = {
    userId?: string;
    average?: number;
    totalCredits?: number;
    university?: string | null;
    country?: string | null;
    courses: course[];
  };
  