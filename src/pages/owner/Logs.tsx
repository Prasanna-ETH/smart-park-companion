import { useState, useEffect } from 'react';
import LogsTable from '@/components/LogsTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  timestamp: string;
  slot: string;
  event: 'entry' | 'exit' | 'reserved' | 'cancelled';
  vehicleNumber?: string;
}

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [parkId, setParkId] = useState<number | null>(null);

  useEffect(() => {
    fetchParks();
  }, []);

  const fetchParks = async () => {
    try {
      const { data } = await api.get('/owner/parks');
      if (data && data.length > 0) {
        setParkId(data[0].id);
        fetchLogs(data[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchLogs = async (id: number) => {
    try {
      const { data } = await api.get(`/owner/logs/${id}`);
      // Transform backend logs to frontend expectations
      const transformed: LogEntry[] = data.map((l: any) => ({
        id: l.id.toString(),
        timestamp: l.timestamp,
        slot: l.slot_number,
        event: l.event_type as any, // 'entry', 'exit', etc
        vehicleNumber: l.description.match(/[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}/)?.[0] // Extract if present
      }));
      setLogs(transformed);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshLogs = async () => {
    if (!parkId) return;
    setIsRefreshing(true);
    fetchLogs(parkId);
  };

  // Poll for logs every 15s if viewing
  useEffect(() => {
    if (!parkId) return;
    const interval = setInterval(() => {
      fetchLogs(parkId);
    }, 15000);
    return () => clearInterval(interval);
  }, [parkId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">Real-time parking events and activity</p>
        </div>
        {parkId && (
          <Button
            variant="outline"
            onClick={refreshLogs}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {logs.length > 0 ? (
        <LogsTable logs={logs} />
      ) : (
        <div className="text-center py-20 rounded-xl bg-muted/20 border border-dashed border-border">
          <p className="text-muted-foreground">No activity logs recorded yet.</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Showing last 50 events • Auto-refreshes every 15 seconds
      </p>
    </div>
  );
};

export default Logs;
