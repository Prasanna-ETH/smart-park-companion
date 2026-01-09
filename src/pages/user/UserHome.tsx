import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParkCard from '@/components/ParkCard';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';

const mockParks = [
  {
    id: '1',
    name: 'MG Road Parking Hub',
    address: '123 MG Road, Bengaluru',
    distance: '0.8 km',
    availableSlots: 12,
    totalSlots: 50,
    pricePerHour: 40,
  },
  {
    id: '2',
    name: 'Phoenix Mall Basement',
    address: 'Phoenix Marketcity, Whitefield',
    distance: '1.2 km',
    availableSlots: 35,
    totalSlots: 200,
    pricePerHour: 60,
  },
  {
    id: '3',
    name: 'Indiranagar Metro Station',
    address: 'CMH Road, Indiranagar',
    distance: '2.1 km',
    availableSlots: 5,
    totalSlots: 30,
    pricePerHour: 30,
  },
  {
    id: '4',
    name: 'UB City Premium Parking',
    address: 'Vittal Mallya Road',
    distance: '3.5 km',
    availableSlots: 28,
    totalSlots: 100,
    pricePerHour: 80,
  },
];

const UserHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredParks = mockParks.filter(
    park =>
      park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      park.address.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h2 className="text-lg font-semibold mb-4">Nearby Parking ({filteredParks.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredParks.map(park => (
            <ParkCard
              key={park.id}
              {...park}
              onBook={handleBook}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
