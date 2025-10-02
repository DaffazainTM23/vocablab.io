import { Sparkles, Play, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2400)',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/70 to-pink-900/70 backdrop-blur-sm" />

      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <Sparkles className="text-yellow-300" size={20} />
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-white uppercase">
              AI VOCABULARY LAB
            </p>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-8">
            <span className="gradient-text block animate-gradient">
              MASTER WORDS
            </span>
            <span className="text-white block">WITH FUN!</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Learn vocabulary with clear pronunciation, examples, and exciting games.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/topics"
              className="group relative px-8 py-4 bg-gradient-luxury text-white font-bold text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 flex items-center gap-3 min-w-[240px] justify-center"
            >
              <Play className="group-hover:scale-110 transition-transform" size={24} />
              Start Learning
            </Link>

            <Link
              to="/quick-test"
              className="group relative px-8 py-4 bg-white/15 backdrop-blur-xl border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/25 hover:border-white/50 transition-all duration-300 flex items-center gap-3 min-w-[240px] justify-center"
            >
              <Zap className="text-yellow-300 group-hover:scale-110 transition-transform" size={24} />
              Try a Quick Test
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-card p-6 hover:scale-105 transition-all">
              <div className="text-4xl font-black gradient-text mb-2">516</div>
              <p className="text-white/90 font-semibold">Vocabulary Words</p>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-all">
              <div className="text-4xl font-black gradient-text mb-2">10</div>
              <p className="text-white/90 font-semibold">Interactive Topics</p>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-all">
              <div className="text-4xl font-black gradient-text mb-2">4</div>
              <p className="text-white/90 font-semibold">Fun Games</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50 dark:from-gray-950 to-transparent" />
    </section>
  );
}
