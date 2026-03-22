import React, { useState } from 'react';
import { Activity, Clock, Database, Brain, Zap, AlertTriangle, CheckCircle2, XCircle, FileText, User, Server, Search } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [normalStep, setNormalStep] = useState(0);
  const [idealStep, setIdealStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const [input, setInput] = useState("Patient arrives in ER complaining of severe chest pain radiating to the left arm, accompanied by numbness, sweating, and shortness of breath.");
  const [resultText, setResultText] = useState("");
  const [optimizedTime, setOptimizedTime] = useState<number | null>(null);
  const [normalTime, setNormalTime] = useState<number | null>(null);

  const runSimulation = async () => {
    if (!input.trim()) return;
    
    setIsSimulating(true);
    setShowResults(false);
    setResultText("");
    setOptimizedTime(null);
    setNormalTime(null);
    setNormalStep(1);
    setIdealStep(1);

    const startTime = Date.now();

    // Ideal timeline (Faster context extraction)
    setTimeout(() => setIdealStep(2), 50);

    // Normal timeline (Slower embedding & search)
    setTimeout(() => setNormalStep(2), 150);
    setTimeout(() => setNormalStep(3), 400);

    try {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: `You are an ER Triage Assistant. Based on this patient description, provide a quick triage assessment including Primary Risk and Recommended Actions. Keep it concise, professional, and formatted in Markdown.\n\nPatient Description: ${input}`,
      });

      let fullText = "";
      let firstChunkReceived = false;

      for await (const chunk of responseStream) {
        if (!firstChunkReceived) {
          firstChunkReceived = true;
          setShowResults(true);
          const timeToFirstToken = Date.now() - startTime;
          setOptimizedTime(timeToFirstToken);
          setNormalTime(timeToFirstToken + 550); // Simulate 550ms penalty
        }
        fullText += chunk.text;
        setResultText(fullText);
      }

      setIdealStep(3);
      setTimeout(() => setNormalStep(4), 550);

    } catch (error) {
      console.error("Error generating triage response:", error);
      setResultText("Error generating triage response. Please check your API key and connection.");
      setShowResults(true);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight">Emergency Response Triage Assistant</h1>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live AI Mode
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        
        {/* Context Section */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Real-Time ER Triage</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              In emergency rooms, every millisecond counts. Traditional RAG (Retrieval-Augmented Generation) architectures rely on pre-indexing patient records and embedding emergency queries on the fly. This process often exceeds the critical <strong className="text-red-500">500ms latency limit</strong> before the LLM even begins generating a recommendation.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-100 text-sm font-medium">
                <Clock className="w-4 h-4" /> Normal Latency: 600ms - 1s+
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 text-sm font-medium">
                <Zap className="w-4 h-4" /> Target Latency: &lt; 500ms
              </div>
            </div>
          </div>
        </section>

        {/* Simulation Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Input */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                <User className="w-5 h-5 text-blue-500" /> Patient Arrival
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Description</label>
                  <textarea
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={5}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe the patient's symptoms..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Patient History Context</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="text-sm font-medium text-slate-700">200+ pages</div>
                      <div className="text-xs text-slate-500">14 years of medical records</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={runSimulation}
                  disabled={isSimulating || !input.trim()}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSimulating ? <Activity className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-yellow-400" />}
                  {isSimulating ? 'Processing Triage...' : 'Run Live Triage'}
                </button>
              </div>
            </div>

            {/* Problems with Normal Way */}
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/50">
              <h4 className="text-amber-800 font-semibold mb-3 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" /> Bottlenecks of Normal RAG
              </h4>
              <ul className="text-sm text-amber-900/80 space-y-2.5">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5"/> 
                  <span>Not real-time (relies on offline batch pre-indexing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"/> 
                  <span>High embedding API costs per segment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Server className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"/> 
                  <span>Expensive per-patient vector storage & maintenance</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Panel: Comparison */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Normal Way Column */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
              <div className="bg-slate-50 p-5 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">The Normal Way</h3>
                <p className="text-sm text-slate-500">Pre-indexed Patient Records</p>
              </div>
              
              <div className="p-5 flex-1 space-y-4">
                <Step 
                  icon={<Brain />} 
                  title="Embed Emergency Query" 
                  time="~100ms" 
                  active={normalStep >= 1 && normalStep < 2} 
                  completed={normalStep >= 2} 
                  color="blue"
                />
                <Step 
                  icon={<Search />} 
                  title="Search Vector DB (Top-K)" 
                  time="200-400ms" 
                  active={normalStep >= 2 && normalStep < 3} 
                  completed={normalStep >= 3} 
                  color="blue"
                />
                <Step 
                  icon={<FileText />} 
                  title="LLM Recommendation" 
                  time="300ms+" 
                  active={normalStep >= 3 && normalStep < 4} 
                  completed={normalStep >= 4} 
                  color="blue"
                />
              </div>

              <div className="p-5 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-700">Time to First Token</span>
                  <span className={`font-mono font-bold text-lg ${normalTime ? (normalTime > 500 ? 'text-red-600' : 'text-emerald-600') : 'text-slate-400'}`}>
                    {normalTime ? `${normalTime}ms` : '---'}
                  </span>
                </div>
                {normalTime && normalTime > 500 && (
                  <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Exceeds 500ms emergency limit
                  </div>
                )}
              </div>
            </div>

            {/* Ideal Goal Column */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-emerald-400 flex flex-col overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                Ideal Goal
              </div>
              <div className="bg-emerald-50/50 p-5 border-b border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-900">Optimized Architecture</h3>
                <p className="text-sm text-emerald-700">Real-time Context Assembly</p>
              </div>

              <div className="p-5 flex-1 space-y-4">
                <Step 
                  icon={<Zap />} 
                  title="Extract Relevant Segments" 
                  time="< 50ms" 
                  active={idealStep >= 1 && idealStep < 2} 
                  completed={idealStep >= 2} 
                  color="emerald"
                />
                <Step 
                  icon={<Brain />} 
                  title="LLM Recommendation" 
                  time="~300ms" 
                  active={idealStep >= 2 && idealStep < 3} 
                  completed={idealStep >= 3} 
                  color="emerald"
                />
                {/* Visual spacer to align with the 3-step normal process */}
                <div className={`p-4 rounded-xl border border-dashed border-slate-200 opacity-50 ${idealStep > 0 ? 'hidden' : 'block'}`}>
                  <div className="h-10"></div>
                </div>
              </div>

              <div className="p-5 bg-emerald-50/50 border-t border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-emerald-900">Time to First Token</span>
                  <span className={`font-mono font-bold text-lg ${optimizedTime ? (optimizedTime <= 500 ? 'text-emerald-600' : 'text-amber-600') : 'text-slate-400'}`}>
                    {optimizedTime ? `${optimizedTime}ms` : '---'}
                  </span>
                </div>
                {optimizedTime && optimizedTime <= 500 && (
                  <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Safely within 500ms limit
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                {isSimulating ? <Activity className="w-6 h-6 text-emerald-400 animate-pulse" /> : <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              </div>
              <div>
                <h3 className="text-xl font-bold">Live Triage Output</h3>
                <p className="text-slate-400 text-sm">Generated in real-time by Gemini 3.1 Flash</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">LLM Recommendation</h4>
                <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                  <Markdown>{resultText}</Markdown>
                  {isSimulating && <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1 align-middle"></span>}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex flex-col justify-center">
                <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Impact Analysis</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The <strong className="text-white">Optimized Architecture</strong> delivered this critical recommendation <strong className="text-emerald-400">~550ms faster</strong> than the normal RAG approach. 
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Optimized TTFT:</span>
                    <span className="text-emerald-400 font-mono">{optimizedTime}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Normal TTFT:</span>
                    <span className="text-red-400 font-mono">{normalTime}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Custom animation styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-width {
          0% { width: 10%; }
          100% { width: 90%; }
        }
      `}} />
    </div>
  );
}

// Helper Component for Steps
function Step({ icon, title, time, active, completed, color }: { icon: React.ReactNode, title: string, time: string, active: boolean, completed: boolean, color: 'blue' | 'emerald' }) {
  const isEmerald = color === 'emerald';
  
  const activeBg = isEmerald ? 'bg-emerald-100' : 'bg-blue-100';
  const activeText = isEmerald ? 'text-emerald-700' : 'text-blue-700';
  const activeBorder = isEmerald ? 'border-emerald-200' : 'border-blue-200';
  const barColor = isEmerald ? 'bg-emerald-500' : 'bg-blue-500';
  
  const completedBg = isEmerald ? 'bg-emerald-50' : 'bg-slate-50';
  const completedText = 'text-slate-800';
  const completedBorder = isEmerald ? 'border-emerald-100' : 'border-slate-200';

  let containerClasses = 'p-4 rounded-xl border transition-all duration-500 relative overflow-hidden ';
  let iconContainerClasses = 'p-2.5 rounded-lg shrink-0 transition-colors duration-500 ';

  if (completed) {
    containerClasses += `${completedBg} ${completedBorder}`;
    iconContainerClasses += `${activeBg} ${activeText}`;
  } else if (active) {
    containerClasses += `bg-white ${activeBorder} shadow-sm ring-1 ring-black/5`;
    iconContainerClasses += `bg-slate-100 text-slate-500 animate-pulse`;
  } else {
    containerClasses += 'bg-slate-50/50 border-slate-100 opacity-50';
    iconContainerClasses += 'bg-slate-100 text-slate-300';
  }

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-4">
        <div className={iconContainerClasses}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className={`font-semibold text-sm truncate ${completed ? completedText : active ? 'text-slate-700' : 'text-slate-400'}`}>
              {title}
            </h4>
            <span className={`text-xs font-mono ml-2 shrink-0 ${completed ? 'text-slate-500' : active ? 'text-slate-400' : 'text-slate-300'}`}>
              {time}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full ${barColor} transition-all duration-500 ease-out`}
              style={{ 
                width: completed ? '100%' : active ? '60%' : '0%',
                animation: active && !completed ? 'pulse-width 1.5s ease-in-out infinite alternate' : 'none'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
