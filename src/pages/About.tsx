import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, Clock, Award, Target, Zap } from 'lucide-react';

const stats = [
  { label: 'Drivers Helped', value: '10,000+' },
  { label: 'Success Rate', value: '98%' },
  { label: 'Platforms Supported', value: '10+' },
  { label: 'Years Experience', value: '5+' },
];

const values = [
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Your information is encrypted and handled with the utmost confidentiality.',
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    description: 'Most requests are processed within 24-48 hours for quick resolution.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Our team is available 24/7 to assist you throughout the process.',
  },
  {
    icon: Award,
    title: 'Proven Results',
    description: 'Thousands of satisfied clients with a 98% success rate.',
  },
  {
    icon: Target,
    title: 'Precision',
    description: 'Expert knowledge of platform systems and authorization processes.',
  },
  {
    icon: Zap,
    title: 'Efficiency',
    description: 'Streamlined processes to get you back on the road faster.',
  },
];

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen py-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-10" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold">
                About <span className="gradient-text">GigDrivers Support</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                We are a team of professionals dedicated to helping gig economy drivers
                overcome account challenges and maximize their earning potential.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={stat.label}
                  variant="glass"
                  className="text-center p-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card variant="elevated" className="p-8 md:p-12">
                <CardContent className="p-0 space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-center">
                    Our <span className="gradient-text">Mission</span>
                  </h2>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    At GigDrivers Support, we understand the challenges gig workers face when
                    dealing with account issues. Whether you've been deactivated, stuck on a
                    waitlist, or need to change zones, our mission is to provide fast,
                    reliable, and professional solutions that get you back to work.
                  </p>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    With years of experience navigating platform systems and a deep
                    understanding of how these companies operate, we've helped thousands of
                    drivers overcome obstacles and continue their gig careers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Choose <span className="gradient-text">Us</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our commitment to excellence and customer satisfaction sets us apart
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card
                  key={value.title}
                  variant="service"
                  className="p-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
