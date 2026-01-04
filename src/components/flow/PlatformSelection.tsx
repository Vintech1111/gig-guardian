import { Card } from '@/components/ui/card';
import { PLATFORMS } from '@/lib/constants';
import { useFlow } from '@/contexts/FlowContext';

export function PlatformSelection() {
  const { selectPlatform, state } = useFlow();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Select Your <span className="gradient-text">Platform</span>
        </h2>
        <p className="text-muted-foreground">
          Choose the gig platform you need assistance with
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
        {PLATFORMS.map((platform, index) => (
          <Card
            key={platform.id}
            variant="platform"
            onClick={() => selectPlatform(platform.id)}
            className={`p-6 text-center animate-fade-in-up ${
              state.selectedPlatform === platform.id
                ? 'border-primary glow-primary-sm'
                : ''
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {platform.icon}
            </div>
            <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
              {platform.name}
            </h3>
          </Card>
        ))}
      </div>
    </div>
  );
}
