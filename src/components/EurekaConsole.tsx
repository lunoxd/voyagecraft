import React from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Icon } from './ui/icon';

export const EurekaConsole: React.FC = () => {
  const { microservices, toggleServiceInstance, addServiceInstance, removeServiceInstance } = useStore();

  const totalInstances = microservices.reduce((acc, s) => acc + s.instances.length, 0);
  const healthyInstances = microservices.reduce(
    (acc, s) => acc + s.instances.filter(i => i.status === 'UP').length,
    0
  );

  return (
    <div className="space-y-8 py-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-100 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full font-mono text-[11px]">EUREKA SERVER</Badge>
            <span className="text-xs text-neutral-500 font-mono">Port 8761 &bull; Netflix Eureka Registry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase">
            Eureka Service Registry
          </h2>
          <p className="text-sm text-neutral-600">
            Real-time heartbeat monitoring, dynamic node auto-scaling, and health check telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-full bg-neutral-50 font-mono text-xs flex items-center gap-3">
            <div>
              <span className="text-neutral-500">Registry Health: </span>
              <strong className="text-black font-bold">{healthyInstances}/{totalInstances} UP</strong>
            </div>
            <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
          </div>
        </div>
      </div>

      {/* Services Grid (Apple Soft Panels) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {microservices.map((svc) => {
          const upCount = svc.instances.filter(i => i.status === 'UP').length;
          const isAllUp = upCount === svc.instances.length && svc.instances.length > 0;

          return (
            <div key={svc.serviceId} className="p-7 rounded-3xl bg-neutral-50/70 space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-neutral-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-black">{svc.serviceId}</span>
                    <Badge variant="outline" className="rounded-full text-[10px] font-mono">{svc.version}</Badge>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-800 mt-1">
                    {svc.name}
                  </h3>
                </div>
                <Badge variant={isAllUp ? "default" : upCount > 0 ? "outline" : "destructive"} className="rounded-full text-[10px]">
                  {upCount}/{svc.instances.length} ACTIVE
                </Badge>
              </div>

              <p className="text-xs text-neutral-500">
                {svc.description}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-600 uppercase tracking-wider text-[10px] font-mono">
                    Instances ({svc.instances.length})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addServiceInstance(svc.serviceId)}
                    className="rounded-full h-7 text-xs px-3 gap-1 border-neutral-300 hover:border-black font-semibold bg-white"
                  >
                    <Icon name="add" size={14} />
                    <span>Scale Node</span>
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {svc.instances.map((inst) => (
                    <div
                      key={inst.instanceId}
                      className="p-4 rounded-2xl bg-white border border-neutral-200/80 space-y-2 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              inst.status === 'UP' ? 'bg-black' : 'bg-neutral-300'
                            }`}
                          />
                          <span className="font-bold text-black">{inst.instanceId}</span>
                          <span className="text-neutral-500 text-[11px]">{inst.ip}:{inst.port}</span>
                        </div>
                        <Badge variant={inst.status === 'UP' ? 'default' : 'secondary'} className="rounded-full text-[9px]">
                          {inst.status}
                        </Badge>
                      </div>

                      {/* Telemetry Metrics */}
                      <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-neutral-600 border-t border-neutral-100">
                        <div>Latency: <strong className="text-black">{inst.latencyMs}ms</strong></div>
                        <div>CPU: <strong className="text-black">{inst.cpuPercent}%</strong></div>
                        <div>Zone: <strong className="text-black">{inst.zone}</strong></div>
                      </div>

                      {/* Node Controls */}
                      <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                        <span className="text-[10px] text-neutral-500">
                          Uptime: {Math.floor(inst.uptimeSeconds / 3600)}h {Math.floor((inst.uptimeSeconds % 3600) / 60)}m
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => toggleServiceInstance(svc.serviceId, inst.instanceId)}
                            className="rounded-full h-7 text-xs px-3 font-medium bg-neutral-100 hover:bg-neutral-200 text-black"
                          >
                            {inst.status === 'UP' ? 'Simulate Down' : 'Recover Up'}
                          </Button>
                          {svc.instances.length > 1 && (
                            <button
                              onClick={() => removeServiceInstance(svc.serviceId, inst.instanceId)}
                              className="text-neutral-400 hover:text-black p-1 text-xs cursor-pointer transition-colors"
                              title="Deregister node"
                            >
                              <Icon name="delete" size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
