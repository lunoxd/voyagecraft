import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';

export const AddPackageModal: React.FC = () => {
  const { isAddPackageModalOpen, setIsAddPackageModalOpen, addPackage } = useStore();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState(8);
  const [totalCapacity, setTotalCapacity] = useState(15);
  const [basePrice, setBasePrice] = useState(349000);
  const [deluxePrice, setDeluxePrice] = useState(489000);
  const [vipPrice, setVipPrice] = useState(649000);
  const [category, setCategory] = useState<'LUXURY_EUROPE' | 'ASIAN_EXPEDITION' | 'NORDIC_SAFARI' | 'ALPINE_ESCORT'>('LUXURY_EUROPE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    addPackage({
      code: code.toUpperCase(),
      title,
      subtitle: subtitle || "Multi-City Curated Luxury Expedition",
      description: description || "Exclusive luxury multi-city tour with concierge service.",
      destinations: [
        { city: "Geneva", country: "Switzerland", nights: 3, highlights: ["Lake Cruise", "Old Town Tour"] },
        { city: "Lucerne", country: "Switzerland", nights: 3, highlights: ["Mount Pilatus", "Chapel Bridge"] }
      ],
      durationDays: Number(durationDays),
      totalCapacity: Number(totalCapacity),
      basePrice: Number(basePrice),
      deluxePrice: Number(deluxePrice),
      vipPrice: Number(vipPrice),
      departureDates: ["2026-11-15", "2026-12-05", "2027-01-10"],
      inclusions: [
        "5-Star Accommodations",
        "Executive Private Transfers",
        "Curated Degustation Dining",
        "Dedicated Tour Director"
      ],
      exclusions: ["International Flights", "Personal Expenses"],
      status: "ACTIVE",
      featured: true,
      category
    });

    setIsAddPackageModalOpen(false);
    setTitle('');
    setCode('');
    setSubtitle('');
    setDescription('');
  };

  return (
    <Dialog open={isAddPackageModalOpen} onOpenChange={setIsAddPackageModalOpen} className="max-w-2xl bg-white border-neutral-200">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="rounded-full font-mono text-[10px]">PACKAGE SERVICE</Badge>
          <Badge variant="secondary" className="rounded-full font-mono text-[10px] bg-neutral-100 text-neutral-800">POST /api/v1/packages</Badge>
        </div>
        <DialogTitle className="text-2xl font-black text-black flex items-center gap-2">
          <Icon name="add_circle" size={24} />
          Create New Tour Package
        </DialogTitle>
        <DialogDescription className="text-xs text-neutral-500">
          Register a new travel package with itinerary configuration and capacity thresholds.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-neutral-700 font-semibold">Package Title *</label>
            <Input
              placeholder="e.g. Grand Scandinavian Fjords"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border-neutral-200"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-neutral-700 font-semibold">Package Code *</label>
            <Input
              placeholder="e.g. VC-SCA-05"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-white border-neutral-200"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-neutral-700 font-semibold">Subtitle / Route Summary</label>
          <Input
            placeholder="e.g. Stockholm &bull; Oslo &bull; Bergen &bull; Geiranger Fjord"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="bg-white border-neutral-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-neutral-700 font-semibold">Description</label>
          <Input
            placeholder="High-level description of this itinerary..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white border-neutral-200"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="space-y-1.5">
            <label className="text-neutral-700 font-semibold">Days</label>
            <Input
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              min={1}
              className="bg-white border-neutral-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-neutral-700 font-semibold">Capacity</label>
            <Input
              type="number"
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(Number(e.target.value))}
              min={1}
              className="bg-white border-neutral-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-neutral-700 font-semibold">Base (₹)</label>
            <Input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              min={1000}
              className="bg-white border-neutral-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-neutral-700 font-semibold">Deluxe (₹)</label>
            <Input
              type="number"
              value={deluxePrice}
              onChange={(e) => setDeluxePrice(Number(e.target.value))}
              min={1000}
              className="bg-white border-neutral-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-neutral-700 font-semibold">VIP (₹)</label>
            <Input
              type="number"
              value={vipPrice}
              onChange={(e) => setVipPrice(Number(e.target.value))}
              min={1000}
              className="bg-white border-neutral-200"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-neutral-700 font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-neutral-900 text-xs focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="LUXURY_EUROPE">Luxury European Circuit</option>
            <option value="ASIAN_EXPEDITION">Asian Cultural Expedition</option>
            <option value="NORDIC_SAFARI">Nordic Arctic Safari</option>
            <option value="ALPINE_ESCORT">Alpine Summit Royale</option>
          </select>
        </div>

        <DialogFooter className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setIsAddPackageModalOpen(false)} className="rounded-full">
            Cancel
          </Button>
          <Button type="submit" variant="default" className="rounded-full gap-1.5 bg-black text-white hover:bg-neutral-800 font-bold px-6">
            <Icon name="check" size={16} />
            <span>Publish Tour</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
