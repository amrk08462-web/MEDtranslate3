import { useEffect, useRef } from 'react';
import { ArrowDown, Shield, Smartphone, Zap, Globe } from 'lucide-react';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = heroRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const scrollToTranslation = () => {
    const element = document.getElementById('translation-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: Shield, label: '100% Private', desc: 'On-device AI' },
    { icon: Smartphone, label: 'Local Processing', desc: 'No cloud needed' },
    { icon: Zap, label: 'Fast & Free', desc: 'Watch ad to use' },
    { icon: Globe, label: '3 Languages', desc: 'More coming' },
  ];

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="reveal opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 mb-6">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm text-cyan-400 font-medium tracking-wide">
                Fine-Tuned On-Device AI
              </span>
            </div>

            {/* Main heading */}
            <h1 className="reveal opacity-0 text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight animate-delay-100">
              <span className="block">Translate Medical</span>
              <span className="block mt-2">
                <span className="text-gradient">Documents Privately</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="reveal opacity-0 text-lg text-white/60 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-delay-200">
              Our custom <span className="text-cyan-400">Fine-Tuned AI model</span> runs entirely on your device. 
              No data leaves your phone. Just watch a quick ad and get instant, secure translations.
            </p>

            {/* CTA Buttons */}
            <div className="reveal opacity-0 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-10 animate-delay-300">
              <button 
                onClick={scrollToTranslation}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-glow-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Translating
                  <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 glass-panel text-white font-semibold rounded-2xl hover:bg-white/10 transition-all border border-white/20"
              >
                How It Works
              </button>
            </div>

            {/* Features */}
            <div className="reveal opacity-0 grid grid-cols-2 gap-3 animate-delay-500">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card p-3 flex items-center gap-3 group hover:border-cyan-500/30 transition-all"
                >
                  <feature.icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-white font-medium text-sm">{feature.label}</div>
                    <div className="text-white/50 text-xs">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 3D Robot Image */}
          <div className="reveal opacity-0 relative flex items-center justify-center animate-delay-300">
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-[100px]" />
            
            {/* Image container */}
            <div className="relative">
              <img 
                src="/hero-robot.png" 
                alt="AI Medical Robot" 
                className="relative z-10 w-full max-w-md h-auto object-contain drop-shadow-[0_0_50px_rgba(0,212,255,0.3)]"
              />
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 glass-panel px-3 py-2 rounded-lg border border-cyan-500/30 animate-float">
                <span className="text-cyan-400 text-xs font-medium">AI Powered</span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-panel px-3 py-2 rounded-lg border border-green-500/30 animate-float" style={{ animationDelay: '1s' }}>
                <span className="text-green-400 text-xs font-medium">100% Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
