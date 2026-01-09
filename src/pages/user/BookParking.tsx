import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ParkingGrid, { Slot } from '@/components/ParkingGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Clock, IndianRupee, QrCode, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface ParkDetail {
  id: number;
  name: string;
  location: string;
  hourly_rate: number;
  slots: {
    id: number;
    slot_number: string;
    is_occupied: boolean;
  }[];
}

const BookParking = () => {
  const { parkId } = useParams();
  const navigate = useNavigate();

  const [park, setPark] = useState<ParkDetail | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchParkDetails();
  }, [parkId]);

  const fetchParkDetails = async () => {
    try {
      const response = await api.get(`/user/parks/${parkId}`);
      setPark(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load parking details');
    } finally {
      setIsFetching(false);
    }
  };

  const pricePerHour = park?.hourly_rate || 0;
  const totalPrice = parseInt(duration) * pricePerHour;

  const handleBooking = async () => {
    if (!selectedSlotId || !date || !startTime) {
      toast.error('Please select a slot, date, and time.');
      return;
    }

    setIsLoading(true);
    try {
      // Calculate start_time as ISO string for backend
      const startDateTime = new Date(`${date}T${startTime}`);

      await api.post('/user/bookings', {
        slot_id: parseInt(selectedSlotId),
        start_time: startDateTime.toISOString(),
        duration_hours: parseInt(duration),
        amount: totalPrice
      });

      setShowConfirmation(true);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.detail || 'Booking failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-muted-foreground">Loading park layout...</p>
      </div>
    );
  }

  if (!park) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Park Not Found</h2>
        <Button onClick={() => navigate('/user')} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const gridSlots: Slot[] = park.slots.map(s => ({
    id: s.id.toString(),
    number: s.slot_number,
    status: s.is_occupied ? 'occupied' : 'available'
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to search</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold">{park.name}</h1>
        <p className="text-muted-foreground">{park.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot Selection */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Select a Slot</h2>
          <ParkingGrid
            selectable
            selectedSlot={selectedSlotId}
            onSlotSelect={setSelectedSlotId}
            customSlots={gridSlots}
          />
        </div>

        {/* Booking Form */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-4">Booking Details</h3>

            <div className="space-y-4">
              {selectedSlotId && (
                <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 animate-scale-in">
                  <p className="text-sm text-muted-foreground">Selected Slot</p>
                  <p className="text-xl font-bold text-neon-cyan">
                    {gridSlots.find(s => s.id === selectedSlotId)?.number}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="12"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Rate</span>
              <span>₹{pricePerHour}/hr</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Duration</span>
              <span>{duration} hour(s)</span>
            </div>
            <div className="h-px bg-border my-3" />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span className="flex items-center">
                <IndianRupee size={18} />
                {totalPrice}
              </span>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleBooking}
            disabled={!selectedSlotId || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal (Simplified using conditional rendering for speed) */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-center mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-muted-foreground text-center mb-6">Your parking spot has been reserved.</p>

            <div className="flex flex-col items-center py-6 bg-muted/30 rounded-lg mb-6">
              <QrCode size={128} className="text-neon-cyan mb-4" />
              <p className="text-sm text-muted-foreground text-center px-4">
                Show this QR code at the parking entrance
              </p>
              <div className="mt-4 text-center">
                <p className="font-semibold text-lg">Slot: {gridSlots.find(s => s.id === selectedSlotId)?.number}</p>
                <p className="text-sm text-muted-foreground">
                  {date} at {startTime} ({duration}hr)
                </p>
              </div>
            </div>

            <Button onClick={() => navigate('/user/bookings')} className="w-full">
              View My Bookings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookParking;
