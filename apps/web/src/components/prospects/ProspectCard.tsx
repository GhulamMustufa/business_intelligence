'use client';

import React from 'react';
import Image from 'next/image';

interface ProspectCardProps {
  lead: any; // SavedLead with decisionMaker and company included
  isSelected: boolean;
  onToggle: () => void;
}

export default function ProspectCard({ lead, isSelected, onToggle }: ProspectCardProps) {
  const dm = lead.decisionMaker;
  const company = lead.company;
  
  if (!dm) return null; // We only render decision makers in this view

  return (
    <div className={`bg-surface-container border p-6 rounded-2xl transition-all group relative cursor-pointer ${
      isSelected ? 'border-primary-container shadow-[0_0_15px_2px_rgba(189,194,255,0.08)] bg-surface-container-high' : 'border-outline-variant hover:border-primary-container'
    }`} onClick={onToggle}>
      <input 
        type="checkbox" 
        checked={isSelected}
        onChange={onToggle}
        className={`absolute top-4 left-4 rounded text-primary-container focus:ring-primary-container bg-surface ${
          isSelected ? 'border-primary-container' : 'border-outline-variant'
        }`}
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-white/5 rounded-xl border border-outline-variant flex items-center justify-center shrink-0 overflow-hidden">
          {company?.logoUrl ? (
            <Image src={company.logoUrl} alt={company.name} width={40} height={40} className="object-contain" unoptimized />
          ) : (
            <span className="material-symbols-outlined">business</span>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-body-lg group-hover:text-primary-container transition-colors">
                {dm.name}
              </h4>
              <p className="text-sm text-on-surface-variant">
                {dm.title} @ {company?.name}
              </p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-primary-container">
                <span className="font-label-sm font-bold">{dm.confidenceScore ? Math.round(dm.confidenceScore) : 'N/A'}</span>
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <span className="text-[10px] font-label-sm opacity-50 uppercase tracking-tighter">SCORE</span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {company?.location && (
              <span className="px-2 py-0.5 bg-surface-container-highest text-[10px] font-label-sm rounded flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[12px]">location_on</span>
                {company.location}
              </span>
            )}
            {company?.industry && (
              <span className="px-2 py-0.5 bg-surface-container-highest text-[10px] font-label-sm rounded text-on-surface-variant">
                {company.industry}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-outline-variant flex items-center justify-between">
        <div className="flex gap-2">
          {lead.tags && lead.tags.map((tag: string, idx: number) => {
            let colors = "bg-surface-container-highest text-on-surface-variant";
            if (tag === 'HIGH INTENT') colors = "bg-green-500/10 text-green-500 border border-green-500/20";
            if (tag === 'DECISION MAKER') colors = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
            if (tag === 'FOLLOW-UP') colors = "bg-orange-500/10 text-orange-500 border border-orange-500/20";

            return (
              <span key={idx} className={`px-2.5 py-1 text-[10px] font-label-sm rounded-full ${colors}`}>
                {tag}
              </span>
            );
          })}
        </div>
        
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg hover:bg-primary-container/10 text-on-surface-variant hover:text-primary-container transition-all flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">mail</span>
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-primary-container/10 text-on-surface-variant hover:text-primary-container transition-all flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>
        </div>
      </div>
    </div>
  );
}
