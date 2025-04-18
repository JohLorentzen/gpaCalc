import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { getLetterGrade } from '@/lib/gradeCalculator';
import { Grades } from '@/types/Course';
import { Progress } from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const GradeDisplay = ({ gradeData }: { gradeData: Grades }) => {
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

  const chartData = [
    {
      name: 'GPA',
      value: gpa,
      color: gpa >= 2.5 ? '#4CAF50' : '#F44336' 
    }
  ];

  const CHART_COLORS = [gpa >= 2.5 ? '#4CAF50' : '#F44336'];

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 rounded-xl bg-muted">
          <TabsTrigger 
            value="summary" 
            className={cn(
              "rounded-lg text-sm font-medium transition-all py-2.5 text-foreground/90",
              "hover:bg-muted/70 hover:text-foreground",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary",
              "data-[state=active]:text-white data-[state=active]:shadow-md"
            )}
          >
            Oppsummering
          </TabsTrigger>
          <TabsTrigger 
            value="details" 
            className={cn(
              "rounded-lg text-sm font-medium transition-all py-2.5 text-foreground/90",
              "hover:bg-muted/70 hover:text-foreground", 
              "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary",
              "data-[state=active]:text-white data-[state=active]:shadow-md"
            )}
          >
            Detaljer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4">
          <Card className="border border-border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2">
                  <h3 className="text-xl font-medium text-foreground mb-2">Gjennomsnittlig karakter</h3>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl font-bold" style={{ color: gpa >= 3.5 ? '#4CAF50' : '#F44336' }}>{gpa.toFixed(2)}</span>
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
                      <span className="text-foreground/80">Bokstavkarakter:</span>
                      <span className="text-2xl font-bold px-3 py-1 rounded-md" style={{ color: gpa >= 3.5 ? '#4CAF50' : '#F44336' }}>
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
                        formatter={(value: number) => [`${value.toFixed(2)} / 5`, 'Gjennomsnitt']} 
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
              <h3 className="text-xl font-medium text-foreground mb-4">Karakteroversikt</h3>
              <p className="text-muted-foreground mb-6">
                Her er en detaljert oversikt over dine emner og karakterer.
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[50%] font-semibold">Emnenavn</TableHead>
                    <TableHead className="text-center font-semibold">Studiepoeng</TableHead>
                    <TableHead className="text-center font-semibold">Karakter</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradeData.courses.map((course, index) => {
                    // Ensure credits is always displayed as a valid number
                    const displayCredits = course.credits === null || course.credits === undefined ? 0 : Number(course.credits);
                    
                    return (
                      <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{course.courseName}</TableCell>
                        <TableCell className="text-center">{displayCredits}</TableCell>
                        <TableCell className="text-center font-semibold" style={{ 
                          color: ['A', 'B', 'C', 'D', 'E', 'F'].includes(course.grade || '') 
                            ? getNumericGrade(course.grade) >= 3.5 ? '#4CAF50' : '#F44336' 
                            : undefined 
                        }}>
                          {course.grade}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-border">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Totale studiepoeng:</span>
                  <span className="font-semibold text-lg">{totalCredits}</span>
                </div>
              </div>
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
