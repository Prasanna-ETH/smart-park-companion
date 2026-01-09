import { useAuth } from '@/contexts/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  Database,
  CreditCard,
  FileText,
  BarChart3,
  Home,
  MapPin,
  Calendar,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { Button } from './ui/button';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ownerNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/owner' },
  { icon: Camera, label: 'Setup Camera', path: '/owner/camera' },
  { icon: Database, label: 'Parking Data', path: '/owner/data' },
  { icon: CreditCard, label: 'Payments', path: '/owner/payments' },
  { icon: FileText, label: 'Logs', path: '/owner/logs' },
  { icon: BarChart3, label: 'Analytics', path: '/owner/analytics' },
];

const userNavItems = [
  { icon: Home, label: 'Home', path: '/user' },
  { icon: MapPin, label: 'Nearby Parks', path: '/user/nearby' },
  { icon: Calendar, label: 'Bookings', path: '/user/bookings' },
  { icon: User, label: 'Profile', path: '/user/profile' },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  const navItems = user?.role === 'owner' ? ownerNavItems : userNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transform bg-sidebar transition-transform duration-300 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground neon-glow-cyan'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-lg bg-sidebar-accent p-3 text-xs text-sidebar-foreground/70">
            <p className="font-medium text-sidebar-foreground">Need Help?</p>
            <p className="mt-1">Contact support@smartpark.in</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
