import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { LoadBalancerStrategy } from '../types';

export const AdminManagePage: React.FC = () => {
  const {
    microservices,
    gatewayRoutes,
    loadBalancerStrategy,
    setLoadBalancerStrategy,
    toggleServiceInstance,
    addServiceInstance,
    removeServiceInstance,
    toggleRoute,
    updateRouteRateLimit,
    simulateTrafficBurst,
    logs,
    clearLogs
  } = useStore();

  const [simulating, setSimulating] = useState(false);
  const [showJsonDump, setShowJsonDump] = useState(false);
  const [timeSeries, setTimeSeries] = useState<Array<{ time: string; avgLatency: number; maxCpu: number; reqCount: number }>>([]);

  const totalInstances = microservices.reduce((acc, s) => acc + s.instances.length, 0);
  const upInstances = microservices.reduce((acc, s) => acc + s.instances.filter(i => i.status === 'UP').length, 0);

  // Compute live averages
  const allInstances = microservices.flatMap(s => s.instances);
  const avgLatency = allInstances.length > 0 
    ? Math.round(allInstances.reduce((a, b) => a + b.latencyMs, 0) / allInstances.length)
    : 0;
  const maxCpu = allInstances.length > 0
    ? Math.max(...allInstances.map(i => i.cpuPercent))
    : 0;

  // Track time-series data every 2 seconds for live graphs
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const currentAvg = allInstances.length > 0 
        ? Math.round(allInstances.reduce((a, b) => a + b.latencyMs, 0) / allInstances.length)
        : 12;
      const currentMaxCpu = allInstances.length > 0
        ? Math.max(...allInstances.map(i => i.cpuPercent))
        : 25;
      
      setTimeSeries(prev => [
        ...prev.slice(-19),
        { time: now, avgLatency: currentAvg, maxCpu: currentMaxCpu, reqCount: Math.floor(Math.random() * 80) + 40 }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [allInstances]);

  const handleSimulateBurst = async () => {
    setSimulating(true);
    await simulateTrafficBurst();
    setSimulating(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono p-4 sm:p-8 space-y-8 antialiased selection:bg-black selection:text-white">
      {/* Top Dev Header */}
      <div className="border-b-2 border-black pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
              EUREKA REGISTRY &amp; MICROSERVICES CONSOLE
            </h1>
            <span className="bg-black text-white text-[11px] px-2 py-0.5 font-bold">
              PORT 8761
            </span>
          </div>
          <div className="text-xs text-neutral-600 mt-1 flex flex-wrap gap-4">
            <span>Environment: <strong>PRODUCTION</strong></span>
            <span>Profile: <strong>cloud, postgres, eureka</strong></span>
            <span>Registry: <strong>{upInstances}/{totalInstances} NODES UP</strong></span>
            <span>Avg Latency: <strong>{avgLatency}ms</strong></span>
            <span>Peak CPU: <strong>{maxCpu}%</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateBurst}
            disabled={simulating}
            className="border border-black px-3 py-1.5 text-xs font-bold hover:bg-black hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {simulating ? "BURSTING TRAFFIC..." : "SIMULATE BURST"}
          </button>
          <button
            onClick={() => setShowJsonDump(!showJsonDump)}
            className="border border-black px-3 py-1.5 text-xs font-bold hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            {showJsonDump ? "HIDE JSON" : "RAW METRICS"}
          </button>
          <Link
            to="/admin"
            className="bg-black text-white px-3 py-1.5 text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            &larr; ADMIN PAGE
          </Link>
        </div>
      </div>

      {/* Live Performance Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Graph */}
        <div className="border border-black p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-2 text-xs">
            <span className="font-bold uppercase">Average Cluster Latency (ms)</span>
            <span className="font-bold">{avgLatency} ms current</span>
          </div>
          <div className="h-40 w-full flex items-end gap-1.5 pt-4 bg-neutral-50 p-2 border border-neutral-200">
            {timeSeries.map((pt, idx) => {
              const heightPct = Math.min(100, Math.max(10, (pt.avgLatency / 150) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-black group-hover:bg-neutral-600 transition-all"
                  />
                  <div className="hidden group-hover:block absolute -top-8 bg-black text-white text-[10px] px-1 py-0.5 whitespace-nowrap z-20">
                    {pt.avgLatency}ms ({pt.time})
                  </div>
                </div>
              );
            })}
            {timeSeries.length === 0 && (
              <div className="w-full text-center text-xs text-neutral-400 py-12">
                Awaiting telemetry ticks...
              </div>
            )}
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>T - 40s</span>
            <span>T - 20s</span>
            <span>Now</span>
          </div>
        </div>

        {/* CPU Utilization Graph */}
        <div className="border border-black p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-black pb-2 text-xs">
            <span className="font-bold uppercase">Peak Node CPU Utilization (%)</span>
            <span className="font-bold">{maxCpu}% peak</span>
          </div>
          <div className="h-40 w-full flex items-end gap-1.5 pt-4 bg-neutral-50 p-2 border border-neutral-200">
            {timeSeries.map((pt, idx) => {
              const heightPct = Math.min(100, Math.max(5, pt.maxCpu));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full transition-all ${
                      pt.maxCpu > 70 ? 'bg-neutral-900 border-t-2 border-red-600' : 'bg-black'
                    }`}
                  />
                  <div className="hidden group-hover:block absolute -top-8 bg-black text-white text-[10px] px-1 py-0.5 whitespace-nowrap z-20">
                    {pt.maxCpu}% CPU ({pt.time})
                  </div>
                </div>
              );
            })}
            {timeSeries.length === 0 && (
              <div className="w-full text-center text-xs text-neutral-400 py-12">
                Awaiting telemetry ticks...
              </div>
            )}
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>0%</span>
            <span>50% Threshold</span>
            <span>100% Limit</span>
          </div>
        </div>
      </div>

      {/* Raw JSON metrics inspector */}
      {showJsonDump && (
        <div className="border border-black p-4 bg-neutral-50 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold border-b border-black pb-1">
            <span>GET /eureka/v2/apps (JSON DUMP)</span>
            <button
              onClick={() => setShowJsonDump(false)}
              className="text-xs hover:underline cursor-pointer"
            >
              [CLOSE]
            </button>
          </div>
          <pre className="overflow-x-auto p-3 bg-white border border-neutral-300 text-[11px] max-h-72">
            {JSON.stringify({
              eureka: {
                timestamp: new Date().toISOString(),
                applications: {
                  application: microservices.map(m => ({
                    name: m.serviceId,
                    instance: m.instances.map(i => ({
                      instanceId: i.instanceId,
                      hostName: `${i.port}.internal.voyagecraft.cloud`,
                      app: m.serviceId,
                      ipAddr: i.ip || `10.0.4.${(i.port % 255)}`,
                      status: i.status,
                      port: { $: i.port, "@enabled": "true" },
                      latencyMs: i.latencyMs,
                      cpuPercent: i.cpuPercent,
                      uptimeSeconds: i.uptimeSeconds
                    }))
                  }))
                }
              }
            }, null, 2)}
          </pre>
        </div>
      )}

      {/* Eureka Service Registry Table */}
      <div className="border border-black space-y-0">
        <div className="p-3 bg-black text-white flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider">
            Instances Currently Registered with Eureka
          </span>
          <span className="text-xs font-mono">
            Count: {upInstances} UP / {totalInstances} TOTAL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black bg-neutral-100 font-bold">
                <th className="p-2.5 border-r border-black">Application</th>
                <th className="p-2.5 border-r border-black">AMIs / Port</th>
                <th className="p-2.5 border-r border-black">Status</th>
                <th className="p-2.5 border-r border-black">Latency</th>
                <th className="p-2.5 border-r border-black">CPU</th>
                <th className="p-2.5 border-r border-black">Uptime</th>
                <th className="p-2.5">Node Controls</th>
              </tr>
            </thead>
            <tbody>
              {microservices.map((svc) => (
                <React.Fragment key={svc.serviceId}>
                  <tr className="border-b border-neutral-300 bg-neutral-50 font-bold">
                    <td colSpan={6} className="p-2 border-r border-black">
                      <div className="flex items-center justify-between">
                        <span>{svc.serviceId} ({svc.name}) - v{svc.version}</span>
                        <span className="text-[11px] text-neutral-600 font-normal">
                          {svc.instances.filter(i => i.status === 'UP').length}/{svc.instances.length} ACTIVE
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => addServiceInstance(svc.serviceId)}
                        className="border border-black px-2 py-0.5 text-[11px] font-bold hover:bg-black hover:text-white transition-colors cursor-pointer"
                      >
                        + SCALE NODE
                      </button>
                    </td>
                  </tr>

                  {svc.instances.map((inst) => (
                    <tr key={inst.instanceId} className="border-b border-neutral-200 hover:bg-neutral-50">
                      <td className="p-2 pl-6 border-r border-black font-mono">
                        {inst.instanceId}
                      </td>
                      <td className="p-2 border-r border-black font-mono text-neutral-600">
                        {inst.ip || `10.0.4.${inst.port % 255}`}:{inst.port}
                      </td>
                      <td className="p-2 border-r border-black">
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[10px] font-bold ${
                            inst.status === 'UP' ? 'bg-black text-white' : 'bg-neutral-300 text-black'
                          }`}
                        >
                          {inst.status}
                        </span>
                      </td>
                      <td className="p-2 border-r border-black font-mono">
                        {inst.latencyMs} ms
                      </td>
                      <td className="p-2 border-r border-black font-mono">
                        <div className="flex items-center gap-2">
                          <span>{inst.cpuPercent}%</span>
                          <div className="w-16 h-2 bg-neutral-200 border border-neutral-400 overflow-hidden">
                            <div
                              style={{ width: `${inst.cpuPercent}%` }}
                              className="h-full bg-black"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-2 border-r border-black font-mono text-neutral-600">
                        {Math.floor(inst.uptimeSeconds / 60)}m {inst.uptimeSeconds % 60}s
                      </td>
                      <td className="p-2 flex items-center gap-2">
                        <button
                          onClick={() => toggleServiceInstance(svc.serviceId, inst.instanceId)}
                          className="border border-black px-2 py-0.5 text-[10px] hover:bg-black hover:text-white transition-colors cursor-pointer"
                        >
                          {inst.status === 'UP' ? 'DISABLE' : 'ENABLE'}
                        </button>
                        {svc.instances.length > 1 && (
                          <button
                            onClick={() => removeServiceInstance(svc.serviceId, inst.instanceId)}
                            className="border border-red-600 text-red-600 px-2 py-0.5 text-[10px] hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                          >
                            TERMINATE
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spring Cloud Gateway Routing */}
      <div className="border border-black space-y-0">
        <div className="p-3 bg-black text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="font-bold text-xs uppercase tracking-wider">
            Spring Cloud Gateway - Predicates, Filters &amp; Load Balancing
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span>Algorithm:</span>
            <select
              value={loadBalancerStrategy}
              onChange={(e) => setLoadBalancerStrategy(e.target.value as LoadBalancerStrategy)}
              className="bg-white text-black text-xs font-mono px-2 py-0.5 font-bold border border-black focus:outline-none"
            >
              <option value="ROUND_ROBIN">ROUND_ROBIN</option>
              <option value="WEIGHTED_LEAST_CONN">WEIGHTED_LEAST_CONN</option>
              <option value="RANDOM">RANDOM</option>
              <option value="IP_HASH">IP_HASH</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black bg-neutral-100 font-bold">
                <th className="p-2.5 border-r border-black">Route ID</th>
                <th className="p-2.5 border-r border-black">Path Pattern</th>
                <th className="p-2.5 border-r border-black">Target Service (lb://)</th>
                <th className="p-2.5 border-r border-black">Rate Limit (req/s)</th>
                <th className="p-2.5 border-r border-black">Requests Processed</th>
                <th className="p-2.5 border-r border-black">Status</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {gatewayRoutes.map((route) => (
                <tr key={route.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                  <td className="p-2 border-r border-black font-bold">
                    {route.id}
                  </td>
                  <td className="p-2 border-r border-black font-mono">
                    {route.pathPattern}
                  </td>
                  <td className="p-2 border-r border-black font-mono">
                    lb://{route.serviceId}
                  </td>
                  <td className="p-2 border-r border-black">
                    <input
                      type="number"
                      value={route.rateLimitPerMin}
                      onChange={(e) => updateRouteRateLimit(route.id, parseInt(e.target.value) || 10)}
                      className="w-16 border border-neutral-400 px-1 py-0.5 font-mono text-xs"
                      min={5}
                      max={500}
                    />
                  </td>
                  <td className="p-2 border-r border-black font-mono font-bold">
                    {route.totalRoutedCount.toLocaleString()}
                  </td>
                  <td className="p-2 border-r border-black">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] font-bold ${
                        route.enabled ? 'bg-black text-white' : 'bg-neutral-300 text-black'
                      }`}
                    >
                      {route.enabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleRoute(route.id)}
                      className="border border-black px-2 py-0.5 text-[10px] font-bold hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      {route.enabled ? 'DISABLE' : 'ENABLE'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live System Log Tail */}
      <div className="border border-black space-y-0">
        <div className="p-3 bg-black text-white flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider">
            Live Microservice Telemetry Log Tail ({logs.length} entries)
          </span>
          <button
            onClick={clearLogs}
            className="text-xs text-neutral-300 hover:text-white underline cursor-pointer"
          >
            [CLEAR LOGS]
          </button>
        </div>
        <div className="p-3 bg-neutral-900 text-neutral-100 font-mono text-xs max-h-60 overflow-y-auto space-y-1">
          {logs.slice(0, 30).map((lg) => (
            <div key={lg.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-neutral-500 shrink-0">[{lg.timestamp.split('T')[1].split('.')[0]}]</span>
              <span className={`font-bold shrink-0 ${
                lg.level === 'ERROR' ? 'text-red-400' : lg.level === 'WARN' ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                [{lg.service}]
              </span>
              <span className="text-neutral-300">{lg.message}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-neutral-500 py-4 text-center">No recent log output</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagePage;
