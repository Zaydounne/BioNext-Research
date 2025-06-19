import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Report, User } from '../types';

export const generatePDF = async (report: Report, user: User): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = '#2563EB';
  const secondaryColor = '#64748B';
  const accentColor = '#0D9488';

  // Header
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BioNext Research', 20, 15);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Rapport Scientifique', 20, 25);

  // Project Title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  const titleLines = pdf.splitTextToSize(report.project.title, pageWidth - 40);
  pdf.text(titleLines, 20, 45);

  // Project Info
  let yPosition = 55 + (titleLines.length * 7);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 116, 139);
  
  const projectInfo = [
    `Description: ${report.project.description}`,
    `Échantillons: ${report.project.sampleSize.toLocaleString()} patients`,
    `Date de completion: ${new Date(report.project.completionDate).toLocaleDateString('fr-FR')}`,
    `Significativité statistique: p = ${report.analysis.statisticalSignificance}`,
    `Niveau de confiance: ${report.analysis.confidenceLevel}%`
  ];

  projectInfo.forEach((info) => {
    const lines = pdf.splitTextToSize(info, pageWidth - 40);
    pdf.text(lines, 20, yPosition);
    yPosition += lines.length * 5;
  });

  yPosition += 10;

  // Analysis Summary
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Synthèse de l\'analyse', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(50, 50, 50);
  
  const summaryLines = pdf.splitTextToSize(report.analysis.summary, pageWidth - 40);
  
  // Check if we need a new page
  if (yPosition + (summaryLines.length * 4) > pageHeight - 30) {
    pdf.addPage();
    yPosition = 20;
  }
  
  pdf.text(summaryLines, 20, yPosition);
  yPosition += summaryLines.length * 4 + 15;

  // Key Findings
  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Résultats clés', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  report.analysis.keyFindings.forEach((finding, index) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setTextColor(13, 148, 136);
    pdf.text('•', 20, yPosition);
    
    pdf.setTextColor(50, 50, 50);
    const findingLines = pdf.splitTextToSize(finding, pageWidth - 50);
    pdf.text(findingLines, 25, yPosition);
    yPosition += findingLines.length * 4 + 2;
  });

  yPosition += 10;

  // Methodology
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Méthodologie', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(50, 50, 50);
  
  const methodologyLines = pdf.splitTextToSize(report.analysis.methodology, pageWidth - 40);
  pdf.text(methodologyLines, 20, yPosition);
  yPosition += methodologyLines.length * 4 + 15;

  // Limitations
  if (yPosition > pageHeight - 30) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('Limitations', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  report.analysis.limitations.forEach((limitation) => {
    if (yPosition > pageHeight - 15) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setTextColor(245, 158, 11);
    pdf.text('•', 20, yPosition);
    
    pdf.setTextColor(50, 50, 50);
    const limitationLines = pdf.splitTextToSize(limitation, pageWidth - 50);
    pdf.text(limitationLines, 25, yPosition);
    yPosition += limitationLines.length * 4 + 2;
  });

  // Footer
  const totalPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    
    const footerText = `Généré le ${new Date().toLocaleDateString('fr-FR')} par ${user.name} - BioNext Research`;
    pdf.text(footerText, 20, pageHeight - 10);
    
    pdf.text(`Page ${i} sur ${totalPages}`, pageWidth - 30, pageHeight - 10);
  }

  // Save the PDF
  const fileName = `BioNext_${report.project.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};