import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  slot: string;
  event: 'entry' | 'exit' | 'reserved' | 'cancelled';
  vehicleNumber?: string;
}

interface LogsTableProps {
  logs: LogEntry[];
}

const eventStyles = {
  entry: 'bg-slot-available/10 text-slot-available',
  exit: 'bg-slot-occupied/10 text-slot-occupied',
  reserved: 'bg-slot-reserved/10 text-slot-reserved',
  cancelled: 'bg-muted text-muted-foreground',
};

const eventLabels = {
  entry: 'Vehicle Entry',
  exit: 'Vehicle Exit',
  reserved: 'Slot Reserved',
  cancelled: 'Booking Cancelled',
};

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Timestamp</TableHead>
            <TableHead className="font-semibold">Slot</TableHead>
            <TableHead className="font-semibold">Event</TableHead>
            <TableHead className="font-semibold">Vehicle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="animate-slide-in">
              <TableCell className="font-mono text-sm">
                {new Date(log.timestamp).toLocaleString('en-IN')}
              </TableCell>
              <TableCell>
                <span className="font-mono font-semibold text-neon-cyan">
                  {log.slot}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    eventStyles[log.event]
                  )}
                >
                  {eventLabels[log.event]}
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {log.vehicleNumber || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LogsTable;
