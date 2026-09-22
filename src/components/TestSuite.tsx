import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';

export const TestSuite: React.FC = () => {
  const { testCases, runIntegrationTests } = useStore();
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAll = async () => {
    setIsRunning(true);
    await runIntegrationTests();
    setIsRunning(false);
  };

  const passedCount = testCases.filter(t => t.status === 'PASSED').length;

  return (
    <div className="space-y-8 py-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-100 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full font-mono text-[11px]">TEST HARNESS</Badge>
            <span className="text-xs text-neutral-500 font-mono">Unit &amp; Integration Verification</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase">
            Automated Test Suite
          </h2>
          <p className="text-sm text-neutral-600">
            Automated verification of JWT auth, atomic overbooking guards, Saga rollbacks, Eureka failover, and load balancing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-full bg-neutral-50 font-mono text-xs">
            <span className="text-neutral-500">Suite Status: </span>
            <strong className="text-black font-bold">{passedCount}/{testCases.length} Passed</strong>
          </div>

          <Button
            variant="default"
            onClick={handleRunAll}
            disabled={isRunning}
            className="rounded-full gap-2 font-bold h-11 px-6 bg-black text-white hover:bg-neutral-800 disabled:opacity-50 shadow-sm"
          >
            {isRunning ? (
              <>
                <Icon name="progress_activity" size={18} className="animate-spin" />
                <span>Running Test Suite...</span>
              </>
            ) : (
              <>
                <Icon name="play_arrow" size={18} />
                <span>Execute All Tests</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="space-y-4">
        {testCases.map((tc) => (
          <div key={tc.id} className="p-7 rounded-3xl bg-neutral-50/70 space-y-3">
            <div className="flex items-start justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-black">{tc.title}</span>
                  <Badge variant="outline" className="rounded-full font-mono text-[10px]">{tc.id}</Badge>
                  <Badge variant="secondary" className="rounded-full font-mono text-[10px] bg-white text-neutral-800 border border-neutral-200">{tc.category}</Badge>
                </div>
                <p className="text-xs text-neutral-600 mt-1.5 font-sans">
                  {tc.description}
                </p>
              </div>
              <Badge
                variant={
                  tc.status === 'PASSED'
                    ? 'default'
                    : tc.status === 'RUNNING'
                    ? 'outline'
                    : tc.status === 'FAILED'
                    ? 'destructive'
                    : 'secondary'
                }
                className="rounded-full text-[10px]"
              >
                {tc.status}
              </Badge>
            </div>

            <div className="pt-2 space-y-3 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 text-neutral-700 text-[11px]">
                <strong className="text-black font-semibold">Assertion Contract: </strong>
                <span>{tc.assertion}</span>
              </div>

              {tc.durationMs && (
                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                  <span>Execution Duration:</span>
                  <span><strong className="text-black">{tc.durationMs}ms</strong></span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
