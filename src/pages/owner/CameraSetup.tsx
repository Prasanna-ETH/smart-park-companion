import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Link, Key, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const CameraSetup = () => {
  const [rtspUrl, setRtspUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [parkId, setParkId] = useState<number | null>(null);

  useEffect(() => {
    fetchPark();
  }, []);

  const fetchPark = async () => {
    try {
      const { data } = await api.get('/owner/parks');
      if (data && data.length > 0) {
        setParkId(data[0].id);
        // If park already has a camera URL, show connected
        if (data[0].camera_rtsp_url) {
          // Wait, schemas might name it differently or masking it. 
          // In ParkResponse schema, it doesn't even show the RTSP url for security maybe?
          // Actually I added it in ParkCreate but not necessarily in ParkResponse for privacy.
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parkId) {
      toast.error("No parking lot found to connect camera to.");
      return;
    }

    setIsLoading(true);

    try {
      await api.patch(`/owner/parks/${parkId}`, {
        camera_rtsp_url: rtspUrl
      });


      setIsConnected(true);
      toast.success('Camera Connected! AI analysis started.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.detail || 'Failed to connect camera');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

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
              Your camera is actively detecting parking slots for your facility.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsConnected(false)}
            >
              Update Camera URL
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
              <Camera className="text-neon-cyan" size={24} />
              <div>
                <p className="font-medium">Direct IP Camera Link</p>
                <p className="text-sm text-muted-foreground">
                  Securely link your RTSP stream for YOLOv8 edge analysis
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
                    type="text"
                    placeholder="rtsp://admin:password@1.2.3.4:554/stream"
                    value={rtspUrl}
                    onChange={(e) => setRtspUrl(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground p-2 bg-yellow-500/10 border border-yellow-500/20 rounded mt-2 flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  Ensure your camera is accessible via public IP or you are running this on a local server.
                </p>
              </div>
            </div>

            {!parkId ? (
              <div className="p-4 bg-muted/30 rounded-lg text-center text-sm">
                Please create a parking lot first to setup camera.
              </div>
            ) : (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Connecting & Initializing AI...
                  </>
                ) : (
                  'Connect Camera'
                )}
              </Button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default CameraSetup;
