
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { InterviewHistory } from '@/components/dashboard/interview-history';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock interview data (in a real app, this would come from a database)
  const [interviews] = useState([
    {
      id: '1',
      title: 'Frontend Developer Interview',
      date: 'May 7, 2025',
      duration: '28 minutes',
      role: 'Senior Frontend Developer',
      type: 'technical',
      completed: true,
      score: 8.5
    },
    {
      id: '2',
      title: 'React Engineer Practice',
      date: 'May 4, 2025',
      duration: '34 minutes',
      role: 'React Developer',
      type: 'technical',
      completed: true,
      score: 7.8
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
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Interview History</h2>
          <InterviewHistory interviews={interviews} />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to InterviewAI</h2>
            <p className="text-gray-600 mb-6">
              Practice your interview skills with our AI-powered mock interview system. 
              Get personalized feedback and improve your performance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
