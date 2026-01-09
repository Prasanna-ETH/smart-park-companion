import { Car } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'selected';

interface ParkingSlotProps {
  slotNumber: string;
  status: SlotStatus;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ParkingSlot: React.FC<ParkingSlotProps> = ({
  slotNumber,
  status,
  onClick,
  disabled = false,
  size = 'md',
}) => {
  const sizes = {
    sm: 'w-12 h-14',
    md: 'w-16 h-20',
    lg: 'w-20 h-24',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const statusStyles = {
    available: 'bg-slot-available/10 border-slot-available hover:bg-slot-available/20 slot-pulse-available cursor-pointer',
    occupied: 'bg-slot-occupied/10 border-slot-occupied slot-pulse-occupied cursor-not-allowed',
    reserved: 'bg-slot-reserved/10 border-slot-reserved cursor-not-allowed',
    selected: 'bg-neon-cyan/20 border-neon-cyan neon-glow-cyan cursor-pointer',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || status === 'occupied'}
      className={cn(
        'relative border-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-300',
        sizes[size],
        statusStyles[status],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={`Parking slot ${slotNumber}, ${status}`}
    >
      {status === 'occupied' && (
        <Car size={iconSizes[size]} className="text-slot-occupied" />
      )}
      {status === 'available' && (
        <div className="w-3 h-3 rounded-full bg-slot-available animate-pulse" />
      )}
      {status === 'reserved' && (
        <Car size={iconSizes[size]} className="text-slot-reserved" />
      )}
      {status === 'selected' && (
        <Car size={iconSizes[size]} className="text-neon-cyan" />
      )}
      <span className={cn(
        'font-mono font-bold',
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base',
        status === 'available' ? 'text-slot-available' :
        status === 'occupied' ? 'text-slot-occupied' :
        status === 'reserved' ? 'text-slot-reserved' :
        'text-neon-cyan'
      )}>
        {slotNumber}
      </span>
    </button>
  );
};

export default ParkingSlot;
