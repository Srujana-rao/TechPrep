
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart } from '@/components/ui/bar-chart';
import { BarChart2, MessagesSquare, ScrollText, Download, FileText } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('summary');

  // Data passed from the interview page or mock data if none was passed
  const conversationData = location.state?.conversation || [];
  const overallScoreData = location.state?.overallScore || 7.5; // Default score if none provided
  const responseQualityData = location.state?.responseQuality || {};
  const questionsAskedData = location.state?.questionsAsked || 5;

  // Generate result data based on the actual interview
  const [resultData, setResultData] = useState({
    title: 'Frontend Developer Interview',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    duration: `${Math.floor(Math.random() * 20) + 15} minutes`, // Mock duration
    role: 'Senior Frontend Developer',
    scores: {
      technicalKnowledge: 0,
      communication: 0,
      problemSolving: 0,
      culturalFit: 0,
      confidence: 0,
      questionQuality: 0
    },
    overallScore: 0,
    strengths: [],
    improvements: [],
    keyInsights: [],
    transcript: []
  });

  // Generate report when component mounts or interview data changes
  useEffect(() => {
    // Generate scores based on response quality
    const generateScores = () => {
      // Default base scores
      const baseScores = {
        technicalKnowledge: 6 + Math.random() * 2,
        communication: 6 + Math.random() * 2,
        problemSolving: 6 + Math.random() * 2,
        culturalFit: 6 + Math.random() * 2,
        confidence: 6 + Math.random() * 2,
        questionQuality: 6 + Math.random() * 2
      };
      
      // Adjust scores based on response quality
      Object.values(responseQualityData).forEach(quality => {
        if (quality === 'good') {
          baseScores.technicalKnowledge += 0.5;
          baseScores.communication += 0.4;
          baseScores.problemSolving += 0.3;
        } else if (quality === 'fair') {
          baseScores.technicalKnowledge += 0.2;
          baseScores.communication += 0.1;
        } else {
          baseScores.technicalKnowledge -= 0.2;
          baseScores.problemSolving -= 0.1;
        }
      });
      
      // Cap scores between 0-10
      Object.keys(baseScores).forEach(key => {
        baseScores[key as keyof typeof baseScores] = Math.min(10, Math.max(0, baseScores[key as keyof typeof baseScores]));
      });
      
      return baseScores;
    };

    // Generate strengths based on highest scores
    const generateStrengths = (scores: any) => {
      const strengths = [];
      if (scores.technicalKnowledge > 7) strengths.push('Strong technical knowledge demonstrated throughout the interview');
      if (scores.communication > 7) strengths.push('Excellent communication skills and articulation of concepts');
      if (scores.problemSolving > 7) strengths.push('Good problem-solving approach with structured thinking');
      if (scores.culturalFit > 7) strengths.push('Positive attitude and cultural alignment');
      if (scores.confidence > 7) strengths.push('Confident presentation of ideas and experiences');
      
      // Add generic strengths if needed to have at least 3
      const genericStrengths = [
        'Demonstrated ability to explain complex concepts clearly',
        'Showed enthusiasm for the role and company',
        'Provided specific examples from past experiences',
        'Displayed good listening skills during the interview'
      ];
      
      while (strengths.length < 3 && genericStrengths.length > 0) {
        strengths.push(genericStrengths.shift()!);
      }
      
      return strengths;
    };

    // Generate improvement areas based on lowest scores
    const generateImprovements = (scores: any) => {
      const improvements = [];
      if (scores.technicalKnowledge < 8) improvements.push('Consider expanding on technical details in your responses');
      if (scores.communication < 8) improvements.push('Try to be more concise when explaining complex concepts');
      if (scores.problemSolving < 8) improvements.push('Practice breaking down problems into smaller parts');
      if (scores.culturalFit < 8) improvements.push('Share more examples of team collaboration experiences');
      if (scores.confidence < 8) improvements.push('Work on expressing your ideas with more confidence');
      
      // Add generic improvements if needed to have at least 3
      const genericImprovements = [
        'Provide more specific examples from past projects',
        'Consider discussing trade-offs in technical decisions more explicitly',
        'More emphasis on testing strategies would strengthen responses',
        'Elaborate more on collaborative experiences in team settings'
      ];
      
      while (improvements.length < 3 && genericImprovements.length > 0) {
        improvements.push(genericImprovements.shift()!);
      }
      
      return improvements;
    };

    // Generate key insights
    const generateInsights = (scores: any, strengths: string[], improvements: string[]) => {
      const insights = [];
      
      // Add one strength-based insight
      if (strengths.length > 0) {
        insights.push(`You demonstrated ${
          scores.technicalKnowledge > scores.communication ? 
            'strong technical knowledge' : 
            'excellent communication skills'
        } throughout the interview.`);
      }
      
      // Add one improvement-based insight
      if (improvements.length > 0) {
        insights.push(`Focus on ${
          scores.technicalKnowledge < scores.communication ? 
            'strengthening your technical explanations' : 
            'improving your communication clarity'
        } to enhance your interview performance.`);
      }
      
      // Add generic insights
      insights.push(`Your overall performance indicates you are ${
        overallScoreData >= 8 ? 'well-prepared' : 
        overallScoreData >= 6 ? 'reasonably prepared' : 
        'still developing skills needed'
      } for this role.`);
      
      insights.push('Practicing more mock interviews will help you refine your responses further.');
      
      return insights;
    };

    // Generate transcript from the conversation
    const generateTranscript = () => {
      return conversationData.map((message: any) => ({
        speaker: message.speaker,
        text: message.text,
        feedback: message.quality ? 
          message.quality === 'good' ? 'Strong answer with good examples' :
          message.quality === 'fair' ? 'Adequate response but could be more specific' :
          'Response needs more detail and examples' : null
      }));
    };

    // Generate the full result data
    const generateResultData = () => {
      const scores = generateScores();
      const strengths = generateStrengths(scores);
      const improvements = generateImprovements(scores);
      const insights = generateInsights(scores, strengths, improvements);
      const transcript = generateTranscript();
      
      setResultData({
        ...resultData,
        scores,
        overallScore: overallScoreData,
        strengths,
        improvements,
        keyInsights: insights,
        transcript
      });
    };

    generateResultData();
  }, [conversationData, overallScoreData, responseQualityData]);

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

  // Handle download report
  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Your interview report has been downloaded successfully.",
      duration: 3000,
    });
    
    // In a real app, this would generate and download a PDF report
    // For now, we'll just show a toast notification
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
            <Button 
              className="bg-interview-primary hover:bg-interview-primary/90"
              onClick={handleDownloadReport}
            >
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
                  <span className="text-3xl font-bold text-interview-primary">{resultData.overallScore.toFixed(1)}/10</span>
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
                  valueFormatter={(value: number) => `${value.toFixed(1)}/10`}
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
                    <h3 className="font-semibold text-lg mb-3">Technical Knowledge ({resultData.scores.technicalKnowledge.toFixed(1)}/10)</h3>
                    <p className="mb-2">
                      {resultData.scores.technicalKnowledge >= 8 ? 
                        "You demonstrated excellent technical knowledge with well-structured explanations of concepts." :
                        resultData.scores.technicalKnowledge >= 6 ?
                        "You showed good technical understanding but could expand on some concepts more thoroughly." :
                        "Your technical knowledge responses need more depth and specific examples."}
                    </p>
                    <h4 className="font-medium mt-4">Strengths:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        {resultData.scores.technicalKnowledge >= 7 ? "Clear explanations of technical concepts" : "Basic understanding of key concepts"}
                      </li>
                      <li>
                        {resultData.scores.technicalKnowledge >= 7 ? "Good knowledge of relevant technologies" : "Familiar with industry terminology"}
                      </li>
                    </ul>
                    <h4 className="font-medium mt-4">Areas for improvement:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        {resultData.scores.technicalKnowledge >= 8 ? "Further detail on advanced concepts" : "Deepen knowledge of fundamental principles"}
                      </li>
                      <li>
                        {resultData.scores.technicalKnowledge >= 8 ? "More examples of practical applications" : "Practice explaining complex topics clearly"}
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Communication ({resultData.scores.communication.toFixed(1)}/10)</h3>
                    <p className="mb-2">
                      {resultData.scores.communication >= 8 ? 
                        "Your communication skills were excellent. You articulated complex ideas clearly and maintained good conversational flow." :
                        resultData.scores.communication >= 6 ?
                        "You communicated your ideas reasonably well but could improve clarity and structure." :
                        "Your communication needs improvement, focusing on clearer expression and better structure."}
                    </p>
                    <h4 className="font-medium mt-4">Strengths:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        {resultData.scores.communication >= 7 ? "Clear and concise explanations" : "Basic communication of ideas"}
                      </li>
                      <li>
                        {resultData.scores.communication >= 7 ? "Good response structure" : "Attempts to organize thoughts"}
                      </li>
                    </ul>
                    <h4 className="font-medium mt-4">Areas for improvement:</h4>
                    <ul className="list-disc list-inside pl-4">
                      <li>
                        {resultData.scores.communication >= 8 ? "More specific examples to illustrate points" : "Structure responses with clearer beginning, middle, and end"}
                      </li>
                      <li>
                        {resultData.scores.communication >= 8 ? "Slightly more elaboration on technical concepts" : "Practice explaining concepts using simpler language"}
                      </li>
                    </ul>
                  </div>
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
                        <span className="font-medium">
                          {resultData.scores.technicalKnowledge < resultData.scores.communication ? 
                            "Strengthen technical explanations" : 
                            "Improve communication clarity"}
                        </span>
                        <p className="text-gray-600 mt-1">
                          {resultData.scores.technicalKnowledge < resultData.scores.communication ? 
                            "Focus on explaining technical concepts clearly with examples and trade-offs." : 
                            "Practice expressing complex ideas in simpler terms with clear structure."}
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
