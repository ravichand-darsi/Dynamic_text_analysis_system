
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { analyzeText } from './services/geminiService';
import { AnalysisResult, HistoryItem } from './types';
import AnalysisReport from './components/AnalysisReport';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

/**
 * High-fidelity SVG Logo recreating the provided brand image:
 * - Stylized brain with flowing waves
 * - Magnifying glass focus
 * - Book icon inside the lens
 * - Blue and Purple gradients
 */
const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', showText?: boolean }> = ({ size = 'md', showText = false }) => {
  const dimensions = size === 'lg' ? 'w-48 h-48' : size === 'md' ? 'w-16 h-16' : 'w-10 h-10';
  
  return (
    <div className={`flex flex-col items-center gap-4 ${dimensions}`}>
      <svg viewBox="0 0 200 150" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Brain Wave Patterns */}
        <g fill="url(#logoGradient)" opacity="0.9">
          <path d="M100 20 C60 20, 40 50, 40 80 C40 100, 55 115, 75 120 L100 140 L125 120 C145 115, 160 100, 160 80 C160 50, 140 20, 100 20 Z" opacity="0.2" />
          <path d="M100 30 C75 30, 60 45, 60 70 C60 90, 75 105, 90 110 C85 115, 80 125, 100 135 C120 125, 115 115, 110 110 C125 105, 140 90, 140 70 C140 45, 125 30, 100 30" filter="url(#glow)" />
          
          {/* Decorative Waves to mimic the 'brain' texture */}
          <path d="M65 60 Q80 40 100 60 T135 60" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
          <path d="M70 80 Q90 65 110 80 T130 80" fill="none" stroke="white" strokeWidth="1.5" opacity="0.2" />
        </g>

        {/* Magnifying Glass */}
        <circle cx="100" cy="80" r="35" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="4" />
        <rect x="125" y="105" width="8" height="25" rx="4" transform="rotate(-45 125 105)" fill="white" />
        
        {/* Book Icon inside lens */}
        <g transform="translate(85, 68) scale(1.2)" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </g>
        
        {/* "AI" Text */}
        <text x="145" y="85" fill="white" fontSize="24" fontWeight="900" fontFamily="sans-serif">AI</text>
      </svg>
      
      {showText && (
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Dynamic AI</h1>
          <p className="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">Text Analysis</p>
        </div>
      )}
    </div>
  );
};

const initWorker = () => {
  try {
    const pdfjs: any = (pdfjsLib as any).default || pdfjsLib;
    if (pdfjs && pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    }
  } catch (e) {
    console.error("PDF Worker initialization failed:", e);
  }
};
initWorker();

const SECTOR_EXAMPLES = [
  {
    title: "Finance",
    icon: "🏦",
    text: "Global equity markets experienced significant volatility today as central banks signaled a more hawkish stance on interest rates. While tech stocks led the morning decline, energy sectors rebounded slightly due to supply constraints. Analysts predict a 'wait-and-see' approach for the next quarter as inflation data stabilizes.",
    tag: "Market Update"
  },
  {
    title: "Healthcare",
    icon: "🩺",
    text: "Patient 4592 presents with recurring mild hypertension and fatigue. Recent lab results indicate elevated cortisol levels but stable glucose. We recommend a 30-day monitoring period with a focus on dietary adjustments and stress management techniques before considering pharmacological intervention.",
    tag: "Clinical Summary"
  },
  {
    title: "Customer Exp",
    icon: "⭐",
    text: "The new software suite is a massive improvement over the previous version! The load times are significantly faster, and the new data visualization tools are exactly what our team needed. The only downside is the slightly steep learning curve for the advanced reporting module.",
    tag: "Product Review"
  },
  {
    title: "Legal",
    icon: "⚖️",
    text: "This Mutual Non-Disclosure Agreement ('Agreement') is entered into by and between the parties to protect confidential information shared for the purpose of a potential business partnership. Any unauthorized disclosure of Proprietary Information shall be subject to injunctive relief and monetary damages as permitted by law.",
    tag: "Contract Extract"
  }
];

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) transcript += event.results[i][0].transcript;
        }
        if (transcript) setInputText(prev => prev + (prev ? ' ' : '') + transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const handleAnalyze = useCallback(async (text = inputText) => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeText(text);
      setResult(data);
      setHistory(prev => [{
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        text: text.substring(0, 100),
        result: data
      }, ...prev].slice(0, 10));
    } catch (err) {
      setError('Analysis failed. The engine might be under heavy load.');
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const name = file.name.toLowerCase();
      if (name.endsWith('.pdf')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const pdfjs: any = (pdfjsLib as any).default || pdfjsLib;
            const pdf = await pdfjs.getDocument({ data: e.target?.result }).promise;
            let text = '';
            const maxPages = Math.min(pdf.numPages, 10);
            for (let i = 1; i <= maxPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map((item: any) => item.str).join(' ') + '\n';
            }
            setInputText(text);
            handleAnalyze(text);
          } catch (err) {
            setError('Failed to parse PDF.');
            setLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const res = await mammoth.extractRawText({ arrayBuffer: e.target?.result as ArrayBuffer });
            setInputText(res.value);
            handleAnalyze(res.value);
          } catch (err) {
            setError('Failed to parse Word document.');
            setLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        const text = await file.text();
        setInputText(text);
        handleAnalyze(text);
      }
    } catch (err) {
      setError('Failed to process file.');
      setLoading(false);
    }
  };

  const loadExample = (text: string) => {
    setInputText(text);
    handleAnalyze(text);
  };

  const clearText = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const renderedHistory = useMemo(() => (
    history.map(item => (
      <button 
        key={item.id} 
        onClick={() => { setResult(item.result); setInputText(item.text); }}
        className="w-full p-4 rounded-xl text-left bg-slate-800/40 border border-white/5 hover:border-emerald-500/30 transition-all group"
      >
        <p className="text-xs font-medium truncate text-slate-300 group-hover:text-emerald-400 transition-colors">{item.text}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] text-slate-500 uppercase font-bold">{item.timestamp}</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${item.result.sentiment.label === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-500' : item.result.sentiment.label === 'NEGATIVE' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-500'}`}>
            {item.result.sentiment.label}
          </span>
        </div>
      </button>
    ))
  ), [history]);

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#1e293b]/50 p-6 hidden md:flex flex-col gap-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setResult(null); setInputText('');}}>
          <BrandLogo size="sm" />
          <h1 className="text-lg font-bold tracking-tight">Dynamic AI <span className="text-emerald-500">Text</span></h1>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">History</h2>
          {history.length === 0 ? (
            <div className="px-2 py-4 text-xs text-slate-600 italic">No recent sessions</div>
          ) : renderedHistory}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Mobile Header */}
          <div className="flex justify-between items-center bg-[#1e293b]/50 p-4 rounded-2xl border border-white/5 mb-8 md:hidden">
            <div className="flex items-center gap-2">
              <BrandLogo size="sm" />
              <span className="font-bold text-sm">Dynamic AI</span>
            </div>
            {inputText && <button onClick={clearText} className="text-xs text-rose-400 font-bold uppercase tracking-widest">Clear</button>}
          </div>

          {!result ? (
            <div className="text-center space-y-8 py-12">
              <div className="flex flex-col items-center gap-6">
                <div className="animate-float">
                  <BrandLogo size="lg" showText={true} />
                </div>
                <div>
                  <h2 className="text-5xl font-extrabold tracking-tight mt-4">Intelligence Decoded.</h2>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto mt-4">Professional-grade text analytics optimized for precision and speed.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SECTOR_EXAMPLES.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadExample(ex.text)}
                    className="p-6 glass rounded-2xl text-left border border-white/5 hover:border-emerald-500/40 transition-all hover:scale-[1.02] shadow-xl group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-2xl">{ex.icon}</span>
                      <span className="text-[9px] font-black uppercase text-slate-500 group-hover:text-emerald-500 transition-colors">{ex.title}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-tighter">{ex.tag}</p>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{ex.text}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-4">
                <BrandLogo size="sm" />
                <div>
                  <h2 className="text-2xl font-bold">Dynamic Intelligence</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Active Session</p>
                </div>
              </div>
              <button onClick={clearText} className="px-6 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-white/5">New Analysis</button>
            </div>
          )}

          <div className={`relative glass rounded-[40px] p-1 border-white/10 shadow-2xl transition-all duration-500 ${result ? 'opacity-50 scale-95 origin-top' : ''}`}>
            {inputText && (
              <button 
                onClick={clearText}
                className="absolute top-8 right-8 z-20 p-3 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/20 flex items-center gap-2 group shadow-lg"
                title="Clear Text"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover:block px-2">Clear Text</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <textarea
              className="w-full h-64 bg-transparent p-10 text-xl font-medium focus:outline-none placeholder-slate-600 resize-none scroll-smooth"
              placeholder="Paste text or drop files to begin analysis..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <div className="absolute bottom-8 right-8 left-8 flex justify-between items-center">
              <div className="flex gap-2">
                <button 
                  onClick={() => isListening ? recognitionRef.current?.stop() : recognitionRef.current?.start() && setIsListening(true)} 
                  className={`p-4 rounded-2xl glass transition-all ${isListening ? 'text-red-400 border-red-500/50 animate-pulse bg-red-500/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >🎙️</button>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="p-4 rounded-2xl glass text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >📁</button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
              </div>
              <button 
                disabled={loading || !inputText.trim()}
                onClick={() => handleAnalyze()}
                className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
              >
                {loading ? 'Processing Intelligence...' : 'Analyze Now'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-center">
              <span className="text-rose-400 font-bold text-xs uppercase tracking-widest">{error}</span>
            </div>
          )}
          
          {result && <AnalysisReport result={result} />}
        </div>
      </main>
    </div>
  );
};

export default App;
