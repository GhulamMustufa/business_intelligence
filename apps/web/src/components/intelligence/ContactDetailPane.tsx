'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ContactDetailPaneProps {
  contact: any; // Ideally typed
  isGenerating?: boolean;
  onGenerate?: () => void;
}

export default function ContactDetailPane({ contact, isGenerating, onGenerate }: ContactDetailPaneProps) {
  const suggestedOutreach = contact.suggestedOutreach || [];

  return (
    <aside className="w-[420px] border-l border-outline-variant/30 bg-surface-container/80 backdrop-blur-xl flex flex-col p-8 gap-8 overflow-y-auto custom-scrollbar">
      
      {/* Contact Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20 bg-surface-container-highest">
              {contact.photoUrl ? (
                <Image src={contact.photoUrl} alt={contact.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-bold">
                  {contact.name[0]}
                </div>
              )}
            </div>
            {contact.emailStatus?.toLowerCase() === 'verified' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-[3px] border-surface rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-display-sm text-display-sm text-on-surface">{contact.name}</h3>
            <p className="text-body-sm text-primary font-medium">
              {contact.title} at {contact.company?.name || 'Unknown'}
            </p>
          </div>
        </div>
        <button className="text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* AI Intelligence Card */}
      {contact.aiPriorityMatch ? (
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl shadow-[0_0_15px_rgba(129,140,248,0.1)] relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="material-symbols-outlined text-[48px]">auto_awesome</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <h4 className="font-label-caps text-primary uppercase tracking-widest text-[12px] font-semibold">AI Priority Match</h4>
          </div>
          <p className="text-body-sm leading-relaxed mb-4 text-on-surface">
            {contact.aiPriorityMatch}
          </p>
          
          {contact.matchTags && contact.matchTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {contact.matchTags.map((tag: string, idx: number) => (
                <span key={idx} className="bg-surface-container-high/50 px-3 py-1 rounded-lg text-[10px] font-code border border-outline-variant/30 uppercase text-on-surface-variant">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="border border-dashed border-outline-variant/50 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[32px] mb-3 opacity-50">auto_awesome</span>
          <p className="text-body-sm text-on-surface-variant mb-4">No AI profile generated for this contact yet.</p>
          {onGenerate && (
            <button 
              onClick={onGenerate}
              disabled={isGenerating}
              className="bg-primary-container text-on-primary-container px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span className={`material-symbols-outlined text-[16px] ${isGenerating ? 'animate-spin' : ''}`}>
                {isGenerating ? 'progress_activity' : 'magic_button'}
              </span>
              {isGenerating ? 'Generating...' : 'Generate Profile'}
            </button>
          )}
        </div>
      )}

      {/* Outreach Suggestions */}
      {suggestedOutreach.length > 0 && (
        <div className="space-y-5">
          <h4 className="font-label-caps text-[12px] font-semibold text-on-surface-variant uppercase tracking-[0.2em]">Suggested Outreach</h4>
          <div className="space-y-4">
            {suggestedOutreach.map((outreach: any, idx: number) => (
              <div key={idx} className="p-4 bg-surface-container border border-outline-variant/30 rounded-xl group cursor-pointer hover:border-primary transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Context: {outreach.context}
                  </span>
                  <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                    content_copy
                  </span>
                </div>
                <p className="text-body-sm italic opacity-80 text-on-surface">
                  {outreach.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto space-y-3 pt-6">
        <Link href={`/outreach/${contact.id}`} className="w-full bg-primary text-on-primary-container font-label-caps text-[12px] font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10">
          <span className="material-symbols-outlined text-[20px]">mail</span>
          Write Sequence
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-surface-container border border-outline-variant/30 text-on-surface font-label-caps text-[12px] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]">playlist_add</span>
            Add to List
          </button>
          <button className="bg-surface-container border border-outline-variant/30 text-on-surface font-label-caps text-[12px] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]">launch</span>
            LinkedIn
          </button>
        </div>
      </div>
      
    </aside>
  );
}
