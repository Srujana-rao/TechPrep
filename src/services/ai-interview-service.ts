
import { toast } from "@/hooks/use-toast";

interface QuestionGenerationParams {
  position: string;
  experienceLevel: string;
  skills: string[];
  interviewType: 'technical' | 'behavioral' | 'mixed';
  jobDescription?: string;
  additionalInfo?: string;
}

// This is a mock implementation. In a real application, you would call an actual AI service.
export const generateInterviewQuestions = async (params: QuestionGenerationParams): Promise<string[]> => {
  try {
    console.log("Generating questions with params:", params);
    
    // In a real implementation, this would be an API call to an AI service
    // For now, we'll simulate an AI response with predefined templates and customize by skills/position
    
    // Define question templates by interview type
    const technicalQuestionTemplates = [
      "As a {position}, how would you approach implementing {skill1} in a production environment?",
      "Based on your experience with {skill2}, what challenges have you faced and how did you overcome them?",
      "Can you explain how you would use {skill1} and {skill3} together to solve a complex problem?",
      "What's your approach to debugging issues related to {skill2} in a large codebase?",
      "How would you optimize performance in a {skill1}-based application?",
      "Describe your experience with {skill3} and how you've used it in previous projects.",
      "What best practices do you follow when working with {skill1} for {position}-related tasks?",
      "How do you stay updated with the latest developments in {skill2} and other relevant technologies?",
      "Explain a particularly challenging problem you solved using {skill3} in your previous role.",
      "How would you implement a scalable architecture for a system using {skill1} and {skill2}?"
    ];
    
    const behavioralQuestionTemplates = [
      "Tell me about a time when you had to learn {skill1} quickly for a project. How did you approach it?",
      "Describe a situation where you had a conflict with a team member about a {skill2}-related decision. How did you resolve it?",
      "How do you prioritize your tasks when working on multiple {position}-related projects simultaneously?",
      "Share an example of when you had to meet a tight deadline for a project involving {skill1}. How did you manage it?",
      "Tell me about a time when you received negative feedback on your work as a {position}. How did you handle it?",
      "Describe your approach to collaboration when working in a cross-functional team on {skill3}-related projects.",
      "How do you handle situations where requirements change mid-project?",
      "Tell me about a time when you took initiative on a project involving {skill2}.",
      "Describe a situation where you had to explain a complex {skill1} concept to a non-technical person.",
      "How do you handle stress and pressure when working on critical {position} tasks?"
    ];
    
    // Based on interview type, select the appropriate template mix
    let selectedTemplates: string[] = [];
    
    switch (params.interviewType) {
      case 'technical':
        selectedTemplates = [...technicalQuestionTemplates];
        break;
      case 'behavioral':
        selectedTemplates = [...behavioralQuestionTemplates];
        break;
      case 'mixed':
        // For mixed, take a combination of both types
        selectedTemplates = [
          ...technicalQuestionTemplates.slice(0, 5), 
          ...behavioralQuestionTemplates.slice(0, 5)
        ];
        break;
    }
    
    // Select distinct skills from the skills array to use in templates
    const skillsArray = Array.isArray(params.skills) 
      ? params.skills 
      : params.skills.split(',').map(s => s.trim());
    
    // Make sure we have at least 3 skills to use in templates
    const normalizedSkills = skillsArray.length >= 3 
      ? skillsArray.slice(0, 3) 
      : [...skillsArray, ...Array(3 - skillsArray.length).fill("relevant technology")];
    
    // Customize templates with actual values
    const customizedQuestions = selectedTemplates.map(template => {
      let question = template
        .replace('{position}', params.position)
        .replace('{skill1}', normalizedSkills[0])
        .replace('{skill2}', normalizedSkills[1])
        .replace('{skill3}', normalizedSkills[2]);
        
      // Add experience level context to some questions
      if (Math.random() > 0.7) {
        const experienceContext = getExperienceContext(params.experienceLevel);
        question = `Given your ${experienceContext} experience, ${question.toLowerCase()}`;
      }
      
      return question;
    });
    
    // Shuffle the questions to ensure variety
    const shuffledQuestions = shuffleArray(customizedQuestions);
    
    // Take only as many as we need (typically 5-6 for an interview)
    return shuffledQuestions.slice(0, 6);
    
  } catch (error) {
    console.error("Error generating interview questions:", error);
    toast({
      title: "Question Generation Failed",
      description: "Could not generate custom interview questions. Using default questions instead.",
      variant: "destructive",
    });
    
    // Return generic fallback questions if AI generation fails
    return [
      "Tell me about your background and experience.",
      "What are your key strengths related to this role?",
      "Describe a challenging project you worked on recently.",
      "How do you approach problem-solving?",
      "Where do you see yourself in five years?"
    ];
  }
};

// Helper function to get context based on experience level
const getExperienceContext = (experienceLevel: string): string => {
  switch (experienceLevel) {
    case 'entry':
      return "entry-level";
    case 'mid':
      return "mid-level";
    case 'senior':
      return "senior-level";
    case 'lead':
      return "leadership";
    default:
      return "professional";
  }
};

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// In a production environment, this would be an API call to a real AI service
// Example of how you would implement an actual OpenAI integration
/*
async function generateQuestionsWithAI(params: QuestionGenerationParams): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer crafting personalized interview questions."
        },
        {
          role: "user",
          content: `Create 6 unique interview questions for a ${params.position} role, 
          focusing on skills: ${params.skills.join(', ')}. 
          Experience level: ${params.experienceLevel}. 
          Interview type: ${params.interviewType}.
          ${params.jobDescription ? `Job description: ${params.jobDescription}` : ''}
          ${params.additionalInfo ? `Additional context: ${params.additionalInfo}` : ''}`
        }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Parse the questions from the AI response
  // Assuming the AI returns a numbered list
  const questions = content.split(/\d+\./).slice(1).map((q: string) => q.trim());
  return questions;
}
*/
