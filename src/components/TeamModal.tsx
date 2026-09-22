import React from 'react';
import { useStore } from '../context/StoreContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';

export const TeamModal: React.FC = () => {
  const { isTeamModalOpen, setIsTeamModalOpen } = useStore();

  if (!isTeamModalOpen) return null;

  return (
    <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen} className="max-w-xl bg-white border-neutral-200">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="rounded-full font-mono text-[10px]">VOYAGECRAFT</Badge>
          <span className="text-xs font-mono text-neutral-500">Architecture Specification</span>
        </div>
        <DialogTitle className="text-2xl font-black text-black">
          VoyageCraft Engine Overview
        </DialogTitle>
        <DialogDescription className="text-xs text-neutral-500">
          Tour reservation engine with real-time capacity tracking, atomic lock guards, and Spring Boot microservices.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 text-xs font-sans">
        <div className="p-4 rounded-2xl bg-neutral-50 space-y-2">
          <h4 className="font-bold text-black flex items-center gap-2">
            <Icon name="verified_user" size={16} /> Zero-Overbooking Guarantee
          </h4>
          <p className="text-neutral-600 leading-relaxed">
            Atomic SQL row locks prevent race conditions during high-volume reservation checkout events.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 space-y-2">
          <h4 className="font-bold text-black flex items-center gap-2">
            <Icon name="sync_alt" size={16} /> Distributed Saga Orchestration
          </h4>
          <p className="text-neutral-600 leading-relaxed">
            Coordinated forward and rollback compensating transactions between booking, payment, and inventory services.
          </p>
        </div>
      </div>

      <DialogFooter className="pt-4 border-t border-neutral-100">
        <Button
          variant="default"
          onClick={() => setIsTeamModalOpen(false)}
          className="rounded-full w-full bg-black text-white hover:bg-neutral-800 font-bold h-10 text-xs"
        >
          Close Specification
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
