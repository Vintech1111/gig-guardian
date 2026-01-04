import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlow } from '@/contexts/FlowContext';
import { PLATFORMS, SERVICES } from '@/lib/constants';
import { ArrowLeft, Shield } from 'lucide-react';

interface UserDetailsFormProps {
  onSubmit: () => void;
}

export function UserDetailsForm({ onSubmit }: UserDetailsFormProps) {
  const { state, setUserDetails, setCurrentStep } = useFlow();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    accountDetails: '',
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedPlatform = PLATFORMS.find((p) => p.id === state.selectedPlatform);
  const selectedService = SERVICES.find((s) => s.id === state.selectedService);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.accountDetails.trim()) {
      newErrors.accountDetails = 'Account details are required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setUserDetails(formData);
      onSubmit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
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
          Enter Your <span className="gradient-text">Details</span>
        </h2>
        <p className="text-muted-foreground">
          Provide your account information to proceed with the authorization
        </p>
      </div>

      <Card variant="glass" className="animate-fade-in-up">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-5 h-5" />
            <CardTitle className="text-lg">Secure Information</CardTitle>
          </div>
          <CardDescription>
            Your information is encrypted and securely transmitted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name (as registered on account)</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountDetails">Platform Account Details</Label>
              <Textarea
                id="accountDetails"
                placeholder="Username, phone number, or any relevant account information"
                value={formData.accountDetails}
                onChange={(e) =>
                  setFormData({ ...formData, accountDetails: e.target.value })
                }
                className={errors.accountDetails ? 'border-destructive' : ''}
                rows={3}
              />
              {errors.accountDetails && (
                <p className="text-sm text-destructive">{errors.accountDetails}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State/Province"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className={errors.location ? 'border-destructive' : ''}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location}</p>
              )}
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              Approve Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(2)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Service Selection
        </Button>
      </div>
    </div>
  );
}
