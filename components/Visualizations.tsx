
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  Cell, AreaChart, Area, PieChart, Pie, Legend
} from 'recharts';
import { AnalysisResult } from '../types';

interface VizProps { data: AnalysisResult; }

const COLORS = {
  emerald: '#10b981',
  indigo: '#6366f1',
  rose: '#f43f5e',
  amber: '#f59e0b',
  slate: '#64748b'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value}% Intensity</p>
      </div>
    );
  }
  return null;
};

export const SentimentGauge: React.FC<VizProps> = ({ data }) => {
  const score = data.sentiment.score;
  const color = data.sentiment.label === 'POSITIVE' ? COLORS.emerald : data.sentiment.label === 'NEGATIVE' ? COLORS.rose : COLORS.amber;
  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative py-8">
      <div className="w-48 h-48 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
          <circle
            cx="50" cy="50" r="45" stroke={color} strokeWidth="6" fill="transparent"
            strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - score / 100)}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold" style={{ color }}>{score}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{data.sentiment.label}</span>
        </div>
      </div>
    </div>
  );
};

export const EmotionRadar: React.FC<VizProps> = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.emotions}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
        <Radar name="Score" dataKey="score" stroke={COLORS.indigo} fill={COLORS.indigo} fillOpacity={0.4} />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

export const EntityPie: React.FC<VizProps> = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data.entityDistribution} dataKey="count" nameKey="type" innerRadius={60} outerRadius={80} paddingAngle={5} animationDuration={1000}>
          {data.entityDistribution.map((_, i) => <Cell key={i} fill={[COLORS.emerald, COLORS.indigo, COLORS.amber, COLORS.rose, COLORS.slate][i % 5]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export const TopicBars: React.FC<VizProps> = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={data.topics} margin={{ right: 30, left: 10 }}>
        <XAxis type="number" hide />
        <YAxis dataKey="label" type="category" width={80} tick={{ fill: '#94a3b8', fontSize: 10 }} />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="relevance" fill={COLORS.emerald} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const FlowLine: React.FC<VizProps> = ({ data }) => (
  <div className="h-48 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.sentimentProgression} margin={{ left: -20 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="score" stroke={COLORS.emerald} fillOpacity={1} fill="url(#colorScore)" />
        <Tooltip />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// Updated by Ravi-Chand
