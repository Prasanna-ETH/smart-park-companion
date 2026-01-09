import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkCard from '@/components/ParkCard';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Loader2 } from 'lucide-react';
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

const UserHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNearbyParks();
  }, []);

  const fetchNearbyParks = async () => {
    try {
      // Mocking user location for demo (e.g., Bengaluru)
      const lat = 12.9716;
      const lon = 77.5946;
      const response = await api.get(`/user/parks/nearby?lat=${lat}&lon=${lon}&radius=10`);
      setParks(response.data);
    } catch (error) {
      console.error('Failed to fetch parks', error);
      toast.error('Could not load nearby parks');
    } finally {
      setLoading(false);
    }
  };

  const filteredParks = parks.filter(
    park =>
      park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      park.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBook = (parkId: string) => {
    navigate(`/user/book/${parkId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Find Parking</h1>
        <p className="text-muted-foreground">Discover available parking spots near you</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Map Placeholder */}
      <div className="rounded-xl border border-border bg-muted/30 h-48 flex items-center justify-center blueprint-grid">
        <div className="text-center">
          <MapPin className="mx-auto text-muted-foreground mb-2" size={32} />
          <p className="text-sm text-muted-foreground">Map View Coming Soon</p>
          <p className="text-xs text-muted-foreground">Google Maps integration</p>
        </div>
      </div>

      {/* Park Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Nearby Parking ({filteredParks.length})</h2>
          {loading && <Loader2 className="animate-spin text-muted-foreground" size={20} />}
        </div>

        {filteredParks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredParks.map(park => (
              <ParkCard
                key={park.id}
                id={park.id.toString()}
                name={park.name}
                address={park.location}
                distance={`${park.distance?.toFixed(1) || '0.1'} km`}
                availableSlots={park.available_slots}
                totalSlots={park.total_slots}
                pricePerHour={park.hourly_rate}
                onBook={handleBook}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 rounded-xl bg-muted/20 border border-dashed border-border">
              <p className="text-muted-foreground">No parking locations found matching your search.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserHome;
