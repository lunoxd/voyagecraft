import React from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';
import { BrandLogo } from './ui/BrandLogo';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUserRole,
    simulateTrafficBurst
  } = useStore();

  const navItems = [
    { id: 'packages', label: 'Packages & Catalog', icon: 'travel_explore' },
    { id: 'bookings', label: 'Reservations', icon: 'confirmation_number' },
    { id: 'payments', label: 'Payment Ledger', icon: 'account_balance_wallet' },
    { id: 'eureka', label: 'Eureka Discovery', icon: 'hub' },
    { id: 'gateway', label: 'API Gateway', icon: 'alt_route' },
    { id: 'saga', label: 'Saga Orchestration', icon: 'sync_alt' },
    { id: 'tests', label: 'Test Suite', icon: 'fact_check' },
    { id: 'logs', label: 'System Logs', icon: 'terminal' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-black/95 backdrop-blur">
      <div className="border-b border-neutral-900 bg-neutral-950 px-4 py-1.5 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="inverse" className="font-mono text-[10px] px-2 py-0">
            VOYAGECRAFT
          </Badge>
          <span className="font-semibold text-neutral-200">
            Multi-Destination Travel Package &amp; Reservation Orchestration Platform
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-white text-black flex items-center justify-center font-bold shadow-sm p-1.5">
            <BrandLogo size={22} className="text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white uppercase">VoyageCraft</h1>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-neutral-700">v3.0</Badge>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono leading-none">Microservices Orchestrator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={simulateTrafficBurst}
            className="hidden md:inline-flex text-xs h-8 border-neutral-800 hover:border-neutral-600"
            title="Fire simulated seasonal booking burst across API Gateway"
          >
            <Icon name="bolt" size={16} />
            <span>Simulate Traffic Spike</span>
          </Button>

          {/* Role Quick Switcher */}
          <div className="hidden lg:flex items-center border border-neutral-800 rounded-md p-0.5 bg-neutral-950 text-xs">
            {(['ADMIN', 'AGENT', 'TRAVELER', 'DEVOPS'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setCurrentUserRole(r)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  currentUser.role === r
                    ? 'bg-white text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Sub-Navigation */}
      <div className="border-t border-neutral-800/80 bg-black px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
