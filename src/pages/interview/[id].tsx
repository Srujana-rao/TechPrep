
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Video, VideoOff, MicOff, Send, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  // Mock interview data
  const interviewData = {
    id: '1',
    title: 'Senior Full-Stack Developer Interview',
    role: 'Senior Full-Stack Developer',
    type: 'technical',
  };

  // Start the interview
  const startInterview = () => {
    setIsInProgress(true);
    setConversation([
      { 
        speaker: 'ai', 
        text: `Welcome to your mock interview for the ${interviewData.role} position. I'll be asking you a series of ${interviewData.type} questions. Let's get started.` 
      }
    ]);
    
    // Simulate first question after welcome message
    setTimeout(() => {
      const firstQuestion = "Can you tell me about a challenging project you worked on and how you overcame obstacles?";
      setCurrentQuestion(firstQuestion);
      setConversation(prev => [...prev, { speaker: 'ai', text: firstQuestion }]);
    }, 2000);
  };

  // Toggle video
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast({
      title: isVideoEnabled ? 'Video disabled' : 'Video enabled',
      duration: 2000,
    });
  };

  // Toggle audio
  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast({
      title: isAudioEnabled ? 'Microphone muted' : 'Microphone unmuted',
      duration: 2000,
    });
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
      
      // Mock next question from AI
      const nextQuestions = [
        "How do you handle disagreements with team members about technical decisions?",
        "Describe your approach to debugging a complex issue in a production environment.",
        "Can you explain a time when you had to make a difficult technical decision with limited information?",
        "What's your experience with microservices architecture and what challenges did you face implementing it?"
      ];
      
      const nextQuestion = nextQuestions[Math.floor(Math.random() * nextQuestions.length)];
      setCurrentQuestion(nextQuestion);
      setConversation(prev => [...prev, { speaker: 'ai', text: nextQuestion }]);
    }, 3000);
  };

  // End interview
  const endInterview = () => {
    toast({
      title: 'Interview Complete',
      description: 'Generating your feedback report...',
      duration: 3000,
    });
    
    // Redirect to results page (would use real navigation in production)
    setTimeout(() => {
      window.location.href = `/results/${id}`;
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <main className="flex-grow container px-4 py-8 md:px-6 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{interviewData.title}</h1>
          <p className="text-gray-500">{interviewData.type === 'technical' ? 'Technical Interview' : 'Behavioral Interview'}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
          {/* Video feed column */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden h-[400px] mb-4 relative">
              {/* Video placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isVideoEnabled ? (
                  <div className="text-white text-center">
                    <p>Camera Feed</p>
                    <p className="text-sm text-gray-400">(Webcam would display here in production)</p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <p>Camera Disabled</p>
                  </div>
                )}
              </div>
              
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
            
            {isInProgress && (
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
                      <div className="flex space-x-2">
                        <textarea 
                          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-interview-primary"
                          placeholder="Type your response here..."
                          rows={3}
                          value={userResponse}
                          onChange={(e) => setUserResponse(e.target.value)}
                          disabled={!isInProgress || isProcessing}
                        ></textarea>
                        <Button 
                          className="self-end bg-interview-primary hover:bg-interview-primary/90"
                          disabled={!userResponse.trim() || isProcessing}
                          onClick={submitResponse}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      {isProcessing && (
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Processing your response...
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
                        className={`max-w-[80%] rounded-lg p-3 ${
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
                        <p className="text-sm">{message.text}</p>
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
