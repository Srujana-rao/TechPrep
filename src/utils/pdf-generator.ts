
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

// Function to generate PDF report from interview results
export const generatePdf = (result: InterviewResult): Blob => {
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
  
  const formattedDate = format(new Date(result.date), 'MMMM dd, yyyy');
  doc.text(`Date: ${formattedDate}`, 20, lastY);
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
    lastY += 20;
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
  
  // Add questions and answers section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Questions and Answers', 20, lastY);
  lastY += 10;
  
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
  
  // Add strengths section if available
  if (result.strengths && result.strengths.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Strengths', 20, lastY);
    lastY += 10;
    
    // Create table for strengths
    const strengthsData = result.strengths.map(strength => [strength]);
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
    });
    
    // Update the Y position for the next section
    const strengthsTableFinalY = (doc as any).lastAutoTable?.finalY || lastY + 15;
    lastY = strengthsTableFinalY + 15;
  }
  
  // Areas for improvement section
  if (result.areasForImprovement && result.areasForImprovement.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Areas for Improvement', 20, lastY);
    lastY += 10;
    
    // Create table for areas of improvement
    const improvementsData = result.areasForImprovement.map(area => [area]);
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
    });
    
    // Update the Y position for the next section
    const improvementsTableFinalY = (doc as any).lastAutoTable?.finalY || lastY + 15;
    lastY = improvementsTableFinalY + 15;
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 105, doc.internal.pageSize.height - 5, { align: 'center' });
  }
  
  // Generate and return the PDF as a Blob
  return doc.output('blob');
};

// Export generatePdf as generatePdfReport for compatibility
export const generatePdfReport = generatePdf;
