
/// <reference types="vite/client" />

declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface AutoTableOutput {
    finalY?: number;
    [key: string]: any;
  }

  function autoTable(doc: jsPDF, options: any): AutoTableOutput;
  
  export default autoTable;
}
