'use client';

import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface ProductItemProps {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
  checked: boolean;
  wishlistId: string;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  medium:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function ProductItem({
  id,
  name,
  priority,
  checked,
  wishlistId,
}: ProductItemProps) {
  const queryClient = useQueryClient();

  async function toggleChecked() {
    const supabase = createClient();
    await supabase
      .from('wishlist_products')
      .update({ checked: !checked })
      .eq('id', id);

    queryClient.setQueryData(
      ['wishlist-products', wishlistId],
      (oldData: any) => {
        return oldData.map((item: any) =>
          item.id === id ? { ...item, checked: !checked } : item
        );
      }
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex cursor-pointer items-center gap-4 rounded-lg bg-card p-2"
      onClick={toggleChecked}
    >
      <Checkbox className="h-8 w-8 rounded-full" checked={checked} />
      <div className="flex flex-1 items-center justify-between">
        <p
          className={cn(
            'text-lg font-medium',
            checked && 'text-muted-foreground line-through'
          )}
        >
          {name}
        </p>
        {priority && (
          <span
            className={cn(
              'mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium',
              priorityColors[priority]
            )}
          >
            {priority}
          </span>
        )}
      </div>
    </motion.div>
  );
}
