"use client"
import { useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import FileDropZone from '@/components/FileDropZone';
import GradeDisplay from '@/components/GradeDisplay';
import { Grades } from '@/types/Course';
import { GradeResult } from '@/lib/parser';
import { AuroraText } from "@/components/magicui/aurora-text";

// Loading animation component
const LoadingAnimation = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 border border-border">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Behandler karakterutskrift</h3>
              <p className="text-muted-foreground">
                Dette kan ta litt tid mens vi analyserer bildet ditt og henter ut karakterene
              </p>
            </div>
            
            <div className="w-full space-y-3 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">OCR-behandling</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-gradient-x" style={{ width: "66%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">Analyserer karakterer</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-gradient-x" style={{ width: "33%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">Beregner gjennomsnitt</span>
                <div className="w-2 h-2 rounded-full bg-muted"></div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Results component wrapped in suspense
const ResultsSection = ({ gradeData }: { gradeData: Grades }) => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Dine resultater</h2>
        <GradeDisplay gradeData={gradeData} />
      </div>
    </section>
  );
};

const Page = () => {
  const [gradeData, setGradeData] = useState<Grades | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Original file upload handler - keeping for reference
  /* const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process the file');
      }

      const apiResponse = await response.json();
      handleApiResponse(apiResponse);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }; */

  const handleProcessedGrade = (_average: number, details?: GradeResult) => {
    setIsLoading(false);
    if (details) {
      const courses = details.entries.map(entry => ({
        courseCode: entry.courseCode,
        courseName: entry.courseName,
        term: entry.term,
        credits: entry.credits,
        grade: entry.grade,
      }));

      const gradesData: Grades = {
        average: details.average,
        totalCredits: details.totalCredits,
        courses: courses
      };

      console.log("Converting GradeResult to Grades:", gradesData);
      setGradeData(gradesData);
    }
  };

  // Modified FileDropZone callback to handle loading state
  const handleFileProcessingStart = () => {
    setIsLoading(true);
  };

  /* Keeping this for reference in case we need to handle raw API responses
  const handleApiResponse = (apiResponse: { rawText: string }) => {
    const jsonMatch = apiResponse.rawText.match(/```json\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const coursesJson = JSON.parse(jsonMatch[1]);
        
        interface CourseJSON {
          course: string;
          title: string;
          term: string;
          credits: string;
          grade: string;
        }
        
        const courses = coursesJson.map((course: CourseJSON) => ({
          courseCode: course.course,
          courseName: course.title,
          term: course.term,
          credits: course.credits === '-' ? 0 : Number(course.credits),
          grade: course.grade,
        }));

        const totalCredits = courses.reduce((acc: number, course: { credits: number }) => 
          acc + (isNaN(course.credits) ? 0 : course.credits), 0);
          
        const totalWeightedGrades = courses.reduce((acc: number, course: { grade: string, credits: number }) => {
          const gradeValue = getNumericGrade(course.grade);
          return acc + (gradeValue * (isNaN(course.credits) ? 0 : course.credits));
        }, 0);
        
        const average = totalCredits ? totalWeightedGrades / totalCredits : 0;

        const gradeData: Grades = {
          courses,
          average,
          totalCredits,
        };

        setGradeData(gradeData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else {
      console.error('No JSON data found in the response');
    }
  }; */

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Kalkuler ditt Universitets <AuroraText className='gradient-text'>snitt</AuroraText>
              </h1>
              <p className="text-lg text-foreground/80 mb-8">
                Last opp ditt Universitets/Høyskole karakterutskrift og få dine emner og gjennomsnittskarakter beregnet på sekunder.
              </p>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl opacity-30"></div>
              <div className="relative bg-card text-card-foreground rounded-2xl shadow-xl p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Last opp ditt Universitets/Høyskole karakterutskrift
                </h2>
                <FileDropZone 
                  onFileProcessed={handleProcessedGrade}
                  onProcessingStart={handleFileProcessingStart}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section with Suspense */}
      {isLoading ? (
        <div className="animate-fade-in">
          <Suspense fallback={<div className="py-16 flex justify-center">Laster inn...</div>}>
            <LoadingAnimation />
          </Suspense>
        </div>
      ) : gradeData ? (
        <div className="animate-fade-in">
          <Suspense fallback={<div className="py-16 flex justify-center">Laster resultater...</div>}>
            <ResultsSection gradeData={gradeData} />
          </Suspense>
        </div>
      ) : null}
      
      {/* Features Section */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Hvordan det fungerer</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            KarakterKalk gjør det enkelt og intuitivt å beregne din gjennomsnittskarakter
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Last opp karakterutskrift</h3>
              <p className="text-muted-foreground">
                Dra og slipp ditt Universitets/Høyskole karakterutskrift i bildeformat.
              </p>
            </div>
            
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Øyeblikkelig analyse</h3>
              <p className="text-muted-foreground">
                Vår KI-teknologi henter ut karakterene dine og beregner snittet umiddelbart.
              </p>
            </div>
            
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Se resultater</h3>
              <p className="text-muted-foreground">
                Se dine emner, studiepoeng og gjennomsnittskarakter i en oversiktlig tabell.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 bg-card text-card-foreground dark:bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">KarakterKalk</h2>
              <p className="text-sm text-muted-foreground">© 2025 KarakterKalk. Alle rettigheter reservert.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="btn-link">Personvern</a>
              <a href="#" className="btn-link">Vilkår</a>
              <a href="#" className="btn-link">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
