'use client';

import { useState } from 'react';
import ProspectsSidebar from './ProspectsSidebar';
import ProspectCard from './ProspectCard';
import BulkActionBar from './BulkActionBar';
import { useRouter, useSearchParams } from 'next/navigation';
import { getToken } from "@/app/actions/auth";
import { createFolder } from '@/lib/api/folders.client';
import { exportLeads } from '@/lib/api/saved-leads.client';
import toast from 'react-hot-toast';

interface ProspectsLayoutProps {
  initialLeads: any[];
  totalLeads: number;
  initialFolders: any[];
}

export default function ProspectsLayout({ initialLeads, totalLeads, initialFolders }: ProspectsLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  
  const [leads] = useState(initialLeads);
  const [folders, setFolders] = useState(initialFolders);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  
  const activeFolderId = searchParams.get('folderId');

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Enter new folder name:');
    if (!name) return;
    try {
      const token = await getToken();
      const newFolder = await createFolder(name, token!);
      setFolders(prev => [newFolder, ...prev]);
    } catch (e) {
      console.error(e);
      toast.error('Failed to create folder');
    }
  };

  const handleFolderSelect = (folderId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (folderId) {
      params.set('folderId', folderId);
    } else {
      params.delete('folderId');
    }
    router.push(`/prospects?${params.toString()}`);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const token = await getToken();
      const params = new URLSearchParams(searchParams.toString());
      await exportLeads(params, token!);
    } catch (e) {
      console.error(e);
      toast.error('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-grow flex h-full bg-surface overflow-hidden">
      {/* Sub-Sidebar */}
      <ProspectsSidebar 
        folders={folders} 
        activeFolderId={activeFolderId}
        onSelectFolder={handleFolderSelect}
        onCreateFolder={handleCreateFolder}
      />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-full bg-surface overflow-hidden relative">
        {/* Context Header */}
        <div className="p-8 border-b border-outline-variant space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-lg text-on-surface">Saved Leads</h2>
              <p className="text-sm text-on-surface-variant">
                Manage and organize <span className="text-primary-container font-bold">{totalLeads}</span> high-potential leads across active campaigns.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex border border-outline-variant rounded-xl p-1 bg-surface-container-low">
                <button className="p-1.5 px-3 rounded-lg bg-surface-container-highest shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                </button>
                <button className="p-1.5 px-3 rounded-lg text-on-surface-variant hover:text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">table_rows</span>
                </button>
              </div>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                )}
                {isExporting ? 'Exporting...' : 'Export All'}
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-grow group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="w-full bg-surface-container border border-outline-variant rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary-container outline-none transition-all placeholder:text-on-surface-variant/50 text-on-surface" 
                placeholder="Filter by name, company, or industry..." 
                type="text" 
              />
            </div>
            <div className="flex items-center gap-2 border border-outline-variant bg-surface-container rounded-xl px-4 py-2.5 cursor-pointer hover:border-primary-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">sort</span>
              <span className="text-sm">Sort: <span className="font-semibold">Date Added</span></span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </div>
            <button className="border border-outline-variant bg-surface-container rounded-xl p-2.5 hover:border-primary-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>

          {/* Bulk Action Bar */}
          {selectedIds.size > 0 && (
            <BulkActionBar 
              count={selectedIds.size} 
              selectedIds={Array.from(selectedIds)}
              folders={folders}
              onClearSelection={() => setSelectedIds(new Set())}
            />
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <ProspectCard 
                key={lead.id} 
                lead={lead} 
                isSelected={selectedIds.has(lead.id)}
                onToggle={() => handleSelect(lead.id)}
              />
            ))}
          </div>
          
          {leads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <span className="material-symbols-outlined text-[48px] mb-4">folder_open</span>
              <p>No saved leads found.</p>
            </div>
          )}

          {/* Pagination */}
          {leads.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-4 mb-20">
              <button className="bg-surface-container-highest hover:bg-surface-container-high text-on-surface px-12 py-3 rounded-full font-semibold transition-all border border-outline-variant active:scale-[0.98]">
                Load 50 More
              </button>
              <p className="text-[10px] font-label-sm text-on-surface-variant/50 uppercase tracking-widest">
                SHOWING {leads.length} OF {totalLeads} LEADS
              </p>
            </div>
          )}
        </div>

        {/* AI Command Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-surface-container-highest border border-primary-container/30 rounded-full px-5 py-2.5 shadow-[0_0_15px_2px_rgba(189,194,255,0.08)] transition-all hover:scale-[1.02] cursor-pointer group backdrop-blur-xl">
          <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span className="text-sm font-semibold text-on-surface">Ask LeadForge AI to find more leads like these...</span>
          <div className="flex items-center gap-1 ml-4 bg-white/10 px-2.5 py-1 rounded-lg text-[10px] font-label-sm text-white/60">
            <span>⌘</span><span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
}
