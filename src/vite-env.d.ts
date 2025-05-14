
/// <reference types="vite/client" />

// Define augmentations for jsPDF and jsPDF-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable?: (options: any) => void;
    lastAutoTable?: {
      finalY: number;
    };
    internal: {
      pageSize: {
        getWidth: () => number;
        getHeight: () => number;
        width: number;
        height: number;
      };
    };
  }
}

declare module 'jspdf-autotable' {
  export default function autoTable(doc: any, options: any): void;
}
