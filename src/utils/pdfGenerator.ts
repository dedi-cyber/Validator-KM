/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { ValidationSession, ValidationCategory } from '../types';
import { OFFICIAL_INSTRUMENT, calculateSessionScore } from '../instrumentData';

// Extend jsPDF with autotable types for typescript compilation safety
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => void;
}

export function exportSessionToPDF(session: ValidationSession) {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  const p = session.profile;
  const { score, adaCount, tidakCount, totalItems } = calculateSessionScore(session.gradings);

  // 1. KOP SURAT (Official Header)
  doc.setFillColor(0, 100, 50); // Kemenag Green
  doc.rect(0, 0, 210, 8, 'F');

  // Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('INSTRUMEN VALIDASI DOKUMEN KURIKULUM MADRASAH', 105, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`TAHUN AJARAN ${session.academicYear}`, 105, 24, { align: 'center' });

  doc.setLineWidth(0.5);
  doc.line(15, 28, 195, 28);

  // 2. IDENTITAS MADRASAH (Identity block)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('IDENTITAS MADRASAH', 15, 34);

  doc.setFont('Helvetica', 'normal');
  doc.text('Nama Madrasah', 15, 40);
  doc.text(':', 55, 40);
  doc.text(p.name, 58, 40);

  doc.text('NSM / NPSN', 15, 45);
  doc.text(':', 55, 45);
  doc.text(`${p.nsm} / ${p.npsn}`, 58, 45);

  doc.text('Alamat', 15, 50);
  doc.text(':', 55, 50);
  doc.text(p.address, 58, 50);

  doc.text('Kepala Madrasah', 15, 55);
  doc.text(':', 55, 55);
  doc.text(`${p.headmasterName} (NIP. ${p.headmasterNip || '-'})`, 58, 55);

  doc.text('Status / Akreditasi', 15, 60);
  doc.text(':', 55, 60);
  doc.text(`${p.status} / Terakreditasi ${p.accreditation}`, 58, 60);

  // Score badge on right side
  doc.setFillColor(243, 244, 246);
  doc.rect(135, 34, 60, 26, 'F');
  doc.setDrawColor(0, 100, 50);
  doc.rect(135, 34, 60, 26, 'S');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('STATUS KELAYAKAN', 165, 39, { align: 'center' });
  doc.setFontSize(18);
  doc.setTextColor(0, 100, 50);
  doc.text(`${score}%`, 165, 47, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text(`(${adaCount} Ada / ${tidakCount} Tidak)`, 165, 52, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'bold');
  doc.text(`Status: ${session.status.toUpperCase()}`, 165, 57, { align: 'center' });

  // Reset colors
  doc.setTextColor(0, 0, 0);

  // 3. TABLE OF CHECKLIST ITEMS
  const tableRows: any[] = [];
  
  OFFICIAL_INSTRUMENT.forEach((category) => {
    // Add Category Header row
    tableRows.push([
      { content: category.title, colSpan: 4, styles: { fillColor: [230, 245, 235], fontStyle: 'bold', textColor: [0, 80, 40] } }
    ]);

    category.items.forEach((item) => {
      const grading = session.gradings[item.id] || { status: null, notes: '' };
      const statusText = grading.status === 'ada' ? 'V' : '';
      const tdkStatusText = grading.status === 'tidak' ? 'V' : '';
      
      tableRows.push([
        item.code,
        item.text,
        statusText,
        tdkStatusText,
        grading.notes || '-'
      ]);
    });
  });

  doc.autoTable({
    startY: 65,
    head: [
      [
        { content: 'No', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        { content: 'Komponen Kurikulum Madrasah', rowSpan: 2, styles: { valign: 'middle' } },
        { content: 'Penilaian', colSpan: 2, styles: { halign: 'center' } },
        { content: 'Catatan / Deskripsi', rowSpan: 2, styles: { valign: 'middle' } }
      ],
      ['Ada', 'Tdk']
    ],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [0, 100, 50], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
      4: { cellWidth: 51 }
    },
    styles: { fontSize: 8, cellPadding: 2 },
    margin: { left: 15, right: 15 },
    didParseCell: function (data: any) {
      // Style Category header row differently
      if (data.row.raw && data.row.raw.length === 1) {
        data.cell.styles.fillColor = [235, 245, 235];
      }
    }
  });

  // 4. SIGN-OFF BLOCK
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  if (finalY < 230) {
    drawSignatures(doc, finalY, session);
  } else {
    doc.addPage();
    drawSignatures(doc, 25, session);
  }

  // Save the PDF file
  const fileName = `Instrumen_Validasi_${p.name.replace(/\s+/g, '_')}_${session.academicYear.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}

function drawSignatures(doc: jsPDF, y: number, session: ValidationSession) {
  const p = session.profile;
  
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  
  // Date & Place
  doc.text(`Sungayang, ________________ 2026`, 130, y);

  // Left Signature: Kepala Madrasah
  doc.text('Kepala Madrasah,', 25, y + 8);
  doc.setFont('Helvetica', 'bold');
  doc.text(p.headmasterName, 25, y + 32);
  doc.setFont('Helvetica', 'normal');
  doc.text(`NIP. ${p.headmasterNip || '_______________________'}`, 25, y + 37);

  // Right Signature: Pengawas
  doc.text('Pengawas Satuan Pendidikan,', 130, y + 8);
  doc.setFont('Helvetica', 'bold');
  doc.text(session.pengawasName || '__________________________', 130, y + 32);
  doc.setFont('Helvetica', 'normal');
  doc.text(`NIP. ${session.pengawasNip || '_______________________'}`, 130, y + 37);
}
