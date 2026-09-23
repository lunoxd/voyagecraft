import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './ui/BrandLogo';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { setIsSignInModalOpen, setIsSignUpModalOpen } = useStore();

  const mainLinks = [
    { path: '/packages', label: 'Expeditions' },
    { path: '/about', label: 'Ethos' },
    { path: '/bookings', label: 'Reservations' },
  ];

  return (
    <>
      {/* Floating VoyageCraft Frosted Glass Navbar Capsule */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl sm:rounded-full px-5 sm:px-7 py-3 flex items-center justify-between gap-4 transition-all duration-300">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-7 w-7 rounded-full bg-white/15 border border-white/25 text-white flex items-center justify-center font-bold shadow-xs p-1">
              <BrandLogo size={16} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-white uppercase tracking-wider">
              VoyageCraft
            </span>
          </Link>

          {/* Center Links */}
          <nav className="hidden sm:flex items-center gap-6">
            {mainLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="text-white/80 hover:text-white text-sm font-medium px-2 cursor-pointer hidden xs:inline-block"
            >
              Sign in
            </button>
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className="bg-white text-black font-semibold text-sm px-5 py-2 rounded-2xl hover:bg-white/90 shadow-md transition-all cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-24" />
    </>
  );
};
