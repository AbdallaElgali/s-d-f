"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, User, ChevronRight, TrendingUp, 
  Zap, Moon, Droplet, AlertTriangle, 
  Maximize, Scale, Shield, Briefcase, Menu, 
  ArrowUpRight, ArrowDownRight, Target, Bell,
  FileText, Download, Wifi, Gauge,
  Award, MapPin, Phone
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, AreaChart, Area, Line, Tooltip
} from 'recharts';

// --- 1. DATA SECTION (Updated for Basketball Context) ---
const TEAM_DATA = [
  {
    id: 1,
    name: "Nico Schlotterbeck",
    number: 4,
    position: "Center", // Updated from CB
    img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    height: "205 cm",
    weight: "110 kg",
    age: 24,
    readiness: 92,
    biometrics: { maxSpeed: "28.4 km/h", distance: "4.2 km", hrv: "55 ms" },
    metrics: {
      acRatio: 1.1,
      rpe: { m: 4, t: 7 },
      sleepQuality: 8.2,
      performance: 22.5,
      nutritionAdherence: 95
    },
    insights: {
      risk: "Low",
      primary: "Peak Condition",
      loadAction: "Maintain current micro-cycle load.",
      recoveryAction: "Standard active recovery."
    }
  },
  {
    id: 2,
    name: "Julian Brandt",
    number: 19,
    position: "Point Guard", // Updated from CAM
    img: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    height: "192 cm",
    weight: "88 kg",
    age: 27,
    readiness: 74,
    biometrics: { maxSpeed: "31.8 km/h", distance: "5.5 km", hrv: "42 ms" },
    metrics: {
      acRatio: 1.4,
      rpe: { m: 6, t: 9 },
      sleepQuality: 6.5,
      performance: 18.2,
      nutritionAdherence: 80
    },
    insights: {
      risk: "Moderate",
      primary: "Accumulated Fatigue",
      loadAction: "Reduce volume by 15% today.",
      recoveryAction: "Focus on sleep hygiene + cold plunge."
    }
  },
  {
    id: 3,
    name: "Karim Adeyemi",
    number: 27,
    position: "Shooting Guard", // Updated from Winger
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    height: "196 cm",
    weight: "92 kg",
    age: 22,
    readiness: 45,
    biometrics: { maxSpeed: "34.1 km/h", distance: "4.8 km", hrv: "30 ms" },
    metrics: {
      acRatio: 1.8,
      rpe: { m: 9, t: 9 },
      sleepQuality: 5.1,
      performance: 12.4,
      nutritionAdherence: 60
    },
    insights: {
      risk: "High",
      primary: "Overreaching Warning",
      loadAction: "MODIFY: Non-contact shooting only.",
      recoveryAction: "Mandatory massage therapy session."
    }
  }
];

const REPORTS_DATA = [
  { id: 1, title: "Weekly Load Summary - Week 42", date: "Oct 12, 2024", type: "Physical", size: "2.4 MB" },
  { id: 2, title: "Game Day Analysis vs Lakers", date: "Oct 08, 2024", type: "Tactical", size: "15.1 MB" },
  { id: 3, title: "Monthly Medical Clearance Report", date: "Oct 01, 2024", type: "Medical", size: "1.2 MB" },
  { id: 4, title: "Rookie Integration Metrics", date: "Sep 28, 2024", type: "Development", size: "3.5 MB" },
];

// --- 2. SUB-COMPONENTS ---

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

const RadialProgress = ({ score }) => {
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const getColor = (s) => s > 85 ? '#34d399' : s > 60 ? '#fbbf24' : '#f43f5e';

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg] transition-all duration-1000 ease-out">
        <circle stroke="#27272a" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
        <circle stroke={getColor(score)} fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset, strokeLinecap: "round" }} r={normalizedRadius} cx={radius} cy={radius} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-white font-mono">{score}</span>
      </div>
    </div>
  );
};

// --- 3. CHART COMPONENTS ---

const PlayerRadar = ({ player }) => {
  // Simulate data generation based on player type
  const data = [
    { subject: 'Agility', A: player.position === 'Center' ? 65 : 92, fullMark: 100 },
    { subject: 'Power', A: player.position === 'Center' ? 95 : 70, fullMark: 100 },
    { subject: 'Stamina', A: player.readiness, fullMark: 100 },
    { subject: 'Shooting', A: player.position === 'Center' ? 50 : 88, fullMark: 100 },
    { subject: 'Recovery', A: player.metrics.sleepQuality * 10, fullMark: 100 },
    { subject: 'IQ', A: 80, fullMark: 100 },
  ];

  return (
    <div className="h-64 w-full relative -ml-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={player.name}
            dataKey="A"
            stroke="#eab308"
            strokeWidth={2}
            fill="#eab308"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- NEW: BASKETBALL COURT COMPONENT ---
const BasketballCourt = ({ position }) => {
  // Logic: Map player position to coordinate on the court
  // Top-Down View. Left Basket to Right Basket.
  const getPositionStyle = () => {
    const pos = position.toLowerCase();
    if (pos.includes('center')) {
      // Low Post / Paint (Near Right Basket)
      return 'right-[12%] top-[40%] w-[15%] h-[20%]';
    }
    if (pos.includes('point') || pos.includes('pg')) {
      // Top of Key (Right side attack)
      return 'right-[35%] top-[40%] w-[15%] h-[20%]';
    }
    if (pos.includes('guard') || pos.includes('wing')) {
      // Corner / Wing (Top Right)
      return 'right-[20%] top-[10%] w-[20%] h-[20%]';
    }
    // Default: Center Court
    return 'left-[45%] top-[40%] w-[10%] h-[20%]';
  };

  return (
    <div className="relative w-full h-48 bg-zinc-950 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center shadow-inner group">
      {/* --- COURT MARKINGS (CSS) --- */}
      
      {/* 1. Perimeter & Center Line */}
      <div className="absolute inset-4 border-2 border-zinc-700/60 rounded-sm opacity-80"></div>
      <div className="absolute left-1/2 top-4 bottom-4 w-px bg-zinc-700/60"></div>
      
      {/* 2. Center Circle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-zinc-700/60 rounded-full"></div>

      {/* 3. Left Key (Paint) */}
      <div className="absolute left-4 top-[38%] bottom-[38%] w-[15%] border-y-2 border-r-2 border-zinc-700/60 bg-zinc-900/50"></div>
      <div className="absolute left-4 top-[44%] bottom-[44%] w-[2%] bg-zinc-800 rounded-r-md"></div> {/* Hoop */}

      {/* 4. Right Key (Paint) */}
      <div className="absolute right-4 top-[38%] bottom-[38%] w-[15%] border-y-2 border-l-2 border-zinc-700/60 bg-zinc-900/50"></div>
      <div className="absolute right-4 top-[44%] bottom-[44%] w-[2%] bg-zinc-800 rounded-l-md"></div> {/* Hoop */}

      {/* 5. 3-Point Lines */}
      {/* Left Arc */}
      <div className="absolute left-4 top-[10%] bottom-[10%] w-[30%] border-r-2 border-y-2 border-zinc-700/60 rounded-r-[100px] border-l-0"></div>
      {/* Right Arc */}
      <div className="absolute right-4 top-[10%] bottom-[10%] w-[30%] border-l-2 border-y-2 border-zinc-700/60 rounded-l-[100px] border-r-0"></div>


      {/* --- PLAYER POSITION HEATMAP --- */}
      {/* The Heat Blob */}
      <div className={`absolute transition-all duration-1000 ease-in-out ${getPositionStyle()}`}>
        <div className="w-full h-full bg-gradient-to-r from-yellow-500/40 to-rose-500/40 blur-2xl rounded-full mix-blend-screen animate-pulse"></div>
      </div>
      
      {/* The Specific Dot */}
      <div className={`absolute transition-all duration-1000 ease-in-out flex items-center justify-center ${getPositionStyle()}`}>
         <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.8)] border-2 border-white relative z-10"></div>
         <div className="absolute -bottom-6 whitespace-nowrap bg-zinc-900/90 px-2 py-0.5 rounded text-[9px] font-bold text-yellow-500 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
           Avg Location
         </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-2 left-3 text-[10px] text-zinc-600 uppercase tracking-widest font-bold z-10">
        Shot Chart / Heatmap
      </div>
    </div>
  );
};

const LoadChart = () => {
  const data = [
    { day: 'M', acute: 400, chronic: 350 },
    { day: 'T', acute: 600, chronic: 380 },
    { day: 'W', acute: 800, chronic: 450 },
    { day: 'T', acute: 500, chronic: 480 },
    { day: 'F', acute: 300, chronic: 500 },
    { day: 'S', acute: 900, chronic: 550 },
    { day: 'S', acute: 0, chronic: 530 },
  ];

  return (
    <div className="h-40 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAcute" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#e4e4e7' }}
            cursor={{stroke: '#52525b', strokeWidth: 1, strokeDasharray: '4 4'}}
          />
          <Area type="monotone" dataKey="acute" stroke="#eab308" fillOpacity={1} fill="url(#colorAcute)" strokeWidth={2} activeDot={{r: 4, strokeWidth: 0}} />
          <Line type="monotone" dataKey="chronic" stroke="#71717a" strokeDasharray="5 5" dot={false} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 4. PAGE VIEWS ---

// > COACH PROFILE VIEW
const CoachProfileView = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="md:col-span-1">
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <img src="https://images.unsplash.com/photo-1508002366005-75a695ee2d17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" className="w-full h-96 object-cover" alt="Coach" />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent p-6">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Dr. Marco Reus</h2>
          <p className="text-yellow-500 font-bold tracking-widest text-sm uppercase mt-1">Head Coach / Performance Director</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
          <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400"><Award size={20}/></div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Experience</p>
            <p className="text-white font-bold">12 Years (NBA Level)</p>
          </div>
        </div>
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5 flex items-center gap-4">
          <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400"><MapPin size={20}/></div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Location</p>
            <p className="text-white font-bold">Berlin, Germany</p>
          </div>
        </div>
      </div>
    </div>

    <div className="md:col-span-2 space-y-6">
      <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Briefcase className="text-yellow-500" size={20}/> Coaching Philosophy</h3>
        <p className="text-zinc-400 leading-relaxed mb-4">
          "Performance is not just about metrics; it's about the seamless integration of physical resilience and tactical cognition. My approach prioritizes data-driven load management to ensure players peak exactly when the playoffs start."
        </p>
        <div className="flex gap-2 flex-wrap mt-6">
          {["Strength & Conditioning", "PhD Sports Science", "Load Management Certified"].map(tag => (
            <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-full border border-zinc-700">{tag}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/60 border border-white/5 rounded-3xl p-6">
           <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Squad Availability</h4>
           <div className="text-4xl font-mono text-emerald-400 font-bold">92%</div>
           <p className="text-xs text-zinc-400 mt-1">vs 88% League Avg</p>
        </div>
        <div className="bg-zinc-900/60 border border-white/5 rounded-3xl p-6">
           <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Training Compliance</h4>
           <div className="text-4xl font-mono text-yellow-500 font-bold">96%</div>
           <p className="text-xs text-zinc-400 mt-1">Last 30 Days</p>
        </div>
      </div>
    </div>
  </div>
);

// > REPORTS VIEW
const ReportsView = () => (
  <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 animate-in fade-in zoom-in-95 duration-300">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Team Reports</h2>
        <p className="text-zinc-500 text-sm mt-1">Archived performance and medical documentation.</p>
      </div>
      <button className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
        <FileText size={16}/> Generate New
      </button>
    </div>

    <div className="space-y-2">
      {REPORTS_DATA.map((report) => (
        <div key={report.id} className="group flex items-center justify-between p-4 bg-zinc-800/30 hover:bg-zinc-800/60 border border-white/5 rounded-2xl transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
              <FileText size={20}/>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm group-hover:text-yellow-500 transition-colors">{report.title}</h4>
              <p className="text-zinc-500 text-xs flex items-center gap-2">
                {report.date} • <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] uppercase">{report.type}</span>
              </p>
            </div>
          </div>
          <button className="text-zinc-500 hover:text-white transition-colors p-2">
            <Download size={18}/>
          </button>
        </div>
      ))}
    </div>
  </div>
);

// > LIVE DATA VIEW (Simulated)
const LiveDataView = () => {
  const [heartRate, setHeartRate] = useState(145);
  
  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-zinc-900/80 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Live Telemetry</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          <div className="text-center">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Avg Heart Rate</p>
            <div className="text-6xl font-mono font-bold text-white flex justify-center items-baseline gap-2">
              {heartRate} <span className="text-lg text-zinc-500">bpm</span>
            </div>
            <div className="h-16 flex items-end justify-center gap-1 mt-4 opacity-50">
               {[...Array(20)].map((_,i) => (
                 <div key={i} className="w-1 bg-emerald-500 rounded-full transition-all duration-300" style={{height: `${Math.random() * 100}%`}}></div>
               ))}
            </div>
          </div>

          <div className="text-center border-x border-white/5">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Active Players</p>
            <div className="text-6xl font-mono font-bold text-white flex justify-center items-baseline gap-2">
              12 <span className="text-lg text-zinc-500">/ 15</span>
            </div>
            <div className="mt-6 flex justify-center gap-4">
               <div className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> High Intensity</div>
               <div className="flex items-center gap-2 text-xs text-zinc-400"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> Recovery</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Training Load</p>
            <div className="text-6xl font-mono font-bold text-white flex justify-center items-baseline gap-2">
              842 <span className="text-lg text-zinc-500">au</span>
            </div>
             <p className="text-zinc-400 text-sm mt-2">+12% vs Previous Session</p>
          </div>
        </div>
      </div>

      {/* Live Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEAM_DATA.map((player) => (
           <div key={player.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="relative">
                 <img src={player.img} className="w-10 h-10 rounded-full object-cover grayscale" alt={player.name}/>
                 <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-zinc-900 rounded-full"></div>
               </div>
               <div>
                 <p className="text-sm font-bold text-white">{player.name}</p>
                 <p className="text-xs text-zinc-500">GPS Signal: Excellent</p>
               </div>
             </div>
             <div className="text-right">
               <p className="text-lg font-mono font-bold text-white">{Math.floor(Math.random() * (160 - 130) + 130)} bpm</p>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
};

// > PLAYER DETAIL INFO VIEW
const PlayerDetailView = ({ player }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Header */}
    <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
      <img src={player.img} className="w-40 h-40 rounded-full object-cover border-4 border-zinc-800 shadow-2xl" alt={player.name} />
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">{player.name}</h1>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
          <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-white/5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Position</p>
            <p className="font-bold text-white">{player.position} #{player.number}</p>
          </div>
          <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-white/5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Age</p>
            <p className="font-bold text-white">{player.age} Years</p>
          </div>
          <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-white/5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Contract</p>
            <p className="font-bold text-white">Until 2027</p>
          </div>
        </div>
      </div>
    </div>

    {/* Detailed Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-zinc-900/60 border border-white/5 rounded-3xl p-6">
        <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Activity className="text-emerald-500"/> Season Biometrics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-zinc-400">Max Speed Achieved</span>
            <span className="text-white font-mono font-bold">{player.biometrics?.maxSpeed || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-zinc-400">Avg Distance / Game</span>
            <span className="text-white font-mono font-bold">{player.biometrics?.distance || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-zinc-400">Resting HRV (Avg)</span>
            <span className="text-white font-mono font-bold">{player.biometrics?.hrv || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-white/5 rounded-3xl p-6">
        <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Phone className="text-yellow-500"/> Contact & Medical</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-zinc-400">Emergency Contact</span>
            <span className="text-white font-medium">Sarah {player.name.split(' ')[1]}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-zinc-400">Blood Type</span>
            <span className="text-white font-medium">O+</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-zinc-400">Last Screening</span>
            <span className="text-white font-medium">Oct 14, 2024</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- 5. MAIN COMPONENT ---

export default function LoewenDashboard() {
  // State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'reports', 'live', 'player-info', 'coach'
  const [selectedPlayer, setSelectedPlayer] = useState(TEAM_DATA[0]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Derived Calculations for Dashboard
  const maxRpe = Math.max(selectedPlayer.metrics.rpe.m, selectedPlayer.metrics.rpe.t);
  const nutritionStatus = selectedPlayer.metrics.nutritionAdherence > 85 ? "success" : selectedPlayer.metrics.nutritionAdherence > 60 ? "warning" : "danger";

  const renderContent = () => {
    switch(activeTab) {
      case 'reports': return <ReportsView />;
      case 'live': return <LiveDataView />;
      case 'player-info': return <PlayerDetailView player={selectedPlayer} />;
      case 'coach': return <CoachProfileView />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Hero Card */}
            <div className="relative rounded-3xl bg-zinc-900/80 border border-white/5 p-6 md:p-8 overflow-hidden shadow-2xl shadow-black/50">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-20 animate-pulse"></div>
                  <img src={selectedPlayer.img} alt="avatar" className="w-32 h-32 rounded-full object-cover border-[6px] border-zinc-800 shadow-2xl" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/3F3F46/D4D4D8?text=NO+IMAGE" }} />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white font-black text-xl px-3 py-1 rounded-lg border border-zinc-700 shadow-lg">#{selectedPlayer.number}</div>
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-zinc-700 tracking-wider">First Team</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"><Shield size={10} /> Cleared</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black italic text-white tracking-tighter uppercase mb-4 leading-[0.9]">{selectedPlayer.name}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 text-zinc-400">
                    <div className="flex items-center gap-2"><Briefcase size={16} className="text-yellow-500" /><span className="text-sm font-semibold text-white">{selectedPlayer.position}</span></div>
                    <div className="w-px h-4 bg-zinc-700"></div>
                    <div className="flex items-center gap-2"><Maximize size={16} className="text-zinc-600" /><span className="text-sm font-semibold">{selectedPlayer.height}</span></div>
                    <div className="flex items-center gap-2"><Scale size={16} className="text-zinc-600" /><span className="text-sm font-semibold">{selectedPlayer.weight}</span></div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-zinc-950/50 rounded-2xl p-4 border border-white/5 min-w-[140px]">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">Readiness</p>
                  <RadialProgress score={selectedPlayer.readiness} />
                  <p className={`text-xs font-medium mt-3 px-2 py-1 rounded bg-zinc-900 border ${selectedPlayer.readiness > 85 ? 'text-emerald-400 border-emerald-500/20' : 'text-amber-400 border-amber-500/20'}`}>{selectedPlayer.insights.primary}</p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Load (A:C Ratio)" value={selectedPlayer.metrics.acRatio.toFixed(2)} subtext={selectedPlayer.metrics.acRatio > 1.5 ? "High Load" : "Optimal"} status={selectedPlayer.metrics.acRatio > 1.5 ? "danger" : "success"} icon={Activity} trend="up" trendValue={12} />
              <MetricCard title="Fatigue (sRPE)" value={`${maxRpe}/10`} subtext="Subjective Rating" status={maxRpe > 7 ? "danger" : maxRpe > 5 ? "warning" : "success"} icon={Zap} trend="flat" trendValue={0} />
              <MetricCard title="Sleep Score" value={selectedPlayer.metrics.sleepQuality.toFixed(1)} subtext="Hours Avg" status={selectedPlayer.metrics.sleepQuality < 7 ? "warning" : "success"} icon={Moon} trend="down" trendValue={5} />
              <MetricCard title="Nutrition" value={`${selectedPlayer.metrics.nutritionAdherence}%`} subtext="Protocol Adherence" status={nutritionStatus} icon={Droplet} />
            </div>

            {/* THE NEW PERFORMANCE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* COL 1: Tactical & Physical Profile */}
              <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-white font-bold flex items-center gap-2 mb-4"><Activity className="text-yellow-500" size={18} /> Attribute Profile</h3>
                  <PlayerRadar player={selectedPlayer} />
                </div>
                <div className="pt-6 border-t border-white/5">
                   <h3 className="text-white font-bold flex items-center gap-2 mb-4"><MapPin className="text-emerald-500" size={18} /> Court Presence</h3>
                   <BasketballCourt position={selectedPlayer.position} />
                </div>
              </div>

              {/* COL 2: Load Management */}
              <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2"><TrendingUp className="text-blue-500" size={18} /> Load Management</h3>
                    <select className="bg-zinc-900 border border-zinc-700 text-[10px] rounded text-zinc-400 px-2 py-1">
                      <option>Acute vs Chronic</option>
                      <option>Game vs Practice</option>
                    </select>
                 </div>
                 
                 <div className="flex gap-4 mb-4">
                    <div className="bg-zinc-950/50 p-3 rounded-xl border border-white/5 flex-1">
                       <p className="text-zinc-500 text-[10px] uppercase">7-Day Load</p>
                       <p className="text-xl font-mono font-bold text-white">2,450 <span className="text-xs text-zinc-500 font-sans">au</span></p>
                    </div>
                     <div className="bg-zinc-950/50 p-3 rounded-xl border border-white/5 flex-1">
                       <p className="text-zinc-500 text-[10px] uppercase">Strain</p>
                       <p className="text-xl font-mono font-bold text-rose-400">High</p>
                    </div>
                 </div>

                 <LoadChart />
                 
                 <div className="mt-6 space-y-3">
                    <div className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/50 flex items-start gap-3">
                       <div className="bg-yellow-500/10 p-2 rounded text-yellow-500 mt-1"><Zap size={14} /></div>
                       <div>
                         <p className="text-xs font-bold text-white uppercase">Action Required</p>
                         <p className="text-sm text-zinc-400 leading-tight mt-1">{selectedPlayer.insights.loadAction}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* COL 3: Medical & Body Status */}
              <div className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col">
                <h3 className="text-white font-bold flex items-center gap-2 mb-6"><Shield className="text-rose-500" size={18} /> Medical Status</h3>
                
                <div className="flex-1 space-y-4">
                   <div className="relative h-48 w-full bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center mb-4 shadow-inner">
                      {/* Silhouette Background (Abstract) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <User size={160} className="text-zinc-700" />
                      </div>
                      {/* Injury Hotspots */}
                      {selectedPlayer.metrics.acRatio > 1.2 && (
                        <div className="absolute bottom-[30%] right-[35%] w-4 h-4 bg-rose-500 rounded-full animate-ping"></div>
                      )}
                       <div className="absolute bottom-[30%] right-[35%] w-3 h-3 bg-rose-500 border-2 border-zinc-900 rounded-full"></div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-shadow"></div>
                            <span className="text-sm text-zinc-300">Ankle (L)</span>
                         </div>
                         <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Stable</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-zinc-800/30 border border-rose-500/20 cursor-pointer">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                            <span className="text-sm text-white">Hamstring (R)</span>
                         </div>
                         <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Tightness</span>
                      </div>
                   </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/5">
                    <button className="w-full py-3 bg-white text-zinc-900 font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                      <FileText size={16} /> View Medical Report
                    </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

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
          
          {/* Logo Section */}
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center bg-zinc-900/50 rounded-full p-1 border border-white/5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Gauge },
              { id: 'player-info', label: 'Player Info', icon: User },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'live', label: 'Live Data', icon: Wifi },
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

          {/* User Profile / Actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border border-zinc-900"></span>
            </button>
            <div 
              className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group"
              onClick={() => setActiveTab('coach')}
            >
              <div className="text-right">
                <p className="text-xs text-zinc-500 font-medium group-hover:text-yellow-500 transition-colors">Head Coach</p>
                <p className="text-sm font-bold text-white">Dr. M. Reus</p>
              </div>
              <div className={`w-9 h-9 rounded-full border border-white/10 flex items-center justify-center transition-colors ${activeTab === 'coach' ? 'bg-yellow-500 text-zinc-900' : 'bg-zinc-800 text-yellow-500'}`}>
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
          
          {/* SIDEBAR (Conditional visibility based on View) */}
          {activeTab !== 'coach' && activeTab !== 'reports' && (
            <aside className={`lg:col-span-3 fixed inset-y-0 left-0 z-40 w-80 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:bg-transparent lg:border-none lg:w-auto lg:h-auto pt-24 lg:pt-0 px-4 lg:px-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
              <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden sticky top-24 h-[calc(100vh-8rem)] flex flex-col">
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Target size={14} className="text-yellow-500"/> Active Roster</span>
                  <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700">15 / 18</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                  {TEAM_DATA.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => { setSelectedPlayer(player); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${selectedPlayer.id === player.id ? 'bg-yellow-500 text-zinc-900 shadow-lg shadow-yellow-500/20' : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-white'}`}
                    >
                      <div className="relative shrink-0">
                        <img src={player.img} alt={player.name} className={`w-10 h-10 rounded-xl object-cover ${selectedPlayer.id === player.id ? 'ring-2 ring-zinc-900/20' : 'grayscale group-hover:grayscale-0 transition-all'}`} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/3F3F46/D4D4D8?text=?" }}/>
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${selectedPlayer.id === player.id ? 'border-yellow-400' : 'border-zinc-900'} ${player.readiness > 85 ? 'bg-emerald-500' : player.readiness > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-sm truncate leading-tight">{player.name}</p>
                        <p className={`text-[10px] font-medium uppercase tracking-wider ${selectedPlayer.id === player.id ? 'text-zinc-800' : 'text-zinc-500'}`}>{player.position}</p>
                      </div>
                      {selectedPlayer.id === player.id && <ChevronRight size={16} className="text-zinc-900 opacity-50" />}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* CONTENT AREA */}
          <div className={`${(activeTab === 'coach' || activeTab === 'reports') ? 'lg:col-span-12' : 'lg:col-span-9'}`}>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}