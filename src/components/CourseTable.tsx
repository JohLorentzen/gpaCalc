import React from 'react';
import { GradeEntry } from '@/lib/parser';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface CourseTableProps {
  courses: GradeEntry[];
  average: number;
  totalCredits: number;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, average, totalCredits }) => {
  const t = useTranslations('courseTable');
  
  // Get letter grade for the GPA
  const getLetterGrade = (gpa: number): string => {
    if (gpa >= 4.5) return 'A';
    if (gpa >= 3.5) return 'B';
    if (gpa >= 2.5) return 'C';
    if (gpa >= 1.5) return 'D';
    if (gpa >= 1.0) return 'E';
    return 'F';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{t('courseOverview')}</span>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1 text-base">
              {t('average')}: {average.toFixed(2)} ({getLetterGrade(average)})
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-base">
              {t('totalCredits')}: {totalCredits}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('courseCode')}</TableHead>
              <TableHead>{t('courseName')}</TableHead>
              <TableHead>{t('semester')}</TableHead>
              <TableHead className="text-center">{t('credits')}</TableHead>
              <TableHead className="text-center">{t('grade')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{course.courseCode}</TableCell>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>{course.term || '-'}</TableCell>
                <TableCell className="text-center">{course.credits}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={course.grade === 'F' || course.grade === 'Ikke bestått' ? 'destructive' : 
                            course.grade === 'A' ? 'default' : 'outline'}
                    className="px-2 py-0.5"
                  >
                    {course.grade}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CourseTable; 