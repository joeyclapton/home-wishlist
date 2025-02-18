'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { CreateWishlistDialog } from '@/components/create-wishlist-dialog';
import { WishlistCard } from '@/components/wishlist-card';
import { createClient } from '@/lib/supabase/client';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: wishlists } = useQuery({
    queryKey: ['wishlists'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, wishlist_products(*)');

      if (error) throw error;
      return data;
    },
  });

  if (!mounted) return null;

  const gradients = ['#ffd977', '#c9f2f1', '#c7dab8', '#ffba78'];

  return (
    <main className="container mx-auto min-h-screen max-w-md space-y-6 p-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">🏡 Wishlist</h1>
        <p className="text-sm text-muted-foreground">
          Organizando suas listas de compras juntinhos
        </p>
      </div>

      <CreateWishlistDialog />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        {wishlists?.map((wishlist, index) => (
          <motion.div key={wishlist.id} variants={item}>
            <WishlistCard
              id={wishlist.id}
              name={wishlist.name}
              icon={wishlist.icon}
              totalItems={wishlist.wishlist_products.length}
              completedItems={
                wishlist.wishlist_products.filter((p) => p.checked).length
              }
              color={gradients[index % gradients.length]}
            />
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
