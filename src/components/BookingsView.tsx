import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Icon } from './ui/icon';
import { BadgeGroup } from './ui/badge-group';
import { EmptyState } from './ui/empty-state';
import { Avatar } from './ui/avatar';
import { formatCurrency } from '../lib/utils';
import type { Booking } from '../types';

export const BookingsView: React.FC = () => {
  const { bookings, cancelBooking, setSelectedBookingForReceipt } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.passportNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCancel = async (booking: Booking) => {
    if (confirm(`Are you sure you want to cancel reservation ${booking.pnr} for ${booking.travelerName}? This will trigger an automatic refund and restore capacity to the package.`)) {
      await cancelBooking(booking.id);
    }
  };

  const confirmedCount = bookings.filter(b => b.bookingStatus === 'CONFIRMED').length;

  return (
    <div className="space-y-8 py-6 max-w-full overflow-hidden font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
        <div className="space-y-3">
          <BadgeGroup
            badge="BOOKING SERVICE"
            message={`Port 8084 / 8085 • ${confirmedCount} Active Reservations`}
            variant="brand"
            showArrow={false}
          />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 uppercase">
            Reservations &amp; PNRs
          </h2>
          <p className="text-sm text-neutral-600">
            Real-time traveler bookings, atomic reservation status, and automated refund dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-4 py-2 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <span className="text-neutral-500">Total PNRs: </span>
            <strong className="text-black font-bold text-sm">{bookings.length}</strong>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
            <span className="text-neutral-500">Confirmed: </span>
            <strong className="text-emerald-700 font-bold text-sm">
              {confirmedCount}
            </strong>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Icon name="search" size={18} className="absolute left-4 top-3 text-neutral-400" />
          <Input
            placeholder="Search PNR, traveler name, or tour..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 rounded-full bg-white border-neutral-200 text-xs font-mono placeholder:text-neutral-400 focus:bg-white shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['ALL', 'CONFIRMED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-black text-white font-bold shadow-2xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              {st === 'ALL' ? 'All Bookings' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List or Empty State */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon="confirmation_number"
            title="No reservations found"
            description={searchTerm ? `No bookings match "${searchTerm}".` : "No bookings in this category yet."}
            actionText="Clear Filters"
            onAction={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
            }}
          />
        ) : (
          filteredBookings.map((b) => {
            const initials = b.travelerName
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-white border border-neutral-200/90 hover:border-black transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs hover:shadow-md"
              >
                <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-5">
                  <Avatar
                    initials={initials}
                    size="lg"
                    status={b.bookingStatus === 'CONFIRMED' ? 'online' : 'offline'}
                  />

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-lg text-black">{b.pnr}</span>
                      <span className="text-[10px] text-neutral-400 font-mono bg-neutral-100 px-2 py-0.5 rounded-full">{b.id}</span>
                    </div>
                    <div className="font-bold text-black text-sm">{b.travelerName}</div>
                    <div className="text-xs text-neutral-500">{b.travelerEmail} &bull; Passport: {b.passportNo}</div>
                  </div>

                  <div className="max-w-xs pl-0 sm:pl-4 sm:border-l sm:border-neutral-200">
                    <div className="text-xs font-semibold text-neutral-900 truncate">{b.packageName}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      Departure: {b.departureDate} &bull; {b.seats} Seat(s) ({b.tier})
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                  <div className="text-right font-mono">
                    <div className="text-lg font-black text-black">{formatCurrency(b.totalAmount)}</div>
                    <Badge
                      variant={
                        b.bookingStatus === 'CONFIRMED'
                          ? 'success'
                          : b.bookingStatus === 'CANCELLED'
                          ? 'destructive'
                          : 'secondary'
                      }
                      showDot
                      className="rounded-full text-[10px]"
                    >
                      {b.bookingStatus}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBookingForReceipt(b)}
                      className="rounded-full h-8 px-3 text-xs gap-1 border-neutral-300 hover:border-black font-semibold bg-white"
                    >
                      <Icon name="receipt" size={14} />
                      <span>Receipt</span>
                    </Button>
                    {b.bookingStatus === 'CONFIRMED' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(b)}
                        className="rounded-full h-8 px-3 text-xs gap-1 font-semibold"
                      >
                        <Icon name="cancel" size={14} />
                        <span>Cancel</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
