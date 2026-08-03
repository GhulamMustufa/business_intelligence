import React from 'react';

interface BillingTabProps {
  billing: any;
}

export default function BillingTab({ billing }: BillingTabProps) {
  if (!billing) {
    return <div>Loading billing information...</div>;
  }

  const creditsUsed = billing.creditsUsed || 0;
  const creditsTotal = billing.creditsTotal || 100;
  const percentUsed = Math.min((creditsUsed / creditsTotal) * 100, 100);

  const renewsDate = billing.renewsAt ? new Date(billing.renewsAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }) : 'N/A';

  return (
    <section className="settings-panel animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h2 className="font-headline-md text-2xl text-on-surface mb-2">Billing & Credits</h2>
        <p className="text-on-surface-variant">Manage your subscription plan, credit usage, and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl flex flex-col justify-between">
          <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Current Plan</label>
          <div className="mt-4">
            <h4 className="font-headline-md text-2xl text-primary-container">{billing.planName || 'Free'}</h4>
            <p className="text-xs text-on-surface-variant mt-1">Renews on {renewsDate}</p>
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant p-6 rounded-2xl md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Intelligence Credits</label>
            <span className="font-label-sm">{creditsUsed.toLocaleString()} / {creditsTotal.toLocaleString()} used</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-container transition-all duration-1000" 
              style={{ width: `${percentUsed}%` }}
            ></div>
          </div>
          <p className="mt-4 text-xs text-on-surface-variant">
            Your credits reset in 14 days. <a className="text-primary-container underline cursor-pointer" href="#">Purchase more.</a>
          </p>
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant p-8 rounded-2xl">
        <h4 className="font-headline-md text-lg mb-6 text-on-surface">Payment Methods</h4>
        
        {billing.paymentMethod ? (
          <div className="flex items-center justify-between border border-outline-variant p-5 rounded-xl mb-6 bg-surface-container-low">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-surface-container-highest rounded-lg flex items-center justify-center font-bold text-[10px] text-on-surface">VISA</div>
              <div>
                <p className="font-bold text-sm text-on-surface">{billing.paymentMethod}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Expires 09/2026</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-primary-container/10 text-primary-container text-[10px] rounded-lg font-bold uppercase tracking-wider">DEFAULT</div>
          </div>
        ) : (
          <div className="text-on-surface-variant text-sm mb-6">No payment methods found.</div>
        )}

        <button className="w-full py-3 border border-outline-variant border-dashed rounded-xl font-label-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
          + Add Payment Method
        </button>
      </div>
    </section>
  );
}
