import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFlow } from '@/contexts/FlowContext';
import { PLATFORMS, SERVICES, CONTACT_INFO } from '@/lib/constants';
import { MessageCircle, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

export function PaymentBridge() {
  const { state, setCurrentStep } = useFlow();

  const selectedPlatform = PLATFORMS.find((p) => p.id === state.selectedPlatform);
  const selectedService = SERVICES.find((s) => s.id === state.selectedService);

  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to proceed with payment.

Email: ${state.userDetails?.email}
Platform: ${selectedPlatform?.name}
Service: ${selectedService?.name}
Amount: $${selectedService?.price}

Please provide payment instructions.`
  );

  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center glow-primary mb-6">
          <CheckCircle className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Request <span className="gradient-text">Approved</span>
        </h2>
        <p className="text-muted-foreground">
          Your authorization request has been processed. Proceed to payment to complete your order.
        </p>
      </div>

      {/* Order Summary */}
      <Card variant="glass" className="animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-5 h-5" />
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{state.userDetails?.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{state.userDetails?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform</p>
              <p className="font-medium">{selectedPlatform?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service</p>
              <p className="font-medium">{selectedService?.name}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-bold text-2xl gradient-text">${selectedService?.price}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Info */}
      <Card variant="elevated" className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="text-lg">Accepted Payment Methods</CardTitle>
          <CardDescription>
            Contact us via WhatsApp to receive payment instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-lg bg-secondary text-sm">Zelle</div>
            <div className="px-4 py-2 rounded-lg bg-secondary text-sm">Apple Pay</div>
            <div className="px-4 py-2 rounded-lg bg-secondary text-sm">Bank Transfer</div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp CTA */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        <Button variant="hero" size="xl" className="w-full gap-3">
          <MessageCircle className="w-6 h-6" />
          Proceed to Payment via WhatsApp
        </Button>
      </a>

      <p className="text-center text-sm text-muted-foreground">
        After payment verification, you will receive a secure access link to track your case status.
      </p>

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
