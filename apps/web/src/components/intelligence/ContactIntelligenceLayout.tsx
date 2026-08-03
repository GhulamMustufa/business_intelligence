'use client';

import { useState, useEffect } from 'react';
import ContactsTable from './ContactsTable';
import ContactDetailPane from './ContactDetailPane';
import { getToken } from "@/app/actions/auth";
import toast from 'react-hot-toast';

interface ContactIntelligenceLayoutProps {
  initialContacts: any[];
}

export default function ContactIntelligenceLayout({ initialContacts }: ContactIntelligenceLayoutProps) {
  
  const [contacts, setContacts] = useState(initialContacts);
  const [activeContactId, setActiveContactId] = useState<string | null>(
    initialContacts.length > 0 ? initialContacts[0].id : null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setContacts(initialContacts);
    if (initialContacts.length > 0 && !activeContactId) {
      setActiveContactId(initialContacts[0].id);
    }
  }, [initialContacts]);

  const activeContact = contacts.find(c => c.id === activeContactId);

  const handleGenerateInsights = async () => {
    if (!activeContactId) return;
    
    setIsGenerating(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/decision-makers/${activeContactId}/insights/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const updatedContact = await response.json();
        setContacts(contacts.map(c => c.id === updatedContact.id ? { ...c, ...updatedContact } : c));
      } else {
        toast.error('Failed to generate insights');
      }
    } catch (error) {
      console.error('Failed to generate insights', error);
      toast.error('Error generating insights');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Table Section */}
      <section className="flex-1 flex flex-col overflow-hidden">
        {/* Table Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-outline-variant/10">
          <div>
            <h2 className="font-headline-md text-on-surface">Contact Intelligence</h2>
            <p className="text-body-sm text-on-surface-variant opacity-70">Analyze and engage high-propensity targets from your prospect pool.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2 cursor-pointer hover:border-primary transition-all">
              <span className="material-symbols-outlined text-[20px] mr-2">filter_list</span>
              <span className="font-label-sm">Filters</span>
            </div>
            <button className="bg-primary hover:opacity-90 text-on-primary-container font-label-sm px-5 py-2.5 flex items-center gap-2 rounded-xl transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              Bulk Export
            </button>
          </div>
        </div>
        
        {/* Table Body */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <ContactsTable 
            contacts={contacts} 
            activeContactId={activeContactId} 
            onSelectContact={setActiveContactId} 
          />
        </div>
      </section>

      {/* Right Detail Pane */}
      {activeContact && (
        <ContactDetailPane 
          contact={activeContact} 
          isGenerating={isGenerating}
          onGenerate={handleGenerateInsights}
        />
      )}

      {/* AI Command Bar (Shortcut Indicator) */}
      <div className="fixed bottom-8 left-[calc(50%+120px)] -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-surface-container-highest/90 backdrop-blur border border-primary/40 px-6 py-3 rounded-full flex items-center gap-5 shadow-[0_0_15px_rgba(129,140,248,0.1)]">
          <span className="material-symbols-outlined text-primary">bolt</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-on-surface-variant">Press</span>
            <div className="flex gap-1.5">
              <kbd className="px-2 py-1 rounded bg-surface-container border border-outline-variant/50 text-[10px] font-code text-on-surface">CMD</kbd>
              <span className="text-on-surface-variant font-bold">+</span>
              <kbd className="px-2 py-1 rounded bg-surface-container border border-outline-variant/50 text-[10px] font-code text-on-surface">K</kbd>
            </div>
            <span className="text-sm text-on-surface-variant">for Quick Actions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
