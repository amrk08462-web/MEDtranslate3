import { useEffect, useRef } from 'react';
import { 
  Smartphone, Shield, Zap, Globe, Lock, Cpu, 
  Eye, Clock, Sparkles, Play, Gift, FileText 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, gradient }) => {
  return (
    <div className="group relative glass-card p-6 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Icon */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
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
    
    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const howItWorks = [
    {
      step: 1,
      icon: FileText,
      title: 'Upload Document',
      desc: 'Select your PDF or document file',
    },
    {
      step: 2,
      icon: Play,
      title: 'Watch an Ad',
      desc: 'Support free translations by watching a quick ad',
    },
    {
      step: 3,
      icon: Cpu,
      title: 'AI Translates',
      desc: 'Our Fine-Tuned model processes on your device',
    },
    {
      step: 4,
      icon: Gift,
      title: 'Download Result',
      desc: 'Get your translated document instantly',
    },
  ];

  const features: FeatureCardProps[] = [
    {
      icon: Smartphone,
      title: 'On-Device AI',
      description: 'Our custom Fine-Tuned model runs entirely on your phone. No data ever leaves your device.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Shield,
      title: 'Maximum Privacy',
      description: '100% private translation. Your medical documents are never uploaded to any server.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'No server delays. Process documents instantly using your device\'s computing power.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Lock,
      title: 'Zero Data Collection',
      description: 'We don\'t collect, store, or track any of your documents or personal information.',
      gradient: 'from-red-500 to-rose-500',
    },
    {
      icon: Cpu,
      title: 'Fine-Tuned Model',
      description: 'Custom AI specifically trained for medical terminology and document translation.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Globe,
      title: '3 Languages',
      description: 'Currently supporting English, Spanish, and Arabic. More languages coming soon!',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Eye,
      title: 'OCR Technology',
      description: 'Advanced optical character recognition extracts text from scanned PDFs and images.',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Clock,
      title: 'Always Available',
      description: 'Works offline after initial setup. Translate anytime, anywhere without internet.',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="reveal opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 mb-6">
              <Play className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">How It Works</span>
            </div>
            
            <h2 className="reveal opacity-0 text-3xl md:text-4xl font-bold text-white mb-4 animate-delay-100">
              Translate in <span className="text-gradient">4 Simple Steps</span>
            </h2>
          </div>

          <div className="reveal opacity-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-delay-200">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="glass-card p-6 text-center h-full">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{item.step}</span>
                  </div>
                  <item.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <div className="reveal opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Why Choose Us</span>
          </div>
          
          <h2 className="reveal opacity-0 text-3xl md:text-4xl font-bold text-white mb-4 animate-delay-100">
            Built for <span className="text-gradient">Privacy & Speed</span>
          </h2>
          
          <p className="reveal opacity-0 text-white/60 max-w-2xl mx-auto animate-delay-200">
            Our custom Fine-Tuned AI model is designed specifically for medical document translation, 
            running entirely on your device for maximum security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`reveal opacity-0`}
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="reveal opacity-0 mt-12 glass-card p-6 border border-cyan-500/20 animate-delay-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">More Languages Coming Soon</h3>
                <p className="text-white/50 text-sm">We're working on adding French, German, Chinese, and more!</p>
              </div>
            </div>
            <button 
              onClick={() => document.getElementById('translation-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary whitespace-nowrap"
            >
              Start Translating
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
