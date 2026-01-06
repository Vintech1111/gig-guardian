import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { PlatformsSection } from '@/components/home/PlatformsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { SupportBanner } from '@/components/home/SupportBanner';

const Index = () => {
  return (
    <Layout enableSnapScroll>
      <div className="snap-section">
        <HeroSection />
      </div>
      <div className="snap-section">
        <ServicesPreview />
      </div>
      <div className="snap-section">
        <PlatformsSection />
      </div>
      <div className="snap-section">
        <TestimonialsSection />
      </div>
      <div className="snap-section">
        <SupportBanner />
      </div>
    </Layout>
  );
};

export default Index;
