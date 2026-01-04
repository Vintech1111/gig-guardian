import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Animated Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-glow-secondary/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40 animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 animate-fade-in-up hover:glow-primary-sm transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">24/7 Professional Support Available</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Professional Account Support for{' '}
            <span className="gradient-text glow-text animate-shimmer">Gig Drivers</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            We help gig workers resolve account issues, reactivate deactivated profiles, access waitlists, and optimize platform access across major delivery companies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/services">
              <Button variant="hero" size="xl" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  View Our Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="glass" size="xl" className="group">
                <span className="group-hover:text-primary transition-colors">Contact Support</span>
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 text-muted-foreground group hover:text-primary transition-colors cursor-default">
              <Shield className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm">Secure & Confidential</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground group hover:text-primary transition-colors cursor-default">
              <Clock className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm">Fast Processing</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground group hover:text-primary transition-colors cursor-default">
              <CheckCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm">Guaranteed Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
}
