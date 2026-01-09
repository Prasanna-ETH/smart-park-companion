import { useState, useEffect } from 'react';
import LogsTable from '@/components/LogsTable';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const generateMockLogs = () => {
  const events = ['entry', 'exit', 'reserved', 'cancelled'] as const;
  const slots = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1'];
  const vehicles = ['MH12AB1234', 'DL4CAB5678', 'KA01MN9012', 'TN07XY3456', ''];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `log-${i}`,
    timestamp: new Date(Date.now() - i * 1000 * 60 * Math.random() * 60).toISOString(),
    slot: slots[Math.floor(Math.random() * slots.length)],
    event: events[Math.floor(Math.random() * events.length)],
    vehicleNumber: vehicles[Math.floor(Math.random() * vehicles.length)] || undefined,
  }));
};

const Logs = () => {
  const [logs, setLogs] = useState(generateMockLogs());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshLogs = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(generateMockLogs());
    setIsRefreshing(false);
  };

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          slot: ['A1', 'B2', 'C3', 'D4'][Math.floor(Math.random() * 4)],
          event: ['entry', 'exit'][Math.floor(Math.random() * 2)] as 'entry' | 'exit',
          vehicleNumber: `MH${Math.floor(Math.random() * 99)}AB${Math.floor(Math.random() * 9999)}`,
        },
        ...prev.slice(0, 14),
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">Real-time parking events and activity</p>
        </div>
        <Button
          variant="outline"
          onClick={refreshLogs}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <LogsTable logs={logs} />

      <p className="text-xs text-muted-foreground text-center">
        Showing last 15 events • Auto-refreshes every 10 seconds
      </p>
    </div>
  );
};

export default Logs;
