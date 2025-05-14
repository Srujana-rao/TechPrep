
import React from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpcomingInterview {
  id: string;
  title: string;
  date: Date | string;
  time?: string;
  type: 'technical' | 'behavioral' | 'mixed';
  role: string;
  topics?: string[];
}

interface UpcomingInterviewsProps {
  interviews?: UpcomingInterview[];
}

export const UpcomingInterviews = ({ interviews = [] }: UpcomingInterviewsProps) => {
  // Function to calculate days remaining and return appropriate styling
  const getDaysRemainingInfo = (interviewDate: Date | string) => {
    const date = typeof interviewDate === 'string' ? new Date(interviewDate) : interviewDate;
    const today = new Date();
    const daysRemaining = differenceInDays(date, today);
    
    let badgeVariant: 'default' | 'destructive' | 'outline' = 'default';
    let textColor = 'text-green-600';
    let message = '';
    
    if (daysRemaining < 0) {
      badgeVariant = 'destructive';
      textColor = 'text-red-600';
      message = 'Overdue';
    } else if (daysRemaining === 0) {
      badgeVariant = 'default';
      textColor = 'text-amber-600';
      message = 'Today';
    } else if (daysRemaining === 1) {
      badgeVariant = 'outline';
      textColor = 'text-amber-600';
      message = 'Tomorrow';
    } else if (daysRemaining <= 3) {
      badgeVariant = 'outline';
      textColor = 'text-amber-600';
      message = `${daysRemaining} days left`;
    } else {
      badgeVariant = 'outline';
      message = `${daysRemaining} days left`;
    }
    
    return { badgeVariant, textColor, message, daysRemaining };
  };
  
  // Generate sample upcoming interviews if none provided
  const sampleInterviews: UpcomingInterview[] = [
    {
      id: 'upcoming-1',
      title: 'Frontend Developer Interview',
      date: addDays(new Date(), 2),
      time: '10:00 AM',
      type: 'technical',
      role: 'Frontend Developer',
      topics: ['React', 'JavaScript', 'CSS', 'System Design']
    },
    {
      id: 'upcoming-2',
      title: 'Leadership Assessment',
      date: addDays(new Date(), 5),
      time: '2:30 PM',
      type: 'behavioral',
      role: 'Senior Developer',
      topics: ['Team Management', 'Conflict Resolution', 'Project Planning']
    },
    {
      id: 'upcoming-3',
      title: 'Full Stack Interview',
      date: new Date(),
      time: '4:00 PM',
      type: 'mixed',
      role: 'Full Stack Developer',
      topics: ['Node.js', 'React', 'Database Design']
    }
  ];
  
  const displayInterviews = interviews.length > 0 ? interviews : sampleInterviews;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
      </div>
      
      <div className="space-y-4">
        {displayInterviews.map((interview) => {
          const { badgeVariant, textColor, message } = getDaysRemainingInfo(interview.date);
          const formattedDate = typeof interview.date === 'string' 
            ? format(new Date(interview.date), 'MMM dd, yyyy') 
            : format(interview.date, 'MMM dd, yyyy');
          
          return (
            <Card key={interview.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{interview.title}</CardTitle>
                  <Badge variant={badgeVariant} className={textColor}>
                    {message}
                  </Badge>
                </div>
                <CardDescription>{interview.role}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  {interview.time && (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{interview.time}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-2">
                  <Badge variant="secondary" className="mr-2">
                    {interview.type === 'technical' ? 'Technical' : 
                     interview.type === 'behavioral' ? 'Behavioral' : 'Mixed'}
                  </Badge>
                </div>
                
                {interview.topics && interview.topics.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs text-gray-500 block mb-1">Interview Topics:</span>
                    <div className="flex flex-wrap gap-2">
                      {interview.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm" className="text-interview-primary border-interview-primary hover:bg-interview-primary/10">
                  <Bell className="mr-1 h-4 w-4" />
                  Set Reminder
                </Button>
                
                <Button asChild size="sm" className="bg-interview-primary hover:bg-interview-primary/90">
                  <Link to={`/interview/prepare/${interview.id}`}>
                    Prepare
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
