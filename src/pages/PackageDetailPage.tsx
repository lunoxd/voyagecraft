import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Icon } from '../components/ui/icon';
import { formatCurrency } from '../lib/utils';

export const PackageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { packages, setSelectedPackage, setIsBookingModalOpen } = useStore();

  const pkg = packages.find((p) => p.id === id);
  const [selectedTier, setSelectedTier] = useState<'STANDARD' | 'DELUXE' | 'VIP'>('DELUXE');

  if (!pkg) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-black">Package Not Found</h2>
        <p className="text-neutral-500 text-sm">The requested tour package does not exist in the catalog.</p>
        <Link to="/packages">
          <Button variant="default" className="rounded-full bg-black text-white hover:bg-neutral-800 font-bold px-6">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const availableSlots = Math.max(0, pkg.totalCapacity - pkg.bookedSlots - pkg.lockedSlots);
  const isSoldOut = availableSlots === 0 || pkg.status === 'SOLD_OUT';

  const currentPrice =
    selectedTier === 'VIP' ? pkg.vipPrice : selectedTier === 'DELUXE' ? pkg.deluxePrice : pkg.basePrice;

  const handleStartBooking = () => {
    setSelectedPackage(pkg);
    setIsBookingModalOpen(true);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'LUXURY_EUROPE':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'ASIAN_EXPEDITION':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      case 'NORDIC_SAFARI':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'ALPINE_ESCORT':
        return 'bg-sky-100 text-sky-900 border-sky-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
        <Link to="/packages" className="hover:text-black flex items-center gap-1">
          <Icon name="arrow_back" size={14} />
          <span>Tour Catalog</span>
        </Link>
        <span>/</span>
        <span className="text-black font-bold">{pkg.code}</span>
      </div>

      {/* Hero Photographic Banner */}
      {pkg.imageUrl && (
        <div className="relative rounded-3xl overflow-hidden aspect-21/9 max-h-[420px] w-full bg-neutral-900 shadow-md border border-neutral-200/80">
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-mono font-bold text-white tracking-wider">
                {pkg.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/90 text-black text-[10px] font-bold font-mono">
                35mm Analog
              </span>
              <Badge
                variant={isSoldOut ? "destructive" : "default"}
                className="rounded-full text-[10px] bg-white text-black font-bold border-none"
              >
                {isSoldOut ? "SOLD OUT" : `${availableSlots} SEATS AVAILABLE`}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {pkg.title}
            </h1>
            <p className="text-xs sm:text-base text-neutral-200 font-medium max-w-3xl mt-1">
              {pkg.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Details & Itinerary */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-3">
            <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
              <Icon name="notes" size={22} className="text-neutral-800" />
              Tour Overview
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
              {pkg.description}
            </p>
          </div>

          {/* Destinations Itinerary */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
                <Icon name="route" size={22} className="text-neutral-800" />
                Destination Itinerary ({pkg.durationDays} Days)
              </h2>
              <Badge className={`rounded-full text-xs font-mono font-bold border ${getCategoryColor(pkg.category)}`}>
                {pkg.category.replace('_', ' ')}
              </Badge>
            </div>

            <div className="space-y-4">
              {pkg.destinations.map((dest, idx) => (
                <div key={dest.city} className="p-6 rounded-3xl bg-neutral-50/80 border border-neutral-200/60 space-y-3 hover:bg-neutral-100/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-full bg-black text-white font-bold font-mono text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="font-bold text-black text-lg">
                        {dest.city}, {dest.country}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="rounded-full font-mono text-xs bg-white text-neutral-800 border border-neutral-200">{dest.nights} Nights</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {dest.highlights.map(h => (
                      <span key={h} className="px-3 py-1 rounded-full bg-white text-xs text-neutral-700 font-medium shadow-2xs border border-neutral-200/70">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
              <Icon name="verified" size={22} className="text-neutral-800" />
              Curated Inclusions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700">
              {pkg.inclusions.map(inc => (
                <div key={inc} className="flex items-center gap-2.5 p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/60">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Icon name="check" size={14} />
                  </div>
                  <span className="font-medium text-xs text-neutral-800">{inc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Reservation Checkout Card (Apple Pill Style) */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/80 space-y-6 sticky top-28 shadow-sm">
            <div className="space-y-1 pb-4 border-b border-neutral-200">
              <div className="text-xs text-neutral-500 font-mono uppercase">Reserve Experience</div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-black">
                {formatCurrency(currentPrice)}
                <span className="text-xs font-normal text-neutral-500 font-sans"> / traveler</span>
              </div>
            </div>

            <div className="space-y-5 text-xs">
              {/* Tier Selection */}
              <div className="space-y-2">
                <label className="text-neutral-500 font-bold uppercase text-[10px] tracking-wider font-mono">Experience Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['STANDARD', 'DELUXE', 'VIP'] as const).map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center ${
                        selectedTier === tier
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Quota Bar */}
              <div className="space-y-2 p-4 rounded-2xl bg-white border border-neutral-200">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-neutral-600">Remaining Slots</span>
                  <span className="font-bold text-black font-mono">{availableSlots} / {pkg.totalCapacity}</span>
                </div>
                <Progress value={pkg.bookedSlots} max={pkg.totalCapacity} className="h-2 bg-neutral-200" />
                <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1">
                  <span>Departure:</span>
                  <span className="font-bold text-black font-mono">{pkg.departureDates[0]}</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleStartBooking}
                disabled={isSoldOut}
                className="w-full h-12 rounded-full text-sm font-bold gap-2 bg-black text-white hover:bg-neutral-800 disabled:opacity-50 shadow-md cursor-pointer"
              >
                <Icon name="event_seat" size={18} />
                <span>{isSoldOut ? 'Sold Out' : 'Book Reservation Now'}</span>
              </Button>

              <div className="text-[11px] text-neutral-500 text-center space-y-1">
                <div className="flex items-center justify-center gap-1 font-semibold text-neutral-700">
                  <Icon name="verified_user" size={14} className="text-emerald-600" />
                  <span>Instant Confirmation &bull; Atomic SQL Lock</span>
                </div>
                <div>Free cancellation up to 48 hours prior to departure.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
