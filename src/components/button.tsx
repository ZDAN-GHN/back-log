import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

// 合并类名的工具函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 按钮变体样式映射
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-pink text-white hover:bg-brand-pink/90 shadow-soft',
  secondary: 'bg-brand-green text-gray-700 hover:bg-brand-green/90 shadow-soft',
  danger: 'bg-danger text-white hover:bg-danger/90 shadow-soft',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

// 按钮尺寸样式映射
const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};
