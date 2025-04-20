"use client"

import { useState, Suspense, use } from 'react';
import { useTranslations } from 'next-intl';
import FileDropZone from '@/components/FileDropZone';
import GradeDisplay from '@/components/GradeDisplay';
import { Grades } from '@/types/Course';
import { GradeResult } from '@/lib/parser';
import { AuroraText } from "@/components/magicui/aurora-text";

// Loading animation component
const LoadingAnimation = () => {
  const t = useTranslations('calculator');
  
  return (
    <section className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 border border-border">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{t('processing')}</h3>
              <p className="text-muted-foreground">
                {t('processingDescription')}
              </p>
            </div>
            
            <div className="w-full space-y-3 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('ocrProcessing')}</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-gradient-x" style={{ width: "66%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">{t('analyzingGrades')}</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-gradient-x" style={{ width: "33%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">{t('calculatingAverage')}</span>
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
  const t = useTranslations('calculator');
  
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{t('results')}</h2>
        <GradeDisplay gradeData={gradeData} />
      </div>
    </section>
  );
};



const PageContent = () => {
  const tApp = useTranslations('app');
  const tCalc = useTranslations('calculator');
  const tFeatures = useTranslations('features');
 
  
  const [gradeData, setGradeData] = useState<Grades | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProcessedGrade = (_average: number, details?: GradeResult) => {
    setIsLoading(false);
    if (details) {
      console.log("API Response details:", JSON.stringify(details, null, 2));
      
      const courses = details.entries.map(entry => {
        console.log(`Processing entry: ${entry.courseCode}, credits: ${entry.credits}, type: ${typeof entry.credits}`);
        
        // Ensure credits is always a valid number
        let credits = 0;
        if (entry.credits !== null && entry.credits !== undefined) {
          credits = typeof entry.credits === 'string' ? parseFloat(entry.credits) : Number(entry.credits);
          if (isNaN(credits)) credits = 0;
        }
        
        return {
          courseCode: entry.courseCode,
          courseName: entry.courseName,
          term: entry.term,
          credits: credits,
          grade: entry.grade,
        };
      });

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


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                {tApp('title')} <AuroraText className='gradient-text'>{tApp('titleHighlight')}</AuroraText>
              </h1>
              <p className="text-lg text-foreground/80 mb-8">
                {tApp('description')}
              </p>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl opacity-30"></div>
              <div className="relative bg-card text-card-foreground rounded-2xl shadow-xl p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  {tCalc('uploadTranscript')}
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
          <Suspense fallback={<div className="py-16 flex justify-center">{tCalc('loading')}</div>}>
            <LoadingAnimation />
          </Suspense>
        </div>
      ) : gradeData ? (
        <div className="animate-fade-in">
          <Suspense fallback={<div className="py-16 flex justify-center">{tCalc('loadingResults')}</div>}>
            <ResultsSection gradeData={gradeData} />
          </Suspense>
        </div>
      ) : null}
      
      {/* Features Section */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">{tFeatures('title')}</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            {tFeatures('description')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{tFeatures('step1.title')}</h3>
              <p className="text-muted-foreground">
                {tFeatures('step1.description')}
              </p>
            </div>
            
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{tFeatures('step2.title')}</h3>
              <p className="text-muted-foreground">
                {tFeatures('step2.description')}
              </p>
            </div>
            
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{tFeatures('step3.title')}</h3>
              <p className="text-muted-foreground">
                {tFeatures('step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      
      
    </div>
  );
};

// Actual Next.js page component that receives the params from the URL
export default function Page() {  
  return <PageContent />;
} 