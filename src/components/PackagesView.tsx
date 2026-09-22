import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { TravelPackage } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Icon } from './ui/icon';
import { formatCurrency } from '../lib/utils';

export const PackagesView: React.FC = () => {
  const { packages, setSelectedPackage, setIsBookingModalOpen, setIsAddPackageModalOpen, currentUser, updatePackageCapacity } = useStore();
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

  const handleBookNow = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">PACKAGE SERVICE</Badge>
            <span className="text-xs text-neutral-500 font-mono">Port 8082 / 8083</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-black uppercase">
            Curated Journeys
          </h2>
          <p className="text-sm text-neutral-600">
            Real-time package availability tracking, atomic slot quotas, and multi-tier itineraries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'ADMIN' && (
            <Button
              variant="default"
              onClick={() => setIsAddPackageModalOpen(true)}
              className="gap-2 text-xs font-bold h-11 px-5 bg-black text-white hover:bg-neutral-800"
            >
              <Icon name="add" size={18} />
              <span>Create New Tour Package</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Icon name="search" size={18} className="absolute left-3.5 top-3 text-neutral-400" />
          <Input
            placeholder="Search destinations or cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 bg-white border-neutral-200 text-xs font-mono placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Catalog' },
            { id: 'LUXURY_EUROPE', label: 'Europe Luxury' },
            { id: 'ASIAN_EXPEDITION', label: 'Asian Expedition' },
            { id: 'NORDIC_SAFARI', label: 'Nordic Aurora' },
            { id: 'ALPINE_ESCORT', label: 'Alpine Circuit' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                categoryFilter === cat.id
                  ? 'bg-black text-white border-black font-bold shadow-2xs'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:text-black hover:border-neutral-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPackages.map((pkg) => {
          const availableSlots = Math.max(0, pkg.totalCapacity - pkg.bookedSlots - pkg.lockedSlots);
          const isSoldOut = availableSlots === 0 || pkg.status === 'SOLD_OUT';
          const occupancyRate = Math.round((pkg.bookedSlots / pkg.totalCapacity) * 100);

          return (
            <Card key={pkg.id} className="flex flex-col justify-between border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md transition-all duration-300">
              <div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-neutral-500 font-semibold">{pkg.code}</span>
                        <Badge
                          variant={isSoldOut ? "destructive" : pkg.status === "LIMITED" ? "outline" : "default"}
                          className="text-[10px]"
                        >
                          {isSoldOut ? "SOLD OUT" : pkg.status === "LIMITED" ? "HIGH DEMAND" : "AVAILABLE"}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-black leading-snug text-black">{pkg.title}</CardTitle>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-neutral-500">From</div>
                      <div className="text-xl font-black text-black font-mono">{formatCurrency(pkg.basePrice)}</div>
                      <div className="text-[10px] text-neutral-400">/ person</div>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-neutral-600 font-medium mt-1">
                    {pkg.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 text-xs">
                  <p className="text-neutral-600 leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Multi-Destination Itinerary Ribbon */}
                  <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Icon name="route" size={15} />
                      Itinerary Stops ({pkg.durationDays} Days / {pkg.destinations.reduce((acc, d) => acc + d.nights, 0)} Nights)
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {pkg.destinations.map((dest, i) => (
                        <React.Fragment key={dest.city}>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-800 shadow-2xs font-medium">
                            <Icon name="location_on" size={13} className="text-neutral-500" />
                            <span>{dest.city}</span>
                            <span className="text-neutral-400 font-mono text-[10px]">({dest.nights}n)</span>
                          </div>
                          {i < pkg.destinations.length - 1 && (
                            <Icon name="arrow_forward" size={12} className="text-neutral-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Capacity & Quota Tracker */}
                  <div className="space-y-2 p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 font-mono">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600 flex items-center gap-1.5 font-sans font-medium">
                        <Icon name="airline_seat_recline_normal" size={15} /> Live Capacity Tracker
                      </span>
                      <span className="font-bold text-black">
                        {pkg.bookedSlots} / {pkg.totalCapacity} Booked ({occupancyRate}%)
                      </span>
                    </div>

                    <Progress value={pkg.bookedSlots} max={pkg.totalCapacity} className="h-2 bg-neutral-200" />

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
                      <span>Available: <strong className="text-black font-semibold">{availableSlots} Seats</strong></span>
                      {pkg.lockedSlots > 0 && (
                        <span className="text-neutral-700 flex items-center gap-1 font-semibold">
                          <Icon name="lock" size={12} /> {pkg.lockedSlots} in checkout lock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Admin Capacity Adjuster */}
                  {currentUser.role === 'ADMIN' && (
                    <div className="pt-2 border-t border-neutral-200 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-neutral-500 font-mono">Admin Override Capacity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updatePackageCapacity(pkg.id, Math.max(pkg.bookedSlots, pkg.totalCapacity - 1))}
                          className="h-7 w-7 rounded-md border border-neutral-300 bg-white text-black flex items-center justify-center hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs px-2 font-bold">{pkg.totalCapacity}</span>
                        <button
                          onClick={() => updatePackageCapacity(pkg.id, pkg.totalCapacity + 1)}
                          className="h-7 w-7 rounded-md border border-neutral-300 bg-white text-black flex items-center justify-center hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>

              <CardFooter className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
                <div className="text-xs text-neutral-500 font-mono">
                  <span>Next Departure: </span>
                  <strong className="text-black font-semibold">{pkg.departureDates[0]}</strong>
                </div>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleBookNow(pkg)}
                  disabled={isSoldOut}
                  className="gap-2 text-xs font-bold bg-black text-white hover:bg-neutral-800 h-9 px-4 disabled:opacity-50"
                >
                  <Icon name="event_seat" size={15} />
                  <span>{isSoldOut ? 'Sold Out' : 'Reserve Slots'}</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
