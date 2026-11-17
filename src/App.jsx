import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ComposedChart, Bar, ReferenceDot 
} from 'recharts';
import { TrendingUp, TrendingDown, ShieldAlert, CheckCircle, RefreshCw, Layers, Target, Shield } from 'lucide-react';

export default function BBMAApp() {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState('M15');
  const [activeSignal, setActiveSignal] = useState(null);
  const [riskReward, setRiskReward] = useState('1:2');

  // Generate simulated Forex/Gold Chart data with BBMA indicators and SL/TP
  useEffect(() => {
    generateChartData(timeframe);
  }, [timeframe]);

  const generateChartData = (tf) => {
    let basePrice = 3860.0;
    const generated = [];
    let count = 40;
    
    for (let i = 0; i < count; i++) {
      const noise = (Math.random() - 0.48) * 4.5;
      basePrice += noise;
      const open = basePrice;
      const close = open + (Math.random() - 0.49) * 4.0;
      const high = Math.max(open, close) + Math.random() * 2.5;
      const low = Math.min(open, close) - Math.random() * 2.5;

      const ma5High = high + 1.2;
      const ma5Low = low - 1.2;
      const ma50 = (high + low) / 2 + (Math.sin(i / 5) * 3);
      
      const upperBB = ma50 + 8.5 + Math.cos(i / 4) * 2;
      const lowerBB = ma50 - 8.5 - Math.sin(i / 4) * 2;

      let signal = null;
      let signalType = '';
      let desc = '';
      let sl = 0;
      let tp = 0;

      if (i === count - 6) {
        signal = low - 1.5;
        signalType = 'BUY';
        desc = 'Extreme + Reentry (Price touch lower BB & MA5/10 Low)';
        sl = parseFloat((close - 6.5).toFixed(2));
        tp = parseFloat((close + 13.0).toFixed(2));
      } else if (i === count - 12) {
        signal = high + 1.5;
        signalType = 'SELL';
        desc = 'Extreme Sell at Upper BB';
        sl = parseFloat((close + 6.5).toFixed(2));
        tp = parseFloat((close - 13.0).toFixed(2));
      } else if (i === count - 2) {
        signal = high + 1.8;
        signalType = 'SELL';
        desc = 'MHV / Reentry Sell Zone';
        sl = parseFloat((close + 5.5).toFixed(2));
        tp = parseFloat((close - 11.0).toFixed(2));
      }

      generated.push({
        time: `${17} Nov ${(5 + Math.floor(i/3)).toString().padStart(2, '0')}:${( (i%3)*20 ).toString().padStart(2, '0')}`,
        open: parseFloat(open.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        upperBB: parseFloat(upperBB.toFixed(2)),
        lowerBB: parseFloat(lowerBB.toFixed(2)),
        ma50: parseFloat(ma50.toFixed(2)),
        ma5High: parseFloat(ma5High.toFixed(2)),
        ma5Low: parseFloat(ma5Low.toFixed(2)),
        signal: signal,
        signalType: signalType,
        desc: desc,
        sl: sl,
        tp: tp,
        isGreen: close >= open
      });
    }

    setData(generated);
    const lastSignal = generated.reverse().find(d => d.signalType !== '') || generated[0];
    setActiveSignal(lastSignal);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Bar / Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600/20 text-emerald-400 p-2 rounded-lg border border-emerald-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              BBMA Assistant <span className="text-xs bg-emerald-600 px-2 py-0.5 rounded text-white font-mono">PRO + SL/TP</span>
            </h1>
            <p className="text-xs text-slate-400">Analysing XAUUSD.r - {timeframe}</p>
          </div>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 space-x-1">
          {['M5', 'M15', 'H1', 'H4'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                timeframe === tf 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <button 
          onClick={() => generateChartData(timeframe)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Signal
        </button>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left/Center: Interactive Chart Area */}
        <div className="flex-1 flex flex-col p-4 bg-slate-950 overflow-hidden">
          
          {/* Chart Info Banner */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800/80 px-4 py-2.5 rounded-xl mb-3 shadow-sm">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-medium text-slate-400">Strategy Rules:</span>
              <span className="text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Extreme + Reentry Auto SL/TP
              </span>
            </div>
            <div className="text-xs font-mono text-slate-300">
              Current Price: <span className="text-emerald-400 font-bold">3869.95</span>
            </div>
          </div>

          {/* Recharts BBMA Graph Simulation */}
          <div className="flex-1 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 relative flex flex-col shadow-inner">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              BBMA Bollinger Bands (2.0) & Moving Average (5/10/50) with Entry Points
            </div>

            <div className="flex-1 w-full h-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={11} domain={['auto', 'auto']} tickLine={false} orientation="right" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value, name) => [value, name]}
                  />
                  
                  <Line type="monotone" dataKey="upperBB" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Upper BB" />
                  <Line type="monotone" dataKey="lowerBB" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Lower BB" />
                  <Line type="monotone" dataKey="ma50" stroke="#10b981" strokeWidth={2} dot={false} name="MA 50 Mid BB" />
                  <Line type="monotone" dataKey="ma5High" stroke="#3b82f6" strokeDasharray="3 3" strokeWidth={1} dot={false} name="MA5 High" />
                  <Line type="monotone" dataKey="ma5Low" stroke="#3b82f6" strokeDasharray="3 3" strokeWidth={1} dot={false} name="MA5 Low" />

                  <Bar dataKey="high" fill="#334155" opacity={0} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Signal Panel & Setup Analysis */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>សញ្ញាចូលទិញ/លក់ (Signals)</span>
              <span className="text-xs text-emerald-400 font-normal">Active Setup</span>
            </h2>

            {/* Active Signal Box with SL/TP */}
            {activeSignal && (
              <div className={`p-4 rounded-xl border ${
                activeSignal.signalType === 'BUY' 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    activeSignal.signalType === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    {activeSignal.signalType === 'BUY' ? <TrendingUp className="w-3.5 h-3.5 inline mr-1" /> : <TrendingDown className="w-3.5 h-3.5 inline mr-1" />}
                    {activeSignal.signalType} SIGNAL
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{activeSignal.time}</span>
                </div>
                <p className="text-xs font-medium text-slate-200 mb-3">{activeSignal.desc}</p>
                
                <div className="space-y-2 text-xs pt-3 border-t border-slate-800/80 font-mono">
                  <div className="flex justify-between items-center bg-slate-950/60 p-1.5 rounded">
                    <span className="text-slate-400 flex items-center gap-1"><Target className="w-3.5 h-3.5 text-blue-400" /> Entry Price:</span>
                    <span className="font-bold text-white">{activeSignal.close}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950/60 p-1.5 rounded">
                    <span className="text-slate-400 flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-rose-400" /> Stop Loss (SL):</span>
                    <span className="font-bold text-rose-400">{activeSignal.sl}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950/60 p-1.5 rounded">
                    <span className="text-slate-400 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Take Profit (TP):</span>
                    <span className="font-bold text-emerald-400">{activeSignal.tp}</span>
                  </div>
                </div>
              </div>
            )}

            {/* BBMA Rule Breakdown */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ការណែនាំតាមក្បួន BBMA</h3>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono text-[10px]">1</span>
                  <p><strong>Stop Loss:</strong> កំណត់ហួសពី High នៃ Bollinger Bands (សម្រាប់ Sell) ឬក្រោម Low BB (សម្រាប់ Buy) ប្រហែល 5 ទៅ 10 Pips ។</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono text-[10px]">2</span>
                  <p><strong>Take Profit:</strong> កំណត់គោលដៅយកប្រាក់ចំណេញនៅកណ្តាល BB (MA 50) ឬផ្ទុយ Bollinger Bands វិញ (Risk:Reward 1:2)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-slate-800">
            <p className="text-[11px] text-slate-500">ប្រព័ន្ធវិភាគ BBMA Assistant ជាមួយ SL/TP ស្វ័យប្រវត្តិ។</p>
          </div>
        </div>

      </div>
    </div>
  );
}
```
eof
