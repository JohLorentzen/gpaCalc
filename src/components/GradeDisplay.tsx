"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { getLetterGrade } from '@/lib/gradeCalculator';
import { countryScales, convertGPA, getCountryLetterGrade } from '@/lib/gpaConversions';
import { Grades } from '@/types/Course';
import { Progress } from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GradeDisplay = ({ gradeData }: { gradeData: Grades }) => {
  const t = useTranslations('gradeDisplay');
  const [selectedCountry, setSelectedCountry] = useState("Norway");
  
  // Use the values from the API response directly
  console.log("GradeDisplay received data:", JSON.stringify(gradeData, null, 2));
  
  // Debug individual course credits
  gradeData.courses.forEach((course, index) => {
    console.log(`Course ${index}: ${course.courseName}, credits: ${course.credits}, type: ${typeof course.credits}`);
  });
  
  console.log(`Total credits from API: ${gradeData.totalCredits}`);
  const gpa = gradeData.average || 0;
  const totalCredits = gradeData.totalCredits !== undefined && gradeData.totalCredits !== null ? 
    Number(gradeData.totalCredits) : 0;
  const university = gradeData.university || null;
  const country = countryScales.find(c => c.name === selectedCountry);

  // Get the converted GPA
  const convertedGpa = convertGPA(gpa, selectedCountry) || 0;

  const chartData = [
    {
      name: 'GPA',
      value: gpa,
      color: gpa >= 2.5 ? 'hsl(var(--confirmation))' : 'hsl(var(--destructive))' 
    }
  ];

  const CHART_COLORS = [gpa >= 2.5 ? 'hsl(var(--confirmation))' : 'hsl(var(--destructive))'];

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-1 rounded-xl bg-muted">
          <TabsTrigger 
            value="summary" 
            className={cn(
              "rounded-lg text-sm font-medium transition-all py-2.5 text-foreground/90",
              "hover:bg-muted/70 hover:text-foreground",
              "data-[state=active]:bg-primary data-[state=active]:bg-gradient-to-br from-primary to-primary/80",
              "data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            )}
          >
            {t('summary')}
          </TabsTrigger>
          <TabsTrigger 
            value="details" 
            className={cn(
              "rounded-lg text-sm font-medium transition-all py-2.5 text-foreground/90",
              "hover:bg-muted/70 hover:text-foreground", 
              "data-[state=active]:bg-primary data-[state=active]:bg-gradient-to-br from-primary to-primary/80",
              "data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            )}
          >
            {t('details')}
          </TabsTrigger>
          <TabsTrigger 
            value="countryScales" 
            className={cn(
              "rounded-lg text-sm font-medium transition-all py-2.5 text-foreground/90",
              "hover:bg-muted/70 hover:text-foreground", 
              "data-[state=active]:bg-primary data-[state=active]:bg-gradient-to-br from-primary to-primary/80",
              "data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            )}
          >
            {t('countryScales')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4">
          <Card className="border border-border shadow-sm">
            <CardContent className="pt-6">
              {university && (
                <div className="mb-4 p-3 rounded-lg bg-muted/70 border border-border">
                  <h3 className="text-lg font-medium text-foreground">{university}</h3>
                  {gradeData.country && <p className="text-sm text-muted-foreground">{gradeData.country}</p>}
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2">
                  <h3 className="text-xl font-medium text-foreground mb-2">{t('averageGrade')}</h3>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl font-bold" style={{ 
                      color: gpa >= 3.5 ? 'hsl(var(--confirmation))' : 'hsl(var(--destructive))'
                    }}>
                      {gpa.toFixed(2)}
                    </span>
                    <span className="text-3xl font-semibold text-muted-foreground">/5</span>
                  </div>
                  
                  <Progress value={(gpa / 5) * 100} className="h-3 mb-2" />
                  
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>0</span>
                    <span>2.5</span>
                    <span>5</span>
                  </div>
                  
                  <div className="mt-6 p-4 rounded-lg bg-muted border border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/80">{t('letterGrade')}:</span>
                      <span className="text-2xl font-bold px-3 py-1 rounded-md" style={{ 
                        color: gpa >= 3.5 ? 'hsl(var(--confirmation))' : 'hsl(var(--destructive))'
                      }}>
                        {getLetterGrade(gpa)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)} / 5`, t('average')]} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="mt-4">
          <Card className="border border-border shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium text-foreground mb-4">{t('gradeOverview')}</h3>
              
              {university && (
                <div className="mb-4 p-3 rounded-lg bg-muted/70 border border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-foreground">{t('institution')}:</h4>
                      <p className="text-foreground/90">{university}</p>
                    </div>
                    {gradeData.country && (
                      <div className="text-right">
                        <h4 className="font-medium text-foreground">{t('country')}:</h4>
                        <p className="text-foreground/90">{gradeData.country}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <p className="text-muted-foreground mb-6">
                {t('detailsDescription')}
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[40%] font-semibold">{t('courseName')}</TableHead>
                    <TableHead className="text-center font-semibold">Term</TableHead>
                    <TableHead className="text-center font-semibold">{t('credits')}</TableHead>
                    <TableHead className="text-center font-semibold">{t('grade')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradeData.courses.map((course, index) => {
                    // Ensure credits is always displayed as a valid number
                    const displayCredits = course.credits === null || course.credits === undefined ? 0 : Number(course.credits);
                    
                    return (
                      <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{course.courseCode}</div>
                            <div className="text-sm text-muted-foreground">{course.courseName}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">{course.term || '-'}</TableCell>
                        <TableCell className="text-center">{displayCredits}</TableCell>
                        <TableCell className="text-center font-semibold" style={{ 
                          color: ['A', 'B', 'C', 'D', 'E', 'F'].includes(course.grade || '') 
                            ? getNumericGrade(course.grade) >= 3.5 ? 'hsl(var(--confirmation))' : 'hsl(var(--destructive))' 
                            : undefined 
                        }}>
                          {course.grade}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="mt-6 p-4 rounded-lg gradient-border bg-background/90 border">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{t('totalCredits')}:</span>
                  <span className="font-semibold text-lg">{totalCredits}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countryScales" className="mt-4">
          <Card className="border border-border shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-medium text-foreground mb-4">{t('countryScales')}</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('convertGPA')}
                </label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/80 backdrop-blur-md border border-border">
                    {countryScales.map((country) => (
                      <SelectItem key={country.name} value={country.name} className="hover:bg-primary/10">
                        {country.name} - {country.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">{t('originalScale')} (Norway)</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{gpa.toFixed(2)}</span>
                    <span className="text-muted-foreground">/5</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Letter Grade: {getLetterGrade(gpa)}
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">{t('convertedScale')} ({selectedCountry})</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{convertedGpa.toFixed(country?.scale.decimalPlaces || 2)}</span>
                    <span className="text-muted-foreground">/{country?.scale.max}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {t('equivalentGrade')}: {getCountryLetterGrade(gpa, selectedCountry)}
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Country</TableHead>
                    <TableHead className="text-center font-semibold">Scale</TableHead>
                    <TableHead className="text-center font-semibold">Converted GPA</TableHead>
                    <TableHead className="text-center font-semibold">{t('equivalentGrade')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countryScales.map((country) => {
                    const convertedValue = convertGPA(gpa, country.name) || 0;
                    
                    return (
                      <TableRow 
                        key={country.name} 
                        className={`hover:bg-muted/30 transition-colors ${selectedCountry === country.name ? 'bg-primary/5' : ''}`}
                      >
                        <TableCell className="font-medium">{country.name}</TableCell>
                        <TableCell className="text-center">{country.scale.min} - {country.scale.max}</TableCell>
                        <TableCell className="text-center">{convertedValue.toFixed(country.scale.decimalPlaces)}</TableCell>
                        <TableCell className="text-center font-semibold">
                          {getCountryLetterGrade(gpa, country.name)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to convert letter grades to numeric values
const getNumericGrade = (grade: string | undefined): number => {
  if (!grade) return 0;
  switch (grade) {
    case 'A': return 5;
    case 'B': return 4;
    case 'C': return 3;
    case 'D': return 2;
    case 'E': return 1;
    case 'F': return 0;
    default: return 0;
  }
};

export default GradeDisplay;
