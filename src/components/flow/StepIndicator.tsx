import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Platform',
  'Service',
  'Details',
  'Pricing',
  'Payment',
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center">
        {stepLabels.slice(0, totalSteps).map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground glow-primary-sm'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground glow-primary animate-pulse-glow'
                      : 'bg-secondary text-muted-foreground border border-border'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 mx-2 transition-all duration-300 ${
                    isCompleted ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
