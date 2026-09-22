import React from 'react';
import { useStore } from '../context/StoreContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';
import { Separator } from './ui/separator';
import { BrandLogo } from './ui/BrandLogo';
import { formatCurrency } from '../lib/utils';

export const ReceiptModal: React.FC = () => {
  const { selectedBookingForReceipt, setSelectedBookingForReceipt } = useStore();

  if (!selectedBookingForReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={!!selectedBookingForReceipt} onOpenChange={(open) => !open && setSelectedBookingForReceipt(null)}>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="inverse" className="font-mono text-[10px] px-2">OFFICIAL E-TICKET</Badge>
          <Badge variant="outline" className="font-mono text-[10px]">PAYMENT SETTLED</Badge>
        </div>
        <DialogTitle className="text-2xl font-black text-black">Booking E-Ticket &amp; Invoice</DialogTitle>
        <DialogDescription className="text-xs text-neutral-500">
          Authenticated transaction receipt verified by Payment Service and persisted to SQL.
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-3xl p-6 bg-neutral-50 text-neutral-900 space-y-6 text-xs font-mono">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center p-1">
                <BrandLogo size={14} className="text-white" />
              </span>
              <h3 className="text-base font-black text-black tracking-wider">VOYAGECRAFT</h3>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Tour Reservation Engine &bull; PS030</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-black">{selectedBookingForReceipt.pnr}</div>
            <div className="text-[10px] text-neutral-500">PNR Reference</div>
            <div className="text-[10px] text-neutral-400 mt-1">{new Date(selectedBookingForReceipt.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Passenger & Tour Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-neutral-400 uppercase">Primary Passenger</div>
            <div className="font-bold text-black text-sm">{selectedBookingForReceipt.travelerName}</div>
            <div className="text-neutral-600">{selectedBookingForReceipt.travelerEmail}</div>
            <div className="text-neutral-500">Passport: {selectedBookingForReceipt.passportNo}</div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 uppercase">Itinerary &amp; Tier</div>
            <div className="font-bold text-black text-xs">{selectedBookingForReceipt.packageName}</div>
            <div className="text-neutral-600">Departure: {selectedBookingForReceipt.departureDate}</div>
            <div className="text-neutral-600">Experience: <strong className="text-black">{selectedBookingForReceipt.tier}</strong></div>
          </div>
        </div>

        <Separator />

        {/* Line Items */}
        <div className="space-y-2">
          <div className="flex justify-between text-neutral-500 text-[11px] font-semibold border-b border-neutral-200 pb-1">
            <span>Description</span>
            <span>Qty</span>
            <span>Total</span>
          </div>
          <div className="flex justify-between text-neutral-800">
            <span>Curated Tour Package ({selectedBookingForReceipt.tier} Tier)</span>
            <span>{selectedBookingForReceipt.seats}</span>
            <span className="font-bold text-black">{formatCurrency(selectedBookingForReceipt.totalAmount)}</span>
          </div>
          {selectedBookingForReceipt.specialRequests && (
            <div className="text-[10px] text-neutral-500 pt-1">
              Note: {selectedBookingForReceipt.specialRequests}
            </div>
          )}
        </div>

        <Separator />

        {/* Financial Settlement */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="text-[10px] text-neutral-400 uppercase">Settlement Status</div>
            <Badge variant={selectedBookingForReceipt.paymentStatus === 'PAID' ? 'default' : 'destructive'} className="rounded-full bg-black text-white">
              {selectedBookingForReceipt.paymentStatus}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-neutral-400 uppercase">Total Settled</div>
            <div className="text-xl font-black text-black">{formatCurrency(selectedBookingForReceipt.totalAmount)}</div>
            <div className="text-[10px] text-neutral-500">via {selectedBookingForReceipt.paymentMethod || 'SECURE GATEWAY'}</div>
          </div>
        </div>
      </div>

      <DialogFooter className="print:hidden pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-full gap-1.5 font-semibold">
          <Icon name="print" size={16} />
          <span>Print / Save PDF</span>
        </Button>
        <Button variant="default" size="sm" onClick={() => setSelectedBookingForReceipt(null)} className="rounded-full bg-black text-white hover:bg-neutral-800 font-bold px-6">
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
