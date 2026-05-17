'use client'

import React from "react";
import Link from 'next/link';
import ElectricBorder from '@/components/ui/ElectricBorder';
import PixelTrail from '@/components/ui/PixelTrail';

export default function LandingPage() {
  return (
      <div className="relative min-h-screen w-full text-white overflow-x-hidden selection:bg-pink-500/30 selection:text-pink-200" style={{ background: '#050510' }}>
      {/* 
        SCOPED ANIMATIONS 
      */}
      <style>{`
        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>

      {/* Retro Grid Background */}
      <div className="absolute inset-0 z-0 bg-grid opacity-60" />
      
      {/* Pixel Trail Interactive Background */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
        <PixelTrail
          gridSize={51}
          trailSize={0.07}
          maxAge={250}
          interpolate={5}
          color="#00FFFF"
          gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
        />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b-[2px] border-dotted border-cyan-500/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center border-[2px] border-dotted border-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(255,255,0,0.2)]">
            <div className="w-4 h-4 bg-yellow-400 animate-blink" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl pixel-font tracking-widest text-white" style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>PEBLO</span>
            <span className="pixel-font text-[8px] text-cyan-400 tracking-widest">OS v1.0</span>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/login" className="pixel-font text-[8px] sm:text-[10px] text-zinc-400 hover:text-white transition-all uppercase tracking-widest">Login</Link>
          <Link href="/signup" className="pixel-font inline-flex items-center justify-center border-[2px] border-dotted border-pink-500 bg-pink-500/10 px-4 py-2 sm:px-6 sm:py-3 text-[8px] sm:text-[10px] text-pink-400 transition-all hover:bg-pink-500 hover:text-white shadow-[0_0_15px_rgba(255,0,127,0.3)]">
            INSERT COIN
          </Link>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 md:pt-32 md:pb-32 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center space-y-10">
          
          {/* Badge */}
          <div className="inline-block border-[2px] border-dotted border-cyan-500/50 bg-cyan-500/10 px-4 py-2">
            <span className="text-[8px] sm:text-[10px] pixel-font uppercase tracking-widest text-cyan-400 flex items-center gap-3">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
              INTELLIGENCE ENGINE ACTIVE
            </span>
          </div>

          {/* Heading */}
          <h1 className="pixel-font text-3xl sm:text-5xl lg:text-7xl leading-[1.3] text-white" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
            THE INTELLIGENT
            <br />
            <span className="text-pink-500" style={{ textShadow: '0 0 30px rgba(255,0,127,0.6)' }}>
              WORKSPACE
            </span>
            <br />
            THAT THINKS
          </h1>

          {/* Description */}
          <div className="mono-font max-w-2xl text-sm sm:text-base text-cyan-100/70 leading-relaxed mx-auto text-left sm:text-center p-6 border-[1px] border-dotted border-cyan-500/20 bg-black/40">
            <p className="mb-2">&gt; Bridge the gap between raw thought and structured intelligence.</p>
            <p>&gt; Powered by Gemini 2.5 Flash streaming for zero-latency insights.</p>
            <p className="mt-4 animate-blink text-cyan-500">_</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <Link href="/signup" className="pixel-font group inline-flex items-center justify-center gap-3 border-[2px] border-solid border-yellow-400 bg-yellow-400 px-8 py-5 text-[10px] sm:text-[12px] text-black transition-all hover:scale-105 hover:bg-yellow-300 shadow-[0_0_30px_rgba(255,255,0,0.4)]">
              START GAME
              <span className="text-black group-hover:translate-x-1 transition-transform">▶</span>
            </Link>
            
            <Link href="/dashboard" className="pixel-font group inline-flex items-center justify-center gap-2 border-[2px] border-dotted border-cyan-500 bg-cyan-500/10 px-8 py-5 text-[10px] text-cyan-400 transition-all hover:bg-cyan-500 hover:text-black">
              SPECTATE MODE
            </Link>
          </div>
        </div>

        {/* Core Modules Grid */}
        <div className="mt-32 border-[2px] border-dotted border-purple-500/30 p-8 bg-black/50 backdrop-blur-sm relative">
          <div className="absolute -top-4 left-8 bg-[#050510] px-4">
             <h2 className="text-lg sm:text-xl pixel-font text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">SYSTEM FEATURES</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <ElectricBorder color="#06b6d4" speed={1.5} chaos={0.1} borderRadius={0}>
              <div className="h-full border-[1px] border-dotted border-cyan-500/30 p-6 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors">
                <div className="text-cyan-400 text-3xl mb-6">⚡</div>
                <h3 className="text-[10px] sm:text-xs pixel-font mb-4 text-cyan-300 tracking-widest">NEURAL STREAMING</h3>
                <p className="mono-font text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Zero-latency AI feedback loop. Summaries and action extractions appear token-by-token.
                </p>
              </div>
            </ElectricBorder>

            <ElectricBorder color="#ec4899" speed={1.5} chaos={0.1} borderRadius={0}>
              <div className="h-full border-[1px] border-dotted border-pink-500/30 p-6 bg-pink-500/5 hover:bg-pink-500/10 transition-colors">
                <div className="text-pink-400 text-3xl mb-6">🔒</div>
                <h3 className="text-[10px] sm:text-xs pixel-font mb-4 text-pink-300 tracking-widest">ATOMIC SHARING</h3>
                <p className="mono-font text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Convert private repository items into public knowledge assets instantly.
                </p>
              </div>
            </ElectricBorder>

            <ElectricBorder color="#22c55e" speed={1.5} chaos={0.1} borderRadius={0}>
              <div className="h-full border-[1px] border-dotted border-green-500/30 p-6 bg-green-500/5 hover:bg-green-500/10 transition-colors">
                <div className="text-green-400 text-3xl mb-6">📊</div>
                <h3 className="text-[10px] sm:text-xs pixel-font mb-4 text-green-300 tracking-widest">OUTPUT INSIGHTS</h3>
                <p className="mono-font text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Visualize your intellectual velocity. Track tag frequency and document iterations.
                </p>
              </div>
            </ElectricBorder>
          </div>
        </div>
      </main>

      <footer className="relative z-10 mx-auto px-6 py-8 border-t-[2px] border-dotted border-cyan-500/30 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#050510]">
        <div className="flex items-center gap-3">
          <span className="pixel-font text-[8px] text-cyan-400 tracking-widest">© 2026 PEBLO CORP</span>
        </div>
        <div className="pixel-font text-[6px] sm:text-[8px] text-zinc-600 tracking-widest">
          BUILT FOR PEBLO FULL-STACK CHALLENGE
        </div>
      </footer>
    </div>
  );
}
