
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { InterviewQuestion, InterviewResponse, InterviewType } from '@/types/interview';
import { generatePdf } from '@/utils/pdf-generator';

// Export the generatePdf function as generatePdfReport for backward compatibility
export const generatePdfReport = generatePdf;

// API endpoint for AI interview service
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'https://api.interviewai.com';

// Function to start a new interview session
export const startInterview = async (interviewData: Partial<any>): Promise<any> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/interviews/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interviewData),
    });

    if (!response.ok) {
      throw new Error('Failed to start interview');
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting interview:', error);
    throw error;
  }
};

// Function to get the next question in an interview
export const getNextQuestion = async (interviewId: string): Promise<InterviewQuestion> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/interviews/${interviewId}/next-question`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get next question');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting next question:', error);
    throw error;
  }
};

// Function to submit a response to a question
export const submitResponse = async (
  interviewId: string,
  questionId: string,
  responseText: string
): Promise<InterviewResponse> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/interviews/${interviewId}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId,
        responseText,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit response');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting response:', error);
    throw error;
  }
};

// Function to end an interview and get results
export const endInterview = async (interviewId: string): Promise<any> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/interviews/${interviewId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to end interview');
    }

    return await response.json();
  } catch (error) {
    console.error('Error ending interview:', error);
    throw error;
  }
};

// Function to get interview results
export const getInterviewResults = async (interviewId: string): Promise<any> => {
  try {
    const response = await fetch(`${API_ENDPOINT}/interviews/${interviewId}/results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get interview results');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting interview results:', error);
    throw error;
  }
};

// Function to generate interview questions based on form inputs
export const generateInterviewQuestions = async (
  params: {
    position: string;
    experienceLevel: string;
    skills: string[];
    interviewType: 'technical' | 'behavioral' | 'mixed';
    jobDescription?: string;
    additionalInfo?: string;
  }
): Promise<InterviewQuestion[]> => {
  try {
    // In a production app, we would make an API call here
    // For now, we'll use the mock data
    console.log("Generating questions with params:", params);
    
    // Generate between 5-8 questions based on the params
    const questions = getMockInterviewQuestions(params.interviewType);
    
    // Add some customization based on the position and skills
    const customizedQuestions = questions.map((question, index) => ({
      ...question,
      id: `q-${index + 1}`,
      text: question.text.replace(/developer/gi, params.position)
    }));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return customizedQuestions;
  } catch (error) {
    console.error("Error generating interview questions:", error);
    // Return a default set of questions as fallback
    return getMockInterviewQuestions(params.interviewType);
  }
};

// Mock data for development and testing
export const getMockInterviewQuestions = (type: InterviewType): InterviewQuestion[] => {
  if (type === 'technical') {
    return [
      {
        id: '1',
        text: 'Can you explain the difference between let, const, and var in JavaScript?',
        type: 'technical',
        difficulty: 'medium',
      },
      {
        id: '2',
        text: 'What is the virtual DOM in React and why is it used?',
        type: 'technical',
        difficulty: 'medium',
      },
      {
        id: '3',
        text: 'Explain how promises work in JavaScript.',
        type: 'technical',
        difficulty: 'hard',
      },
    ];
  } else if (type === 'behavioral') {
    return [
      {
        id: '1',
        text: 'Tell me about a time when you had to work under a tight deadline.',
        type: 'behavioral',
        difficulty: 'medium',
      },
      {
        id: '2',
        text: 'Describe a situation where you had to resolve a conflict within your team.',
        type: 'behavioral',
        difficulty: 'medium',
      },
      {
        id: '3',
        text: 'How do you handle criticism of your work?',
        type: 'behavioral',
        difficulty: 'medium',
      },
    ];
  } else {
    // Mixed questions
    return [
      {
        id: '1',
        text: 'What are your strengths as a developer?',
        type: 'behavioral',
        difficulty: 'easy',
      },
      {
        id: '2',
        text: 'Explain the concept of closures in JavaScript.',
        type: 'technical',
        difficulty: 'hard',
      },
      {
        id: '3',
        text: 'Describe a challenging project you worked on and how you approached it.',
        type: 'behavioral',
        difficulty: 'medium',
      },
    ];
  }
};
