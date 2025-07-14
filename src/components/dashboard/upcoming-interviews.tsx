
import React, { useState, useEffect } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Bell, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddInterviewDialog } from './add-interview-dialog';

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
  const [reminderOpen, setReminderOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<UpcomingInterview | null>(null);
  const [reminderTime, setReminderTime] = useState<string>("15");
  const [addInterviewOpen, setAddInterviewOpen] = useState(false);
  const [userInterviews, setUserInterviews] = useState<UpcomingInterview[]>([]);

  // Load user interviews from localStorage on component mount
  useEffect(() => {
    const storedInterviews = localStorage.getItem('upcomingInterviews');
    if (storedInterviews) {
      try {
        setUserInterviews(JSON.parse(storedInterviews));
      } catch (error) {
        console.error('Error loading upcoming interviews:', error);
      }
    }
  }, []);

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

  const handleSetReminder = (interview: UpcomingInterview) => {
    setSelectedInterview(interview);
    setReminderOpen(true);
  };

  const saveReminder = () => {
    if (!selectedInterview) return;

    // In a real app, this would save to a database or calendar
    const reminderMessage = `Reminder set for ${selectedInterview.title} ${reminderTime} minutes before the interview.`;
    
    // Close the dialog
    setReminderOpen(false);
    
    // Show confirmation
    toast({
      title: "Reminder Set",
      description: reminderMessage,
    });
  };

  const handleAddInterview = (newInterview: UpcomingInterview) => {
    const updatedInterviews = [...userInterviews, newInterview];
    setUserInterviews(updatedInterviews);
    localStorage.setItem('upcomingInterviews', JSON.stringify(updatedInterviews));
  };

  const handleViewCalendar = () => {
    // Create a simple calendar view showing all upcoming interviews
    const calendarData = displayInterviews.map(interview => {
      const date = typeof interview.date === 'string' ? new Date(interview.date) : interview.date;
      return {
        title: interview.title,
        date: format(date, 'yyyy-MM-dd'),
        time: interview.time || 'TBD',
        type: interview.type
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const calendarText = calendarData.map(item => 
      `${item.date} at ${item.time} - ${item.title} (${item.type})`
    ).join('\n');

    // For now, show the calendar data in a toast with copy option
    if (navigator.clipboard) {
      navigator.clipboard.writeText(calendarText);
      toast({
        title: "Calendar Data Copied",
        description: "Your interview schedule has been copied to clipboard. You can paste it into your calendar app.",
      });
    } else {
      toast({
        title: "Upcoming Interviews",
        description: `You have ${calendarData.length} upcoming interviews scheduled.`,
      });
    }
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
  
  const displayInterviews = userInterviews.length > 0 ? userInterviews : interviews.length > 0 ? interviews : sampleInterviews;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setAddInterviewOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Interview
          </Button>
          <Button variant="outline" size="sm" onClick={handleViewCalendar}>
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
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
              
              <CardFooter className="pt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-interview-primary border-interview-primary hover:bg-interview-primary/10 w-full"
                  onClick={() => handleSetReminder(interview)}
                >
                  <Bell className="mr-1 h-4 w-4" />
                  Set Reminder
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Reminder Dialog */}
      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Interview Reminder</DialogTitle>
            <DialogDescription>
              Choose when you want to be reminded about this interview.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="mb-2 font-medium">{selectedInterview?.title}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
              <Calendar className="h-4 w-4" />
              <span>
                {selectedInterview?.date instanceof Date 
                  ? format(selectedInterview.date, 'MMM dd, yyyy') 
                  : selectedInterview?.date 
                    ? format(new Date(selectedInterview.date), 'MMM dd, yyyy')
                    : ''}
              </span>
              {selectedInterview?.time && (
                <>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{selectedInterview.time}</span>
                </>
              )}
            </div>
            
            <div className="mt-4">
              <label htmlFor="reminder-time" className="block text-sm font-medium mb-1">
                Remind me before the interview:
              </label>
              <select 
                id="reminder-time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="1440">1 day</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveReminder} className="bg-interview-primary hover:bg-interview-primary/90">
              Save Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Interview Dialog */}
      <AddInterviewDialog
        open={addInterviewOpen}
        onOpenChange={setAddInterviewOpen}
        onAddInterview={handleAddInterview}
      />
    </div>
  );
};
