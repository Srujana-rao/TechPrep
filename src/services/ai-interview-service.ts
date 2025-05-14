
import { generatePdf as generatePdfReport } from '@/utils/pdf-generator';

// Export the generatePdf function as generatePdfReport
export { generatePdfReport };

// Export the interview questions generation function
export const generateInterviewQuestions = async (params: {
  position: string;
  experienceLevel: string;
  skills: string[];
  interviewType: 'technical' | 'behavioral' | 'mixed';
  jobDescription?: string;
  additionalInfo?: string;
}): Promise<Array<{ id: string; text: string; type: string; }>> => {
  // This is a mock function that returns sample interview questions
  // In a real application, this would make an API call to generate questions
  return [
    { id: '1', text: 'Tell me about yourself', type: 'behavioral' },
    { id: '2', text: 'What are your strengths?', type: 'behavioral' },
    { id: '3', text: 'Describe a challenging project you worked on', type: 'behavioral' },
    { id: '4', text: `What experience do you have with ${params.skills[0]}?`, type: 'technical' },
    { id: '5', text: `How would you implement a ${params.skills[0]} solution?`, type: 'technical' }
  ];
};
