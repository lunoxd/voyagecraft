import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';
import { formatCurrency } from '../lib/utils';
import type { TravelTier } from '../types';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    selectedPackage,
    currentUser,
    createBooking
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields - Default dynamically to active user profile or empty fields
  const [travelerName, setTravelerName] = useState(currentUser?.name || '');
  const [travelerEmail, setTravelerEmail] = useState(currentUser?.email || '');
  const [travelerPhone, setTravelerPhone] = useState('');
  const [passportNo, setPassportNo] = useState('');
  const [seats, setSeats] = useState(2);
  const [departureDate, setDepartureDate] = useState('');
  const [tier, setTier] = useState<TravelTier>('DELUXE');
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'CORPORATE_INVOICE' | 'BANK_WIRE' | 'CRYPTO_ESCROW'>('CREDIT_CARD');
  const [specialRequests, setSpecialRequests] = useState('First class panoramic window seating, gourmet culinary preferences.');

  React.useEffect(() => {
    if (currentUser?.name && !travelerName) {
      setTravelerName(currentUser.name);
    }
    if (currentUser?.email && !travelerEmail) {
      setTravelerEmail(currentUser.email);
    }
  }, [currentUser]);

  React.useEffect(() => {
    if (selectedPackage && selectedPackage.departureDates.length > 0) {
      setDepartureDate(selectedPackage.departureDates[0]);
    }
  }, [selectedPackage]);

  if (!selectedPackage) return null;

  const pricePerPerson =
    tier === 'VIP' ? selectedPackage.vipPrice : tier === 'DELUXE' ? selectedPackage.deluxePrice : selectedPackage.basePrice;
  const totalPrice = pricePerPerson * seats;
  const availableSlots = Math.max(0, selectedPackage.totalCapacity - selectedPackage.bookedSlots - selectedPackage.lockedSlots);

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!travelerName || !travelerEmail || !passportNo) {
        setErrorMsg('Please complete all mandatory traveler credential fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (seats > availableSlots) {
        setErrorMsg(`Requested ${seats} seats exceeds available capacity (${availableSlots}).`);
        return;
      }
      setStep(3);
    }
  };

  const handleExecuteBooking = async () => {
    setLoading(true);
    setErrorMsg(null);

    const result = await createBooking({
      packageId: selectedPackage.id,
      travelerName,
      travelerEmail,
      travelerPhone,
      passportNo,
      seats,
      departureDate,
      tier,
      paymentMethod,
      specialRequests
    });

    setLoading(false);

    if (result.success && result.booking) {
      setStep(4);
    } else {
      setErrorMsg(result.error || 'Failed to process booking.');
    }
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setErrorMsg(null);
    }, 200);
  };

  return (
    <Dialog open={isBookingModalOpen} onOpenChange={handleClose} className="max-w-2xl bg-white border-neutral-200">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full font-mono text-[10px] bg-neutral-50">RESERVATION ENGINE</Badge>
            <span className="text-xs font-mono text-neutral-500">Step {step} of 4</span>
          </div>
          <Badge variant="secondary" className="rounded-full font-mono text-[10px] bg-neutral-100 text-neutral-800">
            {availableSlots} Seats Available
          </Badge>
        </div>

        {selectedPackage.imageUrl && (
          <div className="relative h-28 w-full rounded-2xl overflow-hidden mt-3 mb-1 bg-neutral-900">
            <img
              src={selectedPackage.imageUrl}
              alt={selectedPackage.title}
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
              <span className="text-white font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md">
                {selectedPackage.code} &bull; {selectedPackage.category.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        <DialogTitle className="text-xl sm:text-2xl font-black mt-2 text-black">
          {selectedPackage.title}
        </DialogTitle>
        <DialogDescription className="text-xs text-neutral-500">
          Atomic reservation hold and payment settlement pipeline.
        </DialogDescription>
      </DialogHeader>

      {/* Step Indicator Bar */}
      <div className="grid grid-cols-4 gap-2 mb-6 text-center text-xs">
        {[
          { num: 1, label: 'Passenger' },
          { num: 2, label: 'Itinerary' },
          { num: 3, label: 'Payment' },
          { num: 4, label: 'Confirmed' },
        ].map((s) => (
          <div
            key={s.num}
            className={`py-2 px-3 rounded-full font-mono text-[11px] transition-colors ${
              step === s.num
                ? 'bg-black text-white font-bold'
                : step > s.num
                ? 'bg-neutral-100 text-neutral-800'
                : 'bg-neutral-50 text-neutral-400'
            }`}
          >
            {s.num}. {s.label}
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 rounded-2xl bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs flex items-center gap-2 font-medium">
          <Icon name="error" size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: Traveler Details */}
      {step === 1 && (
        <div className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold">Primary Traveler Name *</label>
              <Input
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                placeholder="Full Legal Name"
                className="bg-white border-neutral-200"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold">Email Address (E-Ticket) *</label>
              <Input
                type="email"
                value={travelerEmail}
                onChange={(e) => setTravelerEmail(e.target.value)}
                placeholder="name@domain.com"
                className="bg-white border-neutral-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold">Contact Phone</label>
              <Input
                value={travelerPhone}
                onChange={(e) => setTravelerPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="bg-white border-neutral-200"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold">Passport Number *</label>
              <Input
                value={passportNo}
                onChange={(e) => setPassportNo(e.target.value)}
                placeholder="Passport ID"
                className="bg-white border-neutral-200"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-700 font-semibold">Special Requests</label>
            <Input
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Dietary requests, room preferences..."
              className="bg-white border-neutral-200"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-neutral-100">
            <Button variant="outline" onClick={handleClose} className="rounded-full">
              Cancel
            </Button>
            <Button variant="default" onClick={handleNext} className="rounded-full gap-1.5 font-bold bg-black text-white hover:bg-neutral-800">
              <span>Next: Itinerary &amp; Tier</span>
              <Icon name="arrow_forward" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Tier & Dates */}
      {step === 2 && (
        <div className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold">Departure Date</label>
              <select
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-neutral-900 text-xs focus:outline-none focus:ring-1 focus:ring-black"
              >
                {selectedPackage.departureDates.map((date) => (
                  <option key={date} value={date}>
                    {date} (Guaranteed)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-700 font-semibold">Number of Seats</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  className="h-10 w-10 rounded-full border border-neutral-200 bg-white text-black flex items-center justify-center hover:bg-neutral-100 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono text-sm px-4 font-bold text-black">{seats}</span>
                <button
                  type="button"
                  onClick={() => setSeats(Math.min(availableSlots, seats + 1))}
                  className="h-10 w-10 rounded-full border border-neutral-200 bg-white text-black flex items-center justify-center hover:bg-neutral-100 font-bold cursor-pointer"
                >
                  +
                </button>
                <span className="text-neutral-500 text-[11px] font-mono">Max: {availableSlots}</span>
              </div>
            </div>
          </div>

          {/* Tier Selector */}
          <div className="space-y-2">
            <label className="text-neutral-700 font-semibold block">Experience Tier</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { tier: 'STANDARD' as const, name: 'Standard', price: selectedPackage.basePrice },
                { tier: 'DELUXE' as const, name: 'Deluxe', price: selectedPackage.deluxePrice },
                { tier: 'VIP' as const, name: 'VIP Imperial', price: selectedPackage.vipPrice },
              ].map((t) => (
                <button
                  key={t.tier}
                  type="button"
                  onClick={() => setTier(t.tier)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    tier === t.tier
                      ? 'border-black bg-black text-white shadow-sm'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  <div className={`font-bold text-xs ${tier === t.tier ? 'text-white' : 'text-black'}`}>{t.name}</div>
                  <div className={`text-base font-mono font-black mt-1 ${tier === t.tier ? 'text-white' : 'text-black'}`}>{formatCurrency(t.price)}</div>
                  <div className={`text-[10px] ${tier === t.tier ? 'text-neutral-300' : 'text-neutral-500'}`}>/ traveler</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 flex items-center justify-between text-xs">
            <span className="text-neutral-600 font-medium">Subtotal ({seats} seats &times; {formatCurrency(pricePerPerson)}):</span>
            <span className="text-xl font-mono font-black text-black">{formatCurrency(totalPrice)}</span>
          </div>

          <div className="pt-4 flex justify-between gap-2 border-t border-neutral-100">
            <Button variant="outline" onClick={() => setStep(1)} className="rounded-full">
              Back
            </Button>
            <Button variant="default" onClick={handleNext} className="rounded-full gap-1.5 font-bold bg-black text-white hover:bg-neutral-800">
              <span>Next: Settlement</span>
              <Icon name="arrow_forward" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-4 text-xs font-sans">
          <div className="rounded-2xl bg-neutral-50 p-5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <span className="font-bold text-black text-sm">Booking Summary</span>
              <Badge variant="default" className="rounded-full bg-black text-white text-[10px]">{tier} TIER</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-neutral-600 font-mono text-[11px]">
              <div>Traveler: <span className="text-black font-bold">{travelerName}</span></div>
              <div>Departure: <span className="text-black font-bold">{departureDate}</span></div>
              <div>Seats: <span className="text-black font-bold">{seats} Passenger(s)</span></div>
              <div>Passport: <span className="text-black font-bold">{passportNo}</span></div>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-600 font-semibold">Total Settlement:</span>
              <span className="text-2xl font-black font-mono text-black">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-neutral-700 font-semibold block">Select Settlement Gateway</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'CREDIT_CARD' as const, name: 'Credit Card / UPI', icon: 'credit_card' },
                { id: 'BANK_WIRE' as const, name: 'NEFT / RTGS (NetBanking)', icon: 'account_balance' },
                { id: 'CORPORATE_INVOICE' as const, name: 'Corporate Invoice (Net 30)', icon: 'receipt_long' },
                { id: 'CRYPTO_ESCROW' as const, name: 'Escrow Settlement', icon: 'currency_bitcoin' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`flex items-center gap-2 p-3.5 rounded-2xl border text-left cursor-pointer transition-colors ${
                    paymentMethod === pm.id
                      ? 'border-black bg-black text-white font-bold shadow-sm'
                      : 'border-neutral-200 bg-white hover:border-neutral-400 text-neutral-800'
                  }`}
                >
                  <Icon name={pm.icon} size={18} />
                  <span className="text-xs">{pm.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between gap-2 border-t border-neutral-100">
            <Button variant="outline" onClick={() => setStep(2)} disabled={loading} className="rounded-full">
              Back
            </Button>
            <Button
              variant="default"
              onClick={handleExecuteBooking}
              disabled={loading}
              className="rounded-full gap-2 font-bold px-6 bg-black text-white hover:bg-neutral-800"
            >
              {loading ? (
                <>
                  <Icon name="progress_activity" size={16} className="animate-spin" />
                  <span>Processing Saga...</span>
                </>
              ) : (
                <>
                  <Icon name="lock" size={16} />
                  <span>Confirm &amp; Pay ({formatCurrency(totalPrice)})</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="py-8 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-md">
            <Icon name="check" size={36} className="text-white font-bold" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-black uppercase">Reservation Confirmed!</h3>
            <p className="text-xs text-neutral-500">
              Transaction finalized and inventory committed to the SQL database.
            </p>
          </div>

          <div className="p-5 max-w-sm mx-auto rounded-3xl bg-neutral-50 font-mono text-xs text-left space-y-2 text-neutral-700">
            <div className="flex justify-between">
              <span className="text-neutral-500">Package:</span>
              <span className="text-black font-bold">{selectedPackage.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Passenger:</span>
              <span className="text-black font-bold">{travelerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Total Settled:</span>
              <span className="text-black font-black text-base">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="default" onClick={handleClose} className="rounded-full font-bold px-8 bg-black text-white hover:bg-neutral-800">
              Done
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};
