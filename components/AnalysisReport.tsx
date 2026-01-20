
import React from 'react';
import { AnalysisResult } from '../types';
import { SentimentGauge, EmotionRadar, EntityPie, TopicBars, FlowLine } from './Visualizations';

interface Props { result: AnalysisResult; }

const AnalysisReport: React.FC<Props> = ({ result }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analysis Report</h2>
          <p className="text-slate-500 text-sm">Automated synthesis of provided linguistic patterns.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Language</span>
            <span className="text-sm font-bold text-emerald-500 uppercase">{result.language}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Primary Intent</span>
            <span className="text-sm font-bold text-indigo-400 uppercase">{result.intent}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-3xl border-emerald-500/10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sentiment Balance</h3>
          <SentimentGauge data={result} />
        </div>
        <div className="glass p-8 rounded-3xl lg:col-span-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Narrative Flow</h3>
          <FlowLine data={result} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Emotional Resonance', comp: <EmotionRadar data={result} /> },
          { title: 'Category Mapping', comp: <EntityPie data={result} /> },
          { title: 'Topic Weights', comp: <TopicBars data={result} /> }
        ].map((item, i) => (
          <div key={i} className="glass p-8 rounded-3xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{item.title}</h3>
            {item.comp}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-10 rounded-[32px] space-y-6">
          <h3 className="text-xl font-bold">Linguistic Summary</h3>
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 italic text-lg leading-relaxed text-slate-200">
            "{result.summary.ultraConcise}"
          </div>
          <ul className="space-y-3">
            {result.summary.detailed.map((p, i) => (
              <li key={i} className="text-sm text-slate-400 flex gap-3">
                <span className="text-emerald-500 mt-1">•</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass p-10 rounded-[32px] overflow-hidden">
          <h3 className="text-xl font-bold mb-6">Named Entities</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase text-slate-500 font-bold border-b border-white/5">
                <tr><th className="pb-4">Type</th><th className="pb-4">Entity</th><th className="pb-4 text-right">Hits</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {result.entities.map((e, i) => (
                  <tr key={i} className="group">
                    <td className="py-4"><span className="px-2 py-0.5 rounded bg-slate-800 text-[10px]">{e.type}</span></td>
                    <td className="py-4 font-bold text-slate-300">{e.name}</td>
                    <td className="py-4 text-right text-slate-500 font-mono">{e.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="glass p-12 rounded-[40px] border-emerald-500/10">
        <h3 className="text-2xl font-bold mb-8">Strategic Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.insights.map((insight, i) => (
            <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 text-sm text-slate-400 leading-relaxed hover:text-white transition-colors">
              {insight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
