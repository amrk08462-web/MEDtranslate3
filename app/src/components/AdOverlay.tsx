import { useState, useEffect, useRef } from 'react';
import { X, Play, Gift, Clock, FileText, Sparkles } from 'lucide-react';

interface AdOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  fileName: string;
  sourceLang: string;
  targetLang: string;
}

export function AdOverlay({ isOpen, onClose, onComplete, fileName, sourceLang, targetLang }: AdOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [adTimer, setAdTimer] = useState(15);
  const [showRewardAd, setShowRewardAd] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setProgress(0);
      setAdTimer(15);
      setShowRewardAd(true);
      setIsTranslating(false);
      return;
    }

    // Start the ad timer countdown
    timerRef.current = setInterval(() => {
      setAdTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Ad finished, start translation
          setShowRewardAd(false);
          setIsTranslating(true);
          startTranslationProgress();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isOpen]);

  const startTranslationProgress = () => {
    // Simulate translation progress
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          // Translation complete
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        // Random progress increment
        return Math.min(prev + Math.random() * 8 + 2, 100);
      });
    }, 300);
  };

  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={handleClose} />
      
      {/* Main Container */}
      <div className="relative w-full max-w-lg animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress Counter - Always visible at top */}
        <div className="mb-4 glass-panel-strong rounded-2xl p-4 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium truncate max-w-[200px]">{fileName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/60">{sourceLang}</span>
              <span className="text-cyan-400">→</span>
              <span className="text-white/60">{targetLang}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-white/50">
                {isTranslating ? 'Translating with AI...' : showRewardAd ? 'Waiting for ad...' : 'Starting...'}
              </span>
              <span className="text-lg font-bold text-cyan-400">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Reward Ad Container */}
        {showRewardAd && (
          <div className="glass-panel-strong rounded-2xl overflow-hidden border border-yellow-500/30">
            {/* Ad Header */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 border-b border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Reward Ad</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-bold">{adTimer}s</span>
                </div>
              </div>
            </div>

            {/* Ad Content - Simulated */}
            <div className="p-6 bg-gradient-to-b from-gray-900 to-black">
              <div className="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                
                <div className="text-center relative z-10">
                  <Play className="w-16 h-16 text-white/80 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">Advertisement</p>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              <p className="text-white/70 text-center text-sm">
                Watch this ad to support free translations
              </p>
            </div>
          </div>
        )}

        {/* Translation Status */}
        {isTranslating && (
          <div className="glass-panel-strong rounded-2xl p-6 border border-cyan-500/30 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center border border-cyan-500/50">
                <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Processing with AI</h3>
            <p className="text-white/60 text-sm">
              Your document is being translated using our local AI model
            </p>
          </div>
        )}

        {/* Bottom Banner Ad */}
        <div className="mt-4 glass-panel rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-white/80 text-sm font-medium">Earn Rewards</p>
              <p className="text-white/50 text-xs">Complete tasks to unlock premium features</p>
            </div>
            <button className="px-4 py-2 bg-green-500/20 text-green-400 text-sm font-medium rounded-lg hover:bg-green-500/30 transition-colors">
              View
            </button>
          </div>
        </div>

        {/* Cancel Info */}
        <p className="mt-4 text-center text-white/40 text-xs">
          Click the X button to cancel translation
        </p>
      </div>
    </div>
  );
}
