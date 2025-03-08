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
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 opacity-50"
              >
                <g clip-path="url(#clip0_1030_1970)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.05 7.06002C21.718 7.1026 21.382 7.1026 21.05 7.06002C20.2 6.97002 19.23 6.75002 18.48 6.68002C16.93 6.53002 15.33 6.41002 13.72 6.38002C12.11 6.35002 10.52 6.38002 8.96002 6.49002L4.35002 6.80002C4.38945 6.76952 4.42095 6.72997 4.44184 6.6847C4.46273 6.63944 4.47239 6.58981 4.47002 6.54002C4.59002 6.54002 4.59002 6.04002 4.61002 5.98002C4.68529 5.76788 4.79326 5.56881 4.93002 5.39002C5.04697 5.23431 5.20685 5.11614 5.39002 5.05002C6.17882 4.79815 6.98407 4.60102 7.80002 4.46002C9.03354 4.2555 10.28 4.13854 11.53 4.11002C12.9649 4.01003 14.4051 4.01003 15.84 4.11002C16.7868 4.16566 17.7252 4.31983 18.64 4.57002C18.7223 4.60163 18.7964 4.65128 18.857 4.71531C18.9176 4.77933 18.963 4.85612 18.99 4.94002C19.0731 5.20039 19.13 5.46837 19.16 5.74002C19.177 5.82834 19.2265 5.90709 19.2987 5.96076C19.3709 6.01443 19.4605 6.03914 19.55 6.03002C19.5949 6.02392 19.6381 6.00892 19.677 5.98591C19.716 5.96289 19.75 5.93233 19.777 5.896C19.804 5.85967 19.8235 5.81832 19.8343 5.77436C19.8452 5.7304 19.8471 5.68473 19.84 5.64002C19.8236 5.24705 19.746 4.85905 19.61 4.49002C19.5426 4.33197 19.4428 4.1898 19.3171 4.07268C19.1913 3.95556 19.0424 3.86608 18.88 3.81002C17.9084 3.46851 16.9025 3.23379 15.88 3.11002C15.88 3.11002 15.3 1.60002 15.29 1.59002C15.0219 1.12189 14.6571 0.716233 14.22 0.400018C13.7291 0.088644 13.1491 -0.0519636 12.57 1.78628e-05C12.0479 0.0412535 11.5352 0.162677 11.05 0.360018C10.5437 0.581175 10.1004 0.924831 9.76002 1.36002C9.46121 1.94216 9.23935 2.56068 9.10002 3.20002C8.82002 3.20002 8.52002 3.28002 8.24002 3.34002C7.16026 3.5588 6.10743 3.8941 5.10002 4.34002C4.85326 4.45433 4.63474 4.62163 4.46002 4.83002C4.23629 5.12883 4.07322 5.46855 3.98002 5.83002C3.91981 6.06044 3.87307 6.29417 3.84002 6.53002C3.83566 6.58033 3.84138 6.631 3.85683 6.67908C3.87228 6.72715 3.89716 6.77167 3.93002 6.81002L4.00002 6.83002C0.460018 7.08002 1.73002 7.66002 2.00002 7.65002C2.22481 7.63742 2.44858 7.6107 2.67002 7.57002H9.00002C10.3 7.57002 11.62 7.51002 12.95 7.50002H15.59C16.59 7.50002 17.48 7.50002 18.41 7.56002C19.15 7.56002 20.13 7.75002 20.98 7.80002C21.3786 7.84743 21.7814 7.84743 22.18 7.80002C22.2688 7.7853 22.3481 7.73599 22.4006 7.66288C22.4531 7.58978 22.4745 7.49885 22.46 7.41002C22.4608 7.35854 22.4502 7.30753 22.429 7.26062C22.4078 7.21371 22.3765 7.17206 22.3373 7.13863C22.2981 7.10521 22.2521 7.08083 22.2024 7.06724C22.1528 7.05365 22.1007 7.05119 22.05 7.06002ZM10.47 2.00002C10.6959 1.79778 10.9569 1.6385 11.24 1.53002C11.6996 1.34294 12.1853 1.22825 12.68 1.19002C13.0208 1.13275 13.371 1.18527 13.68 1.34002C14.0227 1.53803 14.3274 1.79536 14.58 2.10002C14.63 2.17002 14.85 2.69002 15.02 3.04002C13.8419 2.95628 12.6598 2.94293 11.48 3.00002C11 3.00002 10.51 3.00002 10 3.07002C10.23 2.70002 10.38 2.06002 10.47 2.00002Z"
                    fill="black"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.65 8.64002C20.5923 8.58441 20.5152 8.55334 20.435 8.55334C20.3548 8.55334 20.2778 8.58441 20.22 8.64002C20.1794 8.69504 20.1575 8.76163 20.1575 8.83002C20.1575 8.8984 20.1794 8.96499 20.22 9.02002V9.07002V9.39002C20.1288 10.987 19.9384 12.5767 19.65 14.15C19.31 16.21 18.9 18.31 18.59 19.38C18.45 19.87 18.35 20.38 18.18 20.86C18.0892 21.1397 17.9542 21.4031 17.78 21.64C17.3711 22.1304 16.8063 22.4658 16.18 22.59C15.1504 22.844 14.0842 22.9151 13.03 22.8C11.61 22.65 10.03 22.8 8.60002 22.61C8.03975 22.5343 7.49774 22.3582 7.00002 22.09C6.70877 21.879 6.48617 21.5868 6.36002 21.25C6.08586 20.6504 5.88766 20.0188 5.77002 19.37C5.62002 18.54 5.44002 17.5 5.26002 16.37C4.84002 13.71 4.40002 10.67 4.20002 9.37002C4.18522 9.27986 4.13669 9.1987 4.06427 9.14299C3.99185 9.08728 3.90096 9.0612 3.81002 9.07002C3.72058 9.08481 3.64038 9.13373 3.58629 9.20648C3.5322 9.27922 3.50844 9.37011 3.52002 9.46002C3.68002 10.78 4.03002 13.82 4.38002 16.46C4.52002 17.59 4.66002 18.65 4.79002 19.46C4.90482 20.2021 5.10967 20.9275 5.40002 21.62C5.59467 22.1715 5.94991 22.6521 6.42002 23C7.037 23.3526 7.71596 23.5835 8.42002 23.68C9.88002 23.93 11.42 23.75 12.91 23.91C14.1132 24.0379 15.3295 23.9465 16.5 23.64C17.3632 23.4255 18.1303 22.9293 18.68 22.23C18.9 21.8923 19.0717 21.5254 19.19 21.14C19.35 20.64 19.44 20.14 19.57 19.59C20.0752 17.1018 20.4457 14.5882 20.68 12.06C20.8047 11.0652 20.8548 10.0624 20.83 9.06002C20.811 8.90579 20.7486 8.76013 20.65 8.64002Z"
                    fill="black"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.27 16.13C9.41 16.97 9.58 17.71 9.69 18.24C9.76 18.58 9.81 18.83 9.83 18.95C9.89 19.25 10.15 19.21 10.34 19.12C10.3722 19.1156 10.4031 19.1044 10.4307 19.0872C10.4583 19.07 10.4819 19.0471 10.5 19.02C10.5 19.02 10.5 18.96 10.5 18.94V18.23C10.5 17.69 10.5 16.93 10.39 16.08C10.39 15.62 10.3 15.14 10.23 14.66C10.23 14.42 10.17 14.18 10.12 13.95C9.92 12.83 9.66 11.81 9.51 11.14C9.50475 11.1006 9.49179 11.0627 9.47186 11.0283C9.45193 10.9939 9.42542 10.9638 9.39385 10.9396C9.36228 10.9155 9.32626 10.8978 9.28785 10.8876C9.24945 10.8773 9.2094 10.8748 9.17 10.88C9.13061 10.8853 9.09263 10.8982 9.05824 10.9182C9.02386 10.9381 8.99373 10.9646 8.96959 10.9962C8.94544 11.0278 8.92776 11.0638 8.91753 11.1022C8.90731 11.1406 8.90475 11.1806 8.91 11.22C8.91 11.9 8.91 12.96 9.02 14.09C9.02 14.33 9.02 14.56 9.09 14.8C9.12 15.19 9.19 15.67 9.27 16.13Z"
                    fill="black"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.85 18.94C14.9402 18.94 15.0267 18.9042 15.0904 18.8404C15.1542 18.7767 15.19 18.6902 15.19 18.6C15.24 17.99 15.41 17.06 15.52 16.04C15.59 15.48 15.65 14.89 15.67 14.33C15.73 12.98 15.67 11.81 15.67 11.42C15.6728 11.3394 15.644 11.261 15.5899 11.2012C15.5358 11.1415 15.4605 11.1052 15.38 11.1C15.3406 11.0973 15.301 11.1024 15.2636 11.115C15.2262 11.1276 15.1916 11.1475 15.1618 11.1735C15.1321 11.1995 15.1078 11.2312 15.0903 11.2666C15.0729 11.302 15.0626 11.3406 15.06 11.38C15 11.73 14.77 12.7 14.6 13.88C14.55 14.22 14.52 14.59 14.49 14.95C14.46 15.31 14.49 15.68 14.49 16.04C14.49 17.04 14.49 17.99 14.57 18.6C14.5688 18.6807 14.5962 18.7592 14.6475 18.8215C14.6988 18.8838 14.7706 18.9258 14.85 18.94Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1030_1970">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
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
