import { Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mockBookings = [
  {
    id: '1',
    parkName: 'MG Road Parking Hub',
    address: '123 MG Road, Bengaluru',
    slot: 'A5',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: '2 hrs',
    amount: 80,
    status: 'upcoming',
  },
  {
    id: '2',
    parkName: 'Phoenix Mall Basement',
    address: 'Phoenix Marketcity, Whitefield',
    slot: 'B12',
    date: '2024-01-10',
    time: '02:00 PM',
    duration: '3 hrs',
    amount: 180,
    status: 'completed',
  },
  {
    id: '3',
    parkName: 'UB City Premium Parking',
    address: 'Vittal Mallya Road',
    slot: 'C3',
    date: '2024-01-08',
    time: '11:00 AM',
    duration: '4 hrs',
    amount: 320,
    status: 'completed',
  },
];

const statusStyles = {
  upcoming: 'bg-slot-available/10 text-slot-available border-slot-available/30',
  completed: 'bg-muted text-muted-foreground border-border',
  cancelled: 'bg-slot-occupied/10 text-slot-occupied border-slot-occupied/30',
};

const Bookings = () => {
  const upcomingBookings = mockBookings.filter(b => b.status === 'upcoming');
  const pastBookings = mockBookings.filter(b => b.status !== 'upcoming');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your parking reservations</p>
      </div>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <div
                key={booking.id}
                className={cn(
                  'rounded-xl border p-5 transition-all hover:shadow-lg',
                  statusStyles[booking.status as keyof typeof statusStyles]
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-slot-available text-white text-xs font-medium">
                        Upcoming
                      </span>
                      <span className="font-mono text-sm text-neon-cyan font-bold">
                        Slot {booking.slot}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{booking.parkName}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin size={14} />
                      <span>{booking.address}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{booking.time} ({booking.duration})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
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
      )}

      {/* Past Bookings */}
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
                      Slot {booking.slot}
                    </span>
                  </div>
                  <h3 className="font-medium">{booking.parkName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.date} • {booking.time}
                  </p>
                </div>
                <p className="font-semibold">₹{booking.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
