'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { CreateWishlistDialog } from '@/components/create-wishlist-dialog';
import { WishlistCard } from '@/components/wishlist-card';
import { createClient } from '@/lib/supabase/client';
import { BottomNavbar } from '@/components/ui/bottom-navbar';
import { cn } from '@/lib/utils';

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

  const { data: wishlists, isLoading } = useQuery({
    queryKey: ['wishlists'],
    queryFn: async () => {
      const supabase = createClient();
      // Otimizando a consulta para trazer apenas os dados necessários
      const { data, error } = await supabase
        .from('wishlist')
        .select('id, name, icon, wishlist_products(checked)')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  if (!mounted) return null;

  const gradients = [
    '#F8C8DC', // Rosa claro
    '#FFDFBA', // Pêssego suave
    '#FAF4B7', // Amarelo pastel
    '#C1E1C1', // Verde menta
    '#A7C7E7', // Azul bebê
    '#D5AAFF', // Lavanda suave
    '#F5E1FD', // Lilás claro
    '#FFD1DC', // Rosa algodão doce
    '#B5EAD7', // Verde água pastel
    '#FFDAC1', // Laranja pálido
  ];

  return (
    <>
      <main className="container mx-auto min-h-screen max-w-md space-y-4 bg-[#fbfdf5]">
        <header className="flex justify-between p-4">
          <h1 className="text-3xl font-bold">🏡 Wishlist</h1>
          <CreateWishlistDialog />
        </header>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative !mb-20 !mt-12"
          >
            {wishlists?.map((wishlist, index) => (
              <motion.div
                className="sticky"
                key={wishlist.id}
                variants={item}
                style={{
                  marginTop: index === 0 ? '0' : '-10px',
                  top: (index + 1) * 20 + 'px',
                }} // Sobrepõe ligeiramente o card anterior
              >
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
        )}
      </main>
      <BottomNavbar />
    </>
  );
}
