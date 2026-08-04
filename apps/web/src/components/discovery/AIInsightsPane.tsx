'use client';

interface AIInsightsPaneProps {
  insights: any;
  isLoading: boolean;
  isGenerating?: boolean;
  onGenerate?: () => void;
}

export default function AIInsightsPane({ insights, isLoading, isGenerating, onGenerate }: AIInsightsPaneProps) {
  if (isLoading) {
    return (
      <section className="w-full xl:w-[320px] flex-shrink-0 flex flex-col bg-surface-container border-t xl:border-t-0 xl:border-l border-outline-variant p-4 xl:p-8 h-auto xl:h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center animate-pulse" />
          <div className="h-6 w-32 bg-surface-container-highest rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-surface-container-highest rounded animate-pulse" />
          <div className="h-32 bg-surface-container-highest rounded animate-pulse" />
          <div className="h-24 bg-surface-container-highest rounded animate-pulse" />
        </div>
      </section>
    );
  }

  if (!insights) {
    return (
      <section className="w-full xl:w-[320px] flex-shrink-0 flex flex-col bg-surface-container border-t xl:border-t-0 xl:border-l border-outline-variant p-4 xl:p-8 h-auto xl:h-full items-center justify-center text-center py-12 xl:py-8">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 opacity-50">auto_awesome</span>
        <h3 className="font-headline-md text-base text-on-surface mb-2">No Insights Yet</h3>
        <p className="font-body-md text-sm text-on-surface-variant mb-6">Generate AI match insights, buying signals, and personalized outreach strategies for this prospect.</p>
        
        {onGenerate && (
          <button 
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={`material-symbols-outlined text-[18px] ${isGenerating ? 'animate-spin' : ''}`}>
              {isGenerating ? 'progress_activity' : 'magic_button'}
            </span>
            {isGenerating ? 'Generating...' : 'Generate Insights'}
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="w-full xl:w-[320px] flex-shrink-0 flex flex-col bg-surface-container border-t xl:border-t-0 xl:border-l border-outline-variant p-4 xl:p-8 h-auto xl:h-full overflow-visible xl:overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary-container" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        <h3 className="font-headline-md text-base text-on-surface">AI Match Insights</h3>
      </div>

      <div className="space-y-10">
        {/* Why this match? */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest">Why this match?</h4>
            <div className="h-px flex-1 bg-primary-container/20 ml-4"></div>
          </div>
          <div className="bg-primary-container/5 p-4 rounded-xl border border-primary-container/10">
            <p className="font-body-md text-sm text-on-surface leading-relaxed">
              {insights.whyMatch}
            </p>
          </div>
        </div>

        {/* AI Opportunity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">AI Opportunity</h4>
            <div className="h-px flex-1 bg-outline-variant/30 ml-4"></div>
          </div>

          <div className="p-5 rounded-xl border border-outline-variant bg-surface-container-low space-y-6">
            
            {/* Website Score */}
            <div className="flex items-center justify-between">
              <span className="font-body-md text-sm font-bold text-on-surface">Website Score:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className={`h-full ${insights.websiteScore > 50 ? 'bg-tertiary' : 'bg-error'}`} style={{ width: `${insights.websiteScore || 0}%` }}></div>
                </div>
                <span className={`font-body-md text-sm font-bold ${insights.websiteScore > 50 ? 'text-tertiary' : 'text-error'}`}>{insights.websiteScore || 'N/A'}/100</span>
              </div>
            </div>

            {/* Problems */}
            {insights.digitalWeaknesses && insights.digitalWeaknesses.length > 0 && (
              <div>
                <span className="font-body-md text-sm font-bold text-on-surface mb-2 block">Problems:</span>
                <ul className="space-y-2">
                  {insights.digitalWeaknesses.map((prob: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-on-surface-variant font-body-md text-sm leading-tight">
                      <span className="text-error text-[12px] mt-0.5 font-bold">✕</span>
                      {prob}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Services */}
            {insights.recommendedServices && insights.recommendedServices.length > 0 && (
              <div>
                <span className="font-body-md text-sm font-bold text-on-surface mb-2 block">Recommended Services:</span>
                <ul className="space-y-2">
                  {insights.recommendedServices.map((service: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-on-surface font-body-md text-sm leading-tight">
                      <span className="text-tertiary font-bold text-[12px] mt-0.5">✔</span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Estimated Project Value */}
            <div className="pt-4 border-t border-outline-variant/50">
              <span className="font-body-md text-xs text-on-surface-variant uppercase tracking-widest block mb-1">Estimated Project Value:</span>
              <span className="font-headline-sm text-2xl text-primary-container font-bold">{insights.estimatedProjectValue || 'N/A'}</span>
            </div>

          </div>
        </div>

        {/* Suggested Outreach */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest">Outreach Strategy</h4>
            <div className="h-px flex-1 bg-outline-variant/30 ml-4"></div>
          </div>
          <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low">
            <p className="font-body-md text-xs text-on-surface-variant italic mb-4 leading-relaxed">
              {insights.outreachStrategy}
            </p>
            <button className="w-full py-2 bg-primary-container/10 text-primary-container border border-primary-container/20 rounded-lg font-label-sm text-[11px] hover:bg-primary-container hover:text-on-primary-container transition-all">
              Copy Angle
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
