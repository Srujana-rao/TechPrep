
import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
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
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to InterviewAI</h2>
            <p className="text-gray-600 mb-6">
              Practice your interview skills with our AI-powered mock interview system. 
              Get personalized feedback and improve your performance.
            </p>
            <Button 
              onClick={handleStartNewInterview}
              className="bg-interview-primary hover:bg-interview-primary/90 text-white font-medium py-2 px-6 rounded-md text-lg"
            >
              Start New Interview
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
