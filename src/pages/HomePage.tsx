import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/badge';
import { Icon } from '../components/ui/icon';
import { FlowingMenu, type FlowingMenuItem } from '../components/ui/FlowingMenu';
import { formatCurrency } from '../lib/utils';

const FLOWING_MENU_ITEMS: FlowingMenuItem[] = [
  {
    link: '/packages/PKG-EUR-01',
    text: 'Swiss Alps & Venice',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&h=400&fit=crop',
  },
  {
    link: '/packages/PKG-JPN-02',
    text: 'Kyoto Sanctuary & Shinkansen',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&h=400&fit=crop',
  },
  {
    link: '/packages/PKG-NOR-03',
    text: 'Lofoten Arctic Auroras',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=600&h=400&fit=crop',
  },
  {
    link: '/packages/PKG-ALP-04',
    text: 'Dolomites Alpine Chalets',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&h=400&fit=crop',
  },
  {
    link: '/packages',
    text: 'Mediterranean Yachting',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&h=400&fit=crop',
  },
];

export const HomePage: React.FC = () => {
  const { packages } = useStore();

  return (
    <div className="relative space-y-28 py-6 font-sans">
      {/* Hero Section */}
      <section className="relative z-10 pt-6 sm:pt-14 pb-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto px-4">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-xs text-white shadow-xl">
            <span className="px-2 py-0.5 rounded-full bg-white text-black font-bold text-[10px] tracking-wider uppercase">
              NEW SEASON
            </span>
            <span className="font-medium tracking-tight">2026/2027 Private Luxury Expeditions</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] drop-shadow-xl">
            Curated Journeys.
            <br />
            <span className="text-white/80 font-normal">Soft Motion Luxury.</span>
          </h1>
        </div>

        {/* 4 Destination Images directly below heading (24-40px spacing) */}
        <div className="w-full mt-7 sm:mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
            {[
              {
                name: 'Swiss Alps',
                region: 'Switzerland',
                img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
                url: '/packages/PKG-EUR-01',
              },
              {
                name: 'Kyoto',
                region: 'Japan',
                img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
                url: '/packages/PKG-JPN-02',
              },
              {
                name: 'Lofoten',
                region: 'Norway',
                img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1200&auto=format&fit=crop',
                url: '/packages/PKG-NOR-03',
              },
              {
                name: 'Dolomites',
                region: 'Italy',
                img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
                url: '/packages/PKG-ALP-04',
              },
            ].map((dest) => (
              <Link
                key={dest.name}
                to={dest.url}
                className="group relative rounded-[20px] overflow-hidden h-[240px] border border-white/15 bg-neutral-900/60 shadow-xl block"
              >
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex flex-col justify-end p-4 sm:p-5 transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                        {dest.name}
                      </h4>
                      <p className="text-[11px] font-mono text-white/70">
                        {dest.region}
                      </p>
                    </div>
                    <span className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Icon name="arrow_forward" size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Hero Description and CTA Buttons */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto px-4 mt-8 sm:mt-10">
          {/* Hero Subtitle Matter */}
          <p className="text-base sm:text-xl text-white/90 font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Handcrafted trans-continental circuits across the Swiss Alps, Kyoto, Lofoten, and Dolomites with real-time seat lock escrows and instantaneous booking.
          </p>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <Link to="/packages">
              <button className="bg-white text-black font-semibold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-2xl hover:bg-neutral-100 hover:scale-102 transition-all cursor-pointer flex items-center gap-2">
                <span>Explore Expeditions</span>
                <Icon name="arrow_forward" size={16} />
              </button>
            </Link>
            <Link to="/about">
              <button className="bg-white/15 backdrop-blur-xl text-white border border-white/25 font-medium text-sm sm:text-base px-8 py-3.5 rounded-2xl hover:bg-white/25 transition-all cursor-pointer">
                Our Craft &amp; Ethos
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours Showcase */}
      <section className="relative z-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-white/60 uppercase tracking-wider mb-1">Featured Expeditions</div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Handcrafted Multi-City Itineraries
            </h2>
          </div>
          <Link to="/packages" className="text-xs font-bold text-white/90 hover:text-white hover:underline flex items-center gap-1 font-mono">
            <span>View all {packages.length} tours</span>
            <Icon name="arrow_forward" size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.slice(0, 2).map((pkg) => {
            const availableSlots = Math.max(0, pkg.totalCapacity - pkg.bookedSlots - pkg.lockedSlots);
            const isSoldOut = availableSlots === 0 || pkg.status === 'SOLD_OUT';

            return (
              <div
                key={pkg.id}
                className="rounded-3xl bg-neutral-900/60 backdrop-blur-xl hover:bg-neutral-900/80 transition-all flex flex-col justify-between overflow-hidden group border border-white/15 shadow-2xl hover:border-white/30"
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

                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-tight group-hover:underline">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-white/70 font-medium mt-1">{pkg.subtitle}</p>
                      </div>
                      <div className="text-right font-mono shrink-0">
                        <div className="text-xs text-white/50">From</div>
                        <div className="text-2xl font-black text-white">{formatCurrency(pkg.basePrice)}</div>
                      </div>
                    </div>

                    <p className="text-xs text-white/75 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>

                    {/* Itinerary Stops */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
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

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
                    <div className="text-xs text-white/60 font-mono">
                      Departure: <strong className="text-white">{pkg.departureDates[0]}</strong>
                    </div>
                    <Link to={`/packages/${pkg.id}`}>
                      <button className="rounded-2xl bg-white text-black hover:bg-neutral-100 text-xs font-bold px-5 py-2.5 shadow-lg transition-all cursor-pointer flex items-center gap-1.5">
                        <span>Reserve Tour</span>
                        <Icon name="arrow_forward" size={14} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Flowing Menu Showcase from React Bits */}
      <section className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-bold font-mono tracking-wider uppercase backdrop-blur-md">
                Interactive Marquee
              </span>
              <span className="text-xs font-mono text-white/60 uppercase tracking-wider">React Bits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Circuit Directory
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl">
              Hover along the compass directions to reveal kinetic panoramic previews and direct booking routes.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-white/80 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shrink-0 shadow-lg">
            <Icon name="navigation" size={14} className="text-white" />
            <span>Hover across rows to reveal motion marquee</span>
          </div>
        </div>

        <div className="relative h-[440px] sm:h-[480px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-950/70 backdrop-blur-xl">
          <FlowingMenu
            items={FLOWING_MENU_ITEMS}
            speed={14}
            bgColor="rgba(19, 34, 37, 0.7)"
            textColor="#f5f5f5"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#132225"
            borderColor="rgba(255, 255, 255, 0.15)"
          />
        </div>
      </section>

      {/* Visual Expeditions Gallery Grid */}
      <section className="relative z-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono text-white/60 uppercase tracking-wider">Visual Journals</div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
            Analog Film Captures
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Natural lighting and organic 35mm grain captured across European, Asian, and Nordic expeditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group rounded-3xl overflow-hidden bg-neutral-900/60 backdrop-blur-xl border border-white/15 shadow-2xl hover:border-white/30 flex flex-col transition-all">
            <div className="aspect-4/3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop"
                alt="Kyoto Zen Garden Pavilion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-1 bg-neutral-950/40">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-400 font-bold uppercase">Kyoto, Japan</span>
                <span className="text-white/40">Fujichrome</span>
              </div>
              <h4 className="font-bold text-sm text-white">Arashiyama Sanctuary &amp; Maple Garden</h4>
              <p className="text-xs text-white/60">Autumn tea ceremony pavilion with stone pathway.</p>
            </div>
          </div>

          <div className="group rounded-3xl overflow-hidden bg-neutral-900/60 backdrop-blur-xl border border-white/15 shadow-2xl hover:border-white/30 flex flex-col transition-all">
            <div className="aspect-4/3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800&auto=format&fit=crop"
                alt="Lofoten Aurora Rorbu"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-1 bg-neutral-950/40">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold uppercase">Lofoten, Norway</span>
                <span className="text-white/40">ISO 800 Film</span>
              </div>
              <h4 className="font-bold text-sm text-white">Arctic Aurora &amp; Fjord Rorbu</h4>
              <p className="text-xs text-white/60">Traditional stilt cabin reflecting emerald northern lights.</p>
            </div>
          </div>

          <div className="group rounded-3xl overflow-hidden bg-neutral-900/60 backdrop-blur-xl border border-white/15 shadow-2xl hover:border-white/30 flex flex-col sm:col-span-2 lg:col-span-1 transition-all">
            <div className="aspect-4/3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop"
                alt="Dolomites Mountain Chalet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-1 bg-neutral-950/40">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase">Dolomites, Italy</span>
                <span className="text-white/40">Kodak Portra</span>
              </div>
              <h4 className="font-bold text-sm text-white">Alpine Sunrise Chalet Terrace</h4>
              <p className="text-xs text-white/60">Morning light kissing snow peaks and wooden balcony.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
