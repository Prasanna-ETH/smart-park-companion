import { Car } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-xl' },
    lg: { icon: 36, text: 'text-2xl' },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-neon-cyan/20 blur-lg rounded-full" />
        <div className="relative bg-gradient-to-br from-primary to-neon-cyan p-2 rounded-lg">
          <Car size={sizes[size].icon} className="text-primary-foreground" />
        </div>
      </div>
      {showText && (
        <span className={`font-bold ${sizes[size].text} bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent`}>
          Smart<span className="text-neon-cyan">Park</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
