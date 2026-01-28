// src/components/FAQs/CategoryBadge/index.tsx - ✅ CORRIGIDO
import React from 'react';
import type { FAQ } from '../../../services';
import Badge from '../../common/Badge';

// ============================================
// TYPES
// ============================================

interface CategoryBadgeProps {
  category: FAQ['category'];
  size?: 'sm' | 'md' | 'lg';
}

// ============================================
// CATEGORY CONFIG
// ============================================

const CATEGORY_CONFIG: Record<FAQ['category'], {
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'orange';
  icon?: string;
}> = {
  General: { color: 'gray', icon: '📋' },
  Admission: { color: 'blue', icon: '🎓' },
  Pricing: { color: 'green', icon: '💰' },
  Uniform: { color: 'purple', icon: '👔' },
  Schedule: { color: 'orange', icon: '📅' },
  Documentation: { color: 'blue', icon: '📄' },
  Activities: { color: 'yellow', icon: '🎨' },
  Meals: { color: 'orange', icon: '🍽️' },
  Transport: { color: 'purple', icon: '🚌' },
  Pedagogical: { color: 'red', icon: '📚' },
};

// ============================================
// COMPONENT
// ============================================

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category,
  size = 'md' 
}) => {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.General;
  
  return (
    <Badge 
      variant={config.color} 
      size={size}
      icon={config.icon ? <span>{config.icon}</span> : undefined}
    >
      {category}
    </Badge>
  );
};

export default CategoryBadge;