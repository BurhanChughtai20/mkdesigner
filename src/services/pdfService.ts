import type { AIOutput } from "@/types";
import { jsPDF } from "jspdf";

export function savePDF(_: AIOutput, clientName: string) {
  const doc = new jsPDF();
  doc.text(`Campaign: ${clientName}`, 10, 10);
  doc.save(`${clientName}.pdf`);
} 