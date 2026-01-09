import { useNavigate } from 'react-router-dom';
import ParkCard from '@/components/ParkCard';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  {
    id: '5',
    name: 'Koramangala Forum Mall',
    address: 'Forum Mall, Koramangala',
    distance: '4.2 km',
    availableSlots: 45,
    totalSlots: 150,
    pricePerHour: 50,
  },
  {
    id: '6',
    name: 'Electronic City Infosys Gate',
    address: 'Electronic City Phase 1',
    distance: '8.5 km',
    availableSlots: 120,
    totalSlots: 300,
    pricePerHour: 25,
  },
];

const NearbyParks = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nearby Parks</h1>
          <p className="text-muted-foreground">All parking locations sorted by distance</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Navigation size={16} />
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
        <div className="absolute top-8 left-12 w-3 h-3 rounded-full bg-slot-available animate-pulse" />
        <div className="absolute top-16 right-24 w-3 h-3 rounded-full bg-slot-available animate-pulse" />
        <div className="absolute bottom-12 left-1/3 w-3 h-3 rounded-full bg-slot-occupied animate-pulse" />
        <div className="absolute bottom-20 right-16 w-3 h-3 rounded-full bg-slot-available animate-pulse" />
      </div>

      {/* Park List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockParks.map(park => (
          <ParkCard
            key={park.id}
            {...park}
            onBook={(id) => navigate(`/user/book/${id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default NearbyParks;
