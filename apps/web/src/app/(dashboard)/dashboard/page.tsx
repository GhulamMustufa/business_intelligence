import { getDashboardMetrics } from "@/lib/api/dashboard.server";
import { Users, FolderOpen, Mail, Zap, Search, Building2, ChevronRight, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  let metrics = null;
  let error = null;

  try {
    metrics = await getDashboardMetrics();
  } catch (err: any) {
    error = err.message || "Failed to load dashboard metrics";
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <h1 className="font-headline-lg text-headline-lg text-white">Dashboard</h1>
        <div className="bg-error/10 text-error p-4 rounded-lg border border-error/20">
          {error}
        </div>
      </div>
    );
  }

  const { totalSavedLeads, totalPitches, totalFolders, creditsRemaining, recentSearches, recentLeads } = metrics!;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12 w-full">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-white tracking-tight">Command Center</h1>
        <p className="text-on-surface-variant font-body-lg text-body-lg mt-2">Welcome back. Here is an overview of your lead generation pipeline.</p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-surface/50 border border-outline/30 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-on-surface-variant font-body-sm text-body-sm mb-1 uppercase tracking-wider font-semibold">Total Prospects</h3>
            <p className="text-white font-headline-lg text-4xl">{totalSavedLeads}</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface/50 border border-outline/30 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-secondary/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-secondary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
              <Mail size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-on-surface-variant font-body-sm text-body-sm mb-1 uppercase tracking-wider font-semibold">AI Pitches Crafted</h3>
            <p className="text-white font-headline-lg text-4xl">{totalPitches}</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface/50 border border-outline/30 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-tertiary/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-tertiary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-tertiary/10 text-tertiary rounded-lg">
              <FolderOpen size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-on-surface-variant font-body-sm text-body-sm mb-1 uppercase tracking-wider font-semibold">Active Folders</h3>
            <p className="text-white font-headline-lg text-4xl">{totalFolders}</p>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-surface/50 border border-outline/30 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group hover:border-yellow-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-yellow-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
              <Zap size={20} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-on-surface-variant font-body-sm text-body-sm mb-1 uppercase tracking-wider font-semibold">Credits Remaining</h3>
            <p className="text-white font-headline-lg text-4xl">{creditsRemaining}</p>
          </div>
        </div>
      </div>

      {/* Middle Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        
        {/* Recent Searches */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-title-lg text-title-lg flex items-center gap-2">
              <Search size={20} className="text-primary" /> Recent Searches
            </h2>
            <Link href="/discovery" className="text-primary hover:text-primary-hover text-sm font-medium flex items-center">
              New Search <ChevronRight size={16} />
            </Link>
          </div>
          <div className="bg-surface border border-outline rounded-2xl overflow-hidden shadow-lg">
            {recentSearches.length > 0 ? (
              <div className="divide-y divide-outline">
                {recentSearches.map((search) => (
                  <Link 
                    key={search.id} 
                    href="/discovery" // In a real app, passing the search ID to hydrate state
                    className="flex items-center justify-between p-4 hover:bg-surface-hover transition-colors group"
                  >
                    <div className="flex flex-col">
                      <span className="text-white font-medium group-hover:text-primary transition-colors">{search.name}</span>
                      <span className="text-on-surface-variant text-xs mt-1 flex items-center gap-1">
                        <Clock size={12} /> {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-outline group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center text-on-surface-variant">
                <Search size={32} className="mb-3 opacity-20" />
                <p>No recent searches.</p>
                <Link href="/discovery" className="mt-4 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/20 transition-colors">
                  Start Discovering
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Prospects */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-title-lg text-title-lg flex items-center gap-2">
              <Building2 size={20} className="text-secondary" /> Recent Prospects
            </h2>
            <Link href="/prospects" className="text-secondary hover:text-secondary-hover text-sm font-medium flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="bg-surface border border-outline rounded-2xl overflow-hidden shadow-lg">
            {recentLeads.length > 0 ? (
              <div className="divide-y divide-outline">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-4 hover:bg-surface-hover transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-white font-bold border border-outline group-hover:border-secondary transition-colors">
                        {lead.company?.name?.substring(0, 1) || 'C'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{lead.company?.name || 'Unknown Company'}</span>
                        <span className="text-on-surface-variant text-xs mt-0.5">{lead.company?.industry || 'Unknown Industry'}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/intelligence?companyId=${lead.company?.id}`}
                      className="px-3 py-1.5 bg-surface-variant hover:bg-secondary/20 hover:text-secondary text-white text-xs font-medium rounded border border-outline hover:border-secondary/50 transition-colors"
                    >
                      Analyze
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center text-on-surface-variant">
                <Building2 size={32} className="mb-3 opacity-20" />
                <p>No prospects saved yet.</p>
                <Link href="/discovery" className="mt-4 bg-secondary/10 text-secondary px-4 py-2 rounded-lg text-sm hover:bg-secondary/20 transition-colors flex items-center gap-2">
                  <Plus size={16} /> Add Prospect
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
