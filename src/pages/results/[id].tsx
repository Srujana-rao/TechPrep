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
import jspdf from 'jspdf';
import 'jspdf-autotable';

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('summary');

  // Get interview data from location state or localStorage
  const interviewDataFromState = location.state?.interviewData;
  const [interviewData, setInterviewData] = useState<any>(interviewDataFromState || null);

  // Data passed from the interview page
  const conversationData = location.state?.conversation || interviewData?.results?.conversation || [];
  const overallScoreData = location.state?.overallScore || interviewData?.results?.overallScore || 0;
  const responseQualityData = location.state?.responseQuality || interviewData?.results?.responseQuality || {};
  const questionsAskedData = location.state?.questionsAsked || interviewData?.results?.questionsAsked || 0;
  const userResponsesData = location.state?.userResponses || interviewData?.results?.userResponses || [];
  const completedAt = location.state?.completedAt || interviewData?.results?.completedAt || new Date().toISOString();
  const interviewDuration = location.state?.interviewDuration || interviewData?.duration || '0 minutes';

  // Fetch interview data from localStorage if not passed via state
  useEffect(() => {
    if (!interviewData) {
      const storedInterviewsStr = localStorage.getItem('interviewResults');
      
      if (storedInterviewsStr) {
        try {
          const storedInterviews = JSON.parse(storedInterviewsStr);
          const foundInterview = storedInterviews.find((interview: any) => interview.id === id);
          
          if (foundInterview) {
            setInterviewData(foundInterview);
          } else {
            toast({
              title: "Interview not found",
              description: "The requested interview could not be found.",
              variant: "destructive",
            });
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error parsing stored interviews:', error);
        }
      }
    }
  }, [id]);

  // Generate result data based on the actual interview
  const [resultData, setResultData] = useState({
    title: interviewData?.title || 'Technical Interview Practice',
    date: new Date(completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    duration: interviewDuration,
    role: interviewData?.role || 'Frontend Developer',
    scores: {
      technicalKnowledge: 0,
      communication: 0,
      problemSolving: 0,
      culturalFit: 0,
      confidence: 0,
      questionQuality: 0
    },
    overallScore: overallScoreData,
    strengths: [],
    improvements: [],
    keyInsights: [],
    transcript: []
  });

  // Generate report when component mounts or interview data changes
  useEffect(() => {
    // Don't generate report if we don't have any responses
    if (questionsAskedData === 0 || userResponsesData.length === 0) {
      setResultData({
        ...resultData,
        overallScore: 0,
        strengths: ["No interview data available"],
        improvements: ["Complete an interview to receive feedback"],
        keyInsights: ["No insights available without interview data"],
        scores: {
          technicalKnowledge: 0,
          communication: 0,
          problemSolving: 0,
          culturalFit: 0,
          confidence: 0,
          questionQuality: 0
        }
      });
      return;
    }
    
    // Generate scores based on actual response quality
    const generateScores = () => {
      // Default base scores - set to low initial values
      const baseScores = {
        technicalKnowledge: 4,
        communication: 4,
        problemSolving: 4,
        culturalFit: 4,
        confidence: 4,
        questionQuality: 4
      };
      
      // No responses means low scores
      if (userResponsesData.length === 0) {
        return baseScores;
      }
      
      // Adjust scores based on response quality and content
      Object.entries(responseQualityData).forEach(([questionIndex, quality]) => {
        const responseIndex = parseInt(questionIndex) - 1;
        if (responseIndex >= 0 && responseIndex < userResponsesData.length) {
          const response = userResponsesData[responseIndex];
          
          // Calculate response length as a quality factor
          const wordCount = response.split(' ').length;
          const lengthFactor = wordCount > 30 ? 0.8 : wordCount > 15 ? 0.5 : 0.2;
          
          if (quality === 'good') {
            baseScores.technicalKnowledge += 1.5 * lengthFactor;
            baseScores.communication += 2.0 * lengthFactor;
            baseScores.problemSolving += 1.7 * lengthFactor;
            baseScores.culturalFit += 1.3 * lengthFactor;
            baseScores.confidence += 1.8 * lengthFactor;
            baseScores.questionQuality += 1.6 * lengthFactor;
          } else if (quality === 'fair') {
            baseScores.technicalKnowledge += 0.8 * lengthFactor;
            baseScores.communication += 1.0 * lengthFactor;
            baseScores.problemSolving += 0.7 * lengthFactor;
            baseScores.culturalFit += 0.9 * lengthFactor;
            baseScores.confidence += 1.0 * lengthFactor;
            baseScores.questionQuality += 0.8 * lengthFactor;
          } else {
            // If quality is 'needs_improvement'
            baseScores.technicalKnowledge += 0.2 * lengthFactor;
            baseScores.communication += 0.3 * lengthFactor;
            baseScores.problemSolving += 0.2 * lengthFactor;
            baseScores.culturalFit += 0.3 * lengthFactor;
            baseScores.confidence += 0.2 * lengthFactor;
            baseScores.questionQuality += 0.2 * lengthFactor;
          }
        }
      });
      
      // Cap scores between 0-10
      Object.keys(baseScores).forEach(key => {
        baseScores[key as keyof typeof baseScores] = Math.min(10, Math.max(0, baseScores[key as keyof typeof baseScores]));
      });
      
      return baseScores;
    };

    // Generate strengths based on highest scores and responses
    const generateStrengths = (scores: any) => {
      if (userResponsesData.length === 0) {
        return ["No interview data available to assess strengths"];
      }
      
      // Sort scores to find highest ones
      const sortedScores = Object.entries(scores)
        .sort(([, a], [, b]) => Number(b) - Number(a))
        .map(([key]) => key);
      
      const strengths = [];
      const avgResponseLength = userResponsesData.reduce((sum, response) => 
        sum + response.split(' ').length, 0) / userResponsesData.length;
      
      // Add strengths based on response content and scores
      if (sortedScores[0] === 'technicalKnowledge' && scores.technicalKnowledge > 6) 
        strengths.push('Demonstrated solid technical knowledge in your responses');
      
      if (sortedScores[0] === 'communication' && scores.communication > 6) 
        strengths.push('Excellent communication skills and articulation of concepts');
      
      if (sortedScores[0] === 'problemSolving' && scores.problemSolving > 6) 
        strengths.push('Good problem-solving approach with structured thinking');
      
      if (avgResponseLength > 25)
        strengths.push('Provided detailed and thorough responses to questions');
      
      // Add generic strengths if needed to have at least 2
      const genericStrengths = [
        'Showed engagement with the interview process',
        'Demonstrated ability to respond to questions directly',
        'Provided some context in your answers',
        'Maintained consistency in your responses'
      ];
      
      while (strengths.length < 2 && genericStrengths.length > 0) {
        strengths.push(genericStrengths.shift()!);
      }
      
      return strengths;
    };

    // Generate improvement areas based on actual responses and lowest scores
    const generateImprovements = (scores: any) => {
      if (userResponsesData.length === 0) {
        return ["Complete an interview to receive personalized improvement suggestions"];
      }
      
      // Sort scores to find lowest ones
      const sortedScores = Object.entries(scores)
        .sort(([, a], [, b]) => Number(a) - Number(b))
        .map(([key]) => key);
      
      const improvements = [];
      const avgResponseLength = userResponsesData.reduce((sum, response) => 
        sum + response.split(' ').length, 0) / userResponsesData.length;
      
      // Add improvements based on response content and scores
      if (sortedScores[0] === 'technicalKnowledge' || scores.technicalKnowledge < 6) 
        improvements.push('Focus on explaining technical concepts with more detail and precision');
      
      if (sortedScores[0] === 'communication' || scores.communication < 6) 
        improvements.push('Practice clearer articulation of your thoughts and experiences');
      
      if (sortedScores[0] === 'problemSolving' || scores.problemSolving < 6) 
        improvements.push('Work on breaking down problems and explaining your approach step-by-step');
      
      if (avgResponseLength < 15)
        improvements.push('Provide more detailed responses with specific examples from your experience');
      
      // Add generic improvements if needed to have at least 3
      const genericImprovements = [
        'Incorporate more specific examples from past projects',
        'Consider discussing trade-offs in your decision-making process',
        'Practice structuring your answers with a clear beginning, middle, and conclusion',
        'Elaborate more on collaborative experiences in team settings'
      ];
      
      while (improvements.length < 2 && genericImprovements.length > 0) {
        improvements.push(genericImprovements.shift()!);
      }
      
      return improvements;
    };

    // Generate key insights based on actual interview data
    const generateInsights = (scores: any, strengths: string[], improvements: string[]) => {
      if (userResponsesData.length === 0) {
        return ["No interview data available for insights"];
      }
      
      const insights = [];
      const avgScore = overallScoreData;
      
      // Add personalized insights
      if (avgScore >= 8) {
        insights.push(`Your overall performance was strong. You demonstrated good understanding of the questions and provided relevant answers.`);
      } else if (avgScore >= 6) {
        insights.push(`Your overall performance was satisfactory. With some improvements in your response quality, you could excel in real interviews.`);
      } else if (avgScore >= 1) {
        insights.push(`Your responses could use more development. Focus on providing specific examples and structured answers.`);
      } else {
        insights.push(`Not enough data to provide meaningful insights. Complete a full interview for better feedback.`);
      }
      
      // Add practice recommendation
      insights.push(`With ${questionsAskedData > 1 ? questionsAskedData : 'more'} practice questions, your interview confidence will continue to improve.`);
      
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
  }, [conversationData, overallScoreData, responseQualityData, userResponsesData, questionsAskedData, completedAt, interviewDuration]);

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
    } else if (resultData.overallScore >= 1) {
      return "We recommend additional practice sessions to build confidence and improve your responses.";
    } else {
      return "Start an interview to receive personalized feedback and recommendations.";
    }
  };

  // Generate PDF report
  const handleDownloadReport = () => {
    try {
      const doc = new jspdf();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(80, 80, 80);
      doc.text("Interview Performance Report", 20, 20);
      
      // Add horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 25, 190, 25);
      
      // Add interview details
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text(`Interview Type: ${resultData.title}`, 20, 35);
      doc.text(`Date: ${resultData.date}`, 20, 42);
      doc.text(`Duration: ${resultData.duration}`, 20, 49);
      doc.text(`Overall Score: ${resultData.overallScore.toFixed(1)}/10`, 20, 56);
      
      // Add performance summary
      doc.setFontSize(16);
      doc.text("Performance Summary", 20, 70);
      doc.setFontSize(12);
      doc.text(resultData.overallScore >= 8 ? 
        'Excellent performance! You demonstrated strong interview skills.' : 
        resultData.overallScore >= 6 ? 
        'Good performance with room for improvement in specific areas.' : 
        resultData.overallScore >= 1 ? 
        'Your interview shows potential, but needs significant improvement.' :
        'Not enough data to provide a comprehensive assessment.', 20, 80);
      
      // Add strengths
      doc.setFontSize(16);
      doc.text("Strengths", 20, 95);
      doc.setFontSize(12);
      resultData.strengths.forEach((strength, index) => {
        doc.text(`• ${strength}`, 25, 105 + (index * 7));
      });
      
      // Add areas for improvement
      const improvementYStart = 110 + (resultData.strengths.length * 7);
      doc.setFontSize(16);
      doc.text("Areas for Improvement", 20, improvementYStart);
      doc.setFontSize(12);
      resultData.improvements.forEach((improvement, index) => {
        doc.text(`• ${improvement}`, 25, improvementYStart + 10 + (index * 7));
      });
      
      // Add score breakdown
      const scoreYStart = improvementYStart + 20 + (resultData.improvements.length * 7);
      doc.setFontSize(16);
      doc.text("Score Breakdown", 20, scoreYStart);
      doc.setFontSize(12);
      
      // Create score table
      const scoreTableData = Object.entries(resultData.scores).map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return [formattedKey, `${value.toFixed(1)}/10`];
      });
      
      // @ts-ignore
      doc.autoTable({
        startY: scoreYStart + 5,
        head: [['Category', 'Score']],
        body: scoreTableData,
        theme: 'striped',
        headStyles: {
          fillColor: [110, 89, 165], // Interview primary color
          textColor: 255
        },
        margin: { left: 20 }
      });
      
      // Add recommendation
      // @ts-ignore
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.text("Recommendation", 20, finalY);
      doc.setFontSize(12);
      doc.text(getRecommendedAction(), 20, finalY + 10);
      
      // Add transcript on new page if there's content
      if (resultData.transcript.length > 0) {
        doc.addPage();
        doc.setFontSize(18);
        doc.text("Interview Transcript", 20, 20);
        
        let yPos = 30;
        resultData.transcript.forEach((entry, index) => {
          const speakerText = entry.speaker === 'ai' ? 'AI Interviewer' : 'You';
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.text(speakerText, 20, yPos);
          
          doc.setFont(undefined, 'normal');
          
          // Split long text into multiple lines to prevent overflow
          const textLines = doc.splitTextToSize(entry.text, 170);
          doc.text(textLines, 20, yPos + 7);
          
          // Add feedback if available
          if (entry.feedback) {
            doc.setFont(undefined, 'italic');
            doc.setTextColor(100, 100, 100);
            const feedbackText = `Feedback: ${entry.feedback}`;
            const feedbackLines = doc.splitTextToSize(feedbackText, 160);
            doc.text(feedbackLines, 25, yPos + 7 + (textLines.length * 7));
            doc.setFont(undefined, 'normal');
            doc.setTextColor(80, 80, 80);
            
            yPos += 15 + (textLines.length * 7) + (feedbackLines.length * 5);
          } else {
            yPos += 15 + (textLines.length * 7);
          }
          
          // Add a new page if we're close to the bottom
          if (yPos > 270 && index < resultData.transcript.length - 1) {
            doc.addPage();
            yPos = 20;
          }
        });
      }
      
      // Add footer with date
      const totalPages = doc.getNumberOfPages();
      for(let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Report generated by InterviewAI on ${new Date().toLocaleDateString()}`, 20, 285);
        doc.text(`Page ${i} of ${totalPages}`, 170, 285);
      }
      
      // Save the PDF
      doc.save(`Interview_Report_${resultData.date.replace(/\s/g, '_')}.pdf`);
      
      toast({
        title: "Report Downloaded",
        description: "Your interview report has been downloaded as a PDF file.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
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
                     resultData.overallScore >= 7 ? 'Good' : 
                     resultData.overallScore >= 1 ? 'Needs Improvement' : 
                     'No Data'}
                  </p>
                  <p className="text-gray-500 mb-2">
                    {getRecommendedAction()}
                  </p>
                  <Badge 
                    variant={resultData.overallScore >= 8.5 ? "default" : 
                            resultData.overallScore >= 7 ? "secondary" : 
                            resultData.overallScore >= 1 ? "outline" : 
                            "destructive"}
                    className="mt-2"
                  >
                    {resultData.overallScore >= 8.5 ? 'Interview Ready' : 
                     resultData.overallScore >= 7 ? 'Almost Ready' : 
                     resultData.overallScore >= 1 ? 'Additional Practice Needed' :
                     'No Interview Data'}
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
                  {resultData.transcript.length > 0 ? (
                    resultData.transcript.map((entry, index) => (
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
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No transcript data available. Complete an interview to see the full conversation.</p>
                    </div>
                  )}
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
