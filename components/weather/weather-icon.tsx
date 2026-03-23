import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/ui/utils';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export function WeatherIcon({ code, isDay = true, className, size = 24 }: WeatherIconProps) {
  const props = { size, className };

  if (code === 0 || code === 1) {
    return isDay ? <Sun {...props} className={cn('text-yellow-400', className)} /> : <Sun {...props} className={cn('text-slate-300', className)} />;
  }
  if (code === 2) return <CloudSun {...props} className={cn('text-yellow-300', className)} />;
  if (code === 3) return <Cloud {...props} className={cn('text-slate-400', className)} />;
  if (code === 45 || code === 48) return <CloudFog {...props} className={cn('text-slate-400', className)} />;
  if (code >= 51 && code <= 57) return <CloudDrizzle {...props} className={cn('text-blue-400', className)} />;
  if (code >= 61 && code <= 67) return <CloudRain {...props} className={cn('text-blue-500', className)} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...props} className={cn('text-sky-300', className)} />;
  if (code >= 80 && code <= 82) return <CloudRain {...props} className={cn('text-blue-500', className)} />;
  if (code >= 85 && code <= 86) return <CloudSnow {...props} className={cn('text-sky-300', className)} />;
  if (code >= 95) return <CloudLightning {...props} className={cn('text-yellow-500', className)} />;

  return <Wind {...props} className={cn('text-slate-400', className)} />;
}
