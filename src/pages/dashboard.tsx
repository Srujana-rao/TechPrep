
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { CreateInterviewCard } from '@/components/dashboard/create-interview-card';
import { InterviewHistory } from '@/components/dashboard/interview-history';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data (will be replaced with Firebase data)
const mockInterviews = [
  {
    id: '1',
    title: 'Senior Full-Stack Developer',
    date: 'May 5, 2025',
    duration: '35 min',
    role: 'Full-Stack Developer',
    type: 'technical' as const,
    completed: true,
    score: 8.5
  },
  {
    id: '2',
    title: 'Product Manager Interview',
    date: 'May 3, 2025',
    duration: '28 min',
    role: 'Product Manager',
    type: 'behavioral' as const,
    completed: true,
    score: 7.8
  },
  {
    id: '3',
    title: 'Frontend Developer',
    date: 'May 1, 2025',
    duration: '15 min',
    role: 'Frontend Developer',
    type: 'technical' as const,
    completed: false
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'in-progress'>('all');

  const filteredInterviews = mockInterviews.filter((interview) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return interview.completed;
    if (activeTab === 'in-progress') return !interview.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated={true} />
      <main className="flex-grow container px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your interview practice sessions</p>
          </div>
          <Button asChild className="mt-4 md:mt-0 bg-interview-primary hover:bg-interview-primary/90">
            <a href="/interview/new">New Interview</a>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {/* Stats cards */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-500">Total Interviews</h3>
            <p className="text-3xl font-bold mt-2">3</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-500">Completed</h3>
            <p className="text-3xl font-bold mt-2">2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-500">Average Score</h3>
            <p className="text-3xl font-bold mt-2">8.2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-500">In Progress</h3>
            <p className="text-3xl font-bold mt-2">1</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="md:w-3/4">
            <h2 className="text-xl font-bold mb-4">Your Interviews</h2>
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'all' | 'completed' | 'in-progress')}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <InterviewHistory interviews={filteredInterviews} />
              </TabsContent>
              <TabsContent value="completed">
                <InterviewHistory interviews={filteredInterviews} />
              </TabsContent>
              <TabsContent value="in-progress">
                <InterviewHistory interviews={filteredInterviews} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:w-1/4">
            <CreateInterviewCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
