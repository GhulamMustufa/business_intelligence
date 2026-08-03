'use client';

import React, { useState } from 'react';
import BillingTab from './BillingTab';

interface SettingsLayoutProps {
  billing: any;
}

export default function SettingsLayout({ billing }: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState('billing');

  return (
    <div className="flex flex-col h-full bg-surface overflow-hidden relative">
      <header className="h-20 border-b border-outline-variant flex items-center justify-between px-8 bg-surface">
        <div className="flex flex-col">
          <h1 className="font-headline-md text-xl text-on-surface">Settings</h1>
          <p className="text-sm text-on-surface-variant">Manage your account and preferences.</p>
        </div>
      </header>

        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto flex gap-12">
            
            {/* Settings Tabs Sidebar */}
            <nav className="w-64 flex flex-col gap-1 sticky top-0 shrink-0">
              <button 
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'text-primary-container bg-primary-container/10 font-medium border border-primary-container/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="material-symbols-outlined">person</span>
                <span className="font-body-md">Profile</span>
              </button>
              
              <button 
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'workspace' ? 'text-primary-container bg-primary-container/10 font-medium border border-primary-container/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('workspace')}
              >
                <span className="material-symbols-outlined">business</span>
                <span className="font-body-md">Workspace</span>
              </button>
              
              <button 
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'billing' ? 'text-primary-container bg-primary-container/10 font-medium border border-primary-container/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('billing')}
              >
                <span className="material-symbols-outlined">payments</span>
                <span className="font-body-md">Billing & Credits</span>
              </button>
              
              <button 
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'api' ? 'text-primary-container bg-primary-container/10 font-medium border border-primary-container/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('api')}
              >
                <span className="material-symbols-outlined">key</span>
                <span className="font-body-md">API Keys</span>
              </button>
              
              <button 
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'preferences' ? 'text-primary-container bg-primary-container/10 font-medium border border-primary-container/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('preferences')}
              >
                <span className="material-symbols-outlined">tune</span>
                <span className="font-body-md">Preferences</span>
              </button>
              
              <button 
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'theme' ? 'text-primary-container bg-primary-container/10 font-medium border border-primary-container/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                onClick={() => setActiveTab('theme')}
              >
                <span className="material-symbols-outlined">palette</span>
                <span className="font-body-md">Theme</span>
              </button>
            </nav>

            {/* Main Settings Content */}
            <div className="flex-grow min-w-0">
              {activeTab === 'billing' ? (
                <BillingTab billing={billing} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-50 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] mb-4">construction</span>
                  <p>This settings tab is not yet implemented.</p>
                </div>
              )}
            </div>

        </div>
      </div>
    </div>
  );
}
