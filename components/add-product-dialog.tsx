'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  priority: z.enum(['low', 'medium', 'high']),
});

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wishlistId: string;
}

export function AddProductDialog({
  open,
  onOpenChange,
  wishlistId,
}: AddProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      priority: 'medium',
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
        title: 'Success!',
        description: 'Product has been added to your wishlist.',
      });

      queryClient.invalidateQueries({ queryKey: ['wishlist-products'] });
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Coffee maker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Add Product
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
