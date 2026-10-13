import { jsPDF } from 'jspdf';
import type { Loan } from '../../shared/types';
import { formatDate } from '../../shared/utils/formatters';

/**
 * Genera y descarga un comprobante oficial de préstamo en formato PDF utilizando jsPDF.
 * 
 * @param loan Objeto de préstamo que cumple con el contrato Loan.
 */
export function exportReceiptPdf(loan: Loan): void {
  // Instanciar documento A4 en orientación vertical (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2; // 170mm

  const loanCode = loan.loanCode || (loan as any).code || loan.id;
  const loanDateStr = loan.loanDate || (loan as any).borrowedAt || '';

  // ==========================================
  // 1. ENCABEZADO INSTITUCIONAL
  // ==========================================
  // Fondo azul institucional
  doc.setFillColor(23, 74, 116); // #174a74
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Franja decorativa dorada
  doc.setFillColor(217, 119, 6); // amber-600
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Textos del encabezado
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.text('SISTEMA DE BIBLIOTECA UNIVERSITARIA', 105, 17, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('COMPROBANTE OFICIAL DE PRÉSTAMO DE LIBRO', 105, 25, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setTextColor(224, 231, 255);
  doc.text('DOCUMENTO DE REGISTRO Y CONTROL BIBLIOGRÁFICO', 105, 33, { align: 'center' });

  // ==========================================
  // 2. TICKET DE IDENTIFICACIÓN RÁPIDA
  // ==========================================
  let currentY = 54;

  // Caja de código y estado
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, currentY, contentWidth, 22, 3, 3, 'FD');

  // Código de préstamo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('CÓDIGO DE PRÉSTAMO:', marginX + 6, currentY + 8);

  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(23, 74, 116);
  doc.text(loanCode, marginX + 6, currentY + 16);

  // Estado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('ESTADO ACTUAL:', marginX + 115, currentY + 8);

  const isDevuelto = loan.status === 'DEVUELTO';
  if (isDevuelto) {
    doc.setFillColor(209, 250, 229); // emerald-100
    doc.setDrawColor(52, 211, 153); // emerald-400
    doc.roundedRect(marginX + 115, currentY + 10, 48, 8, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.text('DEVUELTO', marginX + 139, currentY + 15.5, { align: 'center' });
  } else {
    doc.setFillColor(254, 243, 199); // amber-100
    doc.setDrawColor(251, 191, 36); // amber-400
    doc.roundedRect(marginX + 115, currentY + 10, 48, 8, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('ACTIVO (EN CURSO)', marginX + 139, currentY + 15.5, { align: 'center' });
  }

  // ==========================================
  // 3. DETALLES DEL PRÉSTAMO (GRID PRINCIPAL)
  // ==========================================
  currentY = 83;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59); // slate-850
  doc.text('DETALLES DEL PRÉSTAMO Y DEL EJEMPLAR', marginX, currentY);

  currentY += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(marginX, currentY, contentWidth, 84, 3, 3, 'FD');

  const leftColX = marginX + 6;
  const rightColX = marginX + 90;
  let rowY = currentY + 11;

  // Fila 1: Usuario
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('USUARIO BENEFICIARIO', leftColX, rowY);
  rowY += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(loan.receipt.userName || 'No especificado', leftColX, rowY);

  // ID de Usuario en columna derecha
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('IDENTIFICADOR DE USUARIO', rightColX, rowY - 5.5);
  doc.setFont('courier', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(loan.userId, rightColX, rowY);

  // Línea divisoria suave
  rowY += 7;
  doc.setDrawColor(241, 245, 249);
  doc.line(marginX + 6, rowY, marginX + contentWidth - 6, rowY);
  rowY += 8;

  // Fila 2: Título del Libro
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TÍTULO DEL LIBRO / MATERIAL BIBLIOGRÁFICO', leftColX, rowY);
  rowY += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  // Manejo de títulos largos con splitTextToSize
  const bookTitleLines = doc.splitTextToSize(loan.receipt.bookTitle || 'Sin título', 158);
  doc.text(bookTitleLines, leftColX, rowY);

  rowY += (bookTitleLines.length * 5) + 3;
  doc.setDrawColor(241, 245, 249);
  doc.line(marginX + 6, rowY, marginX + contentWidth - 6, rowY);
  rowY += 8;

  // Fila 3: Fechas clave (3 columnas)
  const col1 = marginX + 6;
  const col2 = marginX + 62;
  const col3 = marginX + 118;

  // Fecha Préstamo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('FECHA DE PRÉSTAMO', col1, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(formatDate(loanDateStr), col1, rowY + 5.5);

  // Fecha Vencimiento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('FECHA LÍMITE (DEVOLUCIÓN)', col2, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text(formatDate(loan.dueAt), col2, rowY + 5.5);

  // Fecha Devolución Real
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('DEVOLUCIÓN EFECTIVA', col3, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  if (loan.returnedAt) {
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text(formatDate(loan.returnedAt), col3, rowY + 5.5);
  } else {
    doc.setTextColor(100, 116, 139);
    doc.text('Pendiente', col3, rowY + 5.5);
  }

  // ==========================================
  // 4. NORMATIVA Y TÉRMINOS
  // ==========================================
  currentY = 178;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, currentY, contentWidth, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('POLÍTICAS Y RESPONSABILIDAD DEL PRÉSTAMO', marginX + 6, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const policies = [
    '1. El usuario asume plena responsabilidad por la preservación e integridad física del libro.',
    '2. La entrega posterior a la fecha límite acarrea penalizaciones y bloqueo temporal de servicios.',
    '3. Para la recepción conforme, el ejemplar debe entregarse en módulo bibliotecario con este comprobante.',
  ];

  let policyY = currentY + 14;
  policies.forEach((item) => {
    doc.text(item, marginX + 6, policyY);
    policyY += 5.5;
  });

  // ==========================================
  // 5. SECCIÓN DE SEGURIDAD / FIRMA
  // ==========================================
  currentY = 227;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, currentY, contentWidth, 32, 3, 3, 'FD');

  // Representación visual de código de validación
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('SELLO DIGITAL DE EMISIÓN', marginX + 6, currentY + 8);

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const now = new Date();
  const dateStr = formatDate(now.toISOString());
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  doc.text(`EMITIDO: ${dateStr} a las ${timeStr} hrs.`, marginX + 6, currentY + 15);
  doc.text(`HASH DE VERIFICACIÓN: [VALID-${loan.id.slice(0, 8).toUpperCase()}-SEC]`, marginX + 6, currentY + 22);

  // Línea de firma
  const signX = marginX + 105;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.line(signX, currentY + 20, signX + 55, currentY + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('FIRMA / SELLO DE CONFORMIDAD', signX + 27.5, currentY + 25, { align: 'center' });

  // ==========================================
  // 6. PIE DE PÁGINA
  // ==========================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Sistema de Biblioteca Universitaria - Evaluación Parcial S7 DAW · Documento generado automáticamente.',
    105,
    286,
    { align: 'center' }
  );

  // Descarga automática del archivo PDF
  const sanitizedCode = loanCode.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`comprobante-prestamo-${sanitizedCode}.pdf`);
}
