import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Icon } from './ui/icon';

export const LogStream: React.FC = () => {
  const { logs, clearLogs } = useStore();
  const [filterService, setFilterService] = useState<string>('ALL');
  const [filterLevel] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const services = ['ALL', 'EUREKA-SERVER', 'API-GATEWAY', 'AUTH-SERVICE', 'PACKAGE-SERVICE', 'BOOKING-SERVICE', 'PAYMENT-SERVICE'];

  const filteredLogs = logs.filter((log) => {
    const matchesService = filterService === 'ALL' || log.service === filterService;
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.traceId.toLowerCase().includes(search.toLowerCase()) ||
      log.service.toLowerCase().includes(search.toLowerCase());
    return matchesService && matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-100 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full font-mono text-[11px]">AUDIT &amp; TELEMETRY</Badge>
            <span className="text-xs text-neutral-500 font-mono">Centralized Cluster Stream</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase">
            Cluster Event Logs
          </h2>
          <p className="text-sm text-neutral-600">
            Real-time audit log stream tracing requests across Gateway, Eureka, Auth, and Transaction services.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={clearLogs}
          className="rounded-full gap-1.5 text-xs h-10 px-5 border-neutral-300 hover:border-black font-semibold bg-white"
        >
          <Icon name="delete_sweep" size={16} />
          <span>Clear Logs</span>
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Icon name="search" size={18} className="absolute left-4 top-3 text-neutral-400" />
          <Input
            placeholder="Search log messages or trace IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 rounded-full bg-neutral-50 border-neutral-200 text-xs font-mono placeholder:text-neutral-400 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {services.map((svc) => (
            <button
              key={svc}
              onClick={() => setFilterService(svc)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                filterService === svc
                  ? 'bg-black text-white font-bold'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
              }`}
            >
              {svc === 'ALL' ? 'ALL SERVICES' : svc}
            </button>
          ))}
        </div>
      </div>

      {/* Apple Soft Panel Log Stream Container */}
      <div className="rounded-3xl bg-neutral-50/80 p-6 font-mono text-xs shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-3 text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="text-neutral-700 font-bold ml-2">cluster-audit-trail.log</span>
          </div>
          <span className="font-semibold">{filteredLogs.length} events logged</span>
        </div>

        <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-2">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">No log entries found.</div>
          ) : (
            filteredLogs.map((log) => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              });

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-2.5 py-2 px-3 rounded-xl hover:bg-white/80 transition-colors"
                >
                  <span className="text-neutral-400 text-[11px] shrink-0">{timeStr}</span>
                  <Badge
                    variant={
                      log.level === 'SUCCESS'
                        ? 'default'
                        : log.level === 'ERROR'
                        ? 'destructive'
                        : log.level === 'WARN'
                        ? 'outline'
                        : 'secondary'
                    }
                    className="rounded-full text-[9px] px-2 py-0 shrink-0 font-mono"
                  >
                    {log.level}
                  </Badge>
                  <span className="text-neutral-800 font-bold shrink-0 text-[11px]">
                    [{log.service}]
                  </span>
                  <span className="text-neutral-400 text-[10px] shrink-0 font-mono">
                    {log.traceId}
                  </span>
                  <span className="text-neutral-700 text-[11px] leading-relaxed break-words font-sans">
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
