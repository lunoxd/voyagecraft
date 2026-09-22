import React from 'react';
import { useStore } from '../context/StoreContext';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';

export const SagaVisualizer: React.FC = () => {
  const { sagas } = useStore();

  return (
    <div className="space-y-8 py-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-100 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full font-mono text-[11px]">SAGA ORCHESTRATOR</Badge>
            <span className="text-xs text-neutral-500 font-mono">Distributed Transaction Coordinator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase">
            Distributed Saga Transactions
          </h2>
          <p className="text-sm text-neutral-600">
            Booking &rarr; Payment &rarr; Package capacity updates with automatic compensation rollback handlers.
          </p>
        </div>
      </div>

      {/* Architecture Flow Diagram (Apple Style Soft Panel) */}
      <div className="p-8 rounded-3xl bg-neutral-50/80 space-y-4">
        <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
          <Icon name="account_tree" size={18} />
          Distributed Saga Choreography Pipeline
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs font-mono">
          <div className="p-5 rounded-2xl bg-white flex flex-col items-center justify-center space-y-1.5 shadow-2xs">
            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
              <Icon name="alt_route" size={16} className="text-white" />
            </div>
            <span className="font-bold text-black pt-1">1. Edge Gateway</span>
            <span className="text-[10px] text-neutral-500">JWT Token Auth</span>
          </div>

          <div className="p-5 rounded-2xl bg-white flex flex-col items-center justify-center space-y-1.5 shadow-2xs">
            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
              <Icon name="lock_clock" size={16} className="text-white" />
            </div>
            <span className="font-bold text-black pt-1">2. Package Lock</span>
            <span className="text-[10px] text-neutral-500">Atomic Seat Quota</span>
          </div>

          <div className="p-5 rounded-2xl bg-white flex flex-col items-center justify-center space-y-1.5 shadow-2xs">
            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
              <Icon name="book_online" size={16} className="text-white" />
            </div>
            <span className="font-bold text-black pt-1">3. Booking Draft</span>
            <span className="text-[10px] text-neutral-500">Generate PNR</span>
          </div>

          <div className="p-5 rounded-2xl bg-white flex flex-col items-center justify-center space-y-1.5 shadow-2xs">
            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
              <Icon name="payments" size={16} className="text-white" />
            </div>
            <span className="font-bold text-black pt-1">4. Payment Capture</span>
            <span className="text-[10px] text-neutral-500">Idempotent Settlement</span>
          </div>

          <div className="p-5 rounded-2xl bg-white flex flex-col items-center justify-center space-y-1.5 shadow-2xs">
            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
              <Icon name="task_alt" size={16} className="text-white" />
            </div>
            <span className="font-bold text-black pt-1">5. Capacity Commit</span>
            <span className="text-[10px] text-neutral-500">Final Confirmation</span>
          </div>
        </div>
      </div>

      {/* Sagas List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-2 font-mono">
          <Icon name="history" size={16} />
          Executed Distributed Transactions ({sagas.length})
        </h3>

        {sagas.length === 0 ? (
          <div className="p-16 rounded-3xl bg-neutral-50 text-center text-xs text-neutral-400 font-mono">
            No dynamic sagas executed yet. Click "Reserve Tour" on any package to trigger a live distributed saga.
          </div>
        ) : (
          sagas.map((saga) => (
            <div key={saga.id} className="p-7 rounded-3xl bg-neutral-50/70 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-black">{saga.name}</span>
                  <Badge variant="outline" className="rounded-full font-mono text-[10px]">{saga.traceId}</Badge>
                </div>
                <Badge variant={saga.status === 'SUCCESS' ? 'default' : 'destructive'} className="rounded-full text-[10px]">
                  {saga.status}
                </Badge>
              </div>

              <div className="text-[11px] text-neutral-500 font-mono">
                Started: {new Date(saga.startTime).toLocaleTimeString()} &bull; Duration: ~80ms
              </div>

              <div className="space-y-2 pt-1">
                {saga.steps.map((step) => (
                  <div
                    key={step.stepIndex}
                    className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[11px]">
                        {step.stepIndex}
                      </span>
                      <div>
                        <div className="font-bold text-black flex items-center gap-2">
                          <span>{step.service}</span>
                          <span className="text-neutral-400 font-normal">&mdash;</span>
                          <span className="text-neutral-700">{step.action}</span>
                        </div>
                        {step.compensationAction && (
                          <div className="text-[10px] text-neutral-500 font-sans">
                            Rollback Handler: {step.compensationAction}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {step.executionTimeMs && (
                        <span className="text-[11px] text-neutral-500">{step.executionTimeMs}ms</span>
                      )}
                      <Badge variant="default" className="rounded-full text-[9px] bg-black text-white">
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
