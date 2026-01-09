import { UserRole } from '@/contexts/AuthContext';
import { Building2, User } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  if (!role) return null;

  const isOwner = role === 'owner';
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizes[size]} ${
        isOwner
          ? 'bg-badge-owner/10 text-badge-owner border border-badge-owner/30'
          : 'bg-badge-user/10 text-badge-user border border-badge-user/30'
      }`}
    >
      {isOwner ? <Building2 size={size === 'sm' ? 12 : 14} /> : <User size={size === 'sm' ? 12 : 14} />}
      {isOwner ? 'Owner' : 'Driver'}
    </span>
  );
};

export default RoleBadge;
