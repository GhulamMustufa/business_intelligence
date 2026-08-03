'use client';

import React, { useState, useEffect } from 'react';

interface OutreachEditorProps {
  draft: any;
  isGenerating: boolean;
  onSave: (subject: string, body: string) => void;
  onRewrite: (instruction: string) => void;
}

export default function OutreachEditor({ draft, isGenerating, onSave, onRewrite }: OutreachEditorProps) {
  // We keep track of standard fields
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [bestAngle, setBestAngle] = useState('');
  const [suggestedFollowUp, setSuggestedFollowUp] = useState('');
  const [thingsToMention, setThingsToMention] = useState<string[]>([]);
  const [command, setCommand] = useState('');

  useEffect(() => {
    if (draft) {
      setSubject(draft.subject || '');
      setBody(draft.body || '');
      setBestAngle(draft.bestAngle || '');
      setSuggestedFollowUp(draft.suggestedFollowUp || '');
      setThingsToMention(draft.thingsToMention || []);
    }
  }, [draft]);

  // Debounce save (mocked with blur for MVP)
  const handleBlur = () => {
    if (draft && (subject !== draft.subject || body !== draft.body)) {
      onSave(subject, body); // For MVP, we still only push subject/body back up to the server manually if edited
    }
  };

  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && command.trim() && !isGenerating) {
      onRewrite(command);
      setCommand('');
    }
  };

  if (!draft && !isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-on-surface-variant opacity-70">Click 'Generate Initial Draft' to start.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col items-center relative">
      {isGenerating && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-surface-container p-6 rounded-2xl shadow-xl flex items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
            <span className="font-semibold text-on-surface">AI is writing...</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl space-y-8">
        
        {/* Strategy Playbook Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary-container">psychology</span>
          <h2 className="font-headline-md text-xl text-on-surface">AI Campaign Strategy</h2>
        </div>

        {/* Best Angle Box */}
        {bestAngle && (
          <div className="bg-surface-container-low border-l-4 border-l-primary-container border-t border-r border-b border-outline-variant p-6 rounded-r-2xl shadow-lg">
            <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">Best Angle</h3>
            <p className="text-on-surface text-sm leading-relaxed">{bestAngle}</p>
          </div>
        )}

        {/* Things to Mention */}
        {thingsToMention && thingsToMention.length > 0 && (
          <div className="bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-lg">
            <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-4">Things to Mention</h3>
            <ul className="space-y-3">
              {thingsToMention.map((mention, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
                  <span className="text-sm text-on-surface-variant">{mention}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* The Email Draft */}
        <div className="bg-surface-container border border-outline-variant rounded-2xl shadow-2xl p-8 relative mt-12">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-outline-variant">
            <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">Suggested First Message</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-error/50"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-green-400/50"></span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 mb-6">
            <p className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-widest opacity-70">Subject:</p>
            <input 
              type="text" 
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg text-lg font-headline-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container px-4 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter subject line..."
            />
          </div>
          
          <textarea 
            className="w-full min-h-[250px] bg-surface-container-low border border-outline-variant/30 rounded-xl text-body-lg text-on-surface leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary-container resize-y p-4 custom-scrollbar"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onBlur={handleBlur}
            placeholder="Start writing your email here..."
          />
        </div>

        {/* Suggested Follow-up */}
        {suggestedFollowUp && (
          <div className="bg-surface-container border border-outline-variant border-dashed rounded-2xl p-6 shadow-lg mt-8 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">reply</span>
              <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">Suggested Follow-up</h3>
            </div>
            <textarea 
              className="w-full min-h-[100px] bg-transparent border-none text-sm text-on-surface-variant leading-relaxed focus:outline-none focus:ring-0 resize-none p-0 custom-scrollbar"
              value={suggestedFollowUp}
              onChange={(e) => setSuggestedFollowUp(e.target.value)}
              readOnly
            />
          </div>
        )}

      </div>

      <div className="mt-10 flex items-center gap-4">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all">
          <span className="material-symbols-outlined text-[18px]">content_copy</span>
          Copy to Clipboard
        </button>
        <button className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-sm shadow-xl shadow-primary-container/20 transition-all active:scale-95">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          Send Now
        </button>
      </div>

      {/* Floating Command Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl">
        <div className="bg-surface-container-highest/90 backdrop-blur-xl border border-primary/30 px-6 py-3.5 rounded-2xl flex items-center gap-4 shadow-2xl">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <input 
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-on-surface" 
            placeholder="Ask AI to edit this draft (e.g. 'Make it shorter')..." 
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommandSubmit}
            disabled={isGenerating || !draft}
          />
          <div className="flex items-center gap-1">
            <kbd className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-label-sm text-on-surface-variant border border-outline-variant">Enter</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
