'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import OutreachContextPane from './OutreachContextPane';
import OutreachEditor from './OutreachEditor';
import OutreachIntelligencePane from './OutreachIntelligencePane';
import { getToken } from "@/app/actions/auth";

export default function OutreachStudioLayout({ contact, initialDraft }: { contact: any, initialDraft: any }) {
  
  const [draft, setDraft] = useState(initialDraft);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState(initialDraft?.tone || 'Professional');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/outreach/${contact.id}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tone })
      });
      if (response.ok) {
        setDraft(await response.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewrite = async (instruction: string) => {
    if (!draft) return;
    setIsGenerating(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/outreach/${draft.id}/rewrite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ instruction, currentSubject: draft.subject, currentBody: draft.body })
      });
      if (response.ok) {
        setDraft(await response.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (subject: string, body: string) => {
    if (!draft) return;
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/outreach/${draft.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject, body, tone })
      });
      if (response.ok) {
        setDraft(await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar - Context & Settings */}
      <OutreachContextPane contact={contact} tone={tone} setTone={setTone} />

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="px-8 py-5 flex items-center justify-between border-b border-outline-variant bg-surface-container-low/50">
          <div className="flex items-center gap-4">
            <Link href="/intelligence" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <h2 className="font-headline-md text-on-surface">AI Outreach Studio</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest">Draft in Progress</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-on-surface-variant font-medium hover:text-on-surface transition-colors">Discard</button>
            <button 
              onClick={() => draft ? handleSave(draft.subject, draft.body) : handleGenerate()} 
              className="px-5 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-sm text-on-surface font-semibold hover:border-primary transition-all shadow-sm flex items-center gap-2"
              disabled={isGenerating}
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {draft ? 'Save Draft' : 'Generate Initial Draft'}
            </button>
          </div>
        </header>

        <OutreachEditor draft={draft} isGenerating={isGenerating} onSave={handleSave} onRewrite={handleRewrite} />
      </main>

      {/* Intelligence & History Sidebar */}
      {draft && (
        <OutreachIntelligencePane draft={draft} onRewrite={handleRewrite} />
      )}
    </div>
  );
}
