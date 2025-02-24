'use client';

import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

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

const priorityLabel = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex cursor-pointer items-center gap-4 rounded-lg bg-card p-2"
      >
        <Checkbox
          className={cn('h-10 w-10 rounded-full')}
          checked={checked}
          onCheckedChange={toggleChecked}
        />
        <div className="flex w-full items-center justify-between">
          <p
            className={cn(
              'text-md font-medium',
              checked && 'text-muted-foreground line-through'
            )}
          >
            {name}
          </p>
          <div className="flex h-[18px] w-[50px] items-center justify-center">
            {priority && (
              <span
                className={cn(
                  'mt-1 inline-block w-full rounded-full px-2 py-0.5 text-center text-xs font-medium',
                  priorityColors[priority]
                )}
              >
                {priorityLabel[priority]}
              </span>
            )}
          </div>
        </div>
      </motion.div>
      <Separator className="my-2" />
    </>
  );
}
