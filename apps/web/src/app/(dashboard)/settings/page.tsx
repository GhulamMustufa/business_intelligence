import { Metadata } from 'next';
import SettingsLayout from '../../../components/settings/SettingsLayout';
import { fetchBilling } from '../../../lib/api/billing.server';

export const metadata: Metadata = {
  title: 'Settings - LeadForge AI',
  description: 'Manage your profile, workspace, and billing',
};

export default async function SettingsPage() {
  let billing = null;
  try {
    billing = await fetchBilling();
  } catch (e) {
    console.error('Failed to fetch billing info', e);
  }

  return <SettingsLayout billing={billing} />;
}
