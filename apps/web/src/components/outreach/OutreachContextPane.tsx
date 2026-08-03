'use client';

import React from 'react';
import Image from 'next/image';

interface OutreachContextPaneProps {
  contact: any;
  tone: string;
  setTone: (tone: string) => void;
}

export default function OutreachContextPane({ contact, tone, setTone }: OutreachContextPaneProps) {
  const tones = ['Professional', 'Aggressive', 'Casual', 'Persuasive'];

  return (
    <aside className="w-[340px] border-r border-outline-variant bg-surface-container flex flex-col">
      <div className="p-8 pb-6 border-b border-outline-variant">
        <h3 className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest mb-6">Target Prospect</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface border border-outline-variant relative">
            {contact.photoUrl ? (
              <Image src={contact.photoUrl} alt={contact.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-on-surface-variant">{contact.name[0]}</div>
            )}
          </div>
          <div>
            <h4 className="font-headline-sm text-on-surface text-lg leading-tight">{contact.name}</h4>
            <p className="text-body-sm text-primary">{contact.title}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">domain</span>
            <span>{contact.company?.name || 'Unknown Company'}</span>
          </div>
          {contact.department && (
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">work</span>
              <span>{contact.department}</span>
            </div>
          )}
          {contact.emailStatus && (
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span className="text-emerald-500 font-medium">Verified Email ({contact.emailStatus})</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        <h3 className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest mb-4">AI Configuration</h3>
        
        <div className="mb-8">
          <label className="text-sm font-semibold text-on-surface mb-3 block">Voice & Tone</label>
          <div className="grid grid-cols-2 gap-2">
            {tones.map(t => (
              <button 
                key={t}
                onClick={() => setTone(t)}
                className={`p-2.5 rounded-xl border text-sm font-medium transition-all ${
                  tone === t 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-outline-variant bg-surface hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-on-surface mb-3 block">Contextual Tags</label>
          <div className="flex flex-wrap gap-2">
            {contact.matchTags?.map((tag: string, i: number) => (
              <span key={i} className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
