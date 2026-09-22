import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import { BrandLogo } from './ui/BrandLogo';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { setIsSignInModalOpen, setIsSignUpModalOpen } = useStore();

  const mainLinks = [
    { path: '/', label: 'Overview', icon: 'home' },
    { path: '/packages', label: 'Tours', icon: 'travel_explore' },
    { path: '/bookings', label: 'Bookings', icon: 'confirmation_number' },
    { path: '/payments', label: 'Ledger', icon: 'account_balance_wallet' },
    { path: '/about', label: 'About', icon: 'info' },
  ];

  return (
    <>
      {/* Floating Apple-Style Pill Navigation Bar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <div className="bg-white/90 backdrop-blur-2xl border border-neutral-200/90 shadow-xl shadow-black/5 rounded-full px-4 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300">
          
          {/* Brand Emblem */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform p-1.5">
              <BrandLogo size={18} className="text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-black uppercase hidden md:inline">
              VoyageCraft
            </span>
          </Link>

          {/* Center Main Navigation Links */}
          <nav className="flex items-center gap-1">
            {mainLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-black text-white shadow-sm font-bold'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100/80'
                  }`}
                >
                  <Icon name={link.icon} size={15} />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSignInModalOpen(true)}
              className="rounded-full text-xs h-8 px-3.5 font-bold border-neutral-200 hover:border-neutral-400 bg-white"
            >
              Sign In
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setIsSignUpModalOpen(true)}
              className="rounded-full text-xs h-8 px-3.5 font-bold bg-black text-white hover:bg-neutral-800 shadow-2xs"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Spacer to push page content cleanly below floating pill navbar */}
      <div className="h-20" />
    </>
  );
};
