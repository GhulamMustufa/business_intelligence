'use client';

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
          <button onClick={() => toast.success('Exporting all results to CSV...')} className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-xl hover:opacity-90 transition-all font-body-md text-sm">
            <span className="material-symbols-outlined">cloud_download</span> Export
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-visible xl:overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-4">
        {companies.map(company => (
          <CompanyCard 
            key={company.id}
            company={company}
            isActive={company.id === activeCompanyId}
            onSelect={onSelectCompany}
            onSave={onSaveLead}
          />
        ))}
      </div>

      {/* Pagination Placeholder */}
      <div className="px-4 md:px-8 py-4 border-t border-outline-variant bg-surface flex flex-wrap gap-4 items-center justify-between">
        <p className="font-label-sm text-xs text-on-surface-variant">Showing 1-{Math.min(25, total)} of {total.toLocaleString()}</p>
        <div className="flex items-center gap-1">
          <button onClick={() => toast('Previous page', { icon: '⬅️' })} className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all text-on-surface-variant">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button onClick={() => toast('Loading page 1...')} className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container font-label-sm text-xs">1</button>
          <button onClick={() => toast('Loading page 2...')} className="w-8 h-8 rounded-lg hover:bg-surface-container font-label-sm text-xs text-on-surface-variant">2</button>
          <button onClick={() => toast('Loading page 3...')} className="w-8 h-8 rounded-lg hover:bg-surface-container font-label-sm text-xs text-on-surface-variant">3</button>
          <span className="text-on-surface-variant px-1 font-label-sm text-xs">...</span>
          <button onClick={() => toast('Loading page 50...')} className="w-8 h-8 rounded-lg hover:bg-surface-container font-label-sm text-xs text-on-surface-variant">50</button>
          <button onClick={() => toast('Next page', { icon: '➡️' })} className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all text-on-surface-variant">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}
