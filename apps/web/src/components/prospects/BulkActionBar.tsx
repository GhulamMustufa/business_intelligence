'use client';

import React, { useState } from 'react';
import { getToken } from "@/app/actions/auth";
import { bulkMoveLeads } from '@/lib/api/saved-leads.client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface BulkActionBarProps {
  count: number;
  selectedIds: string[];
  folders: any[];
  onClearSelection: () => void;
}

export default function BulkActionBar({ count, selectedIds, folders, onClearSelection }: BulkActionBarProps) {
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  
  const router = useRouter();

  const handleMove = async (folderId: string | null) => {
    try {
      const token = await getToken();
      await bulkMoveLeads(selectedIds, folderId, token!);
      onClearSelection();
      router.refresh();
      setShowFolderMenu(false);
    } catch (e) {
      console.error('Failed to move leads', e);
      toast.error('Failed to move leads');
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-highest border border-primary-container shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 z-50 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
          {count}
        </div>
        <span className="font-semibold text-on-surface">Leads Selected</span>
      </div>
      
      <div className="w-px h-8 bg-outline-variant"></div>
      
      <div className="flex items-center gap-2 relative">
        <button 
          onClick={() => setShowFolderMenu(!showFolderMenu)}
          className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-xl transition-colors border border-outline-variant text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">folder_open</span>
          Move
        </button>
        
        {showFolderMenu && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-surface-container-highest border border-outline-variant shadow-xl rounded-xl py-2 z-50">
            <div className="px-3 pb-2 mb-2 border-b border-outline-variant/50 text-[10px] font-label-sm text-on-surface-variant/70 uppercase tracking-widest">
              Move to Folder
            </div>
            <button 
              onClick={() => handleMove(null)}
              className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">inbox</span>
              Remove from folder
            </button>
            {folders.map(f => (
              <button 
                key={f.id}
                onClick={() => handleMove(f.id)}
                className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">folder</span>
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </div>
        )}

        <button className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-xl transition-colors border border-outline-variant text-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">sell</span>
          Tags
        </button>
        <button className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-xl transition-colors border border-outline-variant text-sm font-semibold text-error">
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Delete
        </button>
      </div>
      
      <div className="w-px h-8 bg-outline-variant"></div>
      
      <button onClick={onClearSelection} className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">
        close
      </button>
    </div>
  );
}
