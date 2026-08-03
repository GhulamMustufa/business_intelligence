'use client';
import { useState } from 'react';

import CompanyCard from './CompanyCard';
import toast from 'react-hot-toast';

interface ResultsPaneProps {
  companies: any[];
  total: number;
  activeCompanyId: string | null;
  onSelectCompany: (company: any) => void;
  onSaveLead: (companyId: string) => void;
}

export default function ResultsPane({
  companies,
  total,
  activeCompanyId,
  onSelectCompany,
  onSaveLead
}: ResultsPaneProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const totalPages = Math.max(1, Math.ceil(companies.length / itemsPerPage));
  const paginatedCompanies = companies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportToCsv = () => {
    if (!companies || companies.length === 0) {
      toast.error('No companies to export.');
      return;
    }

    const headers = ['Name', 'Industry', 'Location', 'Website', 'LinkedIn', 'Phone', 'Google Rating', 'Reviews Count'];
    const rows = companies.map(c => [
      `"${c.name || ''}"`,
      `"${c.industry || ''}"`,
      `"${c.location || ''}"`,
      `"${c.website || ''}"`,
      `"${c.linkedInUrl || ''}"`,
      `"${c.phone || ''}"`,
      c.googleRating || '',
      c.reviewsCount || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leadforge_discovery_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Exported all results to CSV!');
  };

  return (
    <section className="w-full xl:flex-1 flex flex-col bg-surface overflow-visible xl:overflow-hidden h-auto xl:h-full">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 flex items-center justify-between border-b border-outline-variant bg-surface">
        <div className="flex items-center gap-4">
          <input type="checkbox" className="rounded-lg text-primary-container focus:ring-primary-container bg-surface-container-low border-outline-variant" />
          <h3 className="font-headline-md text-on-surface">Results <span className="text-on-surface-variant font-normal">({total.toLocaleString()})</span></h3>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast('Sorting options coming soon!', { icon: '📊' })} className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl hover:bg-surface-container-high transition-all font-body-md text-sm">
            <span className="material-symbols-outlined">sort</span> Sort
          </button>
          <button onClick={exportToCsv} className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-xl hover:opacity-90 transition-all font-body-md text-sm">
            <span className="material-symbols-outlined">cloud_download</span> Export
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-visible xl:overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-4">
        {paginatedCompanies.map(company => (
          <CompanyCard 
            key={company.id}
            company={company}
            isActive={company.id === activeCompanyId}
            onSelect={onSelectCompany}
            onSave={onSaveLead}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="px-4 md:px-8 py-4 border-t border-outline-variant bg-surface flex flex-wrap gap-4 items-center justify-between">
        <p className="font-label-sm text-xs text-on-surface-variant">
          Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, total)} of {total.toLocaleString()}
        </p>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all text-on-surface-variant disabled:opacity-50"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          {/* First Page */}
          <button 
            onClick={() => setCurrentPage(1)} 
            className={`w-8 h-8 rounded-lg font-label-sm text-xs transition-colors ${currentPage === 1 ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
          >
            1
          </button>

          {/* Logic to show previous/next pages around current page */}
          {currentPage > 3 && <span className="text-on-surface-variant px-1 font-label-sm text-xs">...</span>}
          
          {currentPage > 2 && (
            <button 
              onClick={() => setCurrentPage(currentPage - 1)} 
              className="w-8 h-8 rounded-lg hover:bg-surface-container font-label-sm text-xs text-on-surface-variant"
            >
              {currentPage - 1}
            </button>
          )}
          
          {currentPage !== 1 && currentPage !== totalPages && (
             <button 
              className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container font-label-sm text-xs"
            >
              {currentPage}
            </button>
          )}

          {currentPage < totalPages - 1 && (
            <button 
              onClick={() => setCurrentPage(currentPage + 1)} 
              className="w-8 h-8 rounded-lg hover:bg-surface-container font-label-sm text-xs text-on-surface-variant"
            >
              {currentPage + 1}
            </button>
          )}

          {currentPage < totalPages - 2 && <span className="text-on-surface-variant px-1 font-label-sm text-xs">...</span>}
          
          {/* Last Page */}
          {totalPages > 1 && (
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              className={`w-8 h-8 rounded-lg font-label-sm text-xs transition-colors ${currentPage === totalPages ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-container text-on-surface-variant'}`}
            >
              {totalPages}
            </button>
          )}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all text-on-surface-variant disabled:opacity-50"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}
