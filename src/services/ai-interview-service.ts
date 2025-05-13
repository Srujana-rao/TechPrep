import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { InterviewQuestion, InterviewResponse, InterviewType } from '@/types/interview';

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

// Function to generate a PDF report for an interview
export const generatePdfReport = (interviewData: any): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Format date helper
  const formatDate = (date: string | Date): string => {
    return format(new Date(date), 'MMMM d, yyyy');
  };

  // Set font styles
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80); // Dark blue text

  // Add header
  doc.setFontSize(24);
  doc.text('Interview Performance Report', 20, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const currentDate = formatDate(interviewData.date || new Date());
  doc.text(`Generated on ${currentDate}`, 20, 30);

  // Add horizontal line
  doc.setDrawColor(41, 128, 185); // Blue line
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Add interview information
  let lastY = 45; // Starting Y position
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Interview Details', 20, lastY);
  lastY += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Role
  doc.setFont('helvetica', 'bold');
  doc.text('Position:', 20, lastY);
  doc.setFont('helvetica', 'normal');
  doc.text(interviewData.role || 'Not specified', 60, lastY);
  lastY += 8;
  
  // Type
  doc.setFont('helvetica', 'bold');
  doc.text('Interview Type:', 20, lastY);
  doc.setFont('helvetica', 'normal');
  doc.text(interviewData.type || 'Not specified', 60, lastY);
  lastY += 8;
  
  // Duration
  doc.setFont('helvetica', 'bold');
  doc.text('Duration:', 20, lastY);
  doc.setFont('helvetica', 'normal');
  doc.text(interviewData.duration || 'Not specified', 60, lastY);
  lastY += 15;
  
  // Overall score
  if (interviewData.results && interviewData.results.overallScore) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Score', 20, lastY);
    lastY += 8;
    
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185); // Blue text for score
    const score = `${interviewData.results.overallScore}/10`;
    doc.text(score, 20, lastY);
    doc.setTextColor(44, 62, 80); // Reset text color
    lastY += 15;
  }
  
  // Strengths section
  if (interviewData.results && interviewData.results.strengths && interviewData.results.strengths.length > 0) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Strengths', 20, lastY);
    lastY += 8;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const strengths = interviewData.results.strengths;
    
    // @ts-ignore - autoTable types are not fully compatible
    const strengthsTableOutput = doc.autoTable({
      startY: lastY,
      head: [['Strengths']],
      body: strengths.map((strength: string) => [strength]),
      theme: 'grid',
      headStyles: {
        fillColor: [231, 247, 255],
        textColor: [44, 62, 80],
        fontStyle: 'bold'
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 4,
        cellWidth: 'auto'
      },
      margin: { left: 20, right: 20 }
    });
    
    // Update the Y position for the next section
    if (strengthsTableOutput && strengthsTableOutput.lastAutoTable && strengthsTableOutput.lastAutoTable.finalY !== undefined) {
      lastY = strengthsTableOutput.lastAutoTable.finalY + 15;
    } else {
      lastY += 25 + (strengths.length * 10);
    }
  }
  
  // Areas for improvement section
  if (interviewData.results && interviewData.results.improvements && interviewData.results.improvements.length > 0) {
    // Check if we need a new page
    if (lastY > 250) {
      doc.addPage();
      lastY = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Areas for Improvement', 20, lastY);
    lastY += 8;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const improvements = interviewData.results.improvements;
    
    // @ts-ignore - autoTable types are not fully compatible
    const improvementsTableOutput = doc.autoTable({
      startY: lastY,
      head: [['Areas for Improvement']],
      body: improvements.map((improvement: string) => [improvement]),
      theme: 'grid',
      headStyles: {
        fillColor: [255, 243, 224],
        textColor: [44, 62, 80],
        fontStyle: 'bold'
      },
      styles: {
        overflow: 'linebreak',
        cellPadding: 4,
        cellWidth: 'auto'
      },
      margin: { left: 20, right: 20 }
    });
    
    // Update the Y position for the next section
    if (improvementsTableOutput && improvementsTableOutput.lastAutoTable && improvementsTableOutput.lastAutoTable.finalY !== undefined) {
      lastY = improvementsTableOutput.lastAutoTable.finalY + 15;
    } else {
      lastY += 25 + (improvements.length * 10);
    }
  }
  
  // Add detailed feedback if available
  if (interviewData.results && interviewData.results.detailedFeedback) {
    // Check if we need a new page
    if (lastY > 200) {
      doc.addPage();
      lastY = 20;
    }
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Feedback', 20, lastY);
    lastY += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    const feedback = interviewData.results.detailedFeedback;
    
    // Add each feedback category
    Object.entries(feedback).forEach(([category, comments]) => {
      if (lastY > 250) {
        doc.addPage();
        lastY = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(category, 20, lastY);
      lastY += 6;
      
      doc.setFont('helvetica', 'normal');
      
      if (typeof comments === 'string') {
        const textLines = doc.splitTextToSize(comments as string, 170);
        doc.text(textLines, 20, lastY);
        lastY += textLines.length * 6 + 8;
      } else if (Array.isArray(comments)) {
        (comments as string[]).forEach(comment => {
          const textLines = doc.splitTextToSize(`• ${comment}`, 170);
          doc.text(textLines, 20, lastY);
          lastY += textLines.length * 6 + 4;
        });
        lastY += 4;
      }
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by InterviewAI', 20, 290);
    doc.text(`Page ${i} of ${pageCount}`, 180, 290);
  }
  
  return doc;
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
