import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PRICING_TIERS, PLATFORMS, SERVICES } from '@/lib/constants';
import { useFlow } from '@/contexts/FlowContext';
import { Check, ArrowLeft, Star } from 'lucide-react';

export function PricingSelection() {
  const { state, selectTier, setCurrentStep } = useFlow();

  const selectedPlatform = PLATFORMS.find((p) => p.id === state.selectedPlatform);
  const selectedService = SERVICES.find((s) => s.id === state.selectedService);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full glass border-primary/30 text-sm text-primary">
            {selectedPlatform?.name}
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="px-3 py-1 rounded-full glass border-primary/30 text-sm text-primary">
            {selectedService?.name}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Choose Your <span className="gradient-text">Plan</span>
        </h2>
        <p className="text-muted-foreground">
          Select the tier that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PRICING_TIERS.map((tier, index) => (
          <Card
            key={tier.id}
            variant={tier.popular ? 'pricingBest' : 'pricing'}
            className={`relative animate-fade-in-up ${
              state.selectedTier === tier.id ? 'ring-2 ring-primary' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1 px-4 py-1 rounded-full gradient-primary text-primary-foreground text-sm font-semibold glow-primary-sm">
                  <Star className="w-4 h-4 fill-current" />
                  Best Value
                </div>
              </div>
            )}

            <CardHeader className="text-center pt-8">
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold gradient-text">${tier.price}</span>
              </div>
              <CardDescription className="mt-2">{tier.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                variant={tier.popular ? 'hero' : 'outline'}
                size="lg"
                className="w-full"
                onClick={() => selectTier(tier.id)}
              >
                Select {tier.name}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(3)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
