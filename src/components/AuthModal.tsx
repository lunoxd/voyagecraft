import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';
import type { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentUser, jwtToken, decodedJWT, setCurrentUserRole } = useStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jwtToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'ADMIN', title: 'System Administrator', desc: 'Full permissions: manage catalog, configure gateway, access telemetry and financial ledger.' },
    { role: 'AGENT', title: 'VoyageCraft Travel Agent', desc: 'Operational permissions: initiate group bookings, hold slots, view customer itineraries.' },
    { role: 'TRAVELER', title: 'Individual Traveler', desc: 'Customer permissions: browse public packages, execute personal reservations, view receipts.' },
    { role: 'DEVOPS', title: 'DevOps & Reliability Engineer', desc: 'Infrastructure permissions: manage Eureka instances, load balancer strategies, and run test suites.' },
  ];

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} className="max-w-2xl bg-white border-neutral-200">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="rounded-full font-mono text-[10px]">AUTH SERVICE</Badge>
          <Badge variant="secondary" className="rounded-full font-mono text-[10px] bg-neutral-100 text-neutral-800">RFC 7519 Compliant</Badge>
        </div>
        <DialogTitle className="text-2xl font-black text-black flex items-center gap-2">
          <Icon name="security" size={24} />
          JWT Authentication &amp; RBAC Inspector
        </DialogTitle>
        <DialogDescription className="text-xs text-neutral-500">
          Live cryptographic Bearer token validation and role-based scope management.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 text-sm font-sans">
        {/* Role Selector */}
        <div>
          <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block mb-3 font-mono">
            Switch Simulated Active Role:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((r) => {
              const isSelected = currentUser.role === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setCurrentUserRole(r.role)}
                  className={`text-left p-4 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-black'}`}>{r.title}</span>
                    {isSelected && <Badge variant="secondary" className="rounded-full text-[9px] py-0 bg-white text-black font-bold">ACTIVE</Badge>}
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>{r.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Encoded JWT Token Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5 font-mono">
              <Icon name="vpn_key" size={15} /> Bearer Token
            </span>
            <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-full h-7 text-xs px-3 gap-1 border-neutral-300 hover:border-black font-semibold bg-white">
              <Icon name={copied ? "done" : "content_copy"} size={13} />
              <span>{copied ? "Copied" : "Copy Token"}</span>
            </Button>
          </div>
          <div className="p-4 bg-neutral-50 rounded-2xl font-mono text-[11px] text-neutral-800 break-all select-all">
            {jwtToken}
          </div>
        </div>

        {/* Decoded Claims Payload */}
        {decodedJWT && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5 font-mono">
              <Icon name="code" size={15} /> Decoded Claims (Payload)
            </span>
            <div className="p-4 bg-neutral-50 rounded-2xl font-mono text-[11px] text-neutral-800 overflow-x-auto">
              <pre>{JSON.stringify(decodedJWT, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="pt-4 border-t border-neutral-100">
        <Button variant="default" onClick={() => setIsAuthModalOpen(false)} className="rounded-full bg-black text-white hover:bg-neutral-800 font-bold px-8">
          Close Inspector
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
