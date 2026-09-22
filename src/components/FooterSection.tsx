import { Link } from 'react-router-dom';
import { BrandLogo } from './ui/BrandLogo';

// Import generic icons from lucide-react
import {
  Globe, // Could represent a website or general online presence
  Share2, // Could represent sharing/social media in general
  MessageCircle, // Could represent communication/social
  Link as LinkIcon, // Renamed to avoid conflict with Link
  Send, // Could represent sending a message, a bit like a paper plane for social
  Feather, // Could be an abstract representation for a 'feed' or 'post'
} from 'lucide-react';

const links = [
  {
    title: 'Expedition Catalog',
    href: '/packages',
  },
  {
    title: 'Active Reservations',
    href: '/bookings',
  },
  {
    title: 'Payment Ledger',
    href: '/payments',
  },
  {
    title: 'About & Philosophy',
    href: '/about',
  },
  {
    title: 'Privacy Escrow',
    href: '#',
  },
  {
    title: 'Terms of Service',
    href: '#',
  },
];

export default function FooterSection() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950/40 backdrop-blur-2xl py-16 md:py-24 text-white/70 mt-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Brand Emblem */}
        <Link
          to="/"
          aria-label="go home"
          className="mx-auto flex flex-col items-center gap-2 size-fit group"
        >
          <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform p-2">
            <BrandLogo size={20} className="text-white" />
          </div>
          <span className="text-sm font-black tracking-tight text-white uppercase">
            VoyageCraft
          </span>
        </Link>

        {/* Primary Navigation Links */}
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm font-medium">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="text-white/70 hover:text-white block duration-150 transition-colors"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>

        {/* Generic Social / Connection Links */}
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          <Link
            to="#"
            aria-label="Share"
            className="text-white/60 hover:text-white block transition-colors duration-150 p-2 hover:bg-white/10 rounded-full"
          >
            <Share2 className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Community Messaging"
            className="text-white/60 hover:text-white block transition-colors duration-150 p-2 hover:bg-white/10 rounded-full"
          >
            <MessageCircle className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Direct Link"
            className="text-white/60 hover:text-white block transition-colors duration-150 p-2 hover:bg-white/10 rounded-full"
          >
            <LinkIcon className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Global Network"
            className="text-white/60 hover:text-white block transition-colors duration-150 p-2 hover:bg-white/10 rounded-full"
          >
            <Globe className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Send Dispatch"
            className="text-white/60 hover:text-white block transition-colors duration-150 p-2 hover:bg-white/10 rounded-full"
          >
            <Send className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Editorial Journal"
            className="text-white/60 hover:text-white block transition-colors duration-150 p-2 hover:bg-white/10 rounded-full"
          >
            <Feather className="size-5" />
          </Link>
        </div>

        {/* Copyright */}
        <span className="text-white/40 block text-center text-xs font-mono">
          &copy; {new Date().getFullYear()} VoyageCraft Inc. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
