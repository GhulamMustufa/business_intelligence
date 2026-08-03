import React from 'react';
import { notFound } from 'next/navigation';
import { fetchDecisionMaker } from '@/lib/api/decision-makers';
import { fetchOutreachDraft } from '@/lib/api/outreach';
import OutreachStudioLayout from '@/components/outreach/OutreachStudioLayout';

export default async function OutreachStudioPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const decisionMakerId = params.id;
  
  const contact = await fetchDecisionMaker(decisionMakerId);
  if (!contact) {
    notFound();
  }

  const initialDraft = await fetchOutreachDraft(decisionMakerId);

  return <OutreachStudioLayout contact={contact} initialDraft={initialDraft} />;
}
