import { Metadata } from 'next';
import ProspectsLayout from '../../../components/prospects/ProspectsLayout';
import { fetchSavedLeads } from '../../../lib/api/saved-leads.server';
import { fetchFolders } from '../../../lib/api/folders.server';

export const metadata: Metadata = {
  title: 'Saved Leads - LeadForge AI',
  description: 'Manage and organize high-potential leads',
};

interface ProspectsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProspectsPage(props: ProspectsPageProps) {
  const searchParams = await props.searchParams;
  const params = new URLSearchParams();
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, String(value));
      }
    });
  }

  let leadsData = { items: [], total: 0 };
  let folders = [];
  
  try {
    const [leadsRes, foldersRes] = await Promise.all([
      fetchSavedLeads(params),
      fetchFolders()
    ]);
    leadsData = leadsRes;
    folders = foldersRes;
  } catch (error) {
    console.error('Failed to load saved leads or folders', error);
  }

  return (
    <ProspectsLayout 
      initialLeads={leadsData.items} 
      totalLeads={leadsData.total} 
      initialFolders={folders}
    />
  );
}
