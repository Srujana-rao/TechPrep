
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
import { Calendar, Clock, BarChart, Trash2, Download, Share } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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

  const handleDownloadPdf = (interview: Interview) => {
    try {
      // Ensure we have conversation data
      if (!interview.results?.conversation || interview.results.conversation.length === 0) {
        // Create minimal conversation if it doesn't exist
        const questionsAndAnswers = [
          {
            question: "No detailed conversation data available",
            answer: "Summary report only",
            feedback: ""
          }
        ];
        
        // Call generatePdfReport with properly formatted data
        generatePdfReport({
          id: interview.id,
          title: interview.title,
          date: interview.date,
          position: interview.position || interview.role,
          questionsAndAnswers: questionsAndAnswers,
          overallScore: interview.score || interview.results?.overallScore || 0,
          overallFeedback: "This is an automatically generated report based on your interview performance.",
          strengths: interview.results?.strengths || [],
          areasForImprovement: interview.results?.improvements || [],
        });
      } else {
        // Convert Interview conversation data to the expected format
        const questionsAndAnswers = interview.results.conversation.map((item) => {
          return {
            question: item.question || item.text || "",
            answer: item.answer || "",
            feedback: item.feedback || ""
          };
        });

        // Call generatePdfReport with properly formatted data
        generatePdfReport({
          id: interview.id,
          title: interview.title,
          date: interview.date,
          position: interview.position || interview.role,
          questionsAndAnswers: questionsAndAnswers,
          overallScore: interview.score || interview.results?.overallScore || 0,
          overallFeedback: interview.results?.overallFeedback || "This report summarizes your interview performance.",
          strengths: interview.results?.strengths || [],
          areasForImprovement: interview.results?.improvements || [],
        });
      }
      
      toast({
        title: "Report generated",
        description: "Your interview report has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error generating report",
        description: "There was a problem generating your PDF report.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (interview: Interview, platform: string) => {
    try {
      // Create share URL with interview details
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/results/${interview.id}`;
      const shareTitle = `My Interview Results: ${interview.title}`;
      const shareText = `Check out my interview results for ${interview.position || interview.role} position. Score: ${interview.score || interview.results?.overallScore || 'N/A'}/10`;
      
      // Handle different share platforms
      let shareLink = '';
      
      switch(platform) {
        case 'whatsapp':
          shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
          break;
        case 'facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
          break;
        case 'linkedin':
          shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareText)}`;
          break;
        case 'twitter':
          shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'email':
          shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
          break;
        default:
          // Copy to clipboard
          navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
          toast({
            title: "Link copied",
            description: "Interview result link copied to clipboard.",
          });
          return;
      }
      
      // Open the share link in a new window
      window.open(shareLink, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Sharing initiated",
        description: `Sharing interview results via ${platform}.`,
      });
    } catch (error) {
      console.error('Error sharing interview:', error);
      toast({
        title: "Sharing failed",
        description: "There was a problem sharing your results.",
        variant: "destructive",
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
          <CardFooter className="pt-0 flex justify-between">
            {interview.completed ? (
              <div className="flex space-x-2 w-full justify-between">
                <Button asChild variant="outline">
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
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownloadPdf(interview)}
                    className="border-interview-primary text-interview-primary hover:bg-interview-primary/10"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-interview-primary text-interview-primary hover:bg-interview-primary/10">
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleShare(interview, 'whatsapp')}>
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(interview, 'facebook')}>
                        Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(interview, 'linkedin')}>
                        LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(interview, 'twitter')}>
                        Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(interview, 'email')}>
                        Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(interview, 'copy')}>
                        Copy Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <Button asChild>
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
