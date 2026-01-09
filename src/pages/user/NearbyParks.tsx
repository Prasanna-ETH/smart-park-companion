import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkCard from '@/components/ParkCard';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Park {
  id: number;
  name: string;
  location: string;
  distance: number;
  available_slots: number;
  total_slots: number;
  hourly_rate: number;
}

const NearbyParks = () => {
  const navigate = useNavigate();
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNearbyParks();
  }, []);

  const fetchNearbyParks = async () => {
    setLoading(true);
    try {
      // Use Bengaluru as default loc for demo
      const lat = 12.9716;
      const lon = 77.5946;
      const response = await api.get(`/user/parks/nearby?lat=${lat}&lon=${lon}&radius=20`);
      setParks(response.data);
    } catch (error) {
      console.error('Failed to fetch parks', error);
      toast.error('Failed to load nearby parks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nearby Parks</h1>
          <p className="text-muted-foreground">All parking locations sorted by distance</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => fetchNearbyParks()}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Navigation size={16} />}
          Use My Location
        </Button>
      </div>

      {/* Map Placeholder */}
      <div className="rounded-xl border border-border bg-muted/30 h-64 flex items-center justify-center blueprint-grid relative overflow-hidden">
        <div className="text-center z-10">
          <MapPin className="mx-auto text-neon-cyan mb-2 animate-float" size={40} />
          <p className="font-medium">Interactive Map</p>
          <p className="text-sm text-muted-foreground">Google Maps integration coming soon</p>
        </div>
        {/* Decorative markers */}
        {parks.map((park, i) => (
          <div
            key={park.id}
            className={`absolute w-3 h-3 rounded-full ${park.available_slots > 0 ? 'bg-slot-available' : 'bg-slot-occupied'} animate-pulse`}
            style={{
              top: `${20 + (i * 15) % 60}%`,
              left: `${15 + (i * 25) % 70}%`
            }}
          />
        ))}
      </div>

      {/* Park List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary mb-2" size={32} />
          <p className="text-muted-foreground">Finding the best spots for you...</p>
        </div>
      ) : parks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parks.map(park => (
            <ParkCard
              key={park.id}
              id={park.id.toString()}
              name={park.name}
              address={park.location}
              distance={`${park.distance?.toFixed(1) || '0.1'} km`}
              availableSlots={park.available_slots}
              totalSlots={park.total_slots}
              pricePerHour={park.hourly_rate}
              onBook={(id) => navigate(`/user/book/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/10 border border-dashed rounded-xl">
          <MapPin className="mx-auto text-muted-foreground mb-3" size={40} />
          <h3 className="text-lg font-medium">No Parks Found</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            We couldn't find any parking facilities within the selected radius. Try expanding your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default NearbyParks;
