'use client';

import React from 'react';

interface ProspectsSidebarProps {
  folders: any[];
  activeFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onCreateFolder: () => void;
}

export default function ProspectsSidebar({ folders, activeFolderId, onSelectFolder, onCreateFolder }: ProspectsSidebarProps) {
  return (
    <aside className="w-64 border-r border-outline-variant flex flex-col p-6 gap-8 bg-surface-container-low/30 overflow-y-auto">
      <section>
        <h3 className="font-label-sm text-on-surface-variant/60 mb-3 uppercase tracking-widest">BROWSE</h3>
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => onSelectFolder(null)}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${!activeFolderId ? 'bg-primary-container/10 text-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-[20px]">all_inbox</span>
            <span className="text-sm">All Leads</span>
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">history</span>
            <span className="text-sm">Recently Added</span>
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">delete</span>
            <span className="text-sm">Trash</span>
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-label-sm text-on-surface-variant/60 uppercase tracking-widest">FOLDERS</h3>
          <button onClick={onCreateFolder} className="material-symbols-outlined text-sm opacity-40 hover:opacity-100 text-on-surface-variant">add</button>
        </div>
        <div className="flex flex-col gap-1">
          {folders.map(folder => (
            <button 
              key={folder.id} 
              onClick={() => onSelectFolder(folder.id)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${activeFolderId === folder.id ? 'bg-primary-container/10 text-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              <span className={`material-symbols-outlined text-[20px] ${activeFolderId === folder.id ? 'text-primary-container' : 'text-tertiary'}`}>folder</span>
              <span className="text-sm truncate">{folder.name}</span>
            </button>
          ))}
          {folders.length === 0 && (
             <p className="text-xs text-on-surface-variant/50 px-3 py-2">No folders yet</p>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-label-sm text-on-surface-variant/60 uppercase tracking-widest">TAGS</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 bg-green-500/10 text-green-400 text-[10px] font-label-sm rounded-full border border-green-500/20 cursor-pointer hover:bg-green-500/20">HIGH INTENT</span>
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-label-sm rounded-full border border-blue-500/20 cursor-pointer hover:bg-blue-500/20">DECISION MAKER</span>
          <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-label-sm rounded-full border border-orange-500/20 cursor-pointer hover:bg-orange-500/20">FOLLOW-UP</span>
        </div>
      </section>
    </aside>
  );
}
