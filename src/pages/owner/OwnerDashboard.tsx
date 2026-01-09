import { useState, useEffect } from 'react';
import ParkingGrid, { Slot } from '@/components/ParkingGrid';
import StatCard from '@/components/StatCard';
import { Car, IndianRupee, TrendingUp, Clock, PlusCircle } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CreateParkDialog from '@/components/CreateParkDialog';

interface DashboardResponse {
  park_name: string;
  total_slots: number;
  occupied_slots: number;
  available_slots: number;
  total_revenue: number;
  slots: {
    id: number;
    slot_number: string;
    is_occupied: boolean;
  }[];
}

const OwnerDashboard = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPark, setHasPark] = useState<boolean | null>(null);
  const [parkId, setParkId] = useState<number | null>(null);

  useEffect(() => {
    fetchParks();
  }, []);

  const fetchParks = async () => {
    try {
      const { data } = await api.get('/owner/parks');
      if (data && data.length > 0) {
        setHasPark(true);
        setParkId(data[0].id); // Select first park by default
        fetchDashboard(data[0].id);
      } else {
        setHasPark(false);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load parks');
      setLoading(false);
    }
  };

  const fetchDashboard = async (id: number) => {
    try {
      const { data } = await api.get(`/owner/dashboard/${id}`);
      setDashboardData(data);
    } catch (error) {
      console.error(error);
      // Silent fail on polling usually, but explicit fail on first load
    } finally {
      setLoading(false);
    }
  };

  // Poll for updates if parkId is set
  useEffect(() => {
    if (!parkId) return;
    const interval = setInterval(() => {
      fetchDashboard(parkId);
    }, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [parkId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasPark === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <div className="bg-muted/30 p-6 rounded-full">
          <PlusCircle size={48} className="text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">No Parking Lots Found</h2>
          <p className="text-muted-foreground max-w-sm">
            You haven't set up any parking facilities yet. Create your first lot to start managing bookings and cameras.
          </p>
        </div>
        <CreateParkDialog onParkCreated={fetchParks} />
      </div>
    );
  }

  // Transform backend slots to frontend slots
  const gridSlots: Slot[] = dashboardData?.slots.map(s => ({
    id: s.id.toString(),
    number: s.slot_number,
    status: s.is_occupied ? 'occupied' : 'available'
  })) || [];

  // Format revenue as INR
  const revenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(dashboardData?.total_revenue || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">{dashboardData?.park_name || 'Dashboard'}</h1>
        <p className="text-muted-foreground">Real-time overview of your parking facility</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Slots"
          value={dashboardData?.total_slots || 0}
          icon={Car}
          variant="default"
        />
        <StatCard
          title="Occupied"
          value={dashboardData?.occupied_slots || 0}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Available"
          value={dashboardData?.available_slots || 0}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Total Revenue"
          value={revenue}
          icon={IndianRupee}
          variant="default"
        />
      </div>

      {/* Parking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {gridSlots.length > 0 ? (
            <ParkingGrid
              rows={5} // These are ignored if customSlots is provided (as per our update)
              cols={5}
              selectable
              selectedSlot={selectedSlot}
              onSlotSelect={setSelectedSlot}
              customSlots={gridSlots}
            />
          ) : (
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground">No slots configured</p>
            </div>
          )}
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
                Selected: Slot {gridSlots.find(s => s.id === selectedSlot)?.number || selectedSlot}
              </h3>
              <p className="text-sm text-muted-foreground">
                Status: {gridSlots.find(s => s.id === selectedSlot)?.status.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
