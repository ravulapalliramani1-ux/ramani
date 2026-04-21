import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Database, Shield, Zap } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 md:p-8 bg-void-black text-white selection:bg-neon-magenta selection:text-white">
      {/* Decorative Scanlines & Noise */}
      <div className="fixed inset-0 pointer-events-none noise z-40 opacity-5" />
      
      {/* Header Bar */}
      <header className="fixed top-0 left-0 w-full p-4 border-b border-neon-cyan/20 flex items-center justify-between z-30 bg-void-black/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neon-cyan flex items-center justify-center text-void-black font-extrabold animate-pulse">
            V
          </div>
          <h1 className="text-sm font-glitch tracking-[0.3em] hidden sm:block">
            NEON_VIRTUA_OS <span className="text-neon-magenta">v4.2.1</span>
          </h1>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest text-neon-cyan/60">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-neon-cyan" />
            <span>ENCRYPTION: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-neon-yellow" />
            <span>PWR_CELL: 98%</span>
          </div>
          <div className="hidden lg:block">
            ISO_TIME: {new Date().toISOString()}
          </div>
        </div>
      </header>

      {/* Main UI Layout */}
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_auto_350px] gap-8 items-start relative z-10 pt-16">
        
        {/* Left Sidebar Status */}
        <section className="hidden lg:flex flex-col gap-6 p-4 border-r border-neon-magenta/20 h-full">
          <div className="space-y-4">
            <h2 className="text-xs font-glitch text-neon-magenta mb-4">SYSTEM_LOGS</h2>
            {[1, 2, 3, 4].map(i => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-[9px] font-mono p-2 bg-neon-magenta/5 border-l border-neon-magenta"
              >
                <span className="text-neon-magenta opacity-50 mr-2">[{0x123 + i}]</span>
                KERNEL_THREAD_INITIALIZED_RESONANCE_{i}
              </motion.div>
            ))}
          </div>
          <div className="mt-auto p-4 bg-neon-cyan/5 border border-neon-cyan/20">
            <p className="text-[10px] font-mono leading-relaxed text-neon-cyan/70">
              WARNING: UNAUTHORIZED FREQUENCY DETECTED. NEURAL LINK REQUIRES CONSTANT FOCUS. OPERATE SNAKE MODULE TO STABILIZE.
            </p>
          </div>
        </section>

        {/* Center: Game Window */}
        <section className="flex flex-col items-center justify-center p-4 bg-void-black/40 relative">
          {/* Animated Background Deco */}
          <div className="absolute -z-10 w-full h-full">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-magenta/30 to-transparent" />
          </div>

          <div className="mb-8 flex flex-col items-center">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl font-glitch text-neon-cyan mb-2"
            >
              {score.toString().padStart(6, '0')}
            </motion.div>
            <div className="text-[10px] font-glitch text-white/40 tracking-[0.5em]">OPERATIONAL_SCORE</div>
          </div>

          <SnakeGame onScoreUpdate={setScore} />

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {[
              { icon: Terminal, label: 'CMD_LINE', color: 'cyan' },
              { icon: Database, label: 'DAT_CORE', color: 'magenta' },
              { icon: Shield, label: 'SEC_PATH', color: 'cyan' },
              { icon: Zap, label: 'FCT_LNK', color: 'magenta' },
            ].map((item, idx) => (
              <div key={idx} className={`p-3 border border-neon-${item.color}/30 flex flex-col items-center gap-2 group hover:border-neon-${item.color} transition-all cursor-pointer`}>
                <item.icon size={18} className={`text-neon-${item.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[8px] font-glitch tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Right Sidebar: Music Player */}
        <aside className="w-full lg:w-[350px] flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 p-2 px-4 bg-neon-magenta text-void-black font-glitch text-[10px]">
             <Zap size={10} /> AUDIO_STIMULATOR_CONNECTED
          </div>
          <MusicPlayer />
          
          {/* Extra widget */}
          <div className="mt-4 p-4 border border-white/10 bg-void-black/20 font-mono text-[9px] leading-tight space-y-2">
            <p className="text-neon-cyan">SNAKE_PROC_INFO:</p>
            <p> - GRID_RES: 20x20</p>
            <p> - COLLISION: PERMISSIVE</p>
            <p> - TICK_RATE: DYNAMIC</p>
            <div className="h-0.5 bg-white/5 w-full mt-2">
               <motion.div 
                className="h-full bg-neon-cyan"
                animate={{ width: ['20%', '80%', '40%'] }}
                transition={{ repeat: Infinity, duration: 3 }}
               />
            </div>
          </div>
        </aside>

      </main>

      {/* Footer System Status */}
      <footer className="fixed bottom-0 left-0 w-full p-2 border-t border-neon-cyan/10 flex items-center justify-center text-[8px] font-mono text-neon-cyan/30 uppercase tracking-[0.5em] z-30 bg-void-black/80">
        SYSTEM_ALIVE // CONNECTION_SECURE // RESONANCE_STABLE // NO_GHOST_DETECTED
      </footer>
    </div>
  );
}
