import Link from 'next/link';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  employeeSizeMin: number;
  employeeSizeMax: number;
  website: string;
  logoUrl: string | null;
  baseScore: number;
  matchLabel: string | null;
  confidence?: number | null;
  recentActivity?: string | null;
  googleRating?: number | null;
}

interface CompanyCardProps {
  company: Company;
  isActive: boolean;
  onSelect: (company: Company) => void;
  onSave: (companyId: string) => void;
}

export default function CompanyCard({ company, isActive, onSelect, onSave }: CompanyCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);

  const handleExport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Industry,Location,Employees,Website,Score\n" +
      `"${company.name}","${company.industry}","${company.location}","${company.employeeSizeMin}-${company.employeeSizeMax}","${company.website}",${company.baseScore}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${company.name.replace(/\\s+/g, '_').toLowerCase()}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };
  return (
    <div 
      onClick={() => onSelect(company)}
      className={`group relative rounded-2xl p-6 transition-all cursor-pointer ${
        isActive 
          ? 'bg-surface-container border-2 border-primary-container/60 ai-glow'
          : 'bg-surface-container border border-outline-variant hover:border-primary-container/50 hover:-translate-y-[2px]'
      }`}
    >
      <div className="flex gap-6">
        <div className="w-14 h-14 flex-shrink-0 bg-surface-container-highest rounded-xl border border-outline-variant flex items-center justify-center overflow-hidden relative">
          {company.logoUrl ? (
            <Image src={company.logoUrl} alt={`${company.name} Logo`} fill className="object-contain p-2" unoptimized />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant">business</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h4 className={`font-headline-md text-lg transition-colors ${isActive ? 'text-primary-container' : 'text-on-surface group-hover:text-primary-container'}`}>
                  {company.name}
                </h4>
                {company.googleRating && (
                  <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-md border border-outline-variant">
                    <span className="font-label-sm text-xs font-bold">{company.googleRating}</span>
                    <span className="material-symbols-outlined text-[12px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                )}
              </div>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                {company.industry} · {company.location}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-col items-end">
                <div className={`flex items-center gap-1.5 ${isActive ? 'text-primary-container' : 'text-primary-container'}`}>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  <span className="font-label-sm text-sm font-bold">{company.baseScore}% Score</span>
                </div>
                {company.matchLabel && (
                  <p className={`font-label-sm text-[10px] uppercase tracking-widest mt-1 ${isActive ? 'text-primary-container font-bold' : 'text-on-surface-variant'}`}>
                    {company.matchLabel}
                  </p>
                )}
              </div>
              
              {company.confidence && (
                <div className="flex flex-col items-end mt-1">
                  <div className="flex items-center gap-1.5 text-green-400">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span className="font-label-sm text-[11px] font-bold">{company.confidence}% Match Confidence</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {company.recentActivity && (
            <div className="mt-4 p-3 rounded-xl bg-surface-container-high border border-outline-variant/50 flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary-container mt-0.5">notifications_active</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Recent Activity</span>
                <span className="font-body-md text-xs text-on-surface">{company.recentActivity}</span>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-12">
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">Employees</span>
              <span className="font-label-sm text-sm text-on-surface">
                {company.employeeSizeMin.toLocaleString()} - {company.employeeSizeMax.toLocaleString()}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">Website</span>
              <a 
                href={`https://${company.website}`} 
                target="_blank" 
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-body-md text-primary-container hover:underline flex items-center gap-1"
              >
                {company.website} <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>

            <div className={`flex-1 flex flex-wrap justify-end gap-2 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowQuickView(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all font-body-md text-xs text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span> Quick View
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all font-body-md text-xs text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">download</span> Export
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onSave(company.id); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all font-body-md text-xs text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">bookmark</span> Save
              </button>
              <Link 
                href={`/companies/${company.id}`}
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-body-md text-xs ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container hover:opacity-90'
                    : 'bg-surface-container-highest text-on-surface border border-outline-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">analytics</span> Analyze
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setShowQuickView(false); }}>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowQuickView(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex items-center gap-4 mb-6">
              {company.logoUrl ? (
                <div className="w-16 h-16 bg-surface-container-highest rounded-xl border border-outline-variant relative overflow-hidden flex-shrink-0">
                  <Image src={company.logoUrl} alt="Logo" fill className="object-contain p-2" unoptimized />
                </div>
              ) : (
                <div className="w-16 h-16 bg-surface-container-highest rounded-xl border border-outline-variant flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[24px] text-on-surface-variant">business</span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-headline-md text-on-surface">{company.name}</h2>
                <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-primary-container hover:underline text-sm flex items-center gap-1 mt-1">
                  {company.website} <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6 border-y border-outline-variant/50 py-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 block">Industry</span>
                <span className="text-sm text-on-surface">{company.industry}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 block">Location</span>
                <span className="text-sm text-on-surface">{company.location}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 block">Company Size</span>
                <span className="text-sm text-on-surface">{company.employeeSizeMin.toLocaleString()} - {company.employeeSizeMax.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 block">Match Score</span>
                <span className="text-sm font-bold text-primary-container">{company.baseScore}%</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowQuickView(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
                Close
              </button>
              <Link 
                href={`/companies/${company.id}`}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-on-primary-container hover:opacity-90 transition-colors"
              >
                Analyze Deeply
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
