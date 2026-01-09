import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Building2, User, Mail, Lock, UserCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast({
        title: 'Please select a role',
        description: 'Choose whether you are a Parking Owner or Driver.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(email, password);
        toast({
          title: 'Welcome to SmartPark!',
          description: `You're now logged in as ${user.role === 'owner' ? 'a Parking Owner' : 'a Driver'}.`,
        });
        navigate(user.role === 'owner' ? '/owner' : '/user');
      } else {
        await register(email, password, name, selectedRole!);
        toast({
          title: 'Welcome to SmartPark!',
          description: `You're now logged in as ${selectedRole === 'owner' ? 'a Parking Owner' : 'a Driver'}.`,
        });
        // After register, we might want to auto-login or redirect to login. 
        // Current implementation of register in AuthContext doesn't auto-login (it just posts).
        // So we should probably switch mode to login or navigate.
        // For now, let's switch to login mode as the toast says "Registration successful! Please login."
        setMode('login');
      }
    } catch {
      toast({
        title: 'Authentication failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    demoLogin(role);
    toast({
      title: 'Demo Mode Active',
      description: `Exploring as ${role === 'owner' ? 'Parking Owner' : 'Driver'}.`,
    });
    navigate(role === 'owner' ? '/owner' : '/user');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - Branding */}
      <div className="hidden md:flex md:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <Logo size="lg" />
          <h1 className="mt-8 text-4xl font-bold text-center">
            Smart Parking for
            <br />
            <span className="text-neon-cyan">Modern Cities</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 text-center max-w-md">
            Real-time parking management powered by AI. Find, book, and manage parking spaces effortlessly.
          </p>

          {/* Animated parking illustration */}
          <div className="mt-12 grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-10 h-12 rounded border-2 flex items-center justify-center',
                  i % 3 === 0
                    ? 'border-slot-available bg-slot-available/20 slot-pulse-available'
                    : 'border-slot-occupied bg-slot-occupied/20'
                )}
              >
                <span className="text-xs font-mono">{String.fromCharCode(65 + Math.floor(i / 4))}{(i % 4) + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {mode === 'login'
                ? 'Sign in to manage your parking'
                : 'Join SmartPark today'}
            </p>
          </div>

          {/* Role selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">I am a...</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('owner')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  selectedRole === 'owner'
                    ? 'border-badge-owner bg-badge-owner/10 neon-glow-cyan'
                    : 'border-border hover:border-badge-owner/50'
                )}
              >
                <Building2
                  size={28}
                  className={selectedRole === 'owner' ? 'text-badge-owner' : 'text-muted-foreground'}
                />
                <span className={cn(
                  'text-sm font-medium',
                  selectedRole === 'owner' ? 'text-badge-owner' : 'text-muted-foreground'
                )}>
                  Parking Owner
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  selectedRole === 'user'
                    ? 'border-badge-user bg-badge-user/10'
                    : 'border-border hover:border-badge-user/50'
                )}
              >
                <User
                  size={28}
                  className={selectedRole === 'user' ? 'text-badge-user' : 'text-muted-foreground'}
                />
                <span className={cn(
                  'text-sm font-medium',
                  selectedRole === 'user' ? 'text-badge-user' : 'text-muted-foreground'
                )}>
                  Driver
                </span>
              </button>
            </div>
          </div>

          {/* Auth form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Demo login buttons */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or try demo</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('owner')}
              className="border-badge-owner/30 hover:bg-badge-owner/10"
            >
              <Zap size={16} className="mr-2 text-badge-owner" />
              Demo Owner
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('user')}
              className="border-badge-user/30 hover:bg-badge-user/10"
            >
              <Zap size={16} className="mr-2 text-badge-user" />
              Demo Driver
            </Button>
          </div>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="font-medium text-primary hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
