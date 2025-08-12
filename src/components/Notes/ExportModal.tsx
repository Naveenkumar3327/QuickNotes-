import React, { useState } from 'react';
import { Download, FileText, File, X } from 'lucide-react';
import { Note } from '../../types';
import jsPDF from 'jspdf';

interface ExportModalProps {
  note: Note;
  onClose: () => void;
}

export default function ExportModal({ note, onClose }: ExportModalProps) {
  const [exporting, setExporting] = useState(false);

  const exportAsText = () => {
    const content = `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}\n\nCreated: ${new Date(note.createdAt).toLocaleString()}\nUpdated: ${new Date(note.updatedAt).toLocaleString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const exportAsPDF = async () => {
    setExporting(true);
    try {
      const pdf = new jsPDF();
      
      // Title
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      const splitTitle = pdf.splitTextToSize(note.title, 170);
      pdf.text(splitTitle, 20, 20);
      
      // Content
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      const splitContent = pdf.splitTextToSize(note.content, 170);
      pdf.text(splitContent, 20, 40);
      
      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(128);
      pdf.text(`Created: ${new Date(note.createdAt).toLocaleString()}`, 20, pdf.internal.pageSize.height - 20);
      pdf.text(`Updated: ${new Date(note.updatedAt).toLocaleString()}`, 20, pdf.internal.pageSize.height - 10);
      
      pdf.save(`${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
    setExporting(false);
    onClose();
  };

  const copyToClipboard = () => {
    const content = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(content).then(() => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Note</h3>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{note.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{note.content}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5 mr-3" />
              Copy to Clipboard
            </button>

            <button
              onClick={exportAsText}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-5 h-5 mr-3" />
              Download as Text
            </button>

            <button
              onClick={exportAsPDF}
              disabled={exporting}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <File className="w-5 h-5 mr-3" />
              {exporting ? 'Generating PDF...' : 'Download as PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}