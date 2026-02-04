import { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileText, ArrowRightLeft, Download, CheckCircle, 
  RefreshCcw, XCircle, ChevronDown, FileCheck, Check, 
  ArrowRight, Play, Shield, Smartphone, Zap, Globe 
} from 'lucide-react';
import { LANGUAGES, type LanguageOption, TranslationStatus } from '@/types';
import { AdOverlay } from '@/components/AdOverlay';
import { translateDocument } from '@/services/geminiService';

// Language Selector Component
interface LanguageSelectorProps {
  label: string;
  value: LanguageOption;
  onChange: (lang: LanguageOption) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative group w-full" ref={containerRef}>
      <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full glass-panel rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-white/10 hover:border-cyan-500/30 cursor-pointer'
          }`}
          disabled={disabled}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{value.flag}</span>
            <div className="text-left">
              <span className="text-white font-medium block">{value.name}</span>
              <span className="text-white/40 text-xs">{value.nameNative}</span>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto glass-panel-strong rounded-xl shadow-glass z-50 animate-fade-in-up">
            <div className="sticky top-0 glass-panel-strong p-3 border-b border-white/10 z-10">
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Select Language</p>
            </div>
            <div className="p-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between group transition-colors ${
                    lang.code === value.code 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <span className="block">{lang.name}</span>
                      <span className="text-xs text-white/40">{lang.nameNative}</span>
                    </div>
                  </div>
                  {lang.code === value.code && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Translation Interface
export function TranslationInterface() {
  const [status, setStatus] = useState<string>(TranslationStatus.IDLE);
  const [sourceLang, setSourceLang] = useState<LanguageOption>(LANGUAGES[0]);
  const [targetLang, setTargetLang] = useState<LanguageOption>(LANGUAGES[1]);
  const [file, setFile] = useState<File | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showAdOverlay, setShowAdOverlay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedExtensions = ['.pdf', '.txt', '.md', '.json', '.csv', '.doc', '.docx'];
      
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please upload a valid document (PDF, TXT, MD, DOC, or CSV).");
        return;
      }
      
      setFile(selectedFile);
      setStatus(TranslationStatus.FILE_SELECTED);
      setError(null);
    }
  };

  const handleStartTranslation = () => {
    if (!file) {
      setError("Please upload a valid document.");
      return;
    }
    // Show ad overlay
    setShowAdOverlay(true);
    setStatus(TranslationStatus.WATCHING_AD);
  };

  const handleAdComplete = async () => {
    setShowAdOverlay(false);
    setStatus(TranslationStatus.TRANSLATING);
    
    try {
      const result = await translateDocument(file!, targetLang.name, sourceLang.name);
      setTranslatedContent(result);
      setStatus(TranslationStatus.COMPLETED);
    } catch (err) {
      console.error(err);
      setError("Translation failed. Please try again.");
      setStatus(TranslationStatus.ERROR);
    }
  };

  const handleAdCancel = () => {
    setShowAdOverlay(false);
    setStatus(TranslationStatus.CANCELLED);
    // Reset after a moment
    setTimeout(() => {
      setStatus(TranslationStatus.FILE_SELECTED);
    }, 1000);
  };

  const handleDownload = () => {
    if (!file) return;
    
    const originalName = file.name;
    const nameParts = originalName.split('.');
    nameParts.pop();
    const nameWithoutExt = nameParts.join('.');
    const newFileName = `${nameWithoutExt}_${targetLang.code}_translated.txt`;

    const element = document.createElement("a");
    const fileBlob = new Blob([translatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = newFileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reset = () => {
    setFile(null);
    setTranslatedContent('');
    setStatus(TranslationStatus.IDLE);
    setError(null);
    setShowAdOverlay(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return (
    <section id="translation-section" className="relative py-20">
      {/* Ad Overlay */}
      <AdOverlay
        isOpen={showAdOverlay}
        onClose={handleAdCancel}
        onComplete={handleAdComplete}
        fileName={file?.name || ''}
        sourceLang={sourceLang.name}
        targetLang={targetLang.name}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/30 mb-6">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">On-Device AI Translation</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Translate Your <span className="text-gradient">Medical Documents</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Upload any PDF or document file. Our custom Fine-Tuned AI model processes everything 
            <span className="text-cyan-400"> locally on your device</span> for maximum privacy and security.
          </p>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">100% Private</p>
              <p className="text-white/50 text-xs">AI runs on your phone</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Lightning Fast</p>
              <p className="text-white/50 text-xs">No server delays</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">3 Languages</p>
              <p className="text-white/50 text-xs">More coming soon</p>
            </div>
          </div>
        </div>

        {/* Main Translation Container */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50" />
          
          <div className="relative glass-panel-strong rounded-3xl p-1 overflow-hidden">
            <div className="bg-black/40 rounded-[22px] relative min-h-[500px] flex flex-col">
              {/* Ambient glows */}
              <div className="absolute inset-0 overflow-hidden rounded-[22px] pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="p-8 md:p-12 relative z-10 flex flex-col flex-1">
                {/* Language Selectors */}
                {status !== TranslationStatus.COMPLETED && (
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 animate-fade-in-up">
                    <LanguageSelector 
                      label="From" 
                      value={sourceLang} 
                      onChange={setSourceLang} 
                      disabled={status === TranslationStatus.WATCHING_AD || status === TranslationStatus.TRANSLATING}
                    />

                    <button 
                      onClick={handleSwapLanguages}
                      disabled={status === TranslationStatus.WATCHING_AD || status === TranslationStatus.TRANSLATING}
                      className="mt-6 p-3 rounded-xl glass-panel hover:bg-white/10 border border-white/20 transition-all hover:rotate-180 disabled:opacity-50 disabled:cursor-not-allowed group"
                      title="Swap Languages"
                    >
                      <ArrowRightLeft className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300" />
                    </button>

                    <LanguageSelector 
                      label="To" 
                      value={targetLang} 
                      onChange={setTargetLang} 
                      disabled={status === TranslationStatus.WATCHING_AD || status === TranslationStatus.TRANSLATING}
                    />
                  </div>
                )}

                {/* Content Area */}
                <div className="flex-1 flex flex-col justify-center">
                  {/* Upload State */}
                  {status !== TranslationStatus.COMPLETED && status !== TranslationStatus.TRANSLATING && status !== TranslationStatus.WATCHING_AD && (
                    <div 
                      className={`border-2 border-dashed rounded-2xl transition-all duration-500 flex flex-col items-center justify-center p-10 text-center cursor-pointer flex-1 min-h-[250px] ${
                        file 
                          ? 'border-cyan-500/50 bg-cyan-500/5' 
                          : 'border-white/20 hover:border-cyan-500/30 hover:bg-white/5'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept=".pdf,.txt,.md,.json,.csv,.doc,.docx"
                        onChange={handleFileChange}
                      />
                      
                      <div className={`relative mb-5 transition-all duration-500 ${file ? 'scale-110' : ''}`}>
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl" />
                        <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                          {file ? <FileCheck className="text-cyan-400 h-10 w-10" /> : <Upload className="text-cyan-400 h-10 w-10" />}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2">
                        {file ? file.name : 'Drop your document here'}
                      </h3>
                      <p className="text-white/50 max-w-md mx-auto mb-3 text-sm">
                        {file 
                          ? 'Ready to translate. Click the button below to start.' 
                          : 'Supports PDF, TXT, MD, DOC files'}
                      </p>
                      
                      {!file && (
                        <div className="flex items-center gap-2 text-sm text-cyan-400">
                          <span>Click to browse</span>
                        </div>
                      )}

                      {file && (
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cancelled State */}
                  {status === TranslationStatus.CANCELLED && (
                    <div className="flex flex-col items-center justify-center flex-1 animate-fade-in-up">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl" />
                        <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30">
                          <XCircle className="text-yellow-400 h-10 w-10" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Translation Cancelled</h3>
                      <p className="text-white/50 mb-4">You closed the ad before completion</p>
                      <button 
                        onClick={() => setStatus(TranslationStatus.FILE_SELECTED)}
                        className="px-6 py-3 glass-panel rounded-xl text-white hover:bg-white/10 transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Completed State */}
                  {status === TranslationStatus.COMPLETED && (
                    <div className="animate-fade-in-up flex flex-col items-center justify-center flex-1 text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                        <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                          <CheckCircle className="text-green-400 h-12 w-12" />
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-white mb-2">Translation Complete!</h2>
                      <p className="text-white/60 mb-6 max-w-md text-sm">
                        Your document has been successfully translated using our on-device AI.
                      </p>

                      <div className="glass-card p-4 mb-6 w-full max-w-md">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                            <FileText className="text-cyan-400 h-6 w-6" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-white font-medium truncate text-sm">{file?.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-white/40 text-xs">{sourceLang.name}</span>
                              <ArrowRight className="w-3 h-3 text-cyan-400" />
                              <span className="text-cyan-400 text-xs">{targetLang.name}</span>
                            </div>
                          </div>
                          <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                            READY
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                        <button 
                          onClick={handleDownload}
                          className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-glow"
                        >
                          <Download className="h-5 w-5" />
                          Download
                        </button>
                        
                        <button 
                          onClick={reset} 
                          className="px-6 py-3 glass-panel text-white rounded-xl hover:bg-white/10 transition-all font-medium border border-white/20"
                        >
                          <RefreshCcw className="h-4 w-4 inline mr-2" />
                          New File
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {status === TranslationStatus.ERROR && (
                    <div className="text-center py-8 animate-fade-in-up flex-1 flex flex-col items-center justify-center">
                      <div className="relative mb-5">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
                        <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center border border-red-500/30">
                          <XCircle className="text-red-400 h-10 w-10" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Translation Failed</h3>
                      <p className="text-white/50 mb-6 max-w-md text-sm">{error}</p>
                      <button 
                        onClick={reset} 
                        className="px-6 py-3 glass-panel rounded-xl text-white hover:bg-white/10 transition-all border border-white/20"
                      >
                        <RefreshCcw className="h-4 w-4 inline mr-2" />
                        Try Again
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Button - Watch Ad & Translate */}
                {status === TranslationStatus.FILE_SELECTED && (
                  <div className="mt-6 flex justify-center animate-fade-in-up">
                    <button 
                      onClick={handleStartTranslation}
                      className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <Play className="h-5 w-5" />
                        Watch an Ad & Translate Your File
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['PDF', 'TXT', 'MD', 'DOC', 'CSV'].map((format) => (
            <div 
              key={format}
              className="px-3 py-1.5 glass-panel rounded-lg text-xs text-white/60 flex items-center gap-2"
            >
              <FileText className="w-3 h-3 text-cyan-400" />
              {format}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
