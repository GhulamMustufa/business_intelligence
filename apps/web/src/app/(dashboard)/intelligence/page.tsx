import { fetchDecisionMakers } from '@/lib/api/decision-makers';
import ContactIntelligenceLayout from '@/components/intelligence/ContactIntelligenceLayout';

export default async function ContactIntelligencePage({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlParams.append(key, v));
    } else if (value) {
      urlParams.append(key, value);
    }
  });

  let initialContacts = [];
  try {
    const data = await fetchDecisionMakers(urlParams);
    initialContacts = data.items || [];
  } catch (error) {
    console.error('Failed to fetch decision makers:', error);
  }

  return (
    <ContactIntelligenceLayout initialContacts={initialContacts} />
  );
}
