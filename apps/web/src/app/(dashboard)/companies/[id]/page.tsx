import { fetchCompanyProfile } from '@/lib/api/companies';
import ProfileContent from '@/components/company-profile/ProfileContent';
import { notFound } from 'next/navigation';

export default async function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15, dynamic route params are a promise
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    notFound();
  }

  let company;
  try {
    company = await fetchCompanyProfile(resolvedParams.id);
  } catch (error) {
    console.error('Failed to load company profile:', error);
  }

  if (!company) {
    notFound();
  }

  return <ProfileContent company={company} />;
}
