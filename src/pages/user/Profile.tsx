import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RoleBadge from '@/components/RoleBadge';
import { Wallet, Car, Calendar, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <RoleBadge role={user?.role || null} size="sm" />
            </div>
            <p className="text-muted-foreground">{user?.email}</p>
            <Button variant="outline" size="sm" className="mt-3">
              <Edit2 size={14} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Wallet className="mx-auto text-neon-cyan mb-2" size={24} />
          <p className="text-2xl font-bold">₹1,240</p>
          <p className="text-xs text-muted-foreground">Wallet Balance</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Car className="mx-auto text-primary mb-2" size={24} />
          <p className="text-2xl font-bold">23</p>
          <p className="text-xs text-muted-foreground">Total Parkings</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Calendar className="mx-auto text-slot-available mb-2" size={24} />
          <p className="text-2xl font-bold">2</p>
          <p className="text-xs text-muted-foreground">Upcoming</p>
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Account Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={user?.name} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+91 9876543210" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle Number</Label>
            <Input id="vehicle" placeholder="MH12AB1234" />
          </div>
        </div>

        <Button className="mt-4">Save Changes</Button>
      </div>

      {/* Wallet */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Wallet</h3>
          <Button>Add Money</Button>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <Wallet className="text-neon-cyan" size={32} />
          <div>
            <p className="text-2xl font-bold">₹1,240</p>
            <p className="text-sm text-muted-foreground">Available Balance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
