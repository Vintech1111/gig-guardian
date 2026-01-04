import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  Clock, 
  User, 
  Briefcase, 
  MapPin,
  MessageCircle,
  Mail,
  Phone,
  FileCheck,
  Loader2,
  PartyPopper,
  AlertCircle
} from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

interface CaseStatus {
  id: string;
  step: number;
  label: string;
  completed: boolean;
  current: boolean;
}

const statusSteps: Omit<CaseStatus, 'id' | 'completed' | 'current'>[] = [
  { step: 1, label: 'Payment Verified' },
  { step: 2, label: 'Case Assigned' },
  { step: 3, label: 'Account Review' },
  { step: 4, label: 'Authorization in Progress' },
  { step: 5, label: 'Finalization' },
  { step: 6, label: 'Completed' },
];

export default function CaseDashboard() {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [caseData, setCaseData] = useState<{
    caseId: string;
    platform: string;
    service: string;
    tier: string;
    userName: string;
    email: string;
    currentStep: number;
    isCompleted: boolean;
    createdAt: string;
  } | null>(null);
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    // Simulate loading case data - in production this would fetch from Supabase
    const timer = setTimeout(() => {
      if (token && token.length > 10) {
        setCaseData({
          caseId: `GDS-${Date.now().toString(36).toUpperCase()}`,
          platform: 'Amazon Flex',
          service: 'Account Reactivation',
          tier: 'Standard - $500',
          userName: 'John Doe',
          email: 'john.doe@email.com',
          currentStep: 3,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        });
        setIsValidToken(true);
      } else {
        setIsValidToken(false);
      }
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [token]);

  const getStatusSteps = (): CaseStatus[] => {
    return statusSteps.map((step, index) => ({
      ...step,
      id: `step-${index}`,
      completed: caseData ? index < caseData.currentStep : false,
      current: caseData ? index === caseData.currentStep : false,
    }));
  };

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
              Case <span className="gradient-text">{caseData.caseId}</span>
            </h1>
            <p className="text-muted-foreground">
              Track your request status in real-time
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Main Status Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Completion Banner */}
              {caseData.isCompleted && (
                <Card className="bg-green-500/10 border-green-500/30 animate-fade-in-up">
                  <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <PartyPopper className="w-8 h-8 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-500">Service Completed!</h3>
                        <p className="text-muted-foreground">
                          Your account has been successfully processed.
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
                        {new Date(caseData.createdAt).toLocaleDateString()}
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
                      <p className="font-medium">{caseData.userName}</p>
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
