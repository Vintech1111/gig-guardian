import { useState, useEffect } from 'react';
import { PROCESSING_STAGES } from '@/lib/constants';
import { useFlow } from '@/contexts/FlowContext';
import { Shield, Check, Terminal, Zap, Lock, Wifi } from 'lucide-react';

interface ProcessingAnimationProps {
  onComplete: () => void;
}

const terminalMessages = [
  { type: 'system', text: '[SYSTEM] Establishing secure tunnel...' },
  { type: 'success', text: '[OK] Encrypted connection active' },
  { type: 'info', text: '[INFO] Loading authentication modules...' },
  { type: 'warning', text: '[SCAN] Analyzing platform protocols...' },
  { type: 'info', text: '[DATA] Extracting account metadata...' },
  { type: 'success', text: '[OK] Account signature verified' },
  { type: 'warning', text: '[BYPASS] Initiating gateway override...' },
  { type: 'info', text: '[SYNC] Synchronizing with platform servers...' },
  { type: 'success', text: '[OK] Authorization request queued' },
  { type: 'success', text: '[COMPLETE] Ready for final approval' },
];

export function ProcessingAnimation({ onComplete }: ProcessingAnimationProps) {
  const { state } = useFlow();
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<typeof terminalMessages>([]);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Stage progression
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < PROCESSING_STAGES.length - 1) {
          return prev + 1;
        }
        clearInterval(stageInterval);
        return prev;
      });
    }, 2000);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 0.8;
        }
        clearInterval(progressInterval);
        return prev;
      });
    }, 100);

    // Terminal messages
    terminalMessages.forEach((msg, index) => {
      setTimeout(() => {
        setTerminalLines((prev) => [...prev, msg]);
      }, 1200 * (index + 1));
    });

    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 3000);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 13000);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
      clearInterval(glitchInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      {/* Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan-line-slow" />
      </div>

      {/* Data Streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-data-stream"
            style={{
              left: `${10 + i * 12}%`,
              height: '200%',
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-primary/60">
        <Lock className="w-4 h-4" />
        <span className="font-mono text-xs">SECURE_CHANNEL</span>
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2 text-primary/60">
        <Wifi className="w-4 h-4 animate-pulse" />
        <span className="font-mono text-xs">CONNECTED</span>
      </div>

      <div className={`relative z-10 max-w-2xl w-full mx-4 space-y-8 ${glitchActive ? 'animate-glitch' : ''}`}>
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center glow-primary animate-pulse-glow">
              <Shield className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
              <Zap className="w-3 h-3 text-background" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Processing <span className="gradient-text animate-shimmer">Authorization</span>
          </h2>
          <div className="space-y-1">
            <p className="text-foreground font-medium animate-fade-in">
              {state.userDetails?.fullName}
            </p>
            <p className="text-sm text-muted-foreground font-mono tracking-wider">
              {state.userDetails?.email}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-mono">PROGRESS</span>
            <span className="text-primary font-mono font-bold">{Math.min(100, Math.round(progress))}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden relative">
            <div
              className="h-full gradient-primary transition-all duration-100 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-fast" />
            </div>
            <div className="absolute inset-0 border border-primary/20 rounded-full" />
          </div>
        </div>

        {/* Stages */}
        <div className="glass rounded-xl p-6 space-y-4 border border-primary/20">
          {PROCESSING_STAGES.map((stage, index) => {
            const isCompleted = index < currentStage;
            const isCurrent = index === currentStage;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 transition-all duration-500 ${
                  isCurrent ? 'text-primary scale-105' : isCompleted ? 'text-green-500' : 'text-muted-foreground opacity-40'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted ? 'bg-green-500/20 scale-100' : isCurrent ? 'bg-primary/20 scale-110 glow-primary-sm' : 'bg-secondary'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 animate-scale-in" />
                  ) : isCurrent ? (
                    <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <span className={`font-mono text-sm flex-1 ${isCurrent ? 'animate-pulse' : ''}`}>
                  {stage}
                </span>
                {isCurrent && (
                  <span className="text-primary font-mono animate-blink">▌</span>
                )}
                {isCompleted && (
                  <span className="text-green-500 font-mono text-xs">OK</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Terminal Effect */}
        <div className="glass rounded-lg overflow-hidden border border-primary/20">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border-b border-border">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">SYSTEM_LOG</span>
            <div className="ml-auto flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="p-4 font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto">
            <p className="text-muted-foreground">[INFO] User: {state.userDetails?.fullName}</p>
            <p className="text-muted-foreground">[INFO] Platform: {state.selectedPlatform?.toUpperCase()}</p>
            <p className="text-muted-foreground">[INFO] Service: {state.selectedService?.toUpperCase().replace(/-/g, '_')}</p>
            <div className="border-t border-border my-2" />
            {terminalLines.map((line, index) => (
              <p
                key={index}
                className={`animate-fade-in ${
                  line.type === 'success' ? 'text-green-500' :
                  line.type === 'warning' ? 'text-yellow-500' :
                  line.type === 'system' ? 'text-primary' :
                  'text-muted-foreground'
                }`}
              >
                {line.text}
              </p>
            ))}
            {terminalLines.length > 0 && terminalLines.length < terminalMessages.length && (
              <span className="text-primary animate-blink">▌</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
