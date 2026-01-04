import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SERVICES, PLATFORMS } from '@/lib/constants';
import { useFlow } from '@/contexts/FlowContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function ServiceSelection() {
  const { state, selectService, setCurrentStep } = useFlow();

  const selectedPlatformName = PLATFORMS.find(
    (p) => p.id === state.selectedPlatform
  )?.name;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 mb-4">
          <span className="text-sm text-primary">{selectedPlatformName}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Select Your <span className="gradient-text">Service</span>
        </h2>
        <p className="text-muted-foreground">
          Choose the service you need for your {selectedPlatformName} account
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {SERVICES.map((service, index) => (
          <Card
            key={service.id}
            variant="service"
            onClick={() => selectService(service.id)}
            className={`animate-fade-in-up ${
              state.selectedService === service.id
                ? 'border-primary glow-primary-sm'
                : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">
                {service.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground">
                {service.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  selectService(service.id);
                }}
              >
                Proceed
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(1)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Platform Selection
        </Button>
      </div>
    </div>
  );
}
