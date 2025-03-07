'use client';

import { motion } from 'framer-motion';
import { ListChecks } from 'lucide-react';
import { GradientCard } from './ui/gradient-card';
import Link from 'next/link';

interface WishlistCardProps {
  id: string;
  name: string;
  totalItems: number;
  completedItems: number;
  color?: string;
  icon: string;
}

export function WishlistCard({
  id,
  name,
  totalItems,
  completedItems,
  icon,
  color,
}: WishlistCardProps) {
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <Link href={`/wishlist/${id}`} prefetch>
      <div className="rounded-lg px-4 py-12" style={{ background: color }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">
              <span className="mr-2">{icon}</span>
              <span>{name}</span>
            </h3>
            <p className="mt-1 text-xs">
              {completedItems} de {totalItems} itens
            </p>
          </div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/40">
          <motion.div
            className="h-full bg-black"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </Link>
  );
}
