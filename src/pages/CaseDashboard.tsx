import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  User, 
  MapPin,
  MessageCircle,
  Mail,
  FileCheck,
  Loader2,
  PartyPopper,
  AlertCircle,
  Upload,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CaseData {
  id: string;
  token: string;
  email: string;
  name: string;
  phone: string | null;
  platform: string;
  service: string;
  tier: string;
  status: string;
  payment_proof_url: string | null;
  authorization_code: string | null;
  code_verified: boolean | null;
  created_at: string;
}

interface CaseStatus {
  id: string;
  step: number;
  label: string;
  completed: boolean;
  current: boolean;
}

const statusSteps: Omit<CaseStatus, 'id' | 'completed' | 'current'>[] = [
  { step: 1, label: 'Payment Uploaded' },
  { step: 2, label: 'Payment Verified' },
  { step: 3, label: 'Service In Progress' },
  { step: 4, label: 'Account Review' },
  { step: 5, label: 'Finalization' },
  { step: 6, label: 'Completed' },
];

const getStepFromStatus = (status: string): number => {
  switch (status) {
    case 'pending_payment': return -1;
    case 'payment_uploaded': return 0;
    case 'payment_verified': return 1;
    case 'service_in_progress': return 2;
    case 'account_review': return 3;
    case 'finalization': return 4;
    case 'completed': return 5;
    default: return -1;
  }
};

export default function CaseDashboard() {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (error || !data) {
        console.error('Error fetching case:', error);
        setIsValidToken(false);
      } else {
        setCaseData(data);
        setIsValidToken(true);
      }
      setIsLoading(false);
    };

    fetchCase();
  }, [token]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !caseData) return;

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${caseData.id}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      // Update case with payment proof URL
      const { error: updateError } = await supabase
        .from('cases')
        .update({ payment_proof_url: publicUrl })
        .eq('token', token);

      if (updateError) throw updateError;

      // Call edge function to send auth code and get WhatsApp link
      const { data: authData, error: authError } = await supabase.functions.invoke('send-auth-code', {
        body: { token }
      });

      if (authError) throw authError;

      setCaseData({ ...caseData, payment_proof_url: publicUrl, status: 'payment_uploaded' });
      setWhatsappUrl(authData.whatsappUrl);
      
      toast.success('Payment proof uploaded! Check your email for the authorization code.');

      // Open WhatsApp to notify admin
      if (authData.whatsappUrl) {
        window.open(authData.whatsappUrl, '_blank');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload payment proof. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!authCode.trim() || !token) return;

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-auth-code', {
        body: { token, code: authCode.trim() }
      });

      if (error) throw error;

      if (data.success) {
        setCaseData(prev => prev ? { ...prev, code_verified: true, status: 'service_in_progress' } : null);
        toast.success('Code verified! Your service is now in progress.');
      } else {
        toast.error(data.message || 'Invalid authorization code');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error('Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusSteps = (): CaseStatus[] => {
    const currentStep = caseData ? getStepFromStatus(caseData.status) : -1;
    return statusSteps.map((step, index) => ({
      ...step,
      id: `step-${index}`,
      completed: index <= currentStep,
      current: index === currentStep + 1,
    }));
  };

  const isPendingPayment = caseData?.status === 'pending_payment';
  const isPaymentUploaded = caseData?.status === 'payment_uploaded';
  const isServiceInProgress = ['service_in_progress', 'account_review', 'finalization', 'completed'].includes(caseData?.status || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
            <p className="text-muted-foreground">Loading your case...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isValidToken || !caseData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-20">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold">Invalid or Expired Link</h2>
              <p className="text-muted-foreground">
                This case link is invalid or has expired. Please contact support if you believe this is an error.
              </p>
              <div className="pt-4 space-y-2">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="glow" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </a>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Return Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-20 md:py-28">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Secure Case Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Case <span className="gradient-text">{caseData.id.slice(0, 8).toUpperCase()}</span>
            </h1>
            <p className="text-muted-foreground">
              Track your request status in real-time
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Upload Section */}
              {isPendingPayment && (
                <Card className="border-primary/50 animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      Upload Payment Proof
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Please upload your payment proof to continue with your service request.
                    </p>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg p-8 hover:border-primary/50 transition-colors">
                      <Upload className="w-12 h-12 text-primary/50 mb-4" />
                      <Label htmlFor="payment-proof" className="cursor-pointer">
                        <span className="text-primary hover:underline">Click to upload</span>
                        <span className="text-muted-foreground"> or drag and drop</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2">PNG, JPG, PDF up to 10MB</p>
                      <Input
                        id="payment-proof"
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </div>
                    {isUploading && (
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Authorization Code Section */}
              {isPaymentUploaded && !caseData.code_verified && (
                <Card className="border-primary/50 animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-primary" />
                      Enter Authorization Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      We've sent an authorization code to your email. Enter it below to confirm your payment.
                    </p>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Enter 6-digit code"
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value.toUpperCase())}
                        className="text-center text-xl tracking-widest font-mono uppercase"
                        maxLength={6}
                      />
                      <Button 
                        onClick={handleVerifyCode} 
                        disabled={isVerifying || authCode.length < 6}
                        variant="glow"
                      >
                        {isVerifying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </div>
                    {whatsappUrl && (
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full mt-2">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Notify Admin on WhatsApp
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Service In Progress Banner */}
              {isServiceInProgress && (
                <Card className="bg-green-500/10 border-green-500/30 animate-fade-in-up">
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        {caseData.status === 'completed' ? (
                          <PartyPopper className="w-8 h-8 text-green-500" />
                        ) : (
                          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-500">
                          {caseData.status === 'completed' ? 'Service Completed!' : 'Service In Progress'}
                        </h3>
                        <p className="text-muted-foreground">
                          {caseData.status === 'completed' 
                            ? 'Your account has been successfully processed.'
                            : 'Our team is actively working on your request.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progress Card */}
              <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Status Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {getStatusSteps().map((status, index) => (
                      <div key={status.id} className="relative">
                        <div className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                          status.completed 
                            ? 'bg-green-500/10' 
                            : status.current 
                              ? 'bg-primary/10 border border-primary/30' 
                              : 'bg-secondary/30'
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            status.completed 
                              ? 'bg-green-500 text-background' 
                              : status.current 
                                ? 'bg-primary text-primary-foreground animate-pulse glow-primary-sm' 
                                : 'bg-secondary text-muted-foreground'
                          }`}>
                            {status.completed ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="font-bold">{status.step}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${
                              status.completed 
                                ? 'text-green-500' 
                                : status.current 
                                  ? 'text-primary' 
                                  : 'text-muted-foreground'
                            }`}>
                              {status.label}
                            </p>
                            {status.current && (
                              <p className="text-sm text-muted-foreground animate-pulse">
                                Currently processing...
                              </p>
                            )}
                          </div>
                          {status.completed && (
                            <span className="text-xs text-green-500 font-mono">✓ DONE</span>
                          )}
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`absolute left-7 top-14 w-0.5 h-6 transition-all ${
                            status.completed ? 'bg-green-500' : 'bg-secondary'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Case Details */}
              <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-primary" />
                    Case Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Platform</p>
                      <p className="font-medium">{caseData.platform}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Service</p>
                      <p className="font-medium">{caseData.service}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Package</p>
                      <p className="font-medium">{caseData.tier}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">
                        {new Date(caseData.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* User Info */}
              <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Account Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{caseData.name}</p>
                      <p className="text-sm text-muted-foreground">{caseData.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card className="animate-fade-in-up border-primary/30" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    24/7 Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Need help? Our support team is available around the clock.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Los Angeles, California</span>
                  </div>
                  <div className="space-y-2">
                    <a
                      href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="glow" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp Support
                      </Button>
                    </a>
                    <a href={`mailto:${CONTACT_INFO.email}`}>
                      <Button variant="outline" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Status Badge */}
              <Card className="glass border-green-500/30 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-500">
                      Support Team Online
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
