import { useState, useEffect } from 'react';
import { Menu, X, Mail, Phone } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Translate', id: 'translation-section' },
    { label: 'Features', id: 'features' },
    { label: 'Contact', id: 'footer' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-2' 
          : 'py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div 
          className={`relative rounded-2xl transition-all duration-500 ${
            isScrolled 
              ? 'glass-panel-strong shadow-glass' 
              : 'bg-transparent'
          }`}
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Logo - Using user's uploaded logo */}
            <div 
              onClick={() => window.location.reload()}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img 
                src="/logo.png" 
                alt="MED TRANSLATE" 
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Contact & CTA */}
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="mailto:amrk08642@gmail.com" 
                className="p-2 text-white/50 hover:text-cyan-400 transition-colors"
                title="Email Us"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/01142855075" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-white/50 hover:text-green-400 transition-colors"
                title="WhatsApp Business"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button 
                onClick={() => scrollToSection('translation-section')}
                className="btn-primary text-sm"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 glass-panel-strong rounded-2xl p-4 animate-fade-in-up">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-3 text-left text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-white/10 flex gap-4">
              <a href="mailto:amrk08642@gmail.com" className="flex items-center gap-2 text-white/50 hover:text-cyan-400">
                <Mail className="w-4 h-4" /> Email
              </a>
              <a href="https://wa.me/01142855075" className="flex items-center gap-2 text-white/50 hover:text-green-400">
                <Phone className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
