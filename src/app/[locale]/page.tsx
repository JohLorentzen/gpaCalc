"use client"

import { useState, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import FileDropZone from '@/components/FileDropZone';
import GradeDisplay from '@/components/GradeDisplay';
import { Grades } from '@/types/Course';
import { GradeResult } from '@/lib/parser';
import { AuroraText } from "@/components/magicui/aurora-text";
import { useParams } from 'next/navigation';

// Loading animation component
const LoadingAnimation = () => {
  const t = useTranslations('calculator');
  
  return (
    <section className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 border border-border relative overflow-hidden">
          {/* Background gradient animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50 animate-gradient-x"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-center text-muted-foreground">{t('processing')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Results section component
const ResultsSection = ({ gradeData }: { gradeData: Grades }) => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <GradeDisplay gradeData={gradeData} />
      </div>
    </section>
  );
};

export default function Page() {
  const tApp = useTranslations('app');
  const tCalc = useTranslations('calculator');
  const tFeatures = useTranslations('features');
  const params = useParams();
  const locale = params.locale as string;
  
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
        university: details.university,
        country: details.country,
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
                  locale={locale}
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
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {tFeatures('title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-card text-card-foreground rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">
                  {tFeatures(`feature${index}.title`)}
                </h3>
                <p className="text-muted-foreground">
                  {tFeatures(`feature${index}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 