
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from '@/components/ui/bar-chart';
import { BarChart2, MessagesSquare, ScrollText, Download, FileText } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { Badge } from '@/components/ui/badge';

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('summary');

  // Mock data for results - in a real app, this would come from the database
  const resultData = {
    title: 'Frontend Developer Interview',
    date: 'May 7, 2025',
    duration: '28 minutes',
    role: 'Senior Frontend Developer',
    scores: {
      technicalKnowledge: 8.5,
      communication: 9.0,
      problemSolving: 8.0,
      culturalFit: 9.2,
      confidence: 7.5,
      questionQuality: 8.8
    },
    overallScore: 8.5,
    strengths: [
      'Strong technical knowledge of React and TypeScript',
      'Excellent communication skills and articulation of complex concepts',
      'Good understanding of modern frontend architecture',
      'Positive attitude and cultural alignment'
    ],
    improvements: [
      'Could provide more specific examples from past projects',
      'Consider discussing trade-offs in technical decisions more explicitly',
      'More emphasis on testing strategies would strengthen responses',
      'Elaborate more on collaborative experiences in team settings'
    ],
    keyInsights: [
      'You demonstrated strong problem-solving capabilities when discussing system architecture',
      'Your communication style is clear and concise, a valuable trait for technical roles',
      'You showed good understanding of state management approaches',
      'Consider preparing more specific examples that showcase your achievements'
    ],
    transcript: [
      { 
        speaker: 'ai', 
        text: 'Could you start by telling me about your background and experience relevant to this position?',
        feedback: 'Strong introduction highlighting relevant experience'
      },
      { 
        speaker: 'user', 
        text: 'I have over 5 years of experience in frontend development, with a focus on React and TypeScript for the last 3 years. I\'ve worked on large-scale applications at Company X where I led the migration from a legacy codebase to a modern React architecture. Prior to that, I was at Startup Y where I built responsive web applications and contributed to their component library. I have a strong focus on performance optimization and accessible UI design.',
        feedback: null
      },
      { 
        speaker: 'ai', 
        text: 'Can you describe a challenging project you worked on and how you overcame obstacles?',
        feedback: 'Good explanation but could include more metrics and specific outcomes'
      },
      // More transcript entries would go here
    ]
  };

  // Prepare data for charts
  const scoreData = [
    { name: 'Technical Knowledge', score: resultData.scores.technicalKnowledge },
    { name: 'Communication', score: resultData.scores.communication },
    { name: 'Problem Solving', score: resultData.scores.problemSolving },
    { name: 'Cultural Fit', score: resultData.scores.culturalFit },
    { name: 'Confidence', score: resultData.scores.confidence },
    { name: 'Response Quality', score: resultData.scores.questionQuality },
  ];
  
  // Generate recommendation based on scores
  const getRecommendedAction = () => {
    if (resultData.overallScore >= 8.5) {
      return "Ready for real interviews! Consider focusing on your specific improvements for additional polish.";
    } else if (resultData.overallScore >= 7) {
      return "Almost ready! A few more practice sessions focusing on your areas for improvement would be beneficial.";
    } else {
      return "We recommend additional practice sessions to build confidence and improve your responses.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <main className="flex-grow container px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{resultData.title} Results</h1>
            <p className="text-gray-500">{resultData.date} • {resultData.duration}</p>
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
                  <span className="text-3xl font-bold text-interview-primary">{resultData.overallScore}/10</span>
                </div>
                <div>
                  <p className="text-lg font-medium mb-1">
                    {resultData.overallScore >= 8.5 ? 'Excellent' : 
                     resultData.overallScore >= 7 ? 'Good' : 'Needs Improvement'}
                  </p>
                  <p className="text-gray-500 mb-2">
                    {getRecommendedAction()}
                  </p>
                  <Badge 
                    variant={resultData.overallScore >= 8.5 ? "default" : 
                            resultData.overallScore >= 7 ? "secondary" : "outline"}
                    className="mt-2"
                  >
                    {resultData.overallScore >= 8.5 ? 'Interview Ready' : 
                     resultData.overallScore >= 7 ? 'Almost Ready' : 'Additional Practice Needed'}
                  </Badge>
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
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
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
            <TabsTrigger value="improvement" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Improvement Plan
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
                    {resultData.strengths.map((strength, index) => (
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
                    {resultData.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-amber-600 mr-2">→</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Key Insights */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resultData.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-interview-primary mr-2">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
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
                  {resultData.transcript.map((entry, index) => (
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
                      <p className="text-gray-700 mb-2">{entry.text}</p>
                      
                      {entry.feedback && (
                        <div className="mt-2 ml-10 p-2 bg-gray-50 rounded text-sm text-gray-600 border-l-2 border-interview-primary">
                          <p><span className="font-medium">Feedback:</span> {entry.feedback}</p>
                        </div>
                      )}
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
                    <h3 className="font-semibold text-lg mb-3">Technical Knowledge ({resultData.scores.technicalKnowledge}/10)</h3>
                    <p className="mb-2">You demonstrated solid technical knowledge with good understanding of frontend frameworks and architectures. Your explanations of React concepts were particularly strong.</p>
                    <h4 className="font-medium mt-4">Strengths:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>Deep understanding of React ecosystem</li>
                      <li>Good knowledge of state management approaches</li>
                      <li>Clear explanations of technical concepts</li>
                    </ul>
                    <h4 className="font-medium mt-4">Areas for improvement:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>Expand on testing methodologies</li>
                      <li>More detailed examples of performance optimizations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Communication ({resultData.scores.communication}/10)</h3>
                    <p className="mb-2">Your communication skills were excellent. You articulated complex ideas clearly and maintained good conversational flow throughout the interview.</p>
                    <h4 className="font-medium mt-4">Strengths:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>Clear and concise explanations</li>
                      <li>Well-structured responses</li>
                      <li>Good use of technical terminology without jargon overload</li>
                    </ul>
                    <h4 className="font-medium mt-4">Areas for improvement:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>Consider using more specific examples to illustrate points</li>
                      <li>Slightly more elaboration on some technical concepts would be beneficial</li>
                    </ul>
                  </div>
                  
                  {/* More sections would follow */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="improvement" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Improvement Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Short-term Focus Areas</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <span className="font-medium">Prepare specific project examples</span>
                        <p className="text-gray-600 mt-1">
                          Create 3-5 detailed examples from your past work that demonstrate problem-solving, 
                          leadership, and technical expertise. Structure them using the STAR method (Situation, Task, Action, Result).
                        </p>
                      </li>
                      <li>
                        <span className="font-medium">Practice discussing trade-offs</span>
                        <p className="text-gray-600 mt-1">
                          Prepare to explain the pros and cons of different technical approaches for common 
                          frontend scenarios like state management, rendering strategies, and performance optimization.
                        </p>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Recommended Practice Questions</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <p className="text-gray-800">
                          "Describe a complex technical challenge you faced and how you resolved it."
                        </p>
                      </li>
                      <li>
                        <p className="text-gray-800">
                          "How would you optimize the performance of a React application that's rendering slowly?"
                        </p>
                      </li>
                      <li>
                        <p className="text-gray-800">
                          "Explain your approach to testing frontend applications."
                        </p>
                      </li>
                      <li>
                        <p className="text-gray-800">
                          "How do you collaborate with designers and backend engineers in your development process?"
                        </p>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Resource Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Technical Articles</h4>
                          <ul className="text-sm space-y-1">
                            <li>"Advanced React Patterns"</li>
                            <li>"Performance Optimization in Modern Web Apps"</li>
                            <li>"Testing Strategies for Frontend Applications"</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Practice Resources</h4>
                          <ul className="text-sm space-y-1">
                            <li>Schedule another mock interview focusing on your improvement areas</li>
                            <li>Join a technical interview practice group</li>
                            <li>Record yourself answering practice questions</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
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
