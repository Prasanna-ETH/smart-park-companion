import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, Link, Key, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

const CameraSetup = () => {
  const [rtspUrl, setRtspUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsConnected(true);
    setIsLoading(false);
    toast({
      title: 'Camera Connected!',
      description: 'Your camera feed is now linked to SmartPark.',
    });
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Setup Camera</h1>
        <p className="text-muted-foreground">Connect your parking camera for AI-powered slot detection</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {isConnected ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slot-available/10 mb-4">
              <CheckCircle2 className="w-8 h-8 text-slot-available" />
            </div>
            <h3 className="text-xl font-semibold">Camera Connected</h3>
            <p className="text-muted-foreground mt-2">
              Your camera is actively detecting parking slots.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsConnected(false)}
            >
              Configure Another Camera
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Camera className="text-neon-cyan" size={24} />
              <div>
                <p className="font-medium">Camera Integration</p>
                <p className="text-sm text-muted-foreground">
                  Enter your IP camera credentials to enable real-time detection
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rtsp">RTSP Stream URL</Label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="rtsp"
                    type="url"
                    placeholder="rtsp://192.168.1.100:554/stream"
                    value={rtspUrl}
                    onChange={(e) => setRtspUrl(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  The RTSP URL from your IP camera
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key (Optional)</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Required for cloud-based camera services
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Connecting...
                </>
              ) : (
                'Connect Camera'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CameraSetup;
