import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Badge } from '../components/ui/badge';
import { Icon } from '../components/ui/icon';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Masonry, type MasonryItem } from '../components/ui/Masonry';
import { FlowingMenu, type FlowingMenuItem } from '../components/ui/FlowingMenu';
import { formatCurrency } from '../lib/utils';

const FALLBACK_MASONRY_ITEMS: MasonryItem[] = [
  {
    id: '1',
    img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
    url: '/packages/PKG-EUR-01',
    height: 720,
  },
  {
    id: '2',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    url: '/packages/PKG-JPN-02',
    height: 440,
  },
  {
    id: '3',
    img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1200&auto=format&fit=crop',
    url: '/packages/PKG-NOR-03',
    height: 820,
  },
  {
    id: '4',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    url: '/packages/PKG-ALP-04',
    height: 520,
  },
  {
    id: '5',
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    url: '/packages',
    height: 640,
  },
  {
    id: '6',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    url: '/packages',
    height: 460,
  },
  {
    id: '7',
    img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
    url: '/packages/PKG-JPN-02',
    height: 760,
  },
  {
    id: '8',
    img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    url: '/packages/PKG-EUR-01',
    height: 540,
  },
];

export const HomePage: React.FC = () => {
  const { packages } = useStore();

  // Dynamically map from live Supabase packages
  const flowingMenuItems: FlowingMenuItem[] = packages.length > 0
    ? packages.map((pkg) => ({
        link: `/packages/${pkg.id}`,
        text: pkg.title.split('&')[0].trim(),
        image: pkg.imageUrl || 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&h=400&fit=crop'
      }))
    : [
        {
          link: '/packages',
          text: 'Swiss Alps & Venice',
          image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&h=400&fit=crop',
        },
        {
          link: '/packages',
          text: 'Kyoto Sanctuary & Shinkansen',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&h=400&fit=crop',
        },
        {
          link: '/packages',
          text: 'Lofoten Arctic Auroras',
          image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=600&h=400&fit=crop',
        },
        {
          link: '/packages',
          text: 'Dolomites Alpine Chalets',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&h=400&fit=crop',
        }
      ];

  const masonryItems: MasonryItem[] = packages.length > 0
    ? packages.map((pkg, idx) => ({
        id: pkg.id,
        img: pkg.imageUrl || FALLBACK_MASONRY_ITEMS[idx % FALLBACK_MASONRY_ITEMS.length].img,
        url: `/packages/${pkg.id}`,
        height: [720, 440, 820, 520, 640, 460][idx % 6]
      }))
    : FALLBACK_MASONRY_ITEMS;

  return (
    <div className="relative space-y-28 py-2 font-sans">
      {/* Hero Section with Full-Screen Interactive Photo Masonry Grid Under Hero Text */}
      <section className="relative z-10 w-full max-w-[1540px] mx-auto px-2 sm:px-4 flex items-center justify-center">
        {/* Full React Bits Interactive Masonry Photo Grid Layer */}
        <div className="relative w-full">
          <Masonry
            items={masonryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.96}
            blurToFocus={false}
            colorShiftOnHover={false}
          />
        </div>

        {/* Hero Text Content Positioned Directly ON the Images */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 max-w-4xl mx-auto px-4 py-8 pointer-events-none z-20">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-xs text-white shadow-2xl pointer-events-auto">
            <div className="h-5 w-5 rounded-full bg-white text-black flex items-center justify-center p-0.5 shadow-sm">
              <BrandLogo size={13} className="text-black" />
            </div>
            <span className="font-bold tracking-wider uppercase text-[11px]">
              VOYAGECRAFT
            </span>
            <span className="text-white/40">•</span>
            <span className="font-medium text-white/90 tracking-tight">Curated Luxury Expeditions</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05]">
            <span className="[text-shadow:_0_2px_16px_rgba(0,0,0,0.65),_0_4px_30px_rgba(0,0,0,0.5)]">
              Curated Journeys.
            </span>
            <br />
            <span className="text-white/95 font-normal [text-shadow:_0_2px_18px_rgba(0,0,0,0.75),_0_4px_32px_rgba(0,0,0,0.55)]">
              Soft Motion Luxury.
            </span>
          </h1>

          {/* Hero Subtitle Matter */}
          <p className="text-base sm:text-xl text-white font-normal max-w-2xl mx-auto leading-relaxed [text-shadow:_0_2px_8px_rgba(0,0,0,0.9),_0_4px_20px_rgba(0,0,0,0.8)]">
            Handcrafted trans-continental circuits across the Swiss Alps, Kyoto, Lofoten, and Dolomites with real-time seat lock escrows and instantaneous booking.
          </p>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 pointer-events-auto">
            <Link to="/packages">
              <button className="bg-white text-black font-semibold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-2xl hover:bg-neutral-100 hover:scale-105 transition-all cursor-pointer flex items-center gap-2">
                <span>Explore Expeditions</span>
                <Icon name="arrow_forward" size={16} />
              </button>
            </Link>
            <Link to="/about">
              <button className="bg-black/60 backdrop-blur-xl text-white border border-white/30 font-medium text-sm sm:text-base px-8 py-3.5 rounded-2xl hover:bg-black/80 transition-all cursor-pointer shadow-xl">
                Our Craft &amp; Ethos
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Flowing Menu Showcase */}
      <section className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-bold font-mono tracking-wider uppercase backdrop-blur-md">
                EXPEDITION CIRCUITS
              </span>
              <span className="text-xs font-mono text-white/60 uppercase tracking-wider">VoyageCraft</span>
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
            items={flowingMenuItems}
            speed={14}
            bgColor="rgba(19, 34, 37, 0.7)"
            textColor="#f5f5f5"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#132225"
            borderColor="rgba(255, 255, 255, 0.15)"
          />
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
