import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { LoadBalancerStrategy } from '../types';

interface MetricPoint {
  time: string;
  latency: number;
  cpu: number;
  rps: number;
}

// Generates smooth Catmull-Rom / Bezier spline path for SVG
function createSmoothCurve(
  data: number[],
  width: number = 500,
  height: number = 110,
  maxVal: number = 100
): { linePath: string; areaPath: string; points: Array<{ x: number; y: number; val: number }> } {
  if (!data || data.length === 0) return { linePath: '', areaPath: '', points: [] };

  const paddingY = 8;
  const usableHeight = height - paddingY * 2;
  const stepX = width / Math.max(1, data.length - 1);

  const pts = data.map((val, idx) => {
    const clampedVal = Math.max(0, Math.min(maxVal, val));
    const normalizedY = 1 - clampedVal / (maxVal || 1);
    return {
      x: Math.round(idx * stepX * 10) / 10,
      y: Math.round((paddingY + normalizedY * usableHeight) * 10) / 10,
      val
    };
  });

  if (pts.length === 1) {
    return {
      linePath: `M 0,${pts[0].y} L ${width},${pts[0].y}`,
      areaPath: `M 0,${pts[0].y} L ${width},${pts[0].y} L ${width},${height} L 0,${height} Z`,
      points: pts
    };
  }

  let linePath = `M ${pts[0].x},${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) * 0.45;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) * 0.55;
    const cpY2 = p1.y;

    linePath += ` C ${cpX1.toFixed(1)},${cpY1.toFixed(1)} ${cpX2.toFixed(1)},${cpY2.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
  }

  const first = pts[0];
  const last = pts[pts.length - 1];
  const areaPath = `${linePath} L ${last.x},${height} L ${first.x},${height} Z`;

  return { linePath, areaPath, points: pts };
}

// Dynamic load-based color evaluator (Green = Normal/Low, Yellow = Moderate, Red = Critical/Overload)
function getStatusTheme(value: number, type: 'latency' | 'cpu' | 'rps'): {
  colorHex: string;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
} {
  if (type === 'latency') {
    if (value < 35) {
      return {
        colorHex: '#10B981', // Green
        badgeText: 'NORMAL (GREEN)',
        badgeBg: 'bg-emerald-100',
        badgeTextColor: 'text-emerald-800'
      };
    } else if (value < 70) {
      return {
        colorHex: '#F59E0B', // Yellow
        badgeText: 'ELEVATED (YELLOW)',
        badgeBg: 'bg-amber-100',
        badgeTextColor: 'text-amber-800'
      };
    } else {
      return {
        colorHex: '#EF4444', // Red
        badgeText: 'CONGESTION (RED)',
        badgeBg: 'bg-rose-100',
        badgeTextColor: 'text-rose-800'
      };
    }
  } else if (type === 'cpu') {
    if (value < 45) {
      return {
        colorHex: '#10B981', // Green
        badgeText: 'OPTIMAL (GREEN)',
        badgeBg: 'bg-emerald-100',
        badgeTextColor: 'text-emerald-800'
      };
    } else if (value < 75) {
      return {
        colorHex: '#F59E0B', // Yellow
        badgeText: 'MODERATE LOAD (YELLOW)',
        badgeBg: 'bg-amber-100',
        badgeTextColor: 'text-amber-800'
      };
    } else {
      return {
        colorHex: '#EF4444', // Red
        badgeText: 'OVERLOAD - SCALE UP (RED)',
        badgeBg: 'bg-rose-100',
        badgeTextColor: 'text-rose-800'
      };
    }
  } else {
    // RPS / Throughput
    if (value < 65) {
      return {
        colorHex: '#10B981', // Green
        badgeText: 'LOW TRAFFIC (GREEN)',
        badgeBg: 'bg-emerald-100',
        badgeTextColor: 'text-emerald-800'
      };
    } else if (value < 110) {
      return {
        colorHex: '#F59E0B', // Yellow
        badgeText: 'MODERATE (YELLOW)',
        badgeBg: 'bg-amber-100',
        badgeTextColor: 'text-amber-800'
      };
    } else {
      return {
        colorHex: '#EF4444', // Red
        badgeText: 'PEAK BURST (RED)',
        badgeBg: 'bg-rose-100',
        badgeTextColor: 'text-rose-800'
      };
    }
  }
}

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

  // Compute live active instances across cluster
  const totalInstances = microservices.reduce((acc, s) => acc + s.instances.length, 0);
  const upInstances = microservices.reduce((acc, s) => acc + s.instances.filter(i => i.status === 'UP').length, 0);

  // Real-time calculation: more UP nodes = load distributes and drops CPU & latency
  const allInstances = microservices.flatMap(s => s.instances);
  const activeNodes = allInstances.filter(i => i.status === 'UP');

  // Compute live averages dynamically directly from state
  const avgLatency = activeNodes.length > 0 
    ? Math.round(activeNodes.reduce((a, b) => a + b.latencyMs, 0) / activeNodes.length)
    : 18;
  const maxCpu = activeNodes.length > 0
    ? Math.max(...activeNodes.map(i => i.cpuPercent))
    : 30;

  // Initialize with initial history points
  const [timeSeries, setTimeSeries] = useState<MetricPoint[]>(() => {
    const initial: MetricPoint[] = [];
    const now = Date.now();
    for (let i = 18; i >= 0; i--) {
      const t = new Date(now - i * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      initial.push({
        time: t,
        latency: 18,
        cpu: 28,
        rps: 45
      });
    }
    return initial;
  });

  // Track time-series data every 2 seconds for smooth live graphs reflecting active nodes
  useEffect(() => {
    const interval = setInterval(() => {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const currentNodes = microservices.flatMap(s => s.instances).filter(i => i.status === 'UP');
      
      const currentAvgLatency = currentNodes.length > 0 
        ? Math.round(currentNodes.reduce((a, b) => a + b.latencyMs, 0) / currentNodes.length)
        : 18;
      const currentPeakCpu = currentNodes.length > 0
        ? Math.max(...currentNodes.map(i => i.cpuPercent))
        : 28;
      
      const newRps = Math.floor(Math.random() * 20) + (currentNodes.length * 15);

      setTimeSeries(prev => [
        ...prev.slice(-21),
        { time: nowTime, latency: currentAvgLatency, cpu: currentPeakCpu, rps: newRps }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [microservices]);

  const handleSimulateBurst = async () => {
    setSimulating(true);
    await simulateTrafficBurst();
    setSimulating(false);
  };

  const handleScaleAllUp = () => {
    microservices.forEach(svc => {
      addServiceInstance(svc.serviceId);
    });
  };

  const handleScaleDown = () => {
    microservices.forEach(svc => {
      if (svc.instances.length > 1) {
        const lastInst = svc.instances[svc.instances.length - 1];
        removeServiceInstance(svc.serviceId, lastInst.instanceId);
      }
    });
  };

  // Compute smooth curve SVG data for Latency, CPU, RPS
  const latencyData = useMemo(() => timeSeries.map(p => p.latency), [timeSeries]);
  const cpuData = useMemo(() => timeSeries.map(p => p.cpu), [timeSeries]);
  const rpsData = useMemo(() => timeSeries.map(p => p.rps), [timeSeries]);

  const latencyCurve = useMemo(() => createSmoothCurve(latencyData, 500, 110, 100), [latencyData]);
  const cpuCurve = useMemo(() => createSmoothCurve(cpuData, 500, 110, 100), [cpuData]);
  const rpsCurve = useMemo(() => createSmoothCurve(rpsData, 500, 110, 150), [rpsData]);

  const latestLatency = latencyData[latencyData.length - 1] ?? avgLatency;
  const latestCpu = cpuData[cpuData.length - 1] ?? maxCpu;
  const latestRps = rpsData[rpsData.length - 1] ?? 50;

  // Dynamic status themes based on current load values (Green, Yellow, Red)
  const latencyTheme = getStatusTheme(latestLatency, 'latency');
  const cpuTheme = getStatusTheme(latestCpu, 'cpu');
  const rpsTheme = getStatusTheme(latestRps, 'rps');

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
            <span>Active Registry: <strong>{upInstances}/{totalInstances} NODES UP</strong></span>
            <span>Cluster Latency: <strong style={{ color: latencyTheme.colorHex }}>{latestLatency}ms</strong></span>
            <span>Peak CPU: <strong style={{ color: cpuTheme.colorHex }}>{latestCpu}%</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleScaleAllUp}
            className="bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs flex items-center gap-1"
            title="Add nodes to all microservices to reduce CPU load and latency"
          >
            <span>+ SCALE ALL UP</span>
          </button>
          <button
            onClick={handleScaleDown}
            className="border border-neutral-400 text-neutral-700 px-3 py-1.5 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Remove 1 extra instance from each service to observe increased load"
          >
            <span>- SCALE DOWN</span>
          </button>
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

      {/* Real Smooth Curved Graphs Grid (Dynamic Green, Yellow, Red according to Load) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph 1: Cluster Latency (Dynamically Green / Yellow / Red) */}
        <div className="border border-neutral-300 p-4 space-y-3 bg-white shadow-xs rounded-xl transition-all">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: latencyTheme.colorHex }}
              />
              <span className="font-bold uppercase text-neutral-900">Cluster Latency</span>
              <span className={`px-1.5 py-0.2 rounded-sm text-[9px] font-bold ${latencyTheme.badgeBg} ${latencyTheme.badgeTextColor}`}>
                {latencyTheme.badgeText}
              </span>
            </div>
            <span
              className="font-bold text-sm font-mono transition-colors"
              style={{ color: latencyTheme.colorHex }}
            >
              {latestLatency} ms
            </span>
          </div>

          <div className="relative h-32 w-full bg-neutral-50/70 border border-neutral-200 rounded-lg overflow-hidden">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
              <div className="border-b border-neutral-400 w-full" />
              <div className="border-b border-neutral-400 w-full" />
              <div className="border-b border-neutral-400 w-full" />
            </div>

            {/* Y Axis Reference Labels */}
            <div className="absolute right-2 inset-y-1 flex flex-col justify-between text-[9px] font-mono text-neutral-400 pointer-events-none">
              <span>100ms</span>
              <span>50ms</span>
              <span>0ms</span>
            </div>

            {/* Smooth SVG Line & Area Chart */}
            <svg
              className="w-full h-full"
              viewBox="0 0 500 110"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="dynLatencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={latencyTheme.colorHex} stopOpacity="0.38" />
                  <stop offset="70%" stopColor={latencyTheme.colorHex} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={latencyTheme.colorHex} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gradient Fill under curve */}
              {latencyCurve.areaPath && (
                <path
                  d={latencyCurve.areaPath}
                  fill="url(#dynLatencyGrad)"
                />
              )}

              {/* Main Smooth Stroke Path */}
              {latencyCurve.linePath && (
                <path
                  d={latencyCurve.linePath}
                  fill="none"
                  stroke={latencyTheme.colorHex}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-500"
                />
              )}

              {/* Pulse Dot on Current Value */}
              {latencyCurve.points.length > 0 && (
                <g>
                  <circle
                    cx={latencyCurve.points[latencyCurve.points.length - 1].x}
                    cy={latencyCurve.points[latencyCurve.points.length - 1].y}
                    r="4"
                    fill={latencyTheme.colorHex}
                  />
                  <circle
                    cx={latencyCurve.points[latencyCurve.points.length - 1].x}
                    cy={latencyCurve.points[latencyCurve.points.length - 1].y}
                    r="8"
                    fill="none"
                    stroke={latencyTheme.colorHex}
                    strokeWidth="1.5"
                    className="animate-ping opacity-60"
                  />
                </g>
              )}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>T - 40s</span>
            <span>T - 20s</span>
            <span className="font-bold" style={{ color: latencyTheme.colorHex }}>Live</span>
          </div>
        </div>

        {/* Graph 2: Node CPU Load (Dynamically Green / Yellow / Red based on active instances) */}
        <div className="border border-neutral-300 p-4 space-y-3 bg-white shadow-xs rounded-xl transition-all">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: cpuTheme.colorHex }}
              />
              <span className="font-bold uppercase text-neutral-900">Node CPU Load</span>
              <span className={`px-1.5 py-0.2 rounded-sm text-[9px] font-bold ${cpuTheme.badgeBg} ${cpuTheme.badgeTextColor}`}>
                {cpuTheme.badgeText}
              </span>
            </div>
            <span
              className="font-bold text-sm font-mono transition-colors"
              style={{ color: cpuTheme.colorHex }}
            >
              {latestCpu}%
            </span>
          </div>

          <div className="relative h-32 w-full bg-neutral-50/70 border border-neutral-200 rounded-lg overflow-hidden">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
              <div className="border-b border-neutral-400 w-full" />
              <div className="border-b border-neutral-400 w-full" />
              <div className="border-b border-neutral-400 w-full" />
            </div>

            {/* Y Axis Reference Labels */}
            <div className="absolute right-2 inset-y-1 flex flex-col justify-between text-[9px] font-mono text-neutral-400 pointer-events-none">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>

            {/* Threshold Warning Line (75%) */}
            <div className="absolute left-0 right-0 top-[25%] border-t border-dashed border-amber-400 pointer-events-none opacity-50"></div>

            {/* Smooth SVG Line & Area Chart */}
            <svg
              className="w-full h-full"
              viewBox="0 0 500 110"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="dynCpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cpuTheme.colorHex} stopOpacity="0.38" />
                  <stop offset="70%" stopColor={cpuTheme.colorHex} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={cpuTheme.colorHex} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gradient Fill under curve */}
              {cpuCurve.areaPath && (
                <path
                  d={cpuCurve.areaPath}
                  fill="url(#dynCpuGrad)"
                />
              )}

              {/* Main Smooth Stroke Path */}
              {cpuCurve.linePath && (
                <path
                  d={cpuCurve.linePath}
                  fill="none"
                  stroke={cpuTheme.colorHex}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-500"
                />
              )}

              {/* Pulse Dot on Current Value */}
              {cpuCurve.points.length > 0 && (
                <g>
                  <circle
                    cx={cpuCurve.points[cpuCurve.points.length - 1].x}
                    cy={cpuCurve.points[cpuCurve.points.length - 1].y}
                    r="4"
                    fill={cpuTheme.colorHex}
                  />
                  <circle
                    cx={cpuCurve.points[cpuCurve.points.length - 1].x}
                    cy={cpuCurve.points[cpuCurve.points.length - 1].y}
                    r="8"
                    fill="none"
                    stroke={cpuTheme.colorHex}
                    strokeWidth="1.5"
                    className="animate-ping opacity-60"
                  />
                </g>
              )}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>0%</span>
            <span>75% Warning Line</span>
            <span className="font-bold" style={{ color: cpuTheme.colorHex }}>Live</span>
          </div>
        </div>

        {/* Graph 3: Gateway Throughput / RPS (Dynamically Green / Yellow / Red) */}
        <div className="border border-neutral-300 p-4 space-y-3 bg-white shadow-xs rounded-xl transition-all">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: rpsTheme.colorHex }}
              />
              <span className="font-bold uppercase text-neutral-900">Throughput / Load</span>
              <span className={`px-1.5 py-0.2 rounded-sm text-[9px] font-bold ${rpsTheme.badgeBg} ${rpsTheme.badgeTextColor}`}>
                {rpsTheme.badgeText}
              </span>
            </div>
            <span
              className="font-bold text-sm font-mono transition-colors"
              style={{ color: rpsTheme.colorHex }}
            >
              {latestRps} RPS
            </span>
          </div>

          <div className="relative h-32 w-full bg-neutral-50/70 border border-neutral-200 rounded-lg overflow-hidden">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
              <div className="border-b border-neutral-400 w-full" />
              <div className="border-b border-neutral-400 w-full" />
              <div className="border-b border-neutral-400 w-full" />
            </div>

            {/* Y Axis Reference Labels */}
            <div className="absolute right-2 inset-y-1 flex flex-col justify-between text-[9px] font-mono text-neutral-400 pointer-events-none">
              <span>150 rps</span>
              <span>75 rps</span>
              <span>0 rps</span>
            </div>

            {/* Smooth SVG Line & Area Chart */}
            <svg
              className="w-full h-full"
              viewBox="0 0 500 110"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="dynRpsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={rpsTheme.colorHex} stopOpacity="0.38" />
                  <stop offset="70%" stopColor={rpsTheme.colorHex} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={rpsTheme.colorHex} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gradient Fill under curve */}
              {rpsCurve.areaPath && (
                <path
                  d={rpsCurve.areaPath}
                  fill="url(#dynRpsGrad)"
                />
              )}

              {/* Main Smooth Stroke Path */}
              {rpsCurve.linePath && (
                <path
                  d={rpsCurve.linePath}
                  fill="none"
                  stroke={rpsTheme.colorHex}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-500"
                />
              )}

              {/* Pulse Dot on Current Value */}
              {rpsCurve.points.length > 0 && (
                <g>
                  <circle
                    cx={rpsCurve.points[rpsCurve.points.length - 1].x}
                    cy={rpsCurve.points[rpsCurve.points.length - 1].y}
                    r="4"
                    fill={rpsTheme.colorHex}
                  />
                  <circle
                    cx={rpsCurve.points[rpsCurve.points.length - 1].x}
                    cy={rpsCurve.points[rpsCurve.points.length - 1].y}
                    r="8"
                    fill="none"
                    stroke={rpsTheme.colorHex}
                    strokeWidth="1.5"
                    className="animate-ping opacity-60"
                  />
                </g>
              )}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
            <span>T - 40s</span>
            <span>T - 20s</span>
            <span className="font-bold" style={{ color: rpsTheme.colorHex }}>Live</span>
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
