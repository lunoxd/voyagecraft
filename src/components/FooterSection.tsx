import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './ui/BrandLogo';
import {
  Globe,
  Send,
  Feather,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function FooterSection() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="border-t border-white/15 bg-neutral-950/80 backdrop-blur-2xl text-white/80 mt-32 pt-20 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Header Row: Brand Identity & Dispatch Subscription */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-14 border-b border-white/10">
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="h-11 w-11 rounded-full bg-white text-black flex items-center justify-center p-2 shadow-lg group-hover:scale-105 transition-transform">
                <BrandLogo size={24} className="text-black" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white uppercase block">
                  VOYAGECRAFT
                </span>
                <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">
                  Curated Luxury Expeditions
                </span>
              </div>
            </Link>

            <p className="text-sm text-white/70 leading-relaxed max-w-md pt-2">
              Pioneering soft-motion luxury travel through verifiable seat-locking escrows, distributed real-time reservations, and bespoke trans-continental itineraries.
            </p>

            {/* Live Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs text-white/90 font-mono shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium tracking-tight">System Operational &bull; Supabase Live</span>
            </div>
          </div>

          {/* Newsletter Dispatch Subscription */}
          <div className="lg:col-span-7 bg-neutral-900/60 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-300" />
              <span className="text-xs font-mono uppercase tracking-widest text-amber-200/90 font-bold">
                Private Dispatch
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Receive Curated Itinerary Previews &amp; Slot Releases
            </h3>
            <p className="text-xs sm:text-sm text-white/70">
              Join our exclusive journal for confidential departure manifests, early reservation access, and alpine expedition dispatches.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs sm:text-sm bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-2xl">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>You have been added to the private dispatch list. Welcome aboard.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 pt-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your confidential email..."
                  required
                  className="flex-1 px-4 py-3 rounded-2xl bg-neutral-950/80 border border-white/20 text-white placeholder:text-white/40 text-xs sm:text-sm focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-white text-black font-bold text-xs sm:text-sm hover:bg-neutral-100 transition-all hover:scale-105 cursor-pointer shadow-lg shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Multi-Column Comprehensive Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Expeditions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/90 font-bold">
              <Compass className="size-3.5 text-white/70" />
              <span>Expedition Circuits</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/packages/PKG-EUR-01" className="text-white/70 hover:text-white transition-colors flex items-center justify-between group">
                  <span>Swiss Alps &amp; Venice</span>
                  <span className="text-[10px] font-mono text-white/40 group-hover:text-white/80">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/packages/PKG-JPN-02" className="text-white/70 hover:text-white transition-colors flex items-center justify-between group">
                  <span>Kyoto Sanctuary &amp; Bullet Train</span>
                  <span className="text-[10px] font-mono text-white/40 group-hover:text-white/80">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/packages/PKG-NOR-03" className="text-white/70 hover:text-white transition-colors flex items-center justify-between group">
                  <span>Lofoten Arctic Auroras</span>
                  <span className="text-[10px] font-mono text-white/40 group-hover:text-white/80">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link to="/packages/PKG-ALP-04" className="text-white/70 hover:text-white transition-colors flex items-center justify-between group">
                  <span>Dolomites Alpine Chalets</span>
                  <span className="text-[10px] font-mono text-white/40 group-hover:text-white/80">&rarr;</span>
                </Link>
              </li>
              <li className="pt-1">
                <Link to="/packages" className="text-xs font-bold text-white hover:underline flex items-center gap-1 font-mono">
                  <span>View All Expeditions</span>
                  <span>&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Traveler Portal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/90 font-bold">
              <Feather className="size-3.5 text-white/70" />
              <span>Traveler Portal</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/packages" className="text-white/70 hover:text-white transition-colors">
                  Explore Catalog
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-white/70 hover:text-white transition-colors">
                  Active Reservations (PNR)
                </Link>
              </li>
              <li>
                <Link to="/payments" className="text-white/70 hover:text-white transition-colors">
                  Payment Ledger &amp; Invoices
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                  Craft &amp; Travel Philosophy
                </Link>
              </li>
              <li>
                <Link to="/signin" className="text-white/70 hover:text-white transition-colors">
                  Member Sign In &amp; Google SSO
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-white/70 hover:text-white transition-colors">
                  Register Traveler Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Operations & SRE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/90 font-bold">
              <ShieldCheck className="size-3.5 text-white/70" />
              <span>Operations &amp; Admin</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/admin" className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  <span>Admin Control Console</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/70 hover:text-white transition-colors">
                  Tour &amp; Capacity Overrides
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/70 hover:text-white transition-colors">
                  Admin Authority Manager
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/70 hover:text-white transition-colors">
                  Microservices Telemetry
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/70 hover:text-white transition-colors">
                  API Gateway &amp; Rate Limits
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/70 hover:text-white transition-colors">
                  Distributed SRE Event Logs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Escrow & Legal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/90 font-bold">
              <Globe className="size-3.5 text-white/70" />
              <span>Escrow &amp; Trust</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                  Real-Time Seat Lock Protocol
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">
                  KLEF Engineering Architecture
                </Link>
              </li>
              <li>
                <a href="#privacy" className="text-white/70 hover:text-white transition-colors">
                  Privacy Escrow Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-white/70 hover:text-white transition-colors">
                  Terms of Carriage &amp; Service
                </a>
              </li>
              <li>
                <a href="#compliance" className="text-white/70 hover:text-white transition-colors">
                  Financial Settlement SLA
                </a>
              </li>
              <li>
                <a href="mailto:concierge@voyagecraft.com" className="text-white/70 hover:text-white transition-colors">
                  24/7 Concierge Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Socials, & Origin Metadata */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-white/50">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 font-mono">
            <span>&copy; {new Date().getFullYear()} VOYAGECRAFT INC. ALL RIGHTS RESERVED.</span>
            <span className="hidden sm:inline text-white/20">&bull;</span>
            <span>VERIFIED ON SUPABASE POSTGRES</span>
          </div>

          {/* Social / Direct Connection Links */}
          <div className="flex items-center gap-3">
            <Link
              to="/about"
              aria-label="Global Network"
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full border border-white/10"
              title="Global Network"
            >
              <Globe className="size-4" />
            </Link>
            <Link
              to="/packages"
              aria-label="Expeditions"
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full border border-white/10"
              title="Expedition Circuits"
            >
              <Compass className="size-4" />
            </Link>
            <Link
              to="/admin"
              aria-label="Admin Console"
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full border border-white/10"
              title="Operations Console"
            >
              <ShieldCheck className="size-4" />
            </Link>
            <a
              href="mailto:concierge@voyagecraft.com"
              aria-label="Send Dispatch"
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full border border-white/10"
              title="Concierge Dispatch"
            >
              <Send className="size-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
