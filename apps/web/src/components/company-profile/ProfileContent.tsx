'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ProfileContentProps {
  company: any; // Ideally typed to Company with relations
}

export default function ProfileContent({ company }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'notes' | 'history'>('summary');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!company) {
    return <div className="p-8 text-on-surface">Company not found.</div>;
  }

  const { insights, techStack, decisionMakers, news, notes, scoreMetrics } = company;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-4 md:px-8">
      <div className="pt-8 pb-32 min-h-screen">
      {/* HEADER / QUICK ACTIONS */}
      <div className="flex justify-between items-start mb-10">
        <div className="flex gap-6 items-center">
          <div className="w-20 h-20 bg-surface-container-highest flex items-center justify-center rounded-xl border border-outline-variant p-2 overflow-hidden relative">
            {company.logoUrl ? (
              <Image src={company.logoUrl} alt={company.name} fill className="object-contain p-2" unoptimized />
            ) : (
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">business</span>
            )}
          </div>
          <div>
            <h2 className="font-headline-lg text-on-surface">{company.name}</h2>
            <div className="flex gap-4 items-center mt-2">
              <span className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-label-sm uppercase tracking-wider rounded border border-outline-variant">
                {company.industry}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {company.location}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">public</span>
                {company.website}
              </span>
              {company.phone && (
                <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  {company.phone}
                </span>
              )}
              {company.linkedInUrl && (
                <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">work</span>
                  <a href={company.linkedInUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast.success('Report exported to PDF!')} className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all text-sm font-label-sm">
            <span className="material-symbols-outlined text-[18px]">ios_share</span> Export Report
          </button>
          <button onClick={() => toast.success('Company saved to your leads!')} className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all text-sm font-label-sm">
            <span className="material-symbols-outlined text-[18px]">bookmark</span> Save
          </button>
          <button onClick={() => toast.success('Running intelligence analysis...')} className="flex items-center gap-2 px-5 py-2 bg-primary-container text-on-primary-container rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm font-label-sm">
            <span className="material-symbols-outlined text-[18px]">analytics</span> Run Intelligence
          </button>
        </div>
      </div>

      {/* BENTO GRID CONTENT */}
      <div className="grid grid-cols-12 gap-6">

        {/* AI OPPORTUNITY PANEL */}
        <div className="col-span-12 bg-surface-container-low border border-primary-container/30 rounded-2xl p-8 relative overflow-hidden shadow-lg ai-glow">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[150px] text-primary-container">psychology</span>
          </div>
          
          <div className="flex items-start justify-between relative z-10 mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary-container mb-2">
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <h3 className="font-headline-md text-xl">AI Opportunity Assessment</h3>
              </div>
              <p className="text-sm text-on-surface-variant max-w-2xl">
                Real-time analysis of {company.name}'s digital presence, AI readiness, and likelihood to need professional services.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-surface-container-high px-5 py-3 rounded-xl border border-outline-variant">
              <div className="flex flex-col items-end border-r border-outline-variant pr-4">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Opportunity Score</span>
                <span className="text-2xl font-headline-lg text-primary-container">{company.baseScore}/100</span>
              </div>
              <div className="flex flex-col items-start pl-2">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Priority</span>
                <span className="px-2.5 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold uppercase tracking-wider border border-green-500/30">
                  {company.matchLabel || 'High Priority'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 relative z-10 mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Growth Score</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary-container">trending_up</span>
                <span className="text-sm text-on-surface">{insights?.growthScore || 'N/A'}/100</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Digital Maturity</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary-container">devices</span>
                <span className="text-sm text-on-surface">{insights?.companyMaturity || 'N/A'}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">AI Readiness</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary-container">memory</span>
                <span className="text-sm text-on-surface">{insights?.aiReadiness || 'N/A'}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Service Need</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary-container">support_agent</span>
                <span className="text-sm text-on-surface">{insights?.likelihoodToNeedServices || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant">
              <span className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-widest mb-2">
                <span className="material-symbols-outlined text-[14px] text-primary-container">lightbulb</span> Suggested Sales Angle
              </span>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {insights?.suggestedSalesAngle || 'N/A'}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant">
              <span className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase tracking-widest mb-2">
                <span className="material-symbols-outlined text-[14px] text-primary-container">send</span> Recommended Outreach
              </span>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {insights?.recommendedOutreach || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* DIGITAL PRESENCE & KEY METRICS */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6">
          <div className="p-6 bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary-container">public</span>
              <p className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Digital Presence</p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">Google Rating</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-on-surface">{company.googleRating || 'N/A'}</span>
                  {company.googleRating && <span className="material-symbols-outlined text-[14px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">Website Quality</span>
                <span className="text-sm text-on-surface">{company.websiteQuality || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">Social Presence</span>
                <span className="text-sm text-on-surface">{company.socialPresence || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-rows-2 gap-6">
            <div className="p-6 bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col justify-between">
              <p className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant mb-4 font-bold">Known Services</p>
              <div className="flex flex-wrap gap-2">
                {company.services && Array.isArray(company.services) ? company.services.map((svc: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-surface-container-high text-on-surface text-xs rounded border border-outline-variant">
                    {svc}
                  </span>
                )) : <span className="text-sm text-on-surface-variant">N/A</span>}
              </div>
            </div>
            <div className="p-6 bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col justify-between">
              <p className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant mb-4 font-bold">Enterprise Metrics</p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-on-surface-variant">Revenue</span>
                  <span className="text-sm text-primary-container font-bold">{company.annualRevenue || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-on-surface-variant">Headcount</span>
                  <span className="text-sm text-primary-container font-bold">{company.headcount || `${company.employeeSizeMin}-${company.employeeSizeMax}`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI ANALYSIS */}
        <div className="col-span-12 lg:col-span-4 bg-primary-container/10 border border-primary-container/20 rounded-2xl p-6 shadow-[0_0_15px_2px_rgba(129,140,248,0.08)] relative overflow-hidden">
          <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[120px] text-primary-container">auto_awesome</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary-container">psychology</span>
            <h3 className="font-headline-md text-lg text-primary-container">AI Analysis</h3>
          </div>
          <div className="space-y-6 relative z-10">
            {insights?.criticalPainPoints && Array.isArray(insights.criticalPainPoints) && insights.criticalPainPoints.length > 0 && (
              <div>
                <p className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">CRITICAL PAIN POINTS</p>
                <ul className="space-y-3">
                  {insights.criticalPainPoints.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-error mt-0.5 text-[18px]">warning</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {insights?.buyingSignals && Array.isArray(insights.buyingSignals) && insights.buyingSignals.length > 0 && (
              <div>
                <p className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">BUYING SIGNALS</p>
                <div className="flex flex-wrap gap-2">
                  {insights.buyingSignals.map((signal: any, idx: number) => (
                    <span key={idx} className="px-2.5 py-1.5 bg-primary-container/20 text-primary-container rounded-lg text-xs flex items-center gap-1.5 border border-primary-container/20">
                      <span className="material-symbols-outlined text-[14px]">{signal.icon}</span>
                      {signal.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {insights?.digitalWeaknesses && Array.isArray(insights.digitalWeaknesses) && insights.digitalWeaknesses.length > 0 && (
              <div>
                <p className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 mt-4">DIGITAL WEAKNESSES</p>
                <ul className="space-y-3">
                  {insights.digitalWeaknesses.map((weakness: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-orange-400 mt-0.5 text-[18px]">gpp_bad</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights?.companyMaturity && (
              <div className="mt-4">
                <p className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">ESTIMATED MATURITY</p>
                <span className="px-3 py-1.5 bg-surface-container-high border border-outline-variant rounded-lg text-sm font-medium text-on-surface inline-block">
                  {insights.companyMaturity}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* TECH STACK */}
        <div className="col-span-12 lg:col-span-3 bg-surface-container border border-outline-variant rounded-2xl p-6">
          <h3 className="font-headline-md text-lg text-on-surface mb-6">Technology Stack</h3>
          <div className="space-y-4">
            {techStack?.map((tech: any) => (
              <div key={tech.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center border border-outline-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary-container">{tech.icon}</span>
                  </div>
                  <span className="text-sm">{tech.name}</span>
                </div>
                <span className={`font-label-sm text-[10px] px-2 py-0.5 rounded border ${
                  tech.status.toLowerCase() === 'competitor' 
                    ? 'text-error bg-error-container/20 border-error-container/20' 
                    : 'text-on-surface-variant bg-surface-container-high border-outline-variant'
                }`}>
                  {tech.status}
                </span>
              </div>
            ))}
            {(!techStack || techStack.length === 0) && (
              <p className="text-on-surface-variant text-sm">No tech stack data available.</p>
            )}
          </div>
          {techStack && techStack.length > 0 && (
            <button onClick={() => toast('Showing all tools...', { icon: '🔧' })} className="w-full mt-8 py-2.5 text-primary-container font-label-sm border border-primary-container/20 rounded-xl hover:bg-primary-container/5 transition-all text-xs">
              View All Tools
            </button>
          )}
        </div>

        {/* DECISION MAKERS */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container border border-outline-variant rounded-2xl p-6">
          <h3 className="font-headline-md text-lg text-on-surface mb-6">Decision Makers</h3>
          <div className="space-y-3">
            {decisionMakers?.map((dm: any) => (
              <div key={dm.id} className="flex items-center justify-between p-3 hover:bg-surface-container-high rounded-xl transition-all border border-transparent hover:border-outline-variant group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant relative">
                    {dm.photoUrl ? (
                      <Image src={dm.photoUrl} alt={dm.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-primary-container/20" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{dm.name}</p>
                    <p className="text-xs text-on-surface-variant">{dm.title}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toast.success('Opening mail client...')} className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-primary-container hover:text-on-primary-container transition-all">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                  </button>
                  <button onClick={() => toast('Opening LinkedIn profile...', { icon: '🔗' })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-primary-container hover:text-on-primary-container transition-all">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                  </button>
                </div>
              </div>
            ))}
            {(!decisionMakers || decisionMakers.length === 0) && (
              <p className="text-on-surface-variant text-sm">No decision makers found.</p>
            )}
          </div>
        </div>

        {/* RECENT NEWS */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container border border-outline-variant rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-lg text-on-surface">Recent News</h3>
            <span className="material-symbols-outlined text-primary-container">feed</span>
          </div>
          <div className="space-y-6">
            {news?.map((item: any, idx: number) => (
              <div key={item.id} className={`border-l-2 pl-4 pb-1 ${idx === 0 ? 'border-primary-container' : 'border-outline-variant'}`}>
                <p className="font-label-sm text-[10px] text-on-surface-variant mb-1.5 uppercase tracking-wider">{item.dateLabel}</p>
                <h4 className="text-sm font-bold mb-1 hover:text-primary-container transition-colors cursor-pointer">{item.title}</h4>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{item.summary}</p>
              </div>
            ))}
            {(!news || news.length === 0) && (
              <p className="text-on-surface-variant text-sm">No recent news.</p>
            )}
          </div>
        </div>

        {/* BUSINESS SUMMARY & NOTES */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container border border-outline-variant rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
          <div className="border-b border-outline-variant flex bg-surface-container-high/30">
            <button 
              onClick={() => setActiveTab('summary')}
              className={`px-8 py-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'summary' ? 'border-primary-container bg-surface-container-high/50 text-on-surface' : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Summary
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`px-8 py-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'notes' ? 'border-primary-container bg-surface-container-high/50 text-on-surface' : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Internal Notes ({notes?.length || 0})
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-8 py-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'history' ? 'border-primary-container bg-surface-container-high/50 text-on-surface' : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Engagement History
            </button>
          </div>
          <div className="p-8 flex-1">
            {activeTab === 'summary' && (
              <div className="prose prose-sm prose-invert max-w-none text-sm text-on-surface/80 leading-relaxed space-y-4">
                <p>{insights?.whyMatch || 'No summary available.'}</p>
                {insights?.outreachStrategy && (
                  <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant italic border-l-4 border-l-primary-container mt-6">
                    "{insights.outreachStrategy}"
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div className="space-y-4">
                {notes?.map((note: any) => (
                  <div key={note.id} className="bg-primary-container/5 p-5 border-l-4 border-primary-container rounded-r-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-primary-container">{note.authorName}</span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface/90">{note.content}</p>
                  </div>
                ))}
                {(!notes || notes.length === 0) && (
                  <p className="text-on-surface-variant text-sm">No internal notes yet.</p>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <p className="text-on-surface-variant text-sm">No engagement history recorded.</p>
            )}
          </div>
        </div>

        {/* ADJACENT OPPORTUNITIES (ASIDE) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container border border-outline-variant rounded-2xl p-6">
            <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-6">Opportunity Score</h3>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-5xl font-bold text-primary-container leading-none">{company.baseScore}</span>
              <span className="text-sm text-on-surface-variant">/ 100</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 mb-8 overflow-hidden">
              <div className="bg-primary-container h-full rounded-full transition-all duration-1000" style={{ width: `${company.baseScore}%` }}></div>
            </div>
            <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-4 mt-6">Reason:</h3>
            <ul className="space-y-3 text-sm">
              {insights?.buyingSignals && Array.isArray(insights.buyingSignals) && insights.buyingSignals.length > 0 ? (
                insights.buyingSignals.map((signal: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-400 text-[18px]">check</span>
                    <span className="text-on-surface-variant leading-snug">{signal.title}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-400 text-[18px]">check</span>
                    <span className="text-on-surface-variant leading-snug">Active website</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-400 text-[18px]">check</span>
                    <span className="text-on-surface-variant leading-snug">Modern tech stack</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-400 text-[18px]">check</span>
                    <span className="text-on-surface-variant leading-snug">Growing business</span>
                  </li>
                </>
              )}
            </ul>

            <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 mt-8">Recommendation:</h3>
            <div className="inline-block px-3 py-1.5 bg-primary-container/20 text-primary-container border border-primary-container/30 rounded-lg text-sm font-bold">
              {company.matchLabel || 'High Priority'}
            </div>
          </div>

          {/* QUICK ACTIONS CARD */}
          <div className="bg-primary-container p-6 rounded-2xl text-on-primary-container shadow-xl shadow-[0_0_15px_2px_rgba(129,140,248,0.08)]">
            <h4 className="font-headline-md text-lg mb-2">Next Recommended Step</h4>
            <p className="text-sm mb-8 opacity-90 leading-relaxed">
              {insights?.outreachStrategy || 'No recommendations available.'}
            </p>
            <button onClick={() => toast.success('Generating personalized email draft...')} className="w-full py-3.5 bg-on-primary-container text-primary-container font-bold rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              Generate Personalized Email
              <span className="material-symbols-outlined text-[20px]">magic_button</span>
            </button>
          </div>
        </div>

      </div>

      {/* AI COMMAND BAR (Global Action) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
        <div className="bg-surface-container/70 backdrop-blur-xl border border-primary-container/30 rounded-2xl flex items-center px-6 py-3.5 shadow-2xl shadow-[0_0_15px_2px_rgba(129,140,248,0.08)]">
          <span className="material-symbols-outlined text-primary-container mr-4">terminal</span>
          <input 
            ref={searchInputRef}
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant/70 outline-none text-on-surface" 
            placeholder="Ask AI to summarize this account or draft an outreach..." 
            type="text" 
          />
          <div className="flex items-center gap-4 ml-4">
            <span className="px-2 py-1 bg-surface-container-high rounded border border-outline-variant text-[10px] text-on-surface font-label-sm uppercase tracking-wider">CMD + K</span>
            <span onClick={() => toast.success('Command sent to AI!')} className="material-symbols-outlined text-primary-container cursor-pointer hover:scale-110 transition-transform">send</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
