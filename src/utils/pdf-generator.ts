
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Define the interview result type structure
interface InterviewResult {
  id: string;
  title: string;
  date: string;
  position: string;
  questionsAndAnswers: Array<{
    question: string;
    answer: string;
    feedback?: string;
    score?: number;
  }>;
  overallFeedback?: string;
  overallScore?: number;
  strengths?: string[];
  areasForImprovement?: string[];
}

// Enhanced list of strengths and improvements to choose from based on score ranges
const enhancedStrengths = {
  high: [
    "Exceptional technical knowledge demonstrated in responses",
    "Outstanding ability to articulate complex concepts clearly",
    "Strong problem-solving skills with methodical approach",
    "Excellent communication style with clear and concise answers",
    "Great ability to provide relevant real-world examples",
    "Strong understanding of industry best practices",
    "Impressive depth of knowledge in specialized areas",
    "Demonstrates critical thinking when approaching problems",
    "Good balance of technical detail and high-level concepts",
    "Thoughtful consideration of trade-offs in technical solutions"
  ],
  medium: [
    "Good fundamental technical understanding",
    "Effective communication of basic concepts",
    "Reasonable problem-solving approach",
    "Provides adequate context in answers",
    "Shows potential in technical reasoning",
    "Satisfactory grasp of relevant technologies",
    "Demonstrates logical thinking process",
    "Able to explain technical decisions",
    "Shows awareness of industry standards",
    "Balanced responses with adequate detail"
  ],
  low: [
    "Basic understanding of technical concepts",
    "Some ability to communicate ideas",
    "Beginning to develop problem-solving approach",
    "Attempts to provide context in answers",
    "Shows interest in expanding technical knowledge",
    "Familiar with some relevant technologies",
    "Demonstrates initial logical reasoning",
    "Can discuss simple technical decisions",
    "Growing awareness of industry practices",
    "Working on providing more detailed responses"
  ]
};

const enhancedImprovements = {
  high: [
    "Consider explaining edge cases more thoroughly",
    "Further develop expertise in emerging technologies",
    "Provide even more concrete examples from past experience",
    "Work on discussing system design with more architectural detail",
    "Enhance responses with more quantitative metrics",
    "Focus on explaining security considerations in solutions",
    "Continue developing communication of complex algorithms",
    "Practice discussing technical trade-offs more explicitly",
    "Expand knowledge of optimization techniques",
    "Develop more comparative analysis in technical discussions"
  ],
  medium: [
    "Practice articulating technical concepts more clearly",
    "Work on providing more specific examples",
    "Develop a more structured approach to problem-solving",
    "Enhance depth of technical explanations",
    "Improve discussion of alternative solutions",
    "Expand knowledge in specialized technical areas",
    "Strengthen responses with more context and background",
    "Work on concise communication of complex ideas",
    "Develop better explanation of technical decisions",
    "Practice connecting theory with practical applications"
  ],
  low: [
    "Focus on strengthening core technical knowledge",
    "Practice structured thinking when answering questions",
    "Work on providing more detailed explanations",
    "Develop ability to provide relevant examples",
    "Improve clarity when communicating technical concepts",
    "Expand knowledge of fundamentals in key areas",
    "Practice discussing technical solutions step-by-step",
    "Strengthen understanding of technical terminology",
    "Work on connecting concepts to real-world scenarios",
    "Consider seeking mentorship in technical communication"
  ]
};

// Function to generate PDF report from interview results
export const generatePdf = (result: InterviewResult): void => {
  // Create a new jsPDF instance
  const doc = new jsPDF();
  
  // Set initial y position for content
  let lastY = 20;
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Interview Results Report', 105, lastY, { align: 'center' });
  lastY += 15;
  
  // Add interview details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Position: ${result.position}`, 20, lastY);
  lastY += 10;
  
  // Format date if it's a valid date string, otherwise use as is
  let formattedDate;
  try {
    formattedDate = format(new Date(result.date), 'MMMM dd, yyyy');
  } catch (e) {
    formattedDate = result.date;
  }
  doc.text(`Date: ${formattedDate}`, 20, lastY);
  lastY += 10;
  
  // Add title of the interview
  doc.text(`Interview: ${result.title}`, 20, lastY);
  lastY += 20;
  
  // Add overall score if available
  if (result.overallScore !== undefined) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Performance', 20, lastY);
    lastY += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const scoreText = `Score: ${result.overallScore}/10`;
    doc.text(scoreText, 20, lastY);
    
    // Add performance rating based on score
    let performanceRating;
    if (result.overallScore >= 8) {
      performanceRating = "Excellent - Ready for real interviews";
    } else if (result.overallScore >= 6) {
      performanceRating = "Good - Almost ready with minor improvements needed";
    } else {
      performanceRating = "Needs Improvement - Additional practice recommended";
    }
    doc.text(`Rating: ${performanceRating}`, 20, lastY + 10);
    lastY += 30;
  }
  
  // Add overall feedback if available
  if (result.overallFeedback) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Feedback', 20, lastY);
    lastY += 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Split long feedback text to fit within page width
    const splitFeedback = doc.splitTextToSize(result.overallFeedback, 170);
    doc.text(splitFeedback, 20, lastY);
    lastY += splitFeedback.length * 7 + 15;
  }
  
  // Enhanced strengths section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Strengths', 20, lastY);
  lastY += 10;
  
  let strengthsList = result.strengths || [];
  
  // If we have fewer than 5 strengths, add more based on score
  if (strengthsList.length < 5) {
    let additionalStrengths;
    if (result.overallScore && result.overallScore >= 8) {
      additionalStrengths = enhancedStrengths.high;
    } else if (result.overallScore && result.overallScore >= 6) {
      additionalStrengths = enhancedStrengths.medium;
    } else {
      additionalStrengths = enhancedStrengths.low;
    }
    
    // Add unique strengths until we reach at least 5
    let i = 0;
    while (strengthsList.length < 5 && i < additionalStrengths.length) {
      if (!strengthsList.includes(additionalStrengths[i])) {
        strengthsList.push(additionalStrengths[i]);
      }
      i++;
    }
  }
  
  // Create table for strengths
  const strengthsData = strengthsList.map(strength => [strength]);
  (doc as any).autoTable({
    startY: lastY,
    body: strengthsData,
    theme: 'grid',
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap',
    },
    headStyles: {
      fillColor: [39, 174, 96],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 248, 240],
    }
  });
  
  // Update the Y position for the next section
  const strengthsTableFinalY = (doc as any).lastAutoTable?.finalY || lastY + 15;
  lastY = strengthsTableFinalY + 15;
  
  // Enhanced improvement areas section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Areas for Improvement', 20, lastY);
  lastY += 10;
  
  let improvementsList = result.areasForImprovement || [];
  
  // If we have fewer than 5 areas for improvement, add more based on score
  if (improvementsList.length < 5) {
    let additionalImprovements;
    if (result.overallScore && result.overallScore >= 8) {
      additionalImprovements = enhancedImprovements.high;
    } else if (result.overallScore && result.overallScore >= 6) {
      additionalImprovements = enhancedImprovements.medium;
    } else {
      additionalImprovements = enhancedImprovements.low;
    }
    
    // Add unique improvements until we reach at least 5
    let i = 0;
    while (improvementsList.length < 5 && i < additionalImprovements.length) {
      if (!improvementsList.includes(additionalImprovements[i])) {
        improvementsList.push(additionalImprovements[i]);
      }
      i++;
    }
  }
  
  // Create table for areas of improvement
  const improvementsData = improvementsList.map(area => [area]);
  (doc as any).autoTable({
    startY: lastY,
    body: improvementsData,
    theme: 'grid',
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap',
    },
    headStyles: {
      fillColor: [231, 76, 60],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [251, 238, 236],
    }
  });
  
  // Update the Y position for the next section
  const improvementsTableFinalY = (doc as any).lastAutoTable?.finalY || lastY + 15;
  lastY = improvementsTableFinalY + 15;
  
  // Add questions and answers section
  if ((lastY + 50) > doc.internal.pageSize.height) {
    doc.addPage();
    lastY = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Questions and Answers', 20, lastY);
  lastY += 10;
  
  // Ensure we have questionsAndAnswers data
  if (result.questionsAndAnswers && result.questionsAndAnswers.length > 0) {
    // Prepare data for Q&A table
    const qaData = result.questionsAndAnswers.map((qa, index) => {
      const data = [
        `Q${index + 1}: ${qa.question}`,
        qa.answer,
      ];
      if (qa.feedback) {
        data.push(qa.feedback);
      }
      if (qa.score !== undefined) {
        data.push(`${qa.score}/10`);
      }
      return data;
    });
    
    // Define column headers based on available data
    const qaHeaders = ['Question', 'Response'];
    if (result.questionsAndAnswers.some(qa => qa.feedback)) {
      qaHeaders.push('Feedback');
    }
    if (result.questionsAndAnswers.some(qa => qa.score !== undefined)) {
      qaHeaders.push('Score');
    }
    
    // Generate the Q&A table
    (doc as any).autoTable({
      startY: lastY,
      head: [qaHeaders],
      body: qaData,
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 50 },
      },
    });
    
    // Get the final Y position of the table
    const qaTableFinalY = (doc as any).lastAutoTable?.finalY || lastY + 15;
    lastY = qaTableFinalY + 15;
  } else {
    // If no Q&A data, add a note
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('No detailed questions and answers available for this interview.', 20, lastY);
    lastY += 15;
  }
  
  // Add skill proficiency section with a graph representation
  if ((lastY + 50) > doc.internal.pageSize.height) {
    doc.addPage();
    lastY = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Skill Proficiency Analysis', 20, lastY);
  lastY += 15;
  
  // Skills to evaluate (hard-coded for demo, would be dynamically generated in a real app)
  const skills = [
    {name: 'Technical Knowledge', score: result.overallScore ? Math.min(result.overallScore * 0.9 + Math.random() * 2, 10) : 5},
    {name: 'Communication', score: result.overallScore ? Math.min(result.overallScore * 1.1 - Math.random(), 10) : 5},
    {name: 'Problem Solving', score: result.overallScore ? Math.min(result.overallScore * 1.0 + Math.random() - 0.5, 10) : 5},
    {name: 'Confidence', score: result.overallScore ? Math.min(result.overallScore * 0.95 + Math.random() * 1.5, 10) : 5},
    {name: 'Industry Knowledge', score: result.overallScore ? Math.min(result.overallScore * 0.85 + Math.random() * 2, 10) : 5}
  ];
  
  // Create a bar chart representation
  const barWidth = 130;
  const barHeight = 15;
  const spacing = 25;
  const startX = 50;
  
  skills.forEach((skill, index) => {
    const y = lastY + (index * spacing);
    
    // Skill name
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(skill.name, 20, y);
    
    // Bar background
    doc.setFillColor(230, 230, 230);
    doc.rect(startX, y - 8, barWidth, barHeight, 'F');
    
    // Bar value
    const scoreWidth = (skill.score / 10) * barWidth;
    doc.setFillColor(skill.score >= 8 ? 39 : skill.score >= 6 ? 160 : 231, 
                     skill.score >= 8 ? 174 : skill.score >= 6 ? 150 : 76, 
                     skill.score >= 8 ? 96 : skill.score >= 6 ? 50 : 60);
    doc.rect(startX, y - 8, scoreWidth, barHeight, 'F');
    
    // Score text
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    if (scoreWidth > 20) {
      doc.text(skill.score.toFixed(1), startX + 5, y); // Score inside bar
    } else {
      doc.setTextColor(0, 0, 0);
      doc.text(skill.score.toFixed(1), startX + scoreWidth + 5, y); // Score outside bar
    }
    doc.setTextColor(0, 0, 0); // Reset text color
  });
  
  lastY += skills.length * spacing + 15;
  
  // Add recommendations section
  if ((lastY + 50) > doc.internal.pageSize.height) {
    doc.addPage();
    lastY = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommended Next Steps', 20, lastY);
  lastY += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Generate recommendations based on score
  let recommendations;
  if (result.overallScore && result.overallScore >= 8) {
    recommendations = [
      "You're interview-ready! Consider practicing specific industry or role-related questions.",
      "Focus on advanced topics in your field to further distinguish yourself.",
      "Practice discussing your accomplishments succinctly for behavioral questions.",
      "Prepare questions to ask interviewers that demonstrate your expertise.",
      "Continue refining your communication of technical concepts to non-technical people."
    ];
  } else if (result.overallScore && result.overallScore >= 6) {
    recommendations = [
      "Additional practice with 3-4 more mock interviews would be beneficial.",
      "Focus on providing more concrete examples in your answers.",
      "Practice explaining complex concepts more clearly and concisely.",
      "Work on your problem-solving approach by verbalizing your thought process.",
      "Review fundamental concepts in areas where you felt less confident."
    ];
  } else {
    recommendations = [
      "Schedule regular mock interviews to build confidence and fluency.",
      "Review core technical concepts related to the target position.",
      "Practice structured answering using the STAR method for behavioral questions.",
      "Join study groups or find a mentor to help prepare for interviews.",
      "Focus on developing concise, clear explanations for common interview topics."
    ];
  }
  
  // Display recommendations
  recommendations.forEach((rec, index) => {
    doc.text(`${index + 1}. ${rec}`, 20, lastY);
    lastY += 10;
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 105, doc.internal.pageSize.height - 5, { align: 'center' });
  }
  
  // Save the PDF file with a meaningful filename
  try {
    // Create a clean filename
    const cleanTitle = result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `Interview_${cleanTitle}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    
    // Save to user's device
    doc.save(fileName);
  } catch (error) {
    console.error('Error saving PDF:', error);
    
    // Fallback method if direct save fails
    try {
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Interview_Results_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (fallbackError) {
      console.error('Fallback PDF save failed:', fallbackError);
      alert('Could not download the PDF. Please try again or use a different browser.');
    }
  }
};

// Export generatePdf as generatePdfReport for compatibility
export const generatePdfReport = generatePdf;
