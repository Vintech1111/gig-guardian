import { Card } from '@/components/ui/card';
import { PLATFORMS } from '@/lib/constants';
import { useFlow } from '@/contexts/FlowContext';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function PlatformsSection() {
  const { selectPlatform } = useFlow();
  const navigate = useNavigate();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.05 });

  const handlePlatformSelect = (platformId: string) => {
    selectPlatform(platformId);
    navigate('/services');
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div 
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Supported <span className="gradient-text">Platforms</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide support for all major gig economy platforms. Select your platform to get started.
          </p>
        </div>

        <div 
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {PLATFORMS.map((platform, index) => (
            <Card
              key={platform.id}
              variant="platform"
              onClick={() => handlePlatformSelect(platform.id)}
              className={`p-6 text-center transition-all duration-500 ${
                gridVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ transitionDelay: gridVisible ? `${index * 50}ms` : '0ms' }}
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
