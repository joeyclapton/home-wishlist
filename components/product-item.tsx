'use client';

import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

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
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function toggleChecked() {
    const supabase = createClient();
    await supabase
      .from('wishlist_products')
      .update({ checked: !checked })
      .eq('id', id);

    const queries = [['tasks'], ['wishlist-products', wishlistId]];

    queries.forEach((queryKey) => {
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((item: any) =>
          item.id === id ? { ...item, checked: !checked } : item
        );
      });
    });
  }

  async function deleteProduct() {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('wishlist_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.setQueryData(
        ['wishlist-products', wishlistId],
        (oldData: any) => {
          return oldData.filter((item: any) => item.id !== id);
        }
      );

      toast({
        description: '✅ Produto excluído com sucesso',
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        description: '❌ Erro ao excluir produto',
        variant: 'destructive',
      });
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 rounded-lg bg-card p-2"
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
          <div className="flex items-center gap-2">
            {priority && (
              <span
                className={cn(
                  'mt-1 inline-block w-[50px] rounded-full px-2 py-0.5 text-center text-xs font-medium',
                  priorityColors[priority]
                )}
              >
                {priorityLabel[priority]}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-5 w-5 text-destructive opacity-45 opacity-50" />
            </Button>
          </div>
        </div>
      </motion.div>
      <Separator className="my-2" />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Excluir produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto <strong>"{name}"</strong>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row-reverse gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={deleteProduct}
              className="w-full sm:w-auto"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
