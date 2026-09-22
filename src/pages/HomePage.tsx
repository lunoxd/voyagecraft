import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Icon } from '../components/ui/icon';
import { Masonry, type MasonryItem } from '../components/ui/Masonry';
import { FlowingMenu, type FlowingMenuItem } from '../components/ui/FlowingMenu';
import { formatCurrency } from '../lib/utils';

const MASONRY_ITEMS: MasonryItem[] = [
  {
    id: '1',
    img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop',
    url: '/package/PKG-EUR-01',
    height: 700,
  },
  {
    id: '2',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    url: '/package/PKG-JPN-02',
    height: 500,
  },
  {
    id: '3',
    img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1200&auto=format&fit=crop',
    url: '/package/PKG-NOR-03',
    height: 800,
  },
  {
    id: '4',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    url: '/package/PKG-ALP-04',
    height: 540,
  },
  {
    id: '5',
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    url: '/packages',
    height: 620,
  },
  {
    id: '6',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    url: '/packages',
    height: 480,
  },
  {
    id: '7',
    img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
    url: '/package/PKG-JPN-02',
    height: 750,
  },
  {
    id: '8',
    img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    url: '/package/PKG-EUR-01',
    height: 560,
  },
];

const FLOWING_MENU_ITEMS: FlowingMenuItem[] = [
  {
    link: '/package/PKG-EUR-01',
    text: 'Swiss Alps & Venice',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=600&h=400&fit=crop',
  },
  {
    link: '/package/PKG-JPN-02',
    text: 'Kyoto Sanctuary & Shinkansen',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&h=400&fit=crop',
  },
  {
    link: '/package/PKG-NOR-03',
    text: 'Lofoten Arctic Auroras',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=600&h=400&fit=crop',
  },
  {
    link: '/package/PKG-ALP-04',
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
      {/* Hero Section Exactly Matching Screenshot */}
      <section className="relative z-10 pt-10 sm:pt-20 pb-12 flex flex-col items-center justify-center text-center space-y-8 min-h-[55vh]">
        {/* New Creative Components Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/15 text-xs text-white/90 shadow-lg">
          <span className="px-2 py-0.5 rounded-full bg-white text-black font-bold text-[10px] tracking-wider uppercase">
            NEW
          </span>
          <span className="font-medium tracking-tight">Creative Components</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08] drop-shadow-sm">
          Grainy gradient colors with soft motion.
        </h1>

        <p className="text-base sm:text-lg text-white/80 font-normal max-w-xl mx-auto leading-relaxed drop-shadow-xs">
          Curated luxury itineraries with real-time slot escrow, distributed sagas, and seamless booking.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/packages">
            <button className="bg-white text-black font-semibold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl hover:bg-neutral-100 hover:scale-102 transition-all cursor-pointer">
              Get started
            </button>
          </Link>
          <Link to="/about">
            <button className="bg-white/15 backdrop-blur-md text-white border border-white/25 font-medium text-sm sm:text-base px-8 py-3.5 rounded-2xl hover:bg-white/25 transition-all cursor-pointer">
              Learn more
            </button>
          </Link>
        </div>
      </section>

      {/* Animated Masonry Gallery from React Bits at the Top of Landing Page */}
      <section className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold font-mono tracking-wider uppercase">
                Dynamic GSAP Grid
              </span>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">React Bits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 uppercase">
              Expedition Poster Gallery
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
              Fluid multi-column masonry gallery capturing analog film stills across the Swiss Alps, Kyoto, Lofoten, and Dolomites.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-200/80 shrink-0">
            <Icon name="touch_app" size={14} className="text-black" />
            <span>Click any item to view expedition</span>
          </div>
        </div>

        {/* Masonry Container */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-neutral-200/80 bg-neutral-900/5 p-3 sm:p-4 backdrop-blur-xs">
          <Masonry
            items={MASONRY_ITEMS}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
          />
        </div>
      </section>

      {/* Featured Tours Showcase */}
      <section className="relative z-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">Featured Expeditions</div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 uppercase">
              Handcrafted Multi-City Itineraries
            </h2>
          </div>
          <Link to="/packages" className="text-xs font-bold text-black hover:underline flex items-center gap-1 font-mono">
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
                className="rounded-3xl bg-white hover:bg-neutral-50/60 transition-all flex flex-col justify-between overflow-hidden group border border-neutral-200/90 shadow-xs hover:shadow-md"
              >
                {/* Tour Photo Banner */}
                {pkg.imageUrl && (
                  <div className="relative aspect-16/9 w-full overflow-hidden bg-neutral-200">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs font-bold">
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
                        <h3 className="text-2xl font-black text-black tracking-tight group-hover:underline">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-neutral-600 font-medium mt-1">{pkg.subtitle}</p>
                      </div>
                      <div className="text-right font-mono shrink-0">
                        <div className="text-xs text-neutral-500">From</div>
                        <div className="text-2xl font-black text-black">{formatCurrency(pkg.basePrice)}</div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>

                    {/* Itinerary Stops */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {pkg.destinations.map((dest, i) => (
                        <React.Fragment key={dest.city}>
                          <span className="px-3 py-1 rounded-full bg-neutral-100 text-xs font-medium text-neutral-800 shadow-2xs border border-neutral-200/60">
                            {dest.city} <span className="text-neutral-400 font-mono text-[10px]">({dest.nights}n)</span>
                          </span>
                          {i < pkg.destinations.length - 1 && (
                            <span className="text-neutral-400 text-xs">&rarr;</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-between mt-4">
                    <div className="text-xs text-neutral-500 font-mono">
                      Departure: <strong className="text-black">{pkg.departureDates[0]}</strong>
                    </div>
                    <Link to={`/packages/${pkg.id}`}>
                      <Button variant="default" size="sm" className="rounded-full bg-black text-white hover:bg-neutral-800 text-xs font-bold px-4 h-9 shadow-sm">
                        <span>Reserve Tour</span>
                        <Icon name="arrow_forward" size={14} className="ml-1" />
                      </Button>
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
              <span className="px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-bold font-mono tracking-wider uppercase">
                Interactive Marquee
              </span>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">React Bits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 uppercase">
              Circuit Directory
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
              Hover along the compass directions to reveal kinetic panoramic previews and direct booking routes.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-200/80 shrink-0">
            <Icon name="navigation" size={14} className="text-black" />
            <span>Hover across rows to reveal motion marquee</span>
          </div>
        </div>

        <div className="relative h-[440px] sm:h-[480px] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950">
          <FlowingMenu
            items={FLOWING_MENU_ITEMS}
            speed={14}
            bgColor="#0a0a0a"
            textColor="#f5f5f5"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#0a0a0a"
            borderColor="rgba(255, 255, 255, 0.1)"
          />
        </div>
      </section>

      {/* Visual Expeditions Gallery Grid */}
      <section className="relative z-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Visual Journals</div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 uppercase">
            Analog Film Captures
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">
            Natural lighting and organic 35mm grain captured across European, Asian, and Nordic expeditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group rounded-3xl overflow-hidden bg-white border border-neutral-200/90 shadow-xs hover:shadow-md flex flex-col transition-all">
            <div className="aspect-4/3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop"
                alt="Kyoto Zen Garden Pavilion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-1 bg-white">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-700 font-bold uppercase">Kyoto, Japan</span>
                <span className="text-neutral-400">Fujichrome</span>
              </div>
              <h4 className="font-bold text-sm text-black">Arashiyama Sanctuary &amp; Maple Garden</h4>
              <p className="text-xs text-neutral-500">Autumn tea ceremony pavilion with stone pathway.</p>
            </div>
          </div>

          <div className="group rounded-3xl overflow-hidden bg-white border border-neutral-200/90 shadow-xs hover:shadow-md flex flex-col transition-all">
            <div className="aspect-4/3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=800&auto=format&fit=crop"
                alt="Lofoten Aurora Rorbu"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-1 bg-white">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-700 font-bold uppercase">Lofoten, Norway</span>
                <span className="text-neutral-400">ISO 800 Film</span>
              </div>
              <h4 className="font-bold text-sm text-black">Arctic Aurora &amp; Fjord Rorbu</h4>
              <p className="text-xs text-neutral-500">Traditional stilt cabin reflecting emerald northern lights.</p>
            </div>
          </div>

          <div className="group rounded-3xl overflow-hidden bg-white border border-neutral-200/90 shadow-xs hover:shadow-md flex flex-col sm:col-span-2 lg:col-span-1 transition-all">
            <div className="aspect-4/3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop"
                alt="Dolomites Mountain Chalet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 space-y-1 bg-white">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-700 font-bold uppercase">Dolomites, Italy</span>
                <span className="text-neutral-400">Kodak Portra</span>
              </div>
              <h4 className="font-bold text-sm text-black">Alpine Sunrise Chalet Terrace</h4>
              <p className="text-xs text-neutral-500">Morning light kissing snow peaks and wooden balcony.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
