'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddProductDialog } from '@/components/add-product-dialog';
import { ProductItem } from '@/components/product-item';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function WishlistDetailClient() {
  const { id } = useParams();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist', id],
    queryFn: async () => {
      const supabase = createClient();
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select('*')
        .eq('id', id)
        .single();

      if (wishlistError) throw wishlistError;
      return wishlistData;
    },
  });

  const { data: products } = useQuery<{}>({
    queryKey: ['wishlist-products', id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('wishlist_products')
        .select(
          `
          id,
          checked,
          product:product_id (
            id,
            name,
            priority
          )
        `
        )
        .eq('wishlist_id', id);

      return data;
    },
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const deleteWishlist = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('wishlist').delete().eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries(['wishlists']);
      toast({
        description: '✅ Wishlist excluída com sucesso.',
      });
      router.push('/');
    } catch (error) {
      toast({
        description: '❌ Erro ao excluir wishlist. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="container mx-auto min-h-screen max-w-md space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{wishlist?.name}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={deleteWishlist}>
          <Trash2 className="h-5 w-5" color="#D9305D" />
        </Button>
      </div>

      <Button
        onClick={() => setIsAddingProduct(true)}
        className="w-full gap-2"
        size="lg"
      >
        <Plus className="h-5 w-5" />
        Add Product
      </Button>

      <motion.div variants={container} initial="hidden" animate="show">
        {products?.map((item) => (
          <ProductItem
            key={item.id}
            id={item.id}
            name={item.product.name}
            priority={item.product.priority}
            checked={item.checked}
            wishlistId={id as string}
          />
        ))}
      </motion.div>

      <AddProductDialog
        open={isAddingProduct}
        onOpenChange={setIsAddingProduct}
        wishlistId={id as string}
      />
    </main>
  );
}
