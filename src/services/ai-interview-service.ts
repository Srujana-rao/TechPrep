
import { generatePdf } from '@/utils/pdf-generator';

// Export the generatePdf function as generatePdfReport
export { generatePdf as generatePdfReport };

// More sophisticated question analysis function
const analyzeAnswer = (answer: string, questionType: string): {
  score: number;
  feedback: string;
} => {
  // Check if answer is empty or very short
  if (!answer || answer.trim().length < 5) {
    return {
      score: 2,
      feedback: "Extremely brief response. Consider elaborating much more."
    };
  }
  
  const words = answer.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Base score on length and complexity
  let score = 0;
  let feedback = "";
  
  // Short answers (less than 15 words)
  if (wordCount < 15) {
    score = Math.min(4, Math.max(2, Math.floor(wordCount / 3)));
    feedback = "Response is too brief. Elaborate with specific examples and more detail.";
  } 
  // Medium answers (15-50 words)
  else if (wordCount < 50) {
    score = Math.min(7, Math.max(4, Math.floor(4 + wordCount / 10)));
    feedback = "Decent response but could be more comprehensive. Add more specific details.";
  }
  // Longer answers
  else {
    score = Math.min(9, Math.max(6, Math.floor(6 + wordCount / 25)));
    feedback = "Good detailed response. Well articulated with sufficient context.";
  }
  
  // Check for unique vocabulary (indicates higher quality answers)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const vocabularyRatio = uniqueWords.size / wordCount;
  
  if (vocabularyRatio > 0.7 && wordCount > 30) {
    score = Math.min(10, score + 1);
    feedback = "Excellent response with rich vocabulary and good detail.";
  }
  
  // Check for specific keywords based on question type
  if (questionType === 'technical') {
    const technicalTerms = ['algorithm', 'system', 'design', 'architecture', 'code', 'solution', 'implementation', 'database', 'framework', 'library', 'api', 'interface', 'test', 'debug'];
    const hasTechnicalTerms = technicalTerms.some(term => answer.toLowerCase().includes(term));
    
    if (hasTechnicalTerms && wordCount > 25) {
      score = Math.min(10, score + 0.5);
    } else if (!hasTechnicalTerms && questionType === 'technical') {
      score = Math.max(2, score - 1);
      feedback = "Your response lacks technical specificity. Include relevant technical terms and concepts.";
    }
  }
  
  // Check for first-person pronouns in behavioral questions
  if (questionType === 'behavioral') {
    const personalExperience = ['i', 'me', 'my', 'we', 'our'].some(pronoun => 
      new RegExp(`\\b${pronoun}\\b`, 'i').test(answer)
    );
    
    if (personalExperience) {
      score = Math.min(10, score + 0.5);
    } else {
      score = Math.max(2, score - 1);
      feedback = "Your response lacks personal examples. Use the STAR method (Situation, Task, Action, Result).";
    }
  }
  
  return {
    score: Math.round(score * 10) / 10, // Round to 1 decimal place
    feedback
  };
};

// Export the interview questions generation function
export const generateInterviewQuestions = async (params: {
  position: string;
  experienceLevel: string;
  skills: string[];
  interviewType: 'technical' | 'behavioral' | 'mixed';
  jobDescription?: string;
  additionalInfo?: string;
}): Promise<Array<{ id: string; text: string; type: string; }>> => {
  // Enhanced set of questions based on the position and interview type
  const technicalQuestions = [
    { id: '1', text: `What experience do you have with ${params.skills[0]}?`, type: 'technical' },
    { id: '2', text: `How would you implement a ${params.skills[0]} solution for a real-world problem?`, type: 'technical' },
    { id: '3', text: `Explain how ${params.skills[1] || 'your technical skills'} would be useful for this ${params.position} role.`, type: 'technical' },
    { id: '4', text: 'Describe your approach to debugging a complex issue in your code.', type: 'technical' },
    { id: '5', text: 'How do you stay updated with the latest technologies in your field?', type: 'technical' }
  ];
  
  const behavioralQuestions = [
    { id: '6', text: 'Tell me about yourself and your background.', type: 'behavioral' },
    { id: '7', text: 'Describe a challenging project you worked on and how you overcame obstacles.', type: 'behavioral' },
    { id: '8', text: 'Give an example of a time you had to work under pressure to meet a deadline.', type: 'behavioral' },
    { id: '9', text: 'Tell me about a time when you had a conflict with a team member and how you resolved it.', type: 'behavioral' },
    { id: '10', text: 'What is your greatest professional achievement and why?', type: 'behavioral' }
  ];
  
  if (params.interviewType === 'technical') {
    return technicalQuestions;
  } else if (params.interviewType === 'behavioral') {
    return behavioralQuestions;
  } else {
    // For mixed, select from both categories
    return [...technicalQuestions.slice(0, 3), ...behavioralQuestions.slice(0, 2)];
  }
};

// Export the answer analysis function
export const analyzeInterviewAnswer = (answer: string, questionType: 'technical' | 'behavioral' | string): {
  score: number;
  feedback: string;
  quality: 'good' | 'fair' | 'needs_improvement';
} => {
  const analysis = analyzeAnswer(answer, questionType);
  
  // Determine quality category based on score
  let quality: 'good' | 'fair' | 'needs_improvement';
  if (analysis.score >= 7.5) {
    quality = 'good';
  } else if (analysis.score >= 5) {
    quality = 'fair';
  } else {
    quality = 'needs_improvement';
  }
  
  return {
    ...analysis,
    quality
  };
};
