import React from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Icon } from './ui/icon';
import type { LoadBalancerStrategy } from '../types';

export const GatewayConsole: React.FC = () => {
  const {
    gatewayRoutes,
    loadBalancerStrategy,
    setLoadBalancerStrategy,
    toggleRoute,
    simulateTrafficBurst,
    updateRouteRateLimit
  } = useStore();

  const strategies: { id: LoadBalancerStrategy; name: string; desc: string }[] = [
    {
      id: 'ROUND_ROBIN',
      name: 'Round Robin',
      desc: 'Evenly cycles incoming vacation requests in sequential order across active microservice instances.'
    },
    {
      id: 'WEIGHTED_ROUND_ROBIN',
      name: 'Weighted Round Robin',
      desc: 'Distributes traffic proportionally based on assigned server hardware capacity weights.'
    },
    {
      id: 'LEAST_CONNECTIONS',
      name: 'Least Active Connections',
      desc: 'Routes booking requests to the instance with the lowest active thread/socket pool count.'
    },
    {
      id: 'IP_HASH',
      name: 'IP Client Hash',
      desc: 'Ensures sticky traveler session affinity by hashing client IP to a deterministic node.'
    }
  ];

  return (
    <div className="space-y-8 py-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-100 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full font-mono text-[11px]">API GATEWAY</Badge>
            <span className="text-xs text-neutral-500 font-mono">Port 8080 &bull; Spring Cloud Edge Router</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-black uppercase">
            API Gateway &amp; Load Balancing
          </h2>
          <p className="text-sm text-neutral-600">
            Intelligent edge request routing, Bearer JWT filtering, token bucket rate limiting, and dynamic traffic balancing.
          </p>
        </div>

        <Button
          variant="default"
          onClick={simulateTrafficBurst}
          className="rounded-full gap-2 text-xs font-bold h-11 px-6 bg-black text-white hover:bg-neutral-800 shadow-sm"
        >
          <Icon name="bolt" size={18} />
          <span>Fire Traffic Burst (20 Requests)</span>
        </Button>
      </div>

      {/* Load Balancing Strategy Picker */}
      <div className="p-8 rounded-3xl bg-neutral-50/80 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <h3 className="text-base font-bold text-black flex items-center gap-2">
              <Icon name="balance" size={18} />
              Load Balancing Algorithm Configuration
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Select dynamic dispatch strategy utilized by Spring Cloud LoadBalancer.
            </p>
          </div>
          <Badge variant="default" className="rounded-full font-mono text-[10px] bg-black text-white px-3">{loadBalancerStrategy}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {strategies.map((st) => {
            const isSelected = loadBalancerStrategy === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setLoadBalancerStrategy(st.id)}
                className={`text-left p-5 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-black'}`}>{st.name}</span>
                  {isSelected && <Badge variant="secondary" className="rounded-full text-[9px] py-0 bg-white text-black font-bold">ACTIVE</Badge>}
                </div>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>{st.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Route Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-2 font-mono">
          <Icon name="alt_route" size={16} />
          Configured Gateway Edge Routes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gatewayRoutes.map((route) => (
            <div key={route.id} className="p-7 rounded-3xl bg-neutral-50/70 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-black">{route.pathPattern}</span>
                  <Badge variant="outline" className="rounded-full font-mono text-[10px]">{route.id}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-semibold text-neutral-500">
                    {route.enabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                  <Switch
                    checked={route.enabled}
                    onCheckedChange={() => toggleRoute(route.id)}
                  />
                </div>
              </div>

              <div className="text-xs text-neutral-500 font-mono">
                Target Service: <strong className="text-neutral-800 font-semibold">{route.serviceId}</strong>
              </div>

              <div className="space-y-4 text-xs font-mono pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-neutral-500 text-[10px] font-sans">Methods:</span>
                  {route.methods.map((m) => (
                    <Badge key={m} variant="secondary" className="rounded-full text-[10px] px-2.5 py-0 font-bold bg-white text-neutral-800 border border-neutral-200">
                      {m}
                    </Badge>
                  ))}
                  {route.requiresAuth && (
                    <Badge variant="default" className="rounded-full text-[10px] px-2.5 py-0 bg-black text-white">
                      JWT Auth Required
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200 text-[11px] text-neutral-500">
                  <div>
                    <span>Routed Count:</span>
                    <div className="text-black font-bold text-xs">{route.totalRoutedCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span>Avg Latency:</span>
                    <div className="text-black font-bold text-xs">{route.avgLatencyMs}ms</div>
                  </div>
                  <div>
                    <span>Circuit Breaker:</span>
                    <div className="text-black font-bold text-xs">{route.circuitBreakerStatus}</div>
                  </div>
                </div>

                {/* Rate limit adjuster */}
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between font-sans">
                  <span className="text-[11px] text-neutral-600">Rate Limit ({route.rateLimitPerMin} req/min):</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateRouteRateLimit(route.id, Math.max(100, route.rateLimitPerMin - 100))}
                      className="h-7 w-7 rounded-full bg-white border border-neutral-200 text-black flex items-center justify-center hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateRouteRateLimit(route.id, route.rateLimitPerMin + 100)}
                      className="h-7 w-7 rounded-full bg-white border border-neutral-200 text-black flex items-center justify-center hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
