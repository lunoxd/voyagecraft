import React from 'react';
import { Badge } from '../components/ui/badge';
import { Icon } from '../components/ui/icon';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-20 py-8 max-w-5xl mx-auto overflow-hidden">
      {/* Editorial Header */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full font-mono text-[11px] font-bold px-3 py-1 bg-neutral-50">
            THE VOYAGECRAFT PHILOSOPHY
          </Badge>
          <span className="text-xs text-neutral-500 font-mono">Bespoke Expeditions &bull; Resilient Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black uppercase leading-none">
          The Craft of <br />
          <span className="text-neutral-400 font-normal">Unforgettable Expeditions.</span>
        </h1>
        <p className="text-base sm:text-xl text-neutral-600 leading-relaxed max-w-3xl">
          VoyageCraft merges artisanal travel curation with high-performance distributed systems engineering. Every journey is designed with meticulous attention to detail, backed by atomic SQL inventory locks and resilient microservices.
        </p>
      </div>

      {/* Brand Values / The VoyageCraft Pillars */}
      <section className="space-y-8">
        <div>
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">Our Pillars</div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase">
            Curated with Intention
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                <Icon name="diamond" size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Private Access &amp; Heritage Suites</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                From private nighttime openings at the Louvre to historic Alpine chalets in St. Moritz and authentic Ryokan onsens in Kyoto, we unlock doors closed to standard tourism.
              </p>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 font-semibold pt-2 border-t border-neutral-200/60">
              Curated Partners: 50+ Global Heritage Estates
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                <Icon name="verified_user" size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Zero-Overbooking Guarantee</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Our proprietary SQL seat-locking engine guarantees that once you hold an expedition slot, it cannot be double-booked by concurrent checkout traffic or network race conditions.
              </p>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 font-semibold pt-2 border-t border-neutral-200/60">
              Concurrency Lock: Pessimistic Row Escrow
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                <Icon name="sync_alt" size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-black">Saga Financial Escrow</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Distributed Saga orchestration automatically coordinates reservation holds, card authorization, and automated compensation rollbacks if a downstream settlement fails.
              </p>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 font-semibold pt-2 border-t border-neutral-200/60">
              Idempotency: Cryptographic SHA-256 Keys
            </div>
          </div>
        </div>
      </section>

      {/* Behind The Engine - Technical Architecture Matrix */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">Infrastructure Matrix</div>
            <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight flex items-center gap-2">
              <Icon name="account_tree" size={26} />
              The Orchestration Engine
            </h2>
          </div>
          <Link to="/admin">
            <Button variant="outline" size="sm" className="rounded-full text-xs font-bold gap-1.5 border-neutral-300">
              <Icon name="admin_panel_settings" size={15} />
              <span>Explore Admin Portal &rarr;</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/60 space-y-3 hover:bg-neutral-100/80 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black font-mono text-sm flex items-center gap-2">
                <Icon name="dns" size={18} className="text-black" />
                PACKAGE &amp; INVENTORY SERVICE
              </span>
              <Badge variant="secondary" className="rounded-full text-[10px] font-mono">Port 8082, 8083</Badge>
            </div>
            <p className="text-neutral-600 leading-relaxed font-sans text-xs">
              Maintains multi-city catalog, departure dates, pricing tiers, and atomic capacity hold locks to eliminate concurrency race conditions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/60 space-y-3 hover:bg-neutral-100/80 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black font-mono text-sm flex items-center gap-2">
                <Icon name="confirmation_number" size={18} className="text-black" />
                BOOKING &amp; PNR SERVICE
              </span>
              <Badge variant="secondary" className="rounded-full text-[10px] font-mono">Port 8084, 8085</Badge>
            </div>
            <p className="text-neutral-600 leading-relaxed font-sans text-xs">
              Executes traveler reservations, generates PNR codes, coordinates with the Saga orchestrator, and manages cancellations with automated refund triggers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/60 space-y-3 hover:bg-neutral-100/80 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black font-mono text-sm flex items-center gap-2">
                <Icon name="account_balance_wallet" size={18} className="text-black" />
                PAYMENT &amp; LEDGER SERVICE
              </span>
              <Badge variant="secondary" className="rounded-full text-[10px] font-mono">Port 8086, 8087</Badge>
            </div>
            <p className="text-neutral-600 leading-relaxed font-sans text-xs">
              Processes card authorizations with idempotent keys, records settlement ledgers in SQL, and issues automated refunds upon cancellation.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-neutral-50/90 border border-neutral-200/60 space-y-3 hover:bg-neutral-100/80 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black font-mono text-sm flex items-center gap-2">
                <Icon name="hub" size={18} className="text-black" />
                EUREKA &amp; SPRING GATEWAY
              </span>
              <Badge variant="secondary" className="rounded-full text-[10px] font-mono">Port 8761 / 8080</Badge>
            </div>
            <p className="text-neutral-600 leading-relaxed font-sans text-xs">
              Dynamic service discovery with 30s heartbeats, client-side load balancing, JWT authentication, and centralized request routing.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <div className="p-10 sm:p-14 rounded-3xl bg-black text-white text-center space-y-6">
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
          Ready to Begin Your Journey?
        </h3>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
          Explore our handpicked seasonal itineraries with guaranteed departures, or sign in to manage your traveler portfolio.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/packages">
            <Button size="lg" className="rounded-full bg-white text-black hover:bg-neutral-100 font-bold px-8 h-12 text-sm">
              <span>View All Tours</span>
              <Icon name="arrow_forward" size={16} className="ml-1" />
            </Button>
          </Link>
          <Link to="/signin">
            <Button size="lg" variant="outline" className="rounded-full border-neutral-700 text-white hover:bg-neutral-900 px-6 h-12 text-sm">
              <span>Sign In to Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
