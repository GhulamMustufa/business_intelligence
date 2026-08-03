import React from 'react';

export default function DiscoveryLoading() {
  // We'll create a shimmer effect for the layout (sidebar + main pane)
  return (
    <div className="w-full h-full flex overflow-hidden bg-background">
      {/* Sidebar Shimmer */}
      <div className="w-full xl:w-[400px] border-r border-outline-variant bg-surface flex flex-col hidden xl:flex">
        <div className="p-6 border-b border-outline-variant">
          <div className="h-8 bg-surface-container-high rounded animate-pulse w-3/4 mb-4"></div>
          <div className="h-10 bg-surface-container rounded-xl animate-pulse w-full"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-surface-container rounded-xl animate-pulse w-full"></div>
          ))}
        </div>
      </div>

      {/* Main Results Pane Shimmer */}
      <section className="w-full xl:flex-1 flex flex-col bg-surface overflow-hidden">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between border-b border-outline-variant bg-surface">
          <div className="h-8 bg-surface-container-high rounded animate-pulse w-32"></div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-surface-container-high rounded-xl animate-pulse"></div>
            <div className="h-10 w-24 bg-primary-container rounded-xl animate-pulse opacity-50"></div>
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-8 space-y-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-40 bg-surface-container rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </section>
    </div>
  );
}
