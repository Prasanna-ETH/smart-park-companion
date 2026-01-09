import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Car, MapPin, Shield, Zap, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'owner' ? '/owner' : '/user');
    }
  }, [isAuthenticated, user, navigate]);

  const features = [
    {
      icon: Car,
      title: 'Real-Time Detection',
      description: 'AI-powered cameras detect available slots instantly',
    },
    {
      icon: MapPin,
      title: 'Find Nearby Parks',
      description: 'Locate and book parking spots near your destination',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'UPI, cards, and wallet support with instant confirmation',
    },
    {
      icon: Zap,
      title: 'Quick Booking',
      description: 'Reserve your spot in seconds with QR code entry',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-6">
          <Logo size="md" />
          <Button
            onClick={() => navigate('/auth')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Sign In
          </Button>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 px-6 py-20 md:py-32 max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Smart Parking for
            <br />
            <span className="text-neon-cyan">Modern India</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            AI-powered parking management that saves time, reduces traffic, and makes urban mobility seamless.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-neon-cyan text-slate-900 hover:bg-neon-cyan/90 font-semibold"
            >
              Get Started Free
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Try Demo
            </Button>
          </div>

          {/* Animated Parking Grid Preview */}
          <div className="mt-16 flex justify-center">
            <div className="grid grid-cols-5 gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-12 rounded border-2 flex items-center justify-center transition-all duration-500 ${
                    i % 3 === 0
                      ? 'border-slot-available bg-slot-available/20 slot-pulse-available'
                      : 'border-slot-occupied bg-slot-occupied/20'
                  }`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <span className="text-xs font-mono text-white/70">
                    {String.fromCharCode(65 + Math.floor(i / 5))}{(i % 5) + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Choose SmartPark?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Built for Indian cities with features that matter
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 text-center hover:border-neon-cyan/50 transition-all hover:shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-neon-cyan/10 mb-4">
                  <feature.icon className="text-neon-cyan" size={24} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-muted/30 blueprint-grid">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Simplify Parking?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of drivers and parking owners already using SmartPark
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-primary hover:bg-primary/90"
          >
            Start Now - It's Free
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            © 2024 SmartPark. Made with ❤️ for India
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
