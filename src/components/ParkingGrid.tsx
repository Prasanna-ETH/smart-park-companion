import { useState, useEffect } from 'react';
import ParkingSlot, { SlotStatus } from './ParkingSlot';

export interface Slot {
  id: string;
  number: string;
  status: SlotStatus;
}

interface ParkingGridProps {
  rows?: number;
  cols?: number;
  onSlotSelect?: (slotId: string) => void;
  selectable?: boolean;
  selectedSlot?: string | null;
  customSlots?: Slot[];
}

const generateSlots = (rows: number, cols: number): Slot[] => {
  const slots: Slot[] = [];
  const statuses: SlotStatus[] = ['available', 'occupied', 'available', 'occupied', 'available'];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const rowLetter = String.fromCharCode(65 + row);
      const slotNumber = `${rowLetter}${col + 1}`;
      slots.push({
        id: slotNumber,
        number: slotNumber,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }
  }
  return slots;
};

const ParkingGrid: React.FC<ParkingGridProps> = ({
  rows = 5,
  cols = 5,
  onSlotSelect,
  selectable = false,
  selectedSlot = null,
  customSlots,
}) => {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (customSlots) {
      setSlots(customSlots);
    } else {
      setSlots(generateSlots(rows, cols));
    }
  }, [rows, cols, customSlots]);

  // Simulate real-time updates only if no custom slots
  useEffect(() => {
    if (customSlots) return;

    const interval = setInterval(() => {
      setSlots(prev => {
        const newSlots = [...prev];
        const randomIndex = Math.floor(Math.random() * newSlots.length);
        if (newSlots[randomIndex].id !== selectedSlot) {
          newSlots[randomIndex] = {
            ...newSlots[randomIndex],
            status: newSlots[randomIndex].status === 'available' ? 'occupied' : 'available',
          };
        }
        return newSlots;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedSlot, customSlots]);

  const handleSlotClick = (slot: Slot) => {
    if (!selectable || slot.status === 'occupied') return;
    onSlotSelect?.(slot.id);
  };

  return (
    <div className="blueprint-grid bg-muted/30 rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Parking Layout
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slot-available" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slot-occupied" />
            <span className="text-muted-foreground">Occupied</span>
          </div>
          {selectable && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-neon-cyan" />
              <span className="text-muted-foreground">Selected</span>
            </div>
          )}
        </div>
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {slots.map(slot => (
          <ParkingSlot
            key={slot.id}
            slotNumber={slot.number}
            status={selectedSlot === slot.id ? 'selected' : slot.status}
            onClick={() => handleSlotClick(slot)}
            disabled={!selectable}
          />
        ))}
      </div>

      {/* Entrance indicator */}
      <div className="mt-4 flex justify-center">
        <div className="px-4 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs font-medium text-primary">
          ↑ ENTRANCE
        </div>
      </div>
    </div>
  );
};

export default ParkingGrid;
