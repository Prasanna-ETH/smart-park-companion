import { MapPin, Clock, IndianRupee, Car } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ParkCardProps {
  id: string;
  name: string;
  address: string;
  distance: string;
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  imageUrl?: string;
  onBook: (id: string) => void;
}

const ParkCard: React.FC<ParkCardProps> = ({
  id,
  name,
  address,
  distance,
  availableSlots,
  totalSlots,
  pricePerHour,
  onBook,
}) => {
  const availabilityPercent = (availableSlots / totalSlots) * 100;
  const isLowAvailability = availabilityPercent < 20;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-neon-cyan/50 hover:shadow-lg animate-fade-in">
      {/* Availability indicator */}
      <div className="absolute right-3 top-3">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            isLowAvailability
              ? 'bg-slot-occupied/10 text-slot-occupied'
              : 'bg-slot-available/10 text-slot-available'
          )}
        >
          <Car size={12} />
          {availableSlots} slots
        </span>
      </div>

      {/* Park info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold group-hover:text-neon-cyan transition-colors">
          {name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} />
          <span className="line-clamp-1">{address}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock size={14} />
          <span>{distance} away</span>
        </div>
        <div className="flex items-center gap-0.5 font-semibold text-primary">
          <IndianRupee size={14} />
          <span>{pricePerHour}/hr</span>
        </div>
      </div>

      {/* Availability bar */}
      <div className="mb-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isLowAvailability ? 'bg-slot-occupied' : 'bg-slot-available'
            )}
            style={{ width: `${availabilityPercent}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {availableSlots} of {totalSlots} slots available
        </p>
      </div>

      {/* Book button */}
      <Button
        onClick={() => onBook(id)}
        className="w-full bg-primary hover:bg-primary/90"
        disabled={availableSlots === 0}
      >
        {availableSlots === 0 ? 'Full' : 'Book Now'}
      </Button>
    </div>
  );
};

export default ParkCard;
