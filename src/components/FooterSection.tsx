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
    <footer className="border-t border-neutral-200/80 bg-white py-16 md:py-24 text-neutral-500 mt-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Brand Emblem */}
        <Link
          to="/"
          aria-label="go home"
          className="mx-auto flex flex-col items-center gap-2 size-fit group"
        >
          <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform p-2">
            <BrandLogo size={20} className="text-white" />
          </div>
          <span className="text-sm font-black tracking-tight text-neutral-950 uppercase">
            VoyageCraft
          </span>
        </Link>

        {/* Primary Navigation Links */}
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm font-medium">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="text-neutral-500 hover:text-neutral-950 block duration-150 transition-colors"
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
            className="text-neutral-400 hover:text-neutral-950 block transition-colors duration-150 p-2 hover:bg-neutral-100 rounded-full"
          >
            <Share2 className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Community Messaging"
            className="text-neutral-400 hover:text-neutral-950 block transition-colors duration-150 p-2 hover:bg-neutral-100 rounded-full"
          >
            <MessageCircle className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Direct Link"
            className="text-neutral-400 hover:text-neutral-950 block transition-colors duration-150 p-2 hover:bg-neutral-100 rounded-full"
          >
            <LinkIcon className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Global Network"
            className="text-neutral-400 hover:text-neutral-950 block transition-colors duration-150 p-2 hover:bg-neutral-100 rounded-full"
          >
            <Globe className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Send Dispatch"
            className="text-neutral-400 hover:text-neutral-950 block transition-colors duration-150 p-2 hover:bg-neutral-100 rounded-full"
          >
            <Send className="size-5" />
          </Link>
          <Link
            to="#"
            aria-label="Editorial Journal"
            className="text-neutral-400 hover:text-neutral-950 block transition-colors duration-150 p-2 hover:bg-neutral-100 rounded-full"
          >
            <Feather className="size-5" />
          </Link>
        </div>

        {/* Copyright */}
        <span className="text-neutral-400 block text-center text-xs font-mono">
          &copy; {new Date().getFullYear()} VoyageCraft Inc. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
