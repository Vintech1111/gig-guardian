import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlow } from '@/contexts/FlowContext';
import { PLATFORMS, SERVICES } from '@/lib/constants';
import { ArrowLeft, Shield, Loader2, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserDetailsFormProps {
  onSubmit: () => void;
}

export function UserDetailsForm({ onSubmit }: UserDetailsFormProps) {
  const navigate = useNavigate();
  const { state, setUserDetails, setCurrentStep } = useFlow();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    accountDetails: '',
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caseCreated, setCaseCreated] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create case via edge function
      const { data, error } = await supabase.functions.invoke('create-case', {
        body: {
          email: formData.email,
          name: formData.fullName,
          phone: formData.accountDetails,
          platform: selectedPlatform?.name || '',
          service: selectedService?.name || '',
          tier: `$${selectedService?.price || 0}`,
        }
      });

      if (error) throw error;

      setUserDetails(formData);
      setDashboardUrl(data.dashboardUrl);
      setCaseCreated(true);
      toast.success('Case created successfully!');
    } catch (error: any) {
      console.error('Error creating case:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dashboardUrl);
    toast.success('Link copied to clipboard!');
  };

  if (caseCreated) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Case Created <span className="gradient-text">Successfully!</span>
          </h2>
          <p className="text-muted-foreground">
            Your service request has been submitted. Use the link below to access your dashboard and upload payment proof.
          </p>
        </div>

        <Card variant="glass" className="animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Your Case Dashboard Link
            </CardTitle>
            <CardDescription>
              Save this link to track your case status and upload payment proof
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50 border border-primary/30">
              <p className="text-sm text-muted-foreground mb-2">Dashboard URL:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm text-primary break-all">{dashboardUrl}</code>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="hero" 
                className="w-full" 
                onClick={() => navigate(dashboardUrl.replace(window.location.origin, ''))}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Go to Dashboard Now
              </Button>
              
              <Button variant="outline" className="w-full" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link for Later
              </Button>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              💡 Tip: Bookmark this link or save it somewhere safe to access your case anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
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
