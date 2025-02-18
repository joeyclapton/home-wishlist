'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: string;
  children: React.ReactNode;
}

export function GradientCard({
  gradient = 'from-blue-500 to-purple-500',
  className,
  children,
  ...props
}: GradientCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg',
        gradient,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
