import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, QrCode, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Booking {
  id: number;
  park_name: string;
  address: string;
  slot_number: string;
  start_time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'active';
  amount: number;
}

const statusStyles = {
  upcoming: 'bg-slot-available/10 text-slot-available border-slot-available/30',
  active: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
  completed: 'bg-muted text-muted-foreground border-border',
  cancelled: 'bg-slot-occupied/10 text-slot-occupied border-slot-occupied/30',
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/user/bookings');
      // Normalize statuses for UI if needed
      setBookings(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming' || b.status === 'active');
  const pastBookings = bookings.filter(b => b.status !== 'upcoming' && b.status !== 'active');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary mb-2" size={32} />
        <p className="text-muted-foreground">Fetching your reservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your parking reservations</p>
      </div>

      {/* Upcoming/Active Bookings */}
      {upcomingBookings.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming & Active</h2>
          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <div
                key={booking.id}
                className={cn(
                  'rounded-xl border p-5 transition-all hover:shadow-lg bg-card',
                  statusStyles[booking.status] || statusStyles.upcoming
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-white text-xs font-medium uppercase",
                        booking.status === 'active' ? "bg-neon-cyan" : "bg-slot-available"
                      )}>
                        {booking.status}
                      </span>
                      <span className="font-mono text-sm text-neon-cyan font-bold">
                        Slot {booking.slot_number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{booking.park_name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin size={14} />
                      <span>{booking.address}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(booking.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatTime(booking.start_time)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center border border-border">
                      <QrCode size={32} className="text-neon-cyan" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{booking.amount}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View QR
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-muted/10 border border-dashed rounded-xl py-10 text-center">
          <p className="text-muted-foreground">No upcoming bookings found.</p>
        </div>
      )}

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Past Bookings</h2>
          <div className="space-y-3">
            {pastBookings.map(booking => (
              <div
                key={booking.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-muted-foreground">
                        Slot {booking.slot_number}
                      </span>
                      <span className="text-xs text-muted-foreground uppercase">{booking.status}</span>
                    </div>
                    <h3 className="font-medium">{booking.park_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.start_time)} • {formatTime(booking.start_time)}
                    </p>
                  </div>
                  <p className="font-semibold">₹{booking.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
