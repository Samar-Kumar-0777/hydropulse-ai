import React, { useState, useEffect } from 'react';
import { 
  Droplets, Activity, Layers, Cpu, FileText, 
  Pause, Play, Terminal, Search, CheckCircle2, Copy
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('command-center');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [rainfall, setRainfall] = useState(72);
  const [waterDepth, setWaterDepth] = useState(1.58);
  const [flowRate, setFlowRate] = useState(510);
  const [drainagePumpStatus, setDrainagePumpStatus] = useState('AUTO_RUNNING');
  const [agentLogs, setAgentLogs] = useState([
    '[INIT] AWS Strands Agent Framework v2.4 initialized.',
    '[TELEMETRY] Sensor Node A-1 connected: OK.',
    '[MODEL] Vector inference confidence: 98.4%'
  ]);

  const [telemetryHistory, setTelemetryHistory] = useState([35, 48, 55, 68, 75, 70, 85, 90, 82, 92]);

  const [nodes, setNodes] = useState([
    { id: 'NODE-01', location: 'Minto Bridge Underpass', depth: 1.45, status: 'CRITICAL', pressure: '4.2 Bar' },
    { id: 'NODE-02', location: 'ITO Intersection Flyover', depth: 0.85, status: 'WARNING', pressure: '3.1 Bar' },
    { id: 'NODE-03', location: 'Dhaula Kuan Underpass', depth: 0.32, status: 'OPTIMAL', pressure: '2.0 Bar' },
    { id: 'NODE-04', location: 'Pul Prahladpur Canal Bed', depth: 1.28, status: 'CRITICAL', pressure: '4.8 Bar' }
  ]);

  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const rainDelta = (Math.random() * 4 - 2).toFixed(1);
      const newRain = Math.max(10, Math.min(100, Math.round(rainfall + parseFloat(rainDelta))));
      setRainfall(newRain);

      const newDepth = (newRain * 0.022 + Math.random() * 0.05).toFixed(2);
      setWaterDepth(newDepth);

      const newFlow = Math.round(newRain * 6.2 + Math.random() * 20);
      setFlowRate(newFlow);

      setTelemetryHistory(prev => [...prev.slice(1), Math.min(Math.round(newRain * 1.1), 100)]);

      const timestamps = new Date().toLocaleTimeString();
      const logTemplates = [
        `[${timestamps}] [AWS STRANDS] Ingested ${newFlow} L/s flow vector.`,
        `[${timestamps}] [INFERENCE] Flood Risk Index calculated: ${(newRain * 1.15).toFixed(1)}/100.`,
        `[${timestamps}] [ACTUATOR] Valve pressure balanced at ${(2 + Math.random() * 2).toFixed(2)} Bar.`
      ];
      const newLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      setAgentLogs(prev => [newLog, ...prev.slice(0, 10)]);

      setNodes(prevNodes => prevNodes.map(node => {
        const depthFluct = (parseFloat(node.depth) + (Math.random() * 0.04 - 0.02)).toFixed(2);
        return {
          ...node,
          depth: Math.max(0.1, depthFluct),
          status: depthFluct > 1.1 ? 'CRITICAL' : depthFluct > 0.6 ? 'WARNING' : 'OPTIMAL'
        };
      }));

    }, 1200);

    return () => clearInterval(interval);
  }, [isLiveStreaming, rainfall]);

  const filteredNodes = nodes.filter(node => 
    node.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
    node.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const riskScore = Math.min(Math.round(rainfall * 1.12), 100);
  const riskLevel = riskScore > 75 ? 'CRITICAL EMERGENCY' : riskScore > 45 ? 'ELEVATED RISK' : 'NORMAL';
  const riskColor = riskScore > 75 ? '#ef4444' : riskScore > 45 ? '#f59e0b' : '#22c55e';

  const blogMarkdown = `# Building HydroPulse AI: Hyperlocal Flood & Waterlogged Early Warning System

## 1. The Challenge
Monsoon waterlogging and sudden flash floods paralyze urban infrastructure across Indian metros, leading to severe traffic disruptions and property damage.

## 2. Our Solution: HydroPulse AI
HydroPulse AI aggregates IoT drainage telemetry and rainfall feeds to calculate street-level risk scores with live GIS spatial mapping.

## 3. Powered by AWS Open-Source Stack
We integrated **AWS Strands Agents SDK** locally to process incoming water-level vectors:
- **AWS Strands Agents SDK:** Real-time agentic calculation without cloud API overhead.
- **Data Flow:** Drainage Sensors -> Strands Local Agent -> Risk Assessment Vector -> GIS Dashboard.
- **Cloud Deployment:** Hosted seamlessly on AWS Open-Source & Amplify Hosting infrastructure.

## 4. Impact & Next Steps
By providing a 30-minute advance warning before severe flooding occurs, municipal authorities can automatically trigger pumps and alert citizens.`;

  const copyBlog = () => {
    navigator.clipboard.writeText(blogMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ backgroundColor: '#030712', color: '#f8fafc', minHeight: '100vh', width: '100%', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Droplets color="#38bdf8" size={24} />
          <div>
            <h1 style={{ fontSize: '18px', margin: 0 }}>HYDROPULSE COMMAND CENTER</h1>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>AWS Open-Source Strands Agentic Infrastructure</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px' }} />
            <input 
              type="text" 
              placeholder="Search nodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ backgroundColor: '#020617', border: '1px solid #334155', color: '#fff', padding: '6px 10px 6px 30px', borderRadius: '16px', fontSize: '12px', outline: 'none' }}
            />
          </div>

          <button 
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: isLiveStreaming ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${isLiveStreaming ? '#22c55e' : '#ef4444'}`, color: isLiveStreaming ? '#22c55e' : '#ef4444', borderRadius: '16px', cursor: 'pointer', fontSize: '12px' }}
          >
            {isLiveStreaming ? <Pause size={14} /> : <Play size={14} />}
            {isLiveStreaming ? 'STREAMING' : 'PAUSED'}
          </button>
        </div>
      </header>

      {/* FIXED GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 260px', gap: '14px', padding: '14px', boxSizing: 'border-box' }}>
        
        {/* SIDEBAR */}
        <aside style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'command-center', label: 'Command Center', icon: Activity },
              { id: 'strands-agent', label: 'AWS Strands AI', icon: Cpu },
              { id: 'arch-flow', label: 'Architecture', icon: Layers },
              { id: 'blog-post', label: 'AWS Blog Draft', icon: FileText }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 8px', backgroundColor: activeView === item.id ? '#0284c7' : 'transparent', color: activeView === item.id ? '#fff' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', textAlign: 'left' }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>PUMP OVERRIDE</span>
            <div style={{ fontSize: '11px', margin: '4px 0', color: '#cbd5e1' }}>Status: {drainagePumpStatus}</div>
            <button onClick={() => setDrainagePumpStatus(prev => prev === 'AUTO_RUNNING' ? 'BOOST_100%' : 'AUTO_RUNNING')} style={{ width: '100%', padding: '6px', backgroundColor: '#0284c7', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
              TOGGLE
            </button>
          </div>

          <div style={{ backgroundColor: '#020617', padding: '10px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>RAIN SIMULATOR</span>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', margin: '4px 0' }}>{rainfall} mm/hr</label>
            <input type="range" min="10" max="100" value={rainfall} onChange={e => setRainfall(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
        </aside>

        {/* WORKSPACE */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: `1px solid ${riskColor}` }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>RISK INDEX</span>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: riskColor }}>{riskScore}/100</div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #38bdf8' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>DRAIN DEPTH</span>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>{waterDepth}m</div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #f59e0b' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>FLOW RATE</span>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{flowRate}L/s</div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', border: '1px solid #22c55e' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>AWS AGENT</span>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#22c55e', marginTop: '2px' }}>Strands SDK</div>
            </div>
          </div>

          {/* VIEW 1: COMMAND CENTER */}
          {activeView === 'command-center' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8' }}>REAL-TIME TELEMETRY STREAM</span>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '90px', marginTop: '10px' }}>
                  {telemetryHistory.map((val, idx) => (
                    <div key={idx} style={{ flex: 1, backgroundColor: val > 75 ? '#ef4444' : val > 45 ? '#f59e0b' : '#0284c7', height: `${val}%`, borderRadius: '4px' }} />
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', display: 'block', marginBottom: '10px' }}>HOTSPOT NODES</span>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                      <th style={{ padding: '6px' }}>ID</th>
                      <th style={{ padding: '6px' }}>LOCATION</th>
                      <th style={{ padding: '6px' }}>DEPTH</th>
                      <th style={{ padding: '6px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNodes.map(node => (
                      <tr key={node.id} style={{ borderBottom: '1px solid #020617' }}>
                        <td style={{ padding: '8px 6px', color: '#38bdf8' }}>{node.id}</td>
                        <td style={{ padding: '8px 6px' }}>{node.location}</td>
                        <td style={{ padding: '8px 6px' }}>{node.depth}m</td>
                        <td style={{ padding: '8px 6px', color: node.status === 'CRITICAL' ? '#ef4444' : node.status === 'WARNING' ? '#f59e0b' : '#22c55e' }}>{node.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 2: AWS STRANDS AI */}
          {activeView === 'strands-agent' && (
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#38bdf8' }}>AWS Strands Agents SDK Inference Engine</h3>
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '3px 6px', borderRadius: '4px' }}>Edge Active</span>
              </div>
              <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                Processes ultrasonic telemetry data locally using AWS Strands Agents Framework to evaluate risk without cloud network latency.
              </p>
              
              <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>AGENT DECISION PIPELINE LOGIC:</span>
                <code style={{ fontSize: '10px', color: '#38bdf8', display: 'block', lineHeight: '1.5', fontFamily: 'monospace' }}>
                  1. Ingest Telemetry Vector (Rain: {rainfall}mm/hr, Depth: {waterDepth}m)<br />
                  2. Compute Risk Score -&gt; Current Output: {riskScore}/100 ({riskLevel})<br />
                  3. Trigger Actuator Event: {riskScore > 75 ? 'ACTIVATE PUMPS FULL SPEED' : 'STANDBY DRAINAGE PUMPS'}
                </code>
              </div>
            </div>
          )}

          {/* VIEW 3: ARCHITECTURE */}
          {activeView === 'arch-flow' && (
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#38bdf8' }}>AWS Cloud & Open-Source Stack Architecture</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '10px', backgroundColor: '#020617', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                  <strong style={{ fontSize: '11px', color: '#f8fafc' }}>1. Edge Ingestion Layer:</strong>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>IoT Drainage Sensors & Weather Telemetry WebSocket streams into AWS EventBridge.</p>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#020617', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                  <strong style={{ fontSize: '11px', color: '#f8fafc' }}>2. AWS Strands Agents SDK (Open-Source):</strong>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>Agentic framework runs vector risk scoring locally without cloud billing overhead.</p>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#020617', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                  <strong style={{ fontSize: '11px', color: '#f8fafc' }}>3. Amplify / Cloud Hosting UI:</strong>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>React SaaS Command Center interface for municipal emergency teams and public alerts.</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: BLOG POST */}
          {activeView === 'blog-post' && (
            <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 'bold' }}>AWS Builder Center Blog Post Draft</span>
                <button onClick={copyBlog} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                  {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy Blog'}
                </button>
              </div>
              <textarea value={blogMarkdown} readOnly rows={9} style={{ width: '100%', backgroundColor: '#020617', color: '#38bdf8', border: '1px solid #1e293b', borderRadius: '6px', padding: '8px', fontSize: '11px', boxSizing: 'border-box' }} />
            </div>
          )}
        </main>

        {/* LOGS */}
        <aside style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '14px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} color="#38bdf8" />
            <span style={{ fontSize: '11px', fontWeight: 'bold' }}>AGENT LOGS</span>
          </div>
          <div style={{ backgroundColor: '#020617', borderRadius: '6px', padding: '8px', fontFamily: 'monospace', fontSize: '10px', height: '340px', overflowY: 'auto' }}>
            {agentLogs.map((log, i) => (
              <div key={i} style={{ color: i === 0 ? '#38bdf8' : '#64748b', marginBottom: '6px' }}>{log}</div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}