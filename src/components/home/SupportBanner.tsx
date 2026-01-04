import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Headphones } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export function SupportBanner() {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 gradient-primary opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass rounded-2xl p-8 md:p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center glow-primary">
              <Headphones className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold">
            Need Help? We're Here <span className="gradient-text">24/7</span>
          </h2>
          
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our support team is available around the clock to assist you with any questions or concerns.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="glow" size="lg" className="gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </Button>
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`}>
              <Button variant="glass" size="lg" className="gap-2">
                <Mail className="w-5 h-5" />
                Email Support
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
