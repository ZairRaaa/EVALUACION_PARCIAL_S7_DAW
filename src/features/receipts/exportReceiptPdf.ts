import { jsPDF } from 'jspdf';
import type { Loan } from '../../shared/types';
import { formatDate } from '../../shared/utils/formatters';

export function buildReceiptPdf(loan: Loan): jsPDF {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor(23, 74, 116);
  doc.text('Biblioteca universitaria', 20, 22);
  doc.setFontSize(14);
  doc.text('Comprobante de préstamo', 20, 32);
  let y = 48;
  const fields = [
    ['Código único', loan.code], ['Usuario', loan.receipt.userName],
    ['Libro prestado', loan.receipt.bookTitle], ['Fecha de préstamo', formatDate(loan.borrowedAt)],
    ['Fecha límite de devolución', formatDate(loan.dueAt)],
    ['Devolución efectiva', loan.returnedAt ? formatDate(loan.returnedAt) : 'Pendiente'], ['Estado', loan.status],
  ];
  for (const [label, value] of fields) {
    if (y > 250) { doc.addPage(); y = 22; }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(82, 100, 122);
    doc.text(label, 20, y); y += 7;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(23, 43, 66);
    const lines: string[] = doc.splitTextToSize(value, 170);
    for (const line of lines) {
      if (y > 275) { doc.addPage(); y = 22; }
      doc.text(line, 20, y); y += 6;
    }
    y += 8;
  }
  return doc;
}

export function exportReceiptPdf(loan: Loan): void {
  buildReceiptPdf(loan).save(`comprobante-${loan.code.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
}
