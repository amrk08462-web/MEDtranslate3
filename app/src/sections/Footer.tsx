import { useState } from 'react';
import { 
  Mail, Phone, MapPin, Globe, ArrowUp, Shield, 
  FileText, ExternalLink, Smartphone, Cpu 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export function Footer({ onOpenPrivacy, onOpenTerms }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Translate', id: 'translation-section' },
    { label: 'Features', id: 'features' },
  ];

  const resources = [
    { label: 'Privacy Policy', onClick: onOpenPrivacy },
    { label: 'Terms of Service', onClick: onOpenTerms },
    { label: 'Help Center', href: '#' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="relative pt-20 pb-8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/logo.png" 
                alt="MED TRANSLATE" 
                className="h-10 w-auto"
              />
            </div>
            
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              AI-powered medical document translation that runs entirely on your device. 
              100% private, secure, and free with ads.
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 glass-panel rounded-full text-xs text-cyan-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Fine-Tuned AI
              </div>
              <div className="px-3 py-1 glass-panel rounded-full text-xs text-green-400 flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                On-Device
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-white/60 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  {resource.onClick ? (
                    <button
                      onClick={resource.onClick}
                      className="text-white/60 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2"
                    >
                      <Shield className="w-3 h-3" />
                      {resource.label}
                    </button>
                  ) : (
                    <a
                      href={resource.href}
                      className="text-white/60 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {resource.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              Stay Updated
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Get notified when we add new languages and features.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">Email</p>
                <a href="mailto:amrk08642@gmail.com" className="text-white text-sm hover:text-cyan-400 transition-colors">
                  amrk08642@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">WhatsApp Business</p>
                <a href="https://wa.me/01142855075" className="text-white text-sm hover:text-green-400 transition-colors">
                  01142855075
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">Location</p>
                <p className="text-white text-sm">Available Worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">
            © 2024 MED TRANSLATE. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenPrivacy}
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              Privacy
            </button>
            <button 
              onClick={onOpenTerms}
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              Terms
            </button>
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 glass-panel rounded-lg flex items-center justify-center text-white/50 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Privacy Modal Content
export function PrivacyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel-strong border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            Privacy Policy
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-white/70 text-sm leading-relaxed">
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">1. 100% On-Device Processing</h3>
            <p>
              MED TRANSLATE processes all documents locally on your device using our Fine-Tuned AI model. 
              <span className="text-cyan-400"> Your files never leave your phone</span> and are never uploaded 
              to any server. This ensures maximum privacy and security for your medical documents.
            </p>
          </section>
          
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">2. No Data Collection</h3>
            <p>
              We do not collect, store, or track any of your documents, translations, or personal information. 
              All processing happens entirely on your device. We have no access to your files.
            </p>
          </section>
          
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">3. Advertisements</h3>
            <p>
              We display ads to support the free service. These ads are served by Google AdMob. 
              Ad networks may collect limited data for ad personalization, but this is separate from 
              your document content which remains private.
            </p>
          </section>
          
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">4. Contact Information</h3>
            <p>
              For privacy-related questions, contact us at: <a href="mailto:amrk08642@gmail.com" className="text-cyan-400 hover:underline">amrk08642@gmail.com</a>
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Terms Modal Content
export function TermsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel-strong border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            Terms of Service
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-white/70 text-sm leading-relaxed">
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">1. Service Description</h3>
            <p>
              MED TRANSLATE provides on-device AI translation for medical documents. Our Fine-Tuned model 
              processes files locally on your device. The service is supported by advertisements.
            </p>
          </section>
          
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">2. Supported Languages</h3>
            <p>
              Currently supported: English, Spanish, and Arabic. More languages will be added in future updates.
            </p>
          </section>
          
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">3. Disclaimer</h3>
            <p>
              While our AI strives for accuracy, translations may contain errors. MED TRANSLATE is not 
              responsible for any damages resulting from translation errors. Always verify critical medical 
              information with qualified professionals.
            </p>
          </section>
          
          <section>
            <h3 className="text-white font-semibold text-lg mb-2">4. Contact</h3>
            <p>
              For questions or support: <a href="mailto:amrk08642@gmail.com" className="text-cyan-400 hover:underline">amrk08642@gmail.com</a> 
              or WhatsApp Business: <a href="https://wa.me/01142855075" className="text-cyan-400 hover:underline">01142855075</a>
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
