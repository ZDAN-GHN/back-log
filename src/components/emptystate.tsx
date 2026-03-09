import { motion } from 'framer-motion';
import { Button } from './Button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  iconSize?: number;
  iconBgColor?: string;
  iconColor?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  iconSize = 48,
  iconBgColor = 'bg-brand-pink/10',
  iconColor = 'text-brand-pink',
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {Icon && (
        <div className={`w-24 h-24 ${iconBgColor} rounded-3xl flex items-center justify-center mb-4`}>
          <Icon size={iconSize} className={iconColor} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-400 mb-6">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};
