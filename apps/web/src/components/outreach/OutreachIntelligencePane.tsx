'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface OutreachIntelligencePaneProps {
  draft: any;
  onRewrite: (instruction: string) => void;
}

export default function OutreachIntelligencePane({ draft, onRewrite }: OutreachIntelligencePaneProps) {
  const versions = draft.versions || [];

  return (
    <section className="w-80 border-l border-outline-variant flex flex-col bg-surface-container-low/50">
      <div className="p-6 h-full flex flex-col gap-8 overflow-y-auto custom-scrollbar">
        
        {/* Rewrite Panel */}
        <div>
          <h3 className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest opacity-70 mb-4">Quick AI Rewrites</h3>
          <div className="flex flex-col gap-2">
            {[
              'Make it more assertive',
              'Shorten to under 100 words',
              'Make it sound more casual',
              'Add a call to action'
            ].map((instruction) => (
              <button 
                key={instruction}
                onClick={() => onRewrite(instruction)}
                className="w-full flex items-center justify-between p-3 text-sm text-on-surface bg-surface-container border border-outline-variant rounded-xl hover:bg-surface-container-high transition-all"
              >
                <span>{instruction}</span>
                <span className="material-symbols-outlined text-[16px] opacity-50">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* History Timeline */}
        <div className="mt-auto">
          <h3 className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest opacity-70 mb-4">Version History</h3>
          <div className="flex flex-col gap-6 border-l border-outline-variant ml-2 pl-4">
            
            <div className="relative">
              <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface"></span>
              <p className="text-sm font-semibold text-on-surface">Current Version</p>
              <p className="text-[10px] text-on-surface-variant">Editor</p>
            </div>

            {[...versions].reverse().map((v: any, idx: number) => (
              <div key={idx} className="relative opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface"></span>
                <p className="text-sm font-medium text-on-surface-variant">{v.type || 'Draft'}</p>
                <p className="text-[10px] text-on-surface-variant">
                  {v.timestamp ? formatDistanceToNow(new Date(v.timestamp), { addSuffix: true }) : 'Unknown time'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
