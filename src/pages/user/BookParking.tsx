import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ParkingGrid from '@/components/ParkingGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Clock, IndianRupee, QrCode } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BookParking = () => {
  const { parkId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const pricePerHour = 40;
  const totalPrice = parseInt(duration) * pricePerHour;

  const handleBooking = async () => {
    if (!selectedSlot || !date || !startTime) {
      toast({
        title: 'Missing information',
        description: 'Please select a slot, date, and time.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowConfirmation(true);
  };

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
        <h1 className="text-2xl font-bold">Book Parking</h1>
        <p className="text-muted-foreground">Park ID: {parkId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot Selection */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Select a Slot</h2>
          <ParkingGrid
            rows={4}
            cols={5}
            selectable
            selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
          />
        </div>

        {/* Booking Form */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold mb-4">Booking Details</h3>

            <div className="space-y-4">
              {selectedSlot && (
                <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 animate-scale-in">
                  <p className="text-sm text-muted-foreground">Selected Slot</p>
                  <p className="text-xl font-bold text-neon-cyan">{selectedSlot}</p>
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
            disabled={!selectedSlot || isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Booking Confirmed! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Your parking spot has been reserved.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-32 h-32 bg-muted rounded-xl flex items-center justify-center mb-4">
              <QrCode size={64} className="text-neon-cyan" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Show this QR code at the parking entrance
            </p>
            <div className="mt-4 text-center">
              <p className="font-semibold">Slot: {selectedSlot}</p>
              <p className="text-sm text-muted-foreground">
                {date} at {startTime} ({duration}hr)
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/user/bookings')} className="w-full">
            View My Bookings
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookParking;
