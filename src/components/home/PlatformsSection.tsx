import { Card } from '@/components/ui/card';
import { PLATFORMS } from '@/lib/constants';
import { useFlow } from '@/contexts/FlowContext';
import { useNavigate } from 'react-router-dom';

export function PlatformsSection() {
  const { selectPlatform } = useFlow();
  const navigate = useNavigate();

  const handlePlatformSelect = (platformId: string) => {
    selectPlatform(platformId);
    navigate('/services');
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Supported <span className="gradient-text">Platforms</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide support for all major gig economy platforms. Select your platform to get started.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {PLATFORMS.map((platform, index) => (
            <Card
              key={platform.id}
              variant="platform"
              onClick={() => handlePlatformSelect(platform.id)}
              className="p-6 text-center animate-fade-in-up"
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
    </section>
  );
}
