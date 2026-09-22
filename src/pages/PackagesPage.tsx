import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Icon } from '../components/ui/icon';
import { BadgeGroup } from '../components/ui/badge-group';
import { EmptyState } from '../components/ui/empty-state';
import { formatCurrency } from '../lib/utils';

export const PackagesPage: React.FC = () => {
  const { packages, currentUser, setIsAddPackageModalOpen, updatePackageCapacity } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destinations.some(d => d.city.toLowerCase().includes(searchTerm.toLowerCase()) || d.country.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'ALL' || pkg.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'LUXURY_EUROPE':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'ASIAN_EXPEDITION':
        return 'bg-rose-50 text-rose-900 border-rose-200';
      case 'NORDIC_SAFARI':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'ALPINE_ESCORT':
        return 'bg-sky-50 text-sky-900 border-sky-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="space-y-12 py-8 font-sans">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-3">
          <BadgeGroup
            badge="PACKAGE SERVICE"
            message="SQL Persisted • Port 8082 • Pessimistic Lock Engine"
            variant="brand"
            showArrow={false}
          />
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
            Curated Journeys
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl">
            Real-time multi-destination itinerary catalog with atomic seat quota enforcement and zero-overbooking guarantees.
          </p>
        </div>

        {currentUser.role === 'ADMIN' && (
          <Button
            variant="default"
            onClick={() => setIsAddPackageModalOpen(true)}
            className="rounded-full gap-2 text-xs font-bold h-11 px-6 bg-white text-black hover:bg-neutral-100 shadow-md"
          >
            <Icon name="add" size={18} />
            <span>Create New Tour</span>
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Icon name="search" size={18} className="absolute left-4 top-3 text-white/40" />
          <Input
            placeholder="Search destinations or cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 rounded-full bg-white/10 border-white/15 text-xs font-mono placeholder:text-white/40 text-white focus:bg-white/15 shadow-md"
          />
        </div>

        {/* Segmented Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Catalog' },
            { id: 'LUXURY_EUROPE', label: 'Europe' },
            { id: 'ASIAN_EXPEDITION', label: 'Asia' },
            { id: 'NORDIC_SAFARI', label: 'Nordic' },
            { id: 'ALPINE_ESCORT', label: 'Alpine' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-white/10 border border-white/15 text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid or Empty State */}
      {filteredPackages.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="No itineraries found"
          description={`No tours match your current filter query "${searchTerm}". Try resetting your search parameters.`}
          actionText="Clear Search"
          onAction={() => {
            setSearchTerm('');
            setCategoryFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPackages.map((pkg) => {
            const availableSlots = Math.max(0, pkg.totalCapacity - pkg.bookedSlots - pkg.lockedSlots);
            const isSoldOut = availableSlots === 0 || pkg.status === 'SOLD_OUT';
            const occupancyRate = Math.round((pkg.bookedSlots / pkg.totalCapacity) * 100);

            return (
              <div
                key={pkg.id}
                className="rounded-3xl bg-neutral-900/60 backdrop-blur-xl hover:bg-neutral-900/80 transition-all flex flex-col justify-between overflow-hidden border border-white/15 group shadow-2xl hover:border-white/30"
              >
                {/* Tour Photo Banner */}
                {pkg.imageUrl && (
                  <div className="relative aspect-16/9 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20">
                        {pkg.code}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border backdrop-blur-md ${getCategoryColor(pkg.category)}`}>
                        {pkg.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <Badge
                        variant={isSoldOut ? "destructive" : "success"}
                        showDot
                        className="rounded-full text-[10px]"
                      >
                        {isSoldOut ? "SOLD OUT" : `${availableSlots} SEATS LEFT`}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-tight group-hover:underline">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-white/70 font-medium mt-1">{pkg.subtitle}</p>
                      </div>
                      <div className="text-right font-mono shrink-0">
                        <div className="text-xs text-white/50">Base Tier</div>
                        <div className="text-2xl font-black text-white">{formatCurrency(pkg.basePrice)}</div>
                      </div>
                    </div>

                    <p className="text-xs text-white/75 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>

                    {/* Circuit Stops */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Circuit Route:</div>
                      <div className="flex flex-wrap items-center gap-2">
                        {pkg.destinations.map((dest, i) => (
                          <React.Fragment key={dest.city}>
                            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white shadow-xs border border-white/15">
                              {dest.city} <span className="text-white/50 font-mono text-[10px]">({dest.nights}n)</span>
                            </span>
                            {i < pkg.destinations.length - 1 && (
                              <span className="text-white/40 text-xs">&rarr;</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Atomic Slot Quota Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white/60">Inventory Quota Allocation</span>
                        <span className="font-bold text-white">{pkg.bookedSlots} / {pkg.totalCapacity} Booked ({occupancyRate}%)</span>
                      </div>
                      <Progress value={occupancyRate} className="h-1.5 bg-white/10" />
                    </div>

                    {/* Admin Capacity Adjuster */}
                    {currentUser.role === 'ADMIN' && (
                      <div className="pt-2 flex items-center justify-between gap-2 text-xs font-mono">
                        <span className="text-white/60">Admin Capacity Adjuster:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updatePackageCapacity(pkg.id, Math.max(pkg.bookedSlots, pkg.totalCapacity - 1))}
                            className="h-7 w-7 rounded-full bg-white border border-neutral-300 text-black flex items-center justify-center hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs px-2 font-bold">{pkg.totalCapacity}</span>
                          <button
                            onClick={() => updatePackageCapacity(pkg.id, pkg.totalCapacity + 1)}
                            className="h-7 w-7 rounded-full bg-white border border-neutral-300 text-black flex items-center justify-center hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4 mt-4">
                    <div className="text-xs text-neutral-500 font-mono">
                      <span>Departure: </span>
                      <strong className="text-black font-semibold">{pkg.departureDates[0]}</strong>
                    </div>

                    <Link to={`/packages/${pkg.id}`}>
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-full gap-2 text-xs font-bold bg-black text-white hover:bg-neutral-800 h-10 px-5 shadow-sm"
                      >
                        <span>View Itinerary</span>
                        <Icon name="arrow_forward" size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
