import { useState, useEffect } from 'react';
import { PROCESSING_STAGES } from '@/lib/constants';
import { useFlow } from '@/contexts/FlowContext';
import { Shield, Check } from 'lucide-react';

interface ProcessingAnimationProps {
  onComplete: () => void;
}

export function ProcessingAnimation({ onComplete }: ProcessingAnimationProps) {
  const { state } = useFlow();
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < PROCESSING_STAGES.length - 1) {
          return prev + 1;
        }
        clearInterval(stageInterval);
        return prev;
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        clearInterval(progressInterval);
        return prev;
      });
    }, 120);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 12000);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center glow-primary animate-pulse-glow">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Processing <span className="gradient-text">Authorization</span>
          </h2>
          <div className="space-y-1">
            <p className="text-muted-foreground">
              {state.userDetails?.fullName}
            </p>
            <p className="text-sm text-muted-foreground font-mono">
              {state.userDetails?.email}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary font-mono">{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-100 glow-primary-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stages */}
        <div className="glass rounded-xl p-6 space-y-4">
          {PROCESSING_STAGES.map((stage, index) => {
            const isCompleted = index < currentStage;
            const isCurrent = index === currentStage;

            return (
              <div
                key={index}
                className={`flex items-center gap-4 transition-all duration-300 ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-muted-foreground opacity-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500/20' : isCurrent ? 'bg-primary/20' : 'bg-secondary'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <span className={`font-mono text-sm ${isCurrent ? 'animate-pulse' : ''}`}>
                  {stage}
                </span>
                {isCurrent && (
                  <span className="ml-auto text-xs animate-pulse">▌</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Terminal Effect */}
        <div className="glass rounded-lg p-4 font-mono text-xs text-muted-foreground overflow-hidden">
          <div className="space-y-1">
            <p className="text-green-500">[SYSTEM] Secure connection established</p>
            <p>[INFO] User: {state.userDetails?.fullName}</p>
            <p>[INFO] Target: {state.selectedPlatform?.toUpperCase()}</p>
            <p className={currentStage >= 2 ? 'text-primary' : 'opacity-50'}>
              [PROCESSING] {PROCESSING_STAGES[currentStage]}
            </p>
            {currentStage >= PROCESSING_STAGES.length - 1 && (
              <p className="text-green-500 animate-pulse">[SUCCESS] Authorization request prepared</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
