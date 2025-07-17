
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { InterviewHistory } from '@/components/dashboard/interview-history';
import { UpcomingInterviews } from '@/components/dashboard/upcoming-interviews';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/integrations/supabase/client';

interface Interview {
  id: string;
  title: string;
  date: string;
  duration: string;
  role: string;
  type: 'technical' | 'behavioral' | 'mixed';
  completed: boolean;
  score?: number;
  results?: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    completedAt: string;
    conversation?: Array<{
      question?: string;
      answer?: string;
      feedback?: string;
      speaker?: string;
      text?: string;
      quality?: string;
    }>;
    responseQuality?: Record<number, 'good' | 'fair' | 'needs_improvement'>;
    questionsAsked?: number;
    userResponses?: string[];
  };
  user_id?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Interview data will be fetched based on user ID
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user-specific interviews when component mounts or user changes
  useEffect(() => {
    const fetchUserInterviews = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      console.log('Fetching interviews for user:', currentUser.id);
      
      try {
        // Check localStorage for any pending/recent interviews for this user
        const storedInterviews = localStorage.getItem('interviewResults');
        let userInterviews: Interview[] = [];
        
        if (storedInterviews) {
          try {
            const parsedInterviews = JSON.parse(storedInterviews);
            console.log('All stored interviews:', parsedInterviews);
            
            // Filter to only include interviews for the current user
            userInterviews = Array.isArray(parsedInterviews) ? parsedInterviews.filter(
              (interview: any) => interview.user_id === currentUser.id
            ) : [];
            
            console.log('Filtered user interviews:', userInterviews);
            
            // If there are interviews without user_id but were created while this user was logged in,
            // associate them with the current user
            const unassociatedInterviews = Array.isArray(parsedInterviews) ? parsedInterviews.filter(
              (interview: any) => !interview.user_id
            ) : [];
            
            if (unassociatedInterviews.length > 0) {
              // Assign the current user to these interviews
              const updatedInterviews = unassociatedInterviews.map((interview: any) => ({
                ...interview,
                user_id: currentUser.id
              }));
              
              // Update these interviews in localStorage
              const updatedAllInterviews = Array.isArray(parsedInterviews) ? parsedInterviews.map((interview: any) => 
                interview.user_id ? interview : { ...interview, user_id: currentUser.id }
              ) : [];
              
              localStorage.setItem('interviewResults', JSON.stringify(updatedAllInterviews));
              
              // Add these now-associated interviews to the user's interviews
              userInterviews = [...userInterviews, ...updatedInterviews];
              console.log('Updated with unassociated interviews:', userInterviews);
            }
          } catch (error) {
            console.error('Error parsing stored interviews:', error);
          }
        } else {
          console.log('No stored interviews found in localStorage');
        }
        
        setInterviews(userInterviews);
      } catch (error) {
        console.error('Error fetching user interviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserInterviews();
  }, [currentUser]);
  
  const handleStartNewInterview = () => {
    navigate('/interview/new');
  };

  const handleDeleteInterview = (id: string) => {
    // Only remove interviews belonging to the current user
    setInterviews(prevInterviews => 
      prevInterviews.filter(interview => interview.id !== id)
    );
    
    // Remove from local storage
    try {
      const storedInterviews = localStorage.getItem('interviewResults');
      if (storedInterviews) {
        const parsedInterviews = JSON.parse(storedInterviews);
        if (Array.isArray(parsedInterviews)) {
          const updatedStoredInterviews = parsedInterviews.filter(
            (interview: any) => interview.id !== id
          );
          localStorage.setItem('interviewResults', JSON.stringify(updatedStoredInterviews));
        }
      }
    } catch (error) {
      console.error('Error updating localStorage after delete:', error);
    }
  };
  
  // Calculate metrics based on user-specific interviews
  const completedInterviews = interviews.filter(interview => interview.completed).length;
  const pendingInterviews = interviews.filter(interview => !interview.completed).length;
  // Get actual upcoming interviews count from localStorage
  const getUpcomingInterviewsCount = () => {
    try {
      const storedInterviews = localStorage.getItem('upcomingInterviews');
      if (storedInterviews) {
        const parsed = JSON.parse(storedInterviews);
        return Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch (error) {
      console.error('Error reading upcoming interviews:', error);
    }
    return 0;
  };
  const upcomingInterviews = getUpcomingInterviewsCount();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated={true} />
      <main className="flex-grow container px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Start a new interview practice session and improve your skills</p>
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
            <h2 className="text-2xl font-bold text-interview-primary mb-2">
              Welcome, {currentUser?.email?.split('@')[0] || 'User'}!
            </h2>
            <p className="text-gray-700">
              Practice your interview skills with our mock interview system. 
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

        {/* Two-column layout for Upcoming Interviews and Interview History */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Upcoming Interviews Section */}
          <div className="xl:col-span-1">
            <UpcomingInterviews />
          </div>
          
          {/* Interview History Section */}
          <div className="xl:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Your Interview History</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading your interviews...</div>
            ) : (
              <InterviewHistory 
                interviews={interviews} 
                onDeleteInterview={handleDeleteInterview}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
