import { useState } from 'react';
import ParkingGrid from '@/components/ParkingGrid';
import StatCard from '@/components/StatCard';
import { Car, IndianRupee, TrendingUp, Clock } from 'lucide-react';

const OwnerDashboard = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your parking facility</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Slots"
          value={25}
          icon={Car}
          variant="default"
        />
        <StatCard
          title="Occupied"
          value={18}
          icon={Clock}
          trend={{ value: 12, isPositive: true }}
          variant="warning"
        />
        <StatCard
          title="Available"
          value={7}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Today's Revenue"
          value="₹4,250"
          icon={IndianRupee}
          trend={{ value: 8, isPositive: true }}
          variant="default"
        />
      </div>

      {/* Parking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ParkingGrid
            rows={5}
            cols={5}
            selectable
            selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <span className="text-sm font-medium">Add Camera Credentials</span>
                <p className="text-xs text-muted-foreground mt-0.5">Configure RTSP stream</p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <span className="text-sm font-medium">Upload Parking Data</span>
                <p className="text-xs text-muted-foreground mt-0.5">Import JSON/CSV</p>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <span className="text-sm font-medium">Generate Payment Link</span>
                <p className="text-xs text-muted-foreground mt-0.5">Stripe/Razorpay</p>
              </button>
            </div>
          </div>

          {selectedSlot && (
            <div className="rounded-xl border border-neon-cyan/50 bg-neon-cyan/5 p-4 animate-scale-in">
              <h3 className="font-semibold text-neon-cyan mb-2">
                Selected: Slot {selectedSlot}
              </h3>
              <p className="text-sm text-muted-foreground">
                Click to view details or manage this slot.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
