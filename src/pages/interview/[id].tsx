
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Video, VideoOff, MicOff, Send, Loader, Volume2, Volume } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

const InterviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isInProgress, setIsInProgress] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [conversation, setConversation] = useState<{ 
    speaker: 'ai' | 'user'; 
    text: string;
    quality?: 'good' | 'fair' | 'needs_improvement' | null;
  }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [responseQuality, setResponseQuality] = useState<Record<number, 'good' | 'fair' | 'needs_improvement'>>({});
  const [overallScore, setOverallScore] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Initialize with interview data
  useEffect(() => {
    if (id) {
      const storedInterviews = localStorage.getItem('interviewData');
      if (storedInterviews) {
        const interviews = JSON.parse(storedInterviews);
        const currentInterview = interviews.find((interview: any) => interview.id === id);
        
        if (currentInterview) {
          setInterviewData(currentInterview);
          if (currentInterview.questions && currentInterview.questions.length > 0) {
            setCustomQuestions(currentInterview.questions);
          }
        }
      }
    }
  }, [id]);

  // Initialize video and audio when component loads
  useEffect(() => {
    if (isInProgress) {
      if (isVideoEnabled) {
        setupVideo();
      }
      if (isAudioEnabled) {
        setupAudioAnalyser();
      }

      // Start tracking interview time
      startTimeRef.current = new Date();
    }
    
    return () => {
      // Clean up video stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clean up audio analyser
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isInProgress, isVideoEnabled, isAudioEnabled]);
  
  // Set up video stream
  const setupVideo = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: isAudioEnabled 
        });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        toast({
          title: "Camera connected",
          description: "Your camera has been successfully connected.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error accessing camera or microphone:', error);
      toast({
        title: "Camera error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
        duration: 5000,
      });
      setIsVideoEnabled(false);
    }
  };
  
  // Set up audio analyser for visualization
  const setupAudioAnalyser = async () => {
    try {
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true 
        });
        streamRef.current = stream;
      }
      
      // Create audio context and analyser
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      // Connect audio source to analyser
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      source.connect(analyserRef.current);
      
      // Start analyzing audio
      updateAudioLevel();
      
      toast({
        title: "Microphone connected",
        description: "Your microphone has been successfully connected.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error setting up audio analyser:', error);
      toast({
        title: "Microphone error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
        duration: 5000,
      });
      setIsAudioEnabled(false);
    }
  };
  
  // Update audio level visualization
  const updateAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate audio level (average of frequencies)
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const normalizedLevel = Math.min(100, Math.max(0, average * 2)); // Scale to 0-100
    
    setAudioLevel(normalizedLevel);
    
    // If sound is detected above threshold, set isListening to true
    const THRESHOLD = 15; // Adjust based on testing
    if (normalizedLevel > THRESHOLD) {
      setIsListening(true);
      // Reset listening state after a delay if no sound is detected
      setTimeout(() => {
        if (normalizedLevel <= THRESHOLD) {
          setIsListening(false);
        }
      }, 300);
    }
    
    // Continue analyzing audio
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };
  
  // Toggle video
  const toggleVideo = async () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    if (!isVideoEnabled) {
      // Turning video on
      await setupVideo();
    } else {
      // Turning video off
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(track => track.stop());
      }
    }
    
    toast({
      title: isVideoEnabled ? "Video disabled" : "Video enabled",
      duration: 2000,
    });
  };

  // Toggle audio
  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
    }
    
    if (!isAudioEnabled) {
      // Turning audio on
      setupAudioAnalyser();
    } else {
      // Turning audio off
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      setAudioLevel(0);
      setIsListening(false);
    }
    
    toast({
      title: isAudioEnabled ? "Microphone muted" : "Microphone unmuted",
      duration: 2000,
    });
  };

  // Start the interview with custom questions
  const startInterview = () => {
    setIsInProgress(true);
    setConversation([
      { 
        speaker: 'ai', 
        text: `Welcome to your ${interviewData?.position || ''} interview. I'll be asking you questions tailored to your profile and skills. Let's get started.` 
      }
    ]);
    
    // Start tracking interview time
    startTimeRef.current = new Date();
    
    // Simulate AI speaking
    setIsSpeaking(true);
    
    // Use the first question from the custom questions or a fallback
    setTimeout(() => {
      const firstQuestion = customQuestions.length > 0 
        ? customQuestions[0]
        : "Could you start by telling me about your background and experience relevant to this position?";
        
      setCurrentQuestion(firstQuestion);
      setConversation(prev => [...prev, { speaker: 'ai', text: firstQuestion }]);
      setQuestionsAsked(1);
      setIsSpeaking(false);
    }, 3000);
  };

  // Reset transcript when a new question is asked
  useEffect(() => {
    if (currentQuestion) {
      setUserResponse('');
    }
  }, [currentQuestion]);

  // Submit response
  const submitResponse = () => {
    if (!userResponse.trim()) return;
    
    // Add user response to conversation
    const currentQuestionIndex = questionsAsked;
    setConversation(prev => [...prev, { speaker: 'user', text: userResponse }]);
    
    // Store the user's response for later analysis
    setUserResponses(prev => [...prev, userResponse]);
    
    setIsProcessing(true);
    
    // Enhanced response evaluation based on content
    const evaluateResponse = (response: string) => {
      // More sophisticated evaluation criteria
      const responseLength = response.split(' ').length;
      const lowerCaseResponse = response.toLowerCase();
      
      // Extract keywords from interview data if available
      let keywords = [];
      if (interviewData?.skills) {
        keywords = interviewData.skills.flatMap((skill: string) => skill.toLowerCase().split(/\s+/));
      } else {
        keywords = [
          'experience', 'skills', 'projects', 'development', 'teamwork',
          'problem solving', 'communication', 'challenges', 'leadership'
        ];
      }
      
      const matchedKeywords = keywords.filter(keyword => 
        lowerCaseResponse.includes(keyword.toLowerCase())
      );
      
      let quality: 'good' | 'fair' | 'needs_improvement';
      
      // More nuanced evaluation
      if (responseLength < 5) {
        quality = 'needs_improvement'; // Too short
      } else if (matchedKeywords.length >= 3 && responseLength >= 20) {
        quality = 'good';
      } else if (matchedKeywords.length >= 1 && responseLength >= 10) {
        quality = 'fair';
      } else {
        quality = 'needs_improvement';
      }
      
      // Store the quality for this question
      setResponseQuality(prev => ({...prev, [currentQuestionIndex]: quality}));
      
      return quality;
    };
    
    const quality = evaluateResponse(userResponse);
    
    // Clear response field
    setUserResponse('');
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsProcessing(false);
      setIsSpeaking(true);
      
      // Check if we should end the interview
      if (questionsAsked >= Math.min(customQuestions.length, 5)) {
        // Calculate overall score based on response qualities
        const qualityValues = Object.values(responseQuality);
        const validQualityValues = qualityValues.length > 0 ? qualityValues : [];
        
        const score = validQualityValues.length > 0 ? validQualityValues.reduce((acc, quality) => {
          if (quality === 'good') return acc + 9;
          if (quality === 'fair') return acc + 7;
          return acc + 5;
        }, 0) / validQualityValues.length : 0;
        
        setOverallScore(score);
        
        setFeedback("I'm analyzing your responses and preparing feedback. Let me summarize how you did in this interview...");
        setConversation(prev => [...prev, { 
          speaker: 'ai', 
          text: "Thank you for your responses. That concludes our interview. I'm now preparing your feedback and results." 
        }]);
        
        setTimeout(() => {
          setIsSpeaking(false);
          setInterviewComplete(true);
        }, 3000);
        
        return;
      }
      
      // Generate AI feedback based on quality
      const generateFeedback = (quality: string) => {
        if (quality === 'good') {
          return "That's a good answer. You provided specific examples and demonstrated your knowledge.";
        } else if (quality === 'fair') {
          return "That's a reasonable response, but consider adding more specific examples from your experience.";
        } else {
          return "Try to elaborate more on your answer and include specific examples from your past experience.";
        }
      };
      
      // Add AI feedback to conversation
      setConversation(prev => [...prev, { 
        speaker: 'ai', 
        text: generateFeedback(quality),
        quality 
      }]);
      
      // Use the next custom question or a fallback
      setTimeout(() => {
        let nextQuestion;
        if (customQuestions.length > questionsAsked) {
          nextQuestion = customQuestions[questionsAsked];
        } else {
          const fallbackQuestions = [
            "Can you describe a challenging project you worked on and how you overcame obstacles?",
            "How do you stay updated with the latest technologies and industry trends?",
            "Tell me about a time when you had to meet a tight deadline. How did you manage your time?",
            "How do you handle disagreements with team members about technical decisions?",
            "What's your approach to debugging complex issues in a production environment?",
          ];
          nextQuestion = fallbackQuestions[questionsAsked % fallbackQuestions.length];
        }
        
        setCurrentQuestion(nextQuestion);
        setConversation(prev => [...prev, { speaker: 'ai', text: nextQuestion }]);
        setQuestionsAsked(questionsAsked + 1);
        
        // End AI speaking after a delay
        setTimeout(() => {
          setIsSpeaking(false);
        }, 2000);
      }, 2000);
    }, 3000);
  };

  // End interview and pass actual data to results page
  const endInterview = () => {
    // Calculate overall score based on actual responses
    const qualityValues = Object.values(responseQuality);
    const score = qualityValues.length > 0 
      ? qualityValues.reduce((acc, quality) => {
          if (quality === 'good') return acc + 9;
          if (quality === 'fair') return acc + 7;
          return acc + 5;
        }, 0) / qualityValues.length
      : 0; // No score if no responses
    
    setOverallScore(score);
    
    toast({
      title: 'Interview Complete',
      description: 'Generating your feedback report...',
      duration: 3000,
    });

    // Calculate accurate interview duration
    let interviewDuration = '1 minute';
    if (startTimeRef.current) {
      const endTime = new Date();
      const durationInMinutes = Math.max(1, Math.round((endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60)));
      interviewDuration = `${durationInMinutes} minute${durationInMinutes !== 1 ? 's' : ''}`;
    }

    // Generate strengths and improvements based on actual responses
    let strengths = [];
    let improvements = [];
    
    // Only add meaningful feedback if there were actual responses
    if (questionsAsked > 0 && userResponses.length > 0) {
      // Count quality distribution
      const qualityCounts = {
        good: 0,
        fair: 0,
        needs_improvement: 0
      };
      
      Object.values(responseQuality).forEach(quality => {
        qualityCounts[quality]++;
      });
      
      // Generate appropriate strengths based on quality
      if (qualityCounts.good > 0) {
        strengths.push('Provided detailed answers with specific examples');
        
        if (qualityCounts.good >= Math.floor(questionsAsked / 2)) {
          strengths.push('Demonstrated good knowledge of technical concepts');
        }
      }
      
      if (userResponses.length >= questionsAsked - 1) {
        strengths.push('Addressed all interview questions');
      }
      
      // Generate improvements
      if (qualityCounts.needs_improvement > 0) {
        improvements.push('Provide more detailed responses with specific examples');
      }
      
      if (qualityCounts.fair > 0) {
        improvements.push('Elaborate more on technical concepts and implementations');
      }
      
      // If no clear strengths were identified
      if (strengths.length === 0) {
        strengths.push('Participated in the interview process');
      }
      
      // If no clear improvements were identified
      if (improvements.length === 0 && score < 9) {
        improvements.push('Continue to work on providing more comprehensive responses');
      }
    } else {
      // No responses case
      strengths = ['No strengths identified - interview ended without responses'];
      improvements = ['Complete the full interview to receive proper feedback'];
    }

    // Prepare interview result data with position and other details
    const interviewResult = {
      id: id || String(Date.now()),
      title: interviewData?.title || 'Interview Practice',
      position: interviewData?.position || 'Not Specified',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      duration: interviewDuration,
      role: interviewData?.position || 'Professional',
      type: (interviewData?.interviewType || 'technical') as 'technical' | 'behavioral',
      completed: true,
      score: score,
      results: {
        overallScore: score,
        strengths: strengths,
        improvements: improvements,
        completedAt: new Date().toISOString(),
        responseQuality: responseQuality,
        questionsAsked: questionsAsked,
        userResponses: userResponses,
        conversation: conversation
      }
    };
    
    // Get existing results from localStorage
    const existingResults = localStorage.getItem('interviewResults');
    let allResults = existingResults ? JSON.parse(existingResults) : [];
    
    // Add new result
    const existingIndex = allResults.findIndex((item: any) => item.id === id);
    if (existingIndex >= 0) {
      allResults[existingIndex] = interviewResult;
    } else {
      allResults.push(interviewResult);
    }
    
    // Store in localStorage
    localStorage.setItem('interviewResults', JSON.stringify(allResults));
    
    // Update the interview data in localStorage to mark it as completed
    const storedInterviews = localStorage.getItem('interviewData');
    if (storedInterviews) {
      const interviews = JSON.parse(storedInterviews);
      const updatedInterviews = interviews.map((interview: any) => {
        if (interview.id === id) {
          return {
            ...interview,
            completed: true
          };
        }
        return interview;
      });
      localStorage.setItem('interviewData', JSON.stringify(updatedInterviews));
    }
    
    // Redirect to results page with actual conversation data
    setTimeout(() => {
      navigate(`/results/${id}`, { 
        state: { 
          interviewData: interviewResult,
          conversation: conversation,
          overallScore: score,
          responseQuality: responseQuality,
          questionsAsked: questionsAsked,
          userResponses: userResponses,
          completedAt: new Date().toISOString(),
          interviewDuration: interviewDuration
        } 
      });
    }, 3000);
    
    // Clean up resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  // Helper function to determine microphone icon based on state
  const getMicIcon = () => {
    if (!isAudioEnabled) {
      return <MicOff />;
    }
    if (isListening) {
      return <Mic className="text-green-500 animate-pulse" />;
    }
    return <Mic />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <main className="flex-grow container px-4 py-8 md:px-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Interview Session</h1>
          <p className="text-gray-500">Your personalized interview is in progress</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          {/* Video feed column */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden h-[400px] mb-4 relative">
              {/* Video feed */}
              {isVideoEnabled ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p>Camera Disabled</p>
                  </div>
                </div>
              )}
              
              {/* Audio level visualization */}
              {isAudioEnabled && (
                <div className="absolute bottom-20 left-4 right-4 bg-black/60 p-2 rounded-md flex items-center gap-2">
                  {isListening ? (
                    <Volume2 className="h-4 w-4 text-green-500 animate-pulse" />
                  ) : (
                    <Volume className="h-4 w-4 text-gray-400" />
                  )}
                  <Progress value={audioLevel} className="h-2" />
                  {isSpeaking && (
                    <div className="ml-auto px-2 py-1 bg-interview-primary text-white text-xs rounded-md animate-pulse">
                      AI Speaking...
                    </div>
                  )}
                </div>
              )}
              
              {/* Interview controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <Button 
                  variant="secondary" 
                  size="icon"
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <Video /> : <VideoOff />}
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon"
                  onClick={toggleAudio}
                  className={isListening ? "bg-green-100" : ""}
                >
                  {getMicIcon()}
                </Button>
                
                {isInProgress ? (
                  <Button 
                    variant="destructive"
                    onClick={endInterview}
                  >
                    End Interview
                  </Button>
                ) : (
                  <Button 
                    onClick={startInterview}
                    className="bg-interview-primary hover:bg-interview-primary/90"
                  >
                    Start Interview
                  </Button>
                )}
              </div>
            </div>
            
            {isInProgress && !interviewComplete && (
              <div className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-interview-primary flex items-center justify-center text-white font-bold">
                        AI
                      </div>
                      <h3 className="font-medium">Current Question:</h3>
                      {isSpeaking && (
                        <span className="text-xs bg-interview-primary/20 text-interview-primary px-2 py-1 rounded-md animate-pulse">
                          Speaking...
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{currentQuestion || "Waiting for the interview to begin..."}</p>
                    
                    <div className="mt-6">
                      <div className="flex flex-col space-y-2">
                        <div className="relative">
                          <Textarea 
                            className="min-h-[100px] p-3"
                            placeholder="Type your response here..."
                            value={userResponse}
                            onChange={(e) => setUserResponse(e.target.value)}
                            disabled={!isInProgress || isProcessing || interviewComplete}
                          />
                        </div>
                        <Button 
                          className="self-end bg-interview-primary hover:bg-interview-primary/90"
                          disabled={!userResponse.trim() || isProcessing || interviewComplete}
                          onClick={submitResponse}
                        >
                          {isProcessing ? (
                            <>
                              <Loader className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Response
                            </>
                          )}
                        </Button>
                      </div>
                      {feedback && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600">{feedback}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {interviewComplete && (
              <div className="mt-4 text-center">
                <Button 
                  onClick={endInterview}
                  className="bg-interview-primary hover:bg-interview-primary/90 mx-auto"
                >
                  View Results
                </Button>
              </div>
            )}
          </div>
          
          {/* Conversation log column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border h-full p-4 overflow-hidden flex flex-col">
              <h2 className="font-bold mb-4">Conversation</h2>
              
              <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {conversation.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>The conversation will appear here once the interview starts.</p>
                  </div>
                ) : (
                  conversation.map((message, index) => (
                    <div key={index} className={`flex ${message.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                      <div 
                        className={`max-w-[90%] rounded-lg p-3 ${
                          message.speaker === 'ai' 
                            ? 'bg-interview-light text-gray-700' 
                            : 'bg-interview-primary text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm">
                            {message.speaker === 'ai' ? 'AI Interviewer' : 'You'}
                          </span>
                          {message.speaker === 'ai' && index === conversation.length - 1 && isSpeaking && (
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full animate-pulse">
                              Speaking
                            </span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        
                        {/* Show response quality indicator for AI feedback messages */}
                        {message.speaker === 'ai' && message.quality && (
                          <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-flex items-center ${
                            message.quality === 'good' ? 'bg-green-100 text-green-800' :
                            message.quality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {message.quality === 'good' ? 'Good Answer' :
                             message.quality === 'fair' ? 'Fair Answer' :
                             'Needs Improvement'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewPage;
