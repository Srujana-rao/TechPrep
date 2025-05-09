
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { InterviewHistory } from '@/components/dashboard/interview-history';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, CheckCircle, Clock } from 'lucide-react';

interface Interview {
  id: string;
  title: string;
  date: string;
  duration: string;
  role: string;
  type: 'technical' | 'behavioral';
  completed: boolean;
  score?: number;
  results?: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    completedAt: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock interview data (in a real app, this would come from a database)
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      title: 'Frontend Developer Interview',
      date: 'May 7, 2025',
      duration: '28 minutes',
      role: 'Senior Frontend Developer',
      type: 'technical',
      completed: true,
      score: 8.5,
      results: {
        overallScore: 8.5,
        strengths: ['Demonstrated solid technical knowledge', 'Clear communication'],
        improvements: ['Provide more specific examples'],
        completedAt: '2025-05-07T14:32:00Z'
      }
    },
    {
      id: '2',
      title: 'React Engineer Practice',
      date: 'May 4, 2025',
      duration: '34 minutes',
      role: 'React Developer',
      type: 'technical',
      completed: true,
      score: 7.8,
      results: {
        overallScore: 7.8,
        strengths: ['Good React knowledge', 'Structured answers'],
        improvements: ['Elaborate more on solutions'],
        completedAt: '2025-05-04T10:15:00Z'
      }
    },
    {
      id: '3',
      title: 'UX Developer Interview',
      date: 'April 30, 2025',
      duration: '22 minutes',
      role: 'UX Developer',
      type: 'behavioral',
      completed: false
    }
  ]);
  
  const handleStartNewInterview = () => {
    navigate('/interview/new');
  };

  // Check local storage for any new interview results
  useEffect(() => {
    const storedInterviews = localStorage.getItem('interviewResults');
    if (storedInterviews) {
      try {
        const parsedInterviews = JSON.parse(storedInterviews);
        const updatedInterviews = [...interviews];
        
        // Update or add new interview results
        parsedInterviews.forEach((storedInterview: any) => {
          const existingIndex = updatedInterviews.findIndex(i => i.id === storedInterview.id);
          
          if (existingIndex >= 0) {
            updatedInterviews[existingIndex] = {
              ...updatedInterviews[existingIndex],
              ...storedInterview,
              completed: true,
              score: storedInterview.results?.overallScore || 0
            };
          } else {
            updatedInterviews.push({
              ...storedInterview,
              completed: true,
              score: storedInterview.results?.overallScore || 0
            });
          }
        });
        
        setInterviews(updatedInterviews);
      } catch (error) {
        console.error('Error parsing stored interviews:', error);
      }
    }
  }, []);
  
  // Calculate metrics
  const completedInterviews = interviews.filter(interview => interview.completed).length;
  const pendingInterviews = interviews.filter(interview => !interview.completed).length;
  const upcomingInterviews = 0; // This would come from scheduled interviews in a real app

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated={true} />
      <main className="flex-grow container px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Start a new AI-powered interview practice session</p>
          </div>
          <Button 
            onClick={handleStartNewInterview}
            className="mt-4 md:mt-0 bg-interview-primary hover:bg-interview-primary/90 text-white font-medium py-2 px-6 rounded-md text-lg"
          >
            Start New Interview
          </Button>
        </div>
        
        {/* Welcome Card */}
        <Card className="mb-8 bg-gradient-to-r from-interview-primary/10 to-interview-primary/5 border-none">
          <CardContent className="py-6">
            <h2 className="text-2xl font-bold text-interview-primary mb-2">Welcome to Interview AI</h2>
            <p className="text-gray-700">
              Practice your interview skills with our AI-powered mock interview system. 
              Get personalized feedback and improve your performance with each session.
            </p>
          </CardContent>
        </Card>

        {/* Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Completed Interviews</p>
                <h3 className="text-2xl font-bold">{completedInterviews}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="rounded-full bg-amber-100 p-3 mr-4">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Interviews</p>
                <h3 className="text-2xl font-bold">{pendingInterviews}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <CalendarClock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Upcoming Interviews</p>
                <h3 className="text-2xl font-bold">{upcomingInterviews}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Interview History</h2>
          <InterviewHistory interviews={interviews} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
