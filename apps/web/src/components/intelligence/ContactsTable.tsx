'use client';

import React from 'react';

interface ContactsTableProps {
  contacts: any[];
  activeContactId: string | null;
  onSelectContact: (id: string) => void;
}

export default function ContactsTable({ contacts, activeContactId, onSelectContact }: ContactsTableProps) {
  
  const getStatusStyle = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'verified':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'bounced':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-surface-container-high text-on-surface-variant border-outline-variant/30';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <table className="w-full border-collapse text-left">
      <thead className="sticky top-0 bg-background z-10">
        <tr className="border-b border-outline-variant/20 bg-surface-container/30">
          <th className="py-4 px-8 font-label-sm text-on-surface-variant uppercase tracking-wider">Person</th>
          <th className="py-4 px-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Role & Department</th>
          <th className="py-4 px-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Social</th>
          <th className="py-4 px-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Email Status</th>
          <th className="py-4 px-8 font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Confidence</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/10">
        {contacts.map((contact) => {
          const isActive = contact.id === activeContactId;
          return (
            <tr 
              key={contact.id}
              onClick={() => onSelectContact(contact.id)}
              className={`cursor-pointer transition-colors ${
                isActive 
                  ? 'bg-primary/5 border-l-2 border-primary hover:bg-primary/10' 
                  : 'hover:bg-surface-container/40'
              }`}
            >
              <td className="py-4 px-8">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isActive ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {getInitials(contact.name)}
                  </div>
                  <div>
                    <div className={`text-body-md font-semibold ${isActive ? 'text-primary' : 'font-medium text-on-surface'}`}>
                      {contact.name}
                    </div>
                    <div className="text-[11px] font-code text-on-surface-variant/60">
                      {contact.emailDomain || `@${contact.company?.website || 'unknown.com'}`}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="text-body-sm text-on-surface">{contact.title}</div>
                <div className="text-[11px] text-on-surface-variant opacity-70 uppercase tracking-widest">
                  {contact.department || 'General'}
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
              </td>
              <td className="py-4 px-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(contact.emailStatus)}`}>
                  {contact.emailStatus || 'Unknown'}
                </span>
              </td>
              <td className={`py-4 px-8 text-right font-code font-bold ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {contact.confidenceScore ? `${contact.confidenceScore}%` : 'N/A'}
              </td>
            </tr>
          );
        })}
        {contacts.length === 0 && (
          <tr>
            <td colSpan={5} className="py-8 text-center text-on-surface-variant">
              No contacts found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
