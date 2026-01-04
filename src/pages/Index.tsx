import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { PlatformsSection } from '@/components/home/PlatformsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { SupportBanner } from '@/components/home/SupportBanner';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesPreview />
      <PlatformsSection />
      <TestimonialsSection />
      <SupportBanner />
    </Layout>
  );
};

export default Index;
