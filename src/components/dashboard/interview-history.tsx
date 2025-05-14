
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BarChart, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { generatePdfReport } from '@/utils/pdf-generator';
import { InterviewResult } from '@/types/interview';

interface Interview {
  id: string;
  title: string;
  date: string;
  duration: string;
  role: string;
  position?: string;
  type: 'technical' | 'behavioral' | 'mixed';
  completed: boolean;
  score?: number;
  user_id?: string;
  results?: InterviewResult;
}

interface InterviewHistoryProps {
  interviews: Interview[];
  onDeleteInterview?: (id: string) => void;
}

export const InterviewHistory = ({ interviews, onDeleteInterview }: InterviewHistoryProps) => {
  const handleDelete = (id: string) => {
    if (onDeleteInterview) {
      onDeleteInterview(id);
      toast({
        title: "Interview deleted",
        description: "The interview has been successfully deleted.",
      });
    }
  };

  if (interviews.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center p-6">
            <h3 className="text-lg font-medium text-gray-700">No interviews yet</h3>
            <p className="text-gray-500 mt-2">Create your first interview to get started.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
      {interviews.map((interview) => (
        <Card key={interview.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle>{interview.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={interview.completed ? "default" : "outline"}>
                  {interview.completed ? "Completed" : "In Progress"}
                </Badge>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Interview</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this interview? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(interview.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CardDescription>{interview.position || interview.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{interview.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{interview.duration}</span>
              </div>
            </div>
            <Badge variant="secondary" className="mr-2">
              {interview.type === 'technical' ? 'Technical' : 
               interview.type === 'behavioral' ? 'Behavioral' : 'Mixed'}
            </Badge>
            {interview.completed && interview.score !== undefined && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className={`font-bold ${
                    interview.score >= 8 ? 'text-green-600' : 
                    interview.score >= 6 ? 'text-amber-600' : 
                    'text-red-600'
                  }`}>{interview.score.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                  <div 
                    className={`h-2 rounded-full ${
                      interview.score >= 8 ? 'bg-green-600' : 
                      interview.score >= 6 ? 'bg-amber-600' : 
                      'bg-red-600'
                    }`}
                    style={{ width: `${interview.score * 10}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            {interview.completed ? (
              <Button asChild variant="outline" className="w-full">
                <Link to={`/results/${interview.id}`} state={{ 
                  interviewData: interview,
                  overallScore: interview.score || 0,
                  results: interview.results,
                  completedAt: interview.results?.completedAt || new Date().toISOString(),
                }}>
                  <BarChart className="mr-2 h-4 w-4" />
                  View Results
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link to={`/interview/${interview.id}`}>
                  Continue
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
