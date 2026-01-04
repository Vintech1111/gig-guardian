import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CONTACT_INFO } from '@/lib/constants';
import { Mail, MessageCircle, Send, Camera, Instagram, MapPin, Clock, Headphones } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message Sent!',
      description: 'We will get back to you within 24 hours.',
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Chat with us',
      href: `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`,
    },
    {
      icon: Send,
      label: 'Telegram',
      value: CONTACT_INFO.telegram,
      href: `https://t.me/${CONTACT_INFO.telegram.replace('@', '')}`,
    },
    {
      icon: Camera,
      label: 'Snapchat',
      value: CONTACT_INFO.snapchat,
      href: `https://snapchat.com/add/${CONTACT_INFO.snapchat}`,
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: CONTACT_INFO.instagram,
      href: `https://instagram.com/${CONTACT_INFO.instagram.replace('@', '')}`,
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen py-20">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold">
                Get in <span className="gradient-text">Touch</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions? We're here to help 24/7. Reach out through any of our channels.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <Card variant="glass" className="p-6 text-center">
                <CardContent className="p-0 space-y-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Response Time</h3>
                  <p className="text-sm text-muted-foreground">
                    We respond within 1-2 hours
                  </p>
                </CardContent>
              </Card>

              <Card variant="glass" className="p-6 text-center">
                <CardContent className="p-0 space-y-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto">
                    <Headphones className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Available around the clock
                  </p>
                </CardContent>
              </Card>

              <Card variant="glass" className="p-6 text-center">
                <CardContent className="p-0 space-y-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Serving clients worldwide
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <Card variant="elevated" className="animate-fade-in-up">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your request..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Methods */}
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-xl font-semibold">Other Ways to Reach Us</h3>

                <div className="space-y-4">
                  {contactMethods.map((method) => (
                    <a
                      key={method.label}
                      href={method.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Card variant="interactive" className="p-4">
                        <CardContent className="p-0 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                            <method.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{method.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.value}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>

                {/* Quick WhatsApp CTA */}
                <Card variant="glow" className="p-6">
                  <CardContent className="p-0 text-center space-y-4">
                    <h4 className="font-semibold">Need Immediate Assistance?</h4>
                    <p className="text-sm text-muted-foreground">
                      For the fastest response, reach out via WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="hero" className="gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Chat on WhatsApp
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
