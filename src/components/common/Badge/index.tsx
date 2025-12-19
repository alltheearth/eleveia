// src/components/common/Badge/index.tsx
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

const VARIANTS = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
  gray: 'bg-gray-100 text-gray-700',
  orange: 'bg-orange-100 text-orange-700',
};

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export default function Badge({ 
  children, 
  variant = 'blue', 
  size = 'md',
  icon 
}: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${VARIANTS[variant]} ${SIZES[size]}`}>
      {icon}
      {children}
    </span>
  );
}