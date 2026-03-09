import type { Category } from '../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as Icons from 'lucide-react';

interface CategoryTagProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

// 图标映射
const iconMap: Record<string, keyof typeof Icons> = {
  'briefcase': 'Briefcase',
  'book-open': 'BookOpen',
  'coffee': 'Coffee',
  'home': 'Home',
  'shopping': 'ShoppingCart',
  'heart': 'Heart',
  'star': 'Star',
  'music': 'Music',
  'gamepad': 'Gamepad2',
};

export const CategoryTag = ({
  category,
  isActive = false,
  onClick,
  className,
}: CategoryTagProps) => {
  const IconName = iconMap[category.icon || 'star'];
  const Icon = Icons[IconName] || Icons.Star;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
        'hover:shadow-sm',
        isActive
          ? 'shadow-sm ring-2 ring-offset-1'
          : 'opacity-70 hover:opacity-100',
        className
      )}
      style={{
        backgroundColor: category.color,
        ringColor: category.color,
        color: '#4A4A4A',
      }}
    >
      {category.icon && <Icon size={14} strokeWidth={2} />}
      <span>{category.name}</span>
    </button>
  );
};
