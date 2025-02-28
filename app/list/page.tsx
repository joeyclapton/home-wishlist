'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { BottomNavbar } from '@/components/ui/bottom-navbar';
import { ProductItem } from '@/components/product-item';

export default function TaskList() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('wishlist_products')
        .select(
          `
          id,
          product_id,
          checked,
          product:product_id (
            name,
            priority
          )
        `
        )
        .order('priority', { foreignTable: 'product', ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <motion.div
          className="h-8 w-8 rounded-full border-b-2 border-t-2 border-primary"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto min-h-screen max-w-md space-y-6 p-4">
        <h1 className="text-center text-3xl font-bold">Lista de Produtos</h1>
        <ul>
          {tasks?.map((task) => (
            <ProductItem
              key={task.id}
              id={task.id}
              name={task.product!.name}
              priority={task.product!.priority}
              checked={task.checked}
              wishlistId={task.product_id}
            />
          ))}
        </ul>
      </main>
      <BottomNavbar />
    </>
  );
}
