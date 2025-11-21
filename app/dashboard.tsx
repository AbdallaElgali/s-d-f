"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, User, ChevronRight, TrendingUp, 
  Zap, Moon, Droplet, AlertTriangle, 
  Scale, Shield, Briefcase, Menu, 
  ArrowUpRight, ArrowDownRight, Target, Bell,
  FileText, Ruler, Hash, Calendar, ExternalLink, Gauge, Loader2,
  Brain, Sliders, Battery, AlertOctagon, Info
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// --- 1. NEW COMPONENT: AI SESSION PREDICTOR ---

const SessionPredictor = ({ player, apiBase }) => {
  const [inputs, setInputs] = useState({
    duration: 90, // minutes
    rpe: 7,       // 1-10
    distance: 4000 // meters
  });
  
  const [hoverRpe, setHoverRpe] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Helper for RPE Colors
  const getRpeColor = (level) => {
    if (level >= 8) return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]';
    if (level >= 5) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  };

  // Real API Call to Backend
  const handlePredict = async () => {
    setIsCalculating(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiBase}/api/predict-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: player?.player_id,
          ...inputs
        }),
      });

      if (!response.ok) throw new Error('Prediction failed');

      const data = await response.json();
      setPrediction(data); 
    } catch (err) {
      console.error("Prediction Error:", err);
      setError("Model unavailable. Check backend connection.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* LEFT: INPUTS */}
      <div className="lg:col-span-4 bg-zinc-900/80 border border-white/5 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-6 text-yellow-500">
          <Sliders size={20} />
          <h3 className="font-bold text-sm uppercase tracking-widest">Session Parameters</h3>
        </div>

        <div className="space-y-8">
          {/* Duration Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm items-center">
              <span className="text-zinc-400 font-medium flex items-center gap-2"><Calendar size={14}/> Duration</span>
              <span className="text-white font-mono bg-zinc-800 px-2 py-1 rounded text-xs">{inputs.duration} min</span>
            </div>
            <input type="range" min="10" max="150" step="5" value={inputs.duration} onChange={(e) => setInputs({...inputs, duration: parseInt(e.target.value)})} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:bg-zinc-700 transition-colors" />
            <div className="flex justify-between text-[10px] text-zinc-600 font-mono uppercase">
              <span>Warmup</span>
              <span>Game+OT</span>
            </div>
          </div>

          {/* RPE Picker (Improved Tactile UI) */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm items-center">
              <span className="text-zinc-400 font-medium flex items-center gap-2"><Zap size={14}/> Target Intensity</span>
              <span className="text-white font-mono bg-zinc-800 px-2 py-1 rounded text-xs">{inputs.rpe} / 10</span>
            </div>
            <div className="flex gap-1.5 h-10 w-full" onMouseLeave={() => setHoverRpe(null)}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button 
                  key={level} 
                  onClick={() => setInputs({...inputs, rpe: level})} 
                  onMouseEnter={() => setHoverRpe(level)} 
                  className={`flex-1 rounded transition-all duration-200 relative group ${level <= (hoverRpe || inputs.rpe) ? getRpeColor(level) : 'bg-zinc-800 hover:bg-zinc-700'} ${level === inputs.rpe ? 'ring-2 ring-white scale-110 z-10' : ''}`}
                >
                   {/* Hover Label */}
                   <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-800 z-50">
                    {level}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-zinc-600 font-mono uppercase">
              <span>Rest</span>
              <span>Max Effort</span>
            </div>
          </div>

          {/* Distance Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm items-center">
              <span className="text-zinc-400 font-medium flex items-center gap-2"><Activity size={14}/> Est. Distance</span>
              <span className="text-white font-mono bg-zinc-800 px-2 py-1 rounded text-xs">{inputs.distance} m</span>
            </div>
            <input type="range" min="1000" max="8000" step="100" value={inputs.distance} onChange={(e) => setInputs({...inputs, distance: parseInt(e.target.value)})} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:bg-zinc-700 transition-colors" />
          </div>

          <button onClick={handlePredict} disabled={isCalculating} className="w-full py-4 bg-white hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {isCalculating ? <Loader2 className="animate-spin" /> : <Brain size={18} />}
            {isCalculating ? "Processing Model..." : "Run AI Prediction"}
          </button>
          {error && <p className="text-xs text-rose-500 text-center mt-2">{error}</p>}
        </div>
      </div>

      {/* RIGHT: OUTPUTS */}
      <div className="lg:col-span-8 bg-zinc-950 border border-white/10 rounded-3xl p-1 relative overflow-hidden min-h-[400px] flex flex-col">
        {!prediction && !isCalculating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 p-8 text-center">
            <Brain size={48} className="mb-6 opacity-20 text-white" />
            <h4 className="text-white font-bold text-lg mb-2">AI Session Simulator</h4>
            <p className="text-sm text-zinc-500 max-w-md">Use the controls to simulate training. The backend model will predict <strong>Invisible Mechanical Load</strong> based on your volume inputs.</p>
          </div>
        )}

        {isCalculating && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-20">
             <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden">
               <div className="h-full bg-yellow-500 animate-progress-indeterminate"></div>
             </div>
             <p className="mt-4 text-xs font-mono text-yellow-500 animate-pulse">CALCULATING MECHANICAL LOAD...</p>
           </div>
        )}

        {prediction && !isCalculating && (
          <div className="h-full flex flex-col bg-zinc-900/30 rounded-[20px] p-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-white font-bold text-xl flex items-center gap-2"><Zap className="text-yellow-500" size={20} /> Predicted Impact</h2>
                <p className="text-zinc-500 text-xs font-mono mt-1 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>MODEL CONFIDENCE: 94%</p>
              </div>
              <div className={`px-4 py-1 rounded-full border ${prediction.risk_label === 'High' ? 'bg-rose-500/10 border-rose-500/30' : prediction.risk_label === 'Moderate' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${prediction.risk_color}`}>{prediction.risk_label} Risk</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              <div className="space-y-4">
                <div className="p-5 bg-zinc-950 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-zinc-500 uppercase font-bold">Est. Mechanical Load</p>
                    <Info size={14} className="text-zinc-700" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-mono font-bold text-white tracking-tighter">{prediction.mech_load}</span>
                    <span className="text-xs text-zinc-500 font-bold">AU</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${prediction.mech_load > 800 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${Math.min((prediction.mech_load / 1000) * 100, 100)}%`}}></div>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-3 leading-tight">Predicted tissue stress (Accel/Decel) based on inputs.</p>
                </div>

                <div className="p-5 bg-zinc-950 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Session Classification</p>
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${prediction.session_type === 'Match Intensity' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {prediction.session_type === 'Match Intensity' ? <AlertOctagon size={20}/> : <Battery size={20}/>}
                    </div>
                    <span className="text-xl font-bold text-white">{prediction.session_type}</span>
                  </div>
                </div>
              </div>

              <div className="relative h-[250px] md:h-auto w-full bg-zinc-950/50 rounded-2xl border border-white/5 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={prediction.radar_data}>
                    <PolarGrid stroke="#3f3f46" strokeOpacity={0.5} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: '600' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Session" dataKey="B" stroke="#eab308" strokeWidth={3} fill="#eab308" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 2. HELPER COMPONENTS (Original) ---

const MetricCard = ({ title, value, subtext, status, icon: Icon, trend, trendValue }) => {
  return (
    <div className={`relative group overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/60 backdrop-blur-md p-5 transition-all duration-300 hover:border-white/10 hover:bg-zinc-800/80 hover:shadow-2xl hover:shadow-black/50`}>
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity opacity-0 group-hover:opacity-20 ${status === 'danger' ? 'bg-rose-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl border bg-zinc-950/50 ${status === 'danger' ? 'border-rose-500/30 text-rose-400' : status === 'warning' ? 'border-amber-500/30 text-amber-400' : 'border-emerald-500/30 text-emerald-400'}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : trend === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-500 bg-zinc-800'}`}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trendValue}%
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-mono font-medium text-white tracking-tighter">{value}</span>
        </div>
        <p className={`text-xs mt-2 font-medium flex items-center gap-1.5 ${status === 'danger' ? 'text-rose-400' : status === 'warning' ? 'text-amber-400' : 'text-zinc-400'}`}>
          {status === 'danger' && <AlertTriangle size={10} />}
          {subtext}
        </p>
      </div>
    </div>
  );
};

const RadialProgress = ({ score, label }) => {
  const safeScore = score || 0;
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;
  const getColor = (s) => s > 85 ? '#34d399' : s > 60 ? '#fbbf24' : '#f43f5e';

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg] transition-all duration-1000 ease-out">
        <circle stroke="#27272a" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
        <circle stroke={getColor(safeScore)} fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset, strokeLinecap: "round" }} r={normalizedRadius} cx={radius} cy={radius} />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="text-xl font-bold text-white font-mono">{safeScore}</span>
      </div>
    </div>
  );
};

const StatPill = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 bg-zinc-950/50 border border-white/5 p-3 rounded-2xl">
    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-yellow-500">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">{label}</p>
      <p className="text-white font-mono font-medium">{value}</p>
    </div>
  </div>
);

const LoadingScreen = ({ message }) => {
  return (
    <div className="absolute inset-0 z-20 bg-zinc-950/80 backdrop-blur-xl flex flex-col items-center justify-center rounded-3xl border border-white/5">
      <div className="relative w-24 h-24 flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-yellow-500 rounded-full animate-spin"></div>
        <Activity className="text-yellow-500 animate-pulse" size={32} />
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-mono font-bold text-white tracking-tight animate-pulse">
          {message}
        </h3>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></span>
        </div>
      </div>
      
      <div className="w-64 h-1 bg-zinc-800 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-yellow-500/50 animate-progress-indeterminate"></div>
      </div>
      <p className="text-xs text-zinc-500 mt-4 font-mono">AI MODEL V2.4 LOADING</p>
    </div>
  );
};

const LoadChart = ({ chartData }) => {
  const formattedData = chartData.map(d => ({
    date: new Date(d.activity_date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
    load: d.external_load || 0,
    ac: d.ac_ratio || 0
  }));

  if (!formattedData || formattedData.length === 0) {
    return <div className="h-64 w-full flex items-center justify-center text-zinc-500 text-xs">No Load Data Available</div>;
  }

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="date" tick={{fill: '#71717a', fontSize: 10}} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#e4e4e7' }}
            cursor={{stroke: '#52525b', strokeWidth: 1, strokeDasharray: '4 4'}}
          />
          <Area type="monotone" dataKey="load" name="Ext Load" stroke="#eab308" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} activeDot={{r: 4, strokeWidth: 0}} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 3. MAIN DASHBOARD COMPONENT ---

export default function LoewenDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [players, setPlayers] = useState([]);
  const [teamStatus, setTeamStatus] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // --- FIXED: Initialize readiness object to prevent TypeError ---
  const [trends, setTrends] = useState({ 
    chart_data: [], 
    insights: [], 
    readiness: { score: 0, status: 'Loading' } 
  });
  
  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing Data");

  const API_BASE = "http://localhost:5000";

  // Mock data for demonstration fallback
  const MOCK_PLAYERS = [
    { player_id: 'p1', name: 'Tischler, N.', jersey_number: 13, position: 'Forward', photo_url: '', height_m: 2.01, weight_kg: 98, age: 23 },
    { player_id: 'p2', name: 'Kramer, D.', jersey_number: 44, position: 'Guard', photo_url: '', height_m: 1.90, weight_kg: 85, age: 26 },
    { player_id: 'p3', name: 'Bango, J.', jersey_number: 21, position: 'Center', photo_url: '', height_m: 2.08, weight_kg: 105, age: 24 }
  ];

  // ----------------------------------------------------------------
  // 1. DATA FETCHING LOGIC
  // ----------------------------------------------------------------

  useEffect(() => {
    // Initial Player Fetch
    fetch(`${API_BASE}/api/players`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPlayers(data);
          setSelectedPlayer(data[0]);
        } else {
          setPlayers(MOCK_PLAYERS);
          setSelectedPlayer(MOCK_PLAYERS[0]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch players:", err);
        setPlayers(MOCK_PLAYERS);
        setSelectedPlayer(MOCK_PLAYERS[0]);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/dashboard/team-status`)
      .then(res => res.json())
      .then(data => setTeamStatus(data))
      .catch(err => console.error("Failed to fetch status:", err));
  }, []);

  useEffect(() => {
    let isMounted = true; 

    const runLoadingSequence = async () => {
      if (selectedPlayer?.player_id) {
        setIsLoading(true);
        // Reset trends slightly to avoid stale data flickering, but keep readiness structure
        setTrends({ chart_data: [], insights: [], readiness: { score: 0, status: 'Analyzing...' } });

        try {
          setLoadingMessage("Analyzing Data");
          await new Promise((resolve) => setTimeout(resolve, 1000)); 
          if (!isMounted) return;

          setLoadingMessage("Training Model");
          await new Promise((resolve) => setTimeout(resolve, 1000)); 
          if (!isMounted) return;

          setLoadingMessage("Predicting Injury Risk");
          await new Promise((resolve) => setTimeout(resolve, 1000)); 
          if (!isMounted) return;

          const response = await fetch(
            `${API_BASE}/api/player/${selectedPlayer.player_id}/trends`
          );
          
          if (!response.ok) throw new Error("Network response was not ok");
          
          const data = await response.json();

          if (isMounted) {
            setTrends(data);
            setIsLoading(false);
          }

        } catch (err) {
          console.error("Failed to fetch trends", err);
          if (isMounted) {
            // --- FIXED: Mock Data now includes readiness object ---
            const mockData = {
              chart_data: Array.from({ length: 7 }, (_, i) => ({
                activity_date: new Date(Date.now() - i * 86400000).toISOString(),
                external_load: Math.random() * 500 + 300,
                ac_ratio: Math.random() * 0.8 + 0.7,
              })).reverse(),
              insights: [
                {
                  type: "WARNING",
                  title: "Spike Detected",
                  message: "Load increased rapidly over last 48h.",
                  action: "Reduce intensity.",
                },
              ],
              readiness: {
                score: 78,
                status: "Moderate (Mock)"
              }
            };
            setTrends(mockData);
            setIsLoading(false);
          }
        }
      }
    };

    runLoadingSequence();

    return () => {
      isMounted = false;
    };
  }, [selectedPlayer]);

  // ----------------------------------------------------------------

  const currentPlayerStatus = teamStatus.find(s => s.name === selectedPlayer?.name) || {};
  
  // --- FIXED: Use Optional Chaining (?. and ??) to safely access readiness data 
  const readinessScore = trends.readiness?.score ?? 0;
  const readinessStatus = trends.readiness?.status || "Analyzing";

  const loadRpe = currentPlayerStatus.load_rpe || 450;
  const acRatio = currentPlayerStatus.ac_ratio || 1.1;
  const primaryInsight = trends.insights && trends.insights.length > 0 
    ? trends.insights[0] 
    : { message: "No critical data available.", action: "Monitor standard load." };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-yellow-500/30">
      {/* Background Gradient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 opacity-50"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
            
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-all duration-300">
                <span className="text-zinc-900 font-black text-2xl italic tracking-tighter">L</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-white leading-none">LÖWEN</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-yellow-500 transition-colors">Analytics</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center bg-zinc-900/50 rounded-full p-1 border border-white/5">
            {[
              { id: 'dashboard', label: 'Performance', icon: Gauge },
              { id: 'player-info', label: 'Player Bio', icon: User },
              { id: 'ai-lab', label: 'AI Lab', icon: Brain },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === item.id
                    ? 'bg-zinc-800 text-white shadow-lg shadow-black/20'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                {activeTab === item.id && <item.icon size={14} className="text-yellow-500"/>}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border border-zinc-900"></span>
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group">
              <div className="text-right">
                <p className="text-xs text-zinc-500 font-medium group-hover:text-yellow-500 transition-colors">Head Coach</p>
                <p className="text-sm font-bold text-white">Dr. M. Reus</p>
              </div>
              <div className={`w-9 h-9 rounded-full border border-white/10 flex items-center justify-center bg-zinc-800 text-yellow-500`}>
                <User size={16} />
              </div>
            </div>
            <button className="md:hidden p-2 text-white" onClick={() => setSidebarOpen(!isSidebarOpen)}><Menu /></button>
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
          {/* SIDEBAR (Roster) */}
          <aside className={`lg:col-span-3 fixed inset-y-0 left-0 z-40 w-80 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:bg-transparent lg:border-none lg:w-auto lg:h-auto pt-24 lg:pt-0 px-4 lg:px-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden sticky top-24 h-[calc(100vh-8rem)] flex flex-col">
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Target size={14} className="text-yellow-500"/> Active Roster</span>
                <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700">{players.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                {players.map((player) => {
                  const pStatus = teamStatus.find(s => s.name === player.name);
                  const color = pStatus?.status_color === 'RED' ? 'bg-rose-500' : pStatus?.status_color === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500';

                  return (
                    <button
                      key={player.player_id}
                      onClick={() => { setSelectedPlayer(player); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${selectedPlayer?.player_id === player.player_id ? 'bg-yellow-500 text-zinc-900 shadow-lg shadow-yellow-500/20' : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-white'}`}
                    >
                      <div className="relative shrink-0">
                        <img 
                            src={player.photo_url || "https://placehold.co/100x100/3F3F46/D4D4D8?text=?"} 
                            alt={player.name} 
                            className={`w-10 h-10 rounded-xl object-cover bg-zinc-800 ${selectedPlayer?.player_id === player.player_id ? 'ring-2 ring-zinc-900/20' : 'grayscale group-hover:grayscale-0 transition-all'}`} 
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/3F3F46/D4D4D8?text=?" }}
                        />
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${selectedPlayer?.player_id === player.player_id ? 'border-yellow-400' : 'border-zinc-900'} ${color}`}></div>
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-sm truncate leading-tight">{player.name}</p>
                          <span className={`text-[10px] font-mono font-bold ${selectedPlayer?.player_id === player.player_id ? 'text-zinc-900/60' : 'text-zinc-600'}`}>#{player.jersey_number}</span>
                        </div>
                        <p className={`text-[10px] font-medium uppercase tracking-wider ${selectedPlayer?.player_id === player.player_id ? 'text-zinc-800' : 'text-zinc-500'}`}>{player.position}</p>
                      </div>
                      {selectedPlayer?.player_id === player.player_id && <ChevronRight size={16} className="text-zinc-900 opacity-50" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* DASHBOARD CONTENT */}
          <div className="lg:col-span-9 relative min-h-[600px]">
            {selectedPlayer && (
            <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            
              {/* Hero Card */}
              <div className="relative rounded-3xl bg-zinc-900/80 border border-white/5 p-6 md:p-8 overflow-hidden shadow-2xl shadow-black/50">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-20 animate-pulse"></div>
                    <img 
                        src={selectedPlayer.photo_url} 
                        alt="avatar" 
                        className="w-32 h-32 rounded-full object-cover border-[6px] border-zinc-800 shadow-2xl bg-zinc-800" 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/3F3F46/D4D4D8?text=NO+IMAGE" }} 
                    />
                    <div className="absolute -bottom-3 -right-3 bg-zinc-900 text-yellow-500 border border-zinc-800 rounded-full w-12 h-12 flex items-center justify-center font-black text-xl shadow-lg z-20">
                        {selectedPlayer.jersey_number}
                    </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-zinc-700 tracking-wider">First Team</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"><Shield size={10} /> Active</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter uppercase mb-4 leading-[0.9]">{selectedPlayer.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-zinc-400">
                      <div className="flex items-center gap-2"><Briefcase size={16} className="text-yellow-500" /><span className="text-sm font-semibold text-white">{selectedPlayer.position}</span></div>
                      <div className="w-px h-4 bg-zinc-800"></div>
                      <div className="flex items-center gap-2"><Ruler size={16} className="text-zinc-600" /><span className="text-sm font-medium">{selectedPlayer.height_m} m</span></div>
                      <div className="flex items-center gap-2"><Scale size={16} className="text-zinc-600" /><span className="text-sm font-medium">{selectedPlayer.weight_kg} kg</span></div>
                      <div className="flex items-center gap-2"><Calendar size={16} className="text-zinc-600" /><span className="text-sm font-medium">{selectedPlayer.age} yo</span></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-zinc-950/50 rounded-2xl p-4 border border-white/5 min-w-[140px]">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">Readiness</p>
                    <RadialProgress score={readinessScore} />
                    <p className="text-zinc-400 text-[10px] font-bold mt-2 text-center max-w-[100px] leading-tight">{readinessStatus}</p>
                  </div>
                </div>
              </div>

              {/* Conditional Rendering based on Tab */}
              {activeTab === 'dashboard' && (
                <>
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard 
                            title="Load (A:C)" 
                            value={acRatio ? acRatio.toFixed(2) : "N/A"} 
                            subtext={acRatio > 1.5 ? "High Load" : "Optimal"} 
                            status={acRatio > 1.5 ? "danger" : "success"} 
                            icon={Activity} 
                        />
                        <MetricCard 
                            title="Fatigue" 
                            value={loadRpe || "0"} 
                            subtext="Total Load (AU)" 
                            status={loadRpe > 600 ? "warning" : "success"} 
                            icon={Zap} 
                        />
                        <MetricCard title="Sleep Score" value="N/A" subtext="No Data" status="neutral" icon={Moon} />
                        <MetricCard title="Nutrition" value="N/A" subtext="No Data" status="neutral" icon={Droplet} />
                    </div>

                    {/* Load Management Section */}
                    <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                        {/* LOADING OVERLAY - Only applies to this section content */}
                        {isLoading && <LoadingScreen message={loadingMessage} />}
                        
                        <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold flex items-center gap-2"><TrendingUp className="text-blue-500" size={18} /> Load Management & Insights</h3>
                        </div>
                          
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                <div className="h-[300px] w-full bg-zinc-950/30 rounded-xl border border-white/5 p-4">
                                     <LoadChart chartData={trends.chart_data || []} />
                                </div>
                            </div>

                            <div className="lg:w-80 space-y-3">
                                <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">AI Analysis</h4>
                                <div className={`p-4 rounded-xl border flex flex-col gap-2 ${primaryInsight.type === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/30' : primaryInsight.type === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-zinc-800/50 border-zinc-700'}`}>
                                    <div className="flex items-center gap-2">
                                        {primaryInsight.type === 'CRITICAL' ? <AlertTriangle size={16} className="text-rose-500"/> : <FileText size={16} className="text-zinc-400"/>}
                                        <span className={`text-xs font-bold ${primaryInsight.type === 'CRITICAL' ? 'text-rose-400' : 'text-zinc-300'}`}>{primaryInsight.title || "Status Normal"}</span>
                                    </div>
                                    <p className="text-sm text-white leading-snug">{primaryInsight.message}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                        <Zap size={14} />
                                        <span className="text-xs font-bold uppercase">Action Required</span>
                                    </div>
                                    <p className="text-sm text-zinc-400">{primaryInsight.action}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
              )}

              {activeTab === 'player-info' && (
                /* --- NEW PLAYER BIO TAB --- */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   {/* Left: Bio Details */}
                   <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><User size={14}/> Physical Profile</h3>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatPill label="Height" value={`${selectedPlayer.height_m} m`} icon={Ruler} />
                                <StatPill label="Weight" value={`${selectedPlayer.weight_kg} kg`} icon={Scale} />
                                <StatPill label="Age" value={`${selectedPlayer.age}`} icon={Calendar} />
                                <StatPill label="Position" value={selectedPlayer.position} icon={Target} />
                            </div>

                            <div className="mt-8 p-4 bg-zinc-950/30 rounded-2xl border border-white/5">
                                <h4 className="text-white font-bold mb-2">About</h4>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Professional basketball player for Braunschweig Löwen. Playing as {selectedPlayer.position}, 
                                    currently wearing jersey number #{selectedPlayer.jersey_number}. 
                                    {readinessScore > 80 ? " Currently in peak physical condition." : " Monitoring workload for optimal performance."}
                                </p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Placeholder for Season Stats */}
                            <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">Season Stats</h3>
                                <div className="flex items-center justify-center h-32 text-zinc-600 text-sm italic">
                                    Detailed Stats Integration Pending
                                </div>
                            </div>
                        </div>
                   </div>

                   {/* Right: Identifiers & Links */}
                   <div className="space-y-6">
                        <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Hash size={14}/> Identifiers</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-zinc-500">Internal ID</span>
                                    <span className="text-sm text-white font-mono">{selectedPlayer.player_id}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-sm text-zinc-500">Jersey No.</span>
                                    <span className="text-sm text-white font-mono">#{selectedPlayer.jersey_number}</span>
                                </div>
                                {selectedPlayer.source_url && (
                                    <a href={selectedPlayer.source_url} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                                            <span>View Official Profile</span>
                                            <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                   </div>
                </div>
              )}

              {/* NEW AI LAB TAB */}
              {activeTab === 'ai-lab' && (
                <div className="space-y-6">
                  <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <Brain size={14} className="text-yellow-500"/> Predictive Modeling
                        </h3>
                        <h2 className="text-2xl font-bold text-white mt-1">Session Simulator</h2>
                      </div>
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-bold uppercase">Beta v2.4</span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-8 max-w-2xl">
                      Simulate future training sessions to predict <strong>Invisible Mechanical Load</strong> and <strong>Injury Risk</strong>. 
                      This model uses Volume inputs to estimate tissue stress and neuromuscular fatigue based on advanced inertial metrics.
                    </p>
                    
                    {/* THE NEW COMPONENT */}
                    <SessionPredictor player={selectedPlayer} apiBase={API_BASE} />
                  </div>
                </div>
              )}

            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}