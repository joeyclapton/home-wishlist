'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/Drawer';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowUp, ArrowUp01Icon, FlagIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const flagColor = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-800',
  medium:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-800',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-800',
};

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  priority: z.enum(['low', 'medium', 'high', '']),
});

interface AddProductDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wishlistId: string;
}

export function AddProductDialog({
  open,
  onOpenChange,
  wishlistId,
}: AddProductDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      priority: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const supabase = createClient();

      // Create product
      const { data: product, error: productError } = await supabase
        .from('product')
        .insert([
          {
            name: values.name,
            priority: values.priority,
          },
        ])
        .select()
        .single();

      if (productError) throw productError;

      // Link product to wishlist
      const { error: linkError } = await supabase
        .from('wishlist_products')
        .insert([
          {
            wishlist_id: wishlistId,
            product_id: product.id,
          },
        ]);

      if (linkError) throw linkError;

      toast({
        description: 'Produto adicionado na listinha 🎉',
      });

      // Invalida ambas as queries
      queryClient.invalidateQueries({
        queryKey: ['wishlist-products', wishlistId],
      });
      queryClient.invalidateQueries({
        queryKey: ['wishlists'],
      });

      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[220px] p-4 sm:max-w-[425px]">
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <section className="flex justify-between gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className={cn(flagColor[field.value])}>
                        <SelectTrigger>
                          <FlagIcon
                            className="mr-2"
                            size={18}
                            strokeWidth={1.2}
                          />
                          <SelectValue placeholder="Prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="rounded-full"
                type="submit"
                size="icon"
                disabled={isSubmitting || !form.formState.isValid}
              >
                <ArrowUp size={20} strokeWidth={4} />
              </Button>
            </section>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
