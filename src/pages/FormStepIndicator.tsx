import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface FormStepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function FormStepIndicator({ steps, currentStep }: FormStepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li key={step.id} className="flex-1 relative">
            <div className="flex items-center">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute left-0 top-4 -translate-y-1/2 w-full h-0.5 -z-10",
                    index <= currentStep ? "bg-primary" : "bg-border"
                  )}
                  style={{ left: '-50%', width: '100%' }}
                />
              )}
              
              {/* Step circle */}
              <div className="relative flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                
                {/* Step label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      index <= currentStep ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
