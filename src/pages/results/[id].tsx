
import React from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from '@/components/ui/bar-chart';
import { BarChart2, MessagesSquare, ScrollText, Download } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';

// Mock data for results
const mockInterviewData = {
  id: '1',
  title: 'Senior Full-Stack Developer Interview',
  date: 'May 5, 2025',
  duration: '35 minutes',
  role: 'Senior Full-Stack Developer',
  type: 'technical',
  scores: {
    communication: 9,
    technicalKnowledge: 8,
    problemSolving: 8.5,
    culturalFit: 9.5,
    confidence: 7.5
  },
  overallScore: 8.5,
  strengths: [
    'Strong technical knowledge in React and Node.js ecosystem',
    'Clear communication of complex concepts',
    'Structured approach to problem solving',
    'Good understanding of system design principles'
  ],
  improvements: [
    'Could provide more specific examples from past experience',
    'Consider discussing trade-offs more explicitly',
    'Explain thought process more thoroughly during technical questions'
  ],
  transcript: [
    { speaker: 'ai', text: 'Can you tell me about a challenging project you worked on and how you overcame obstacles?' },
    { speaker: 'user', text: 'In my previous role, I led the development of a real-time collaboration tool that had significant performance issues at scale. The main challenge was ensuring data consistency across hundreds of simultaneous users without sacrificing responsiveness. I addressed this by implementing a combination of WebSockets for real-time updates and a custom conflict resolution system that used operational transforms. This reduced latency by 70% and eliminated most data consistency issues.' },
    { speaker: 'ai', text: 'How do you approach debugging complex issues in production environments?' },
    { speaker: 'user', text: 'My approach starts with gathering data to understand the scope and impact. I check monitoring dashboards, logs, and error reports to identify patterns. Then I try to reproduce the issue in a controlled environment. For particularly complex problems, I use a divide-and-conquer strategy, isolating components until I can pinpoint the source. Documentation is also critical - I maintain detailed notes throughout the debugging process.' },
    // More transcript entries would go here
  ]
};

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();

  // Prepare data for charts
  const scoreData = [
    { name: 'Communication', score: mockInterviewData.scores.communication },
    { name: 'Technical Knowledge', score: mockInterviewData.scores.technicalKnowledge },
    { name: 'Problem Solving', score: mockInterviewData.scores.problemSolving },
    { name: 'Cultural Fit', score: mockInterviewData.scores.culturalFit },
    { name: 'Confidence', score: mockInterviewData.scores.confidence },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <main className="flex-grow container px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{mockInterviewData.title} Results</h1>
            <p className="text-gray-500">{mockInterviewData.date} • {mockInterviewData.duration}</p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <ButtonLink href="/dashboard" variant="outline">
              Back to Dashboard
            </ButtonLink>
            <Button className="bg-interview-primary hover:bg-interview-primary/90">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
        
        {/* Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full bg-interview-light flex items-center justify-center mr-6">
                  <span className="text-3xl font-bold text-interview-primary">{mockInterviewData.overallScore}/10</span>
                </div>
                <div>
                  <p className="text-lg font-medium mb-1">
                    {mockInterviewData.overallScore >= 8 ? 'Excellent' : 
                     mockInterviewData.overallScore >= 6 ? 'Good' : 'Needs Improvement'}
                  </p>
                  <p className="text-gray-500">
                    Your performance was {mockInterviewData.overallScore >= 8 ? 'strong' : 
                     mockInterviewData.overallScore >= 6 ? 'solid' : 'adequate'} compared to the average 
                    for this role.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <BarChart 
                  data={scoreData}
                  index="name"
                  categories={['score']}
                  colors={['#6E59A5']}
                  valueFormatter={(value: number) => `${value}/10`}
                  yAxisWidth={40}
                  showLegend={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Feedback Tabs */}
        <Tabs defaultValue="summary" className="mb-6">
          <TabsList>
            <TabsTrigger value="summary" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center">
              <MessagesSquare className="mr-2 h-4 w-4" />
              Full Transcript
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center">
              <ScrollText className="mr-2 h-4 w-4" />
              Detailed Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockInterviewData.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Areas for Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-600">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockInterviewData.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-amber-600 mr-2">→</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Recommendations */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Based on your interview performance, here are some recommendations:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Practice explaining technical concepts with concrete examples</li>
                    <li>Work on discussing trade-offs explicitly in your technical decisions</li>
                    <li>Prepare more specific examples from your past experiences</li>
                    <li>Continue leveraging your strong communication skills</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transcript" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockInterviewData.transcript.map((entry, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          entry.speaker === 'ai' ? 'bg-interview-primary' : 'bg-interview-secondary'
                        }`}>
                          {entry.speaker === 'ai' ? 'AI' : 'You'}
                        </div>
                        <span className="font-medium">
                          {entry.speaker === 'ai' ? 'AI Interviewer' : 'You'}
                        </span>
                      </div>
                      <p className="text-gray-700">{entry.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Communication Skills (9/10)</h3>
                    <p className="mb-2">You demonstrated excellent communication skills throughout the interview. Your responses were clear, concise, and structured, making complex technical concepts accessible.</p>
                    <h4 className="font-medium mt-4">Strengths:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>Effective use of technical terminology</li>
                      <li>Clear articulation of complex concepts</li>
                      <li>Structured responses with logical flow</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Technical Knowledge (8/10)</h3>
                    <p className="mb-2">Your technical knowledge was strong, particularly in frontend development and system architecture. You demonstrated good understanding of current best practices.</p>
                    <h4 className="font-medium mt-4">Strengths:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>Deep knowledge of React ecosystem</li>
                      <li>Solid understanding of backend architecture</li>
                    </ul>
                    <h4 className="font-medium mt-4">Areas for improvement:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>Expand on database optimization strategies</li>
                      <li>Discuss more cloud architecture patterns</li>
                    </ul>
                  </div>
                  
                  {/* Additional sections would go here */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Create New Interview Button */}
        <div className="mt-8 text-center">
          <p className="mb-4 text-gray-500">Would you like to practice again?</p>
          <Button asChild className="bg-interview-primary hover:bg-interview-primary/90">
            <a href="/interview/new">Start New Interview</a>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
