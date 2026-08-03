'use client';

import { useState, useEffect } from 'react';
import FiltersPane from './FiltersPane';
import ResultsPane from './ResultsPane';
import AIInsightsPane from './AIInsightsPane';
import { getToken } from "@/app/actions/auth";
import toast from 'react-hot-toast';

export default function DiscoveryLayout({ initialCompanies, initialTotal }: { initialCompanies: any[], initialTotal: number }) {
  
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    if (!activeCompanyId) {
      setInsights(null);
      return;
    }

    let isMounted = true;
    setIsLoadingInsights(true);

    async function loadInsights() {
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/companies/${activeCompanyId}/insights`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setInsights(data);
          }
        } else {
          if (isMounted) setInsights(null);
        }
      } catch (error) {
        console.error('Failed to load insights', error);
        if (isMounted) setInsights(null);
      } finally {
        if (isMounted) setIsLoadingInsights(false);
      }
    }

    loadInsights();

    return () => {
      isMounted = false;
    };
  }, [activeCompanyId]);

  const handleSaveLead = async (companyId: string) => {
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/companies/${companyId}/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Lead saved successfully!');
    } catch (error) {
      console.error('Failed to save lead', error);
      toast.error('Failed to save lead');
    }
  };

  const handleGenerateInsights = async () => {
    if (!activeCompanyId) return;
    
    setIsGeneratingInsights(true);
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/companies/${activeCompanyId}/insights/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      } else {
        toast.error('Failed to generate insights');
      }
    } catch (error) {
      console.error('Failed to generate insights', error);
      toast.error('Error generating insights');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col xl:flex-row overflow-y-auto xl:overflow-hidden h-full relative">
      <FiltersPane />
      
      <ResultsPane 
        companies={initialCompanies}
        total={initialTotal}
        activeCompanyId={activeCompanyId}
        onSelectCompany={(company) => setActiveCompanyId(company.id)}
        onSaveLead={handleSaveLead}
      />
      
      <AIInsightsPane 
        insights={insights}
        isLoading={isLoadingInsights}
        isGenerating={isGeneratingInsights}
        onGenerate={handleGenerateInsights}
      />
    </main>
  );
}
