
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Video, VideoOff, MicOff, Send, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const InterviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isInProgress, setIsInProgress] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [conversation, setConversation] = useState<{ speaker: 'ai' | 'user'; text: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Initialize video when component loads
  useEffect(() => {
    if (isInProgress && isVideoEnabled) {
      setupVideo();
    }
    
    return () => {
      // Clean up video stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isInProgress, isVideoEnabled]);
  
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
    
    toast({
      title: isAudioEnabled ? "Microphone muted" : "Microphone unmuted",
      duration: 2000,
    });
  };

  // Start the interview
  const startInterview = () => {
    setIsInProgress(true);
    setConversation([
      { 
        speaker: 'ai', 
        text: `Welcome to your interview. I'll be asking you questions based on your profile and the job requirements. Let's get started.` 
      }
    ]);
    
    // Simulate first question after welcome message
    setTimeout(() => {
      const firstQuestion = "Could you start by telling me about your background and experience relevant to this position?";
      setCurrentQuestion(firstQuestion);
      setConversation(prev => [...prev, { speaker: 'ai', text: firstQuestion }]);
      setQuestionsAsked(1);
    }, 2000);
  };

  // Submit response
  const submitResponse = () => {
    if (!userResponse.trim()) return;
    
    // Add user response to conversation
    setConversation(prev => [...prev, { speaker: 'user', text: userResponse }]);
    setIsProcessing(true);
    
    // Clear response field
    setUserResponse('');
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsProcessing(false);
      
      // Check if we should end the interview
      if (questionsAsked >= 4) {
        setFeedback("I'm analyzing your responses and preparing feedback. Let me summarize how you did in this interview...");
        setConversation(prev => [...prev, { 
          speaker: 'ai', 
          text: "Thank you for your responses. That concludes our interview. I'm now preparing your feedback and results." 
        }]);
        
        setTimeout(() => {
          setInterviewComplete(true);
        }, 3000);
        
        return;
      }
      
      // Mock next question from AI
      const nextQuestions = [
        "Can you describe a challenging project you worked on and how you overcame obstacles?",
        "How do you stay updated with the latest technologies and industry trends?",
        "Tell me about a time when you had to meet a tight deadline. How did you manage your time?",
        "How do you handle disagreements with team members about technical decisions?",
        "What's your experience with agile development methodologies?",
        "How do you approach debugging complex issues in a production environment?",
      ];
      
      const nextQuestion = nextQuestions[questionsAsked];
      setCurrentQuestion(nextQuestion);
      setConversation(prev => [...prev, { speaker: 'ai', text: nextQuestion }]);
      setQuestionsAsked(questionsAsked + 1);
    }, 3000);
  };

  // End interview
  const endInterview = () => {
    toast({
      title: 'Interview Complete',
      description: 'Generating your feedback report...',
      duration: 3000,
    });
    
    // Redirect to results page
    setTimeout(() => {
      window.location.href = `/results/${id}`;
    }, 3000);
    
    // Clean up video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
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
                >
                  {isAudioEnabled ? <Mic /> : <MicOff />}
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
                    </div>
                    <p className="text-gray-700">{currentQuestion || "Waiting for the interview to begin..."}</p>
                    
                    <div className="mt-6">
                      <div className="flex flex-col space-y-2">
                        <Textarea 
                          className="min-h-[100px] p-3"
                          placeholder="Type your response here..."
                          value={userResponse}
                          onChange={(e) => setUserResponse(e.target.value)}
                          disabled={!isInProgress || isProcessing || interviewComplete}
                        />
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
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
