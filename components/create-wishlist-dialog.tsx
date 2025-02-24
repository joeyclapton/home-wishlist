'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1),
  icon: z.string(),
});

export function CreateWishlistDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: '',
    },
  });
  const icons = ['🏡', '🍳', '🛁', '📺', '🛏️', '✂️', '🐈', '🛠️', '🛍️'];
  const gradients = [
    'bg-[#ffd977]',
    'bg-[#c9f2f1]',
    'bg-[#c7dab8]',
    'bg-[#ffba78]',
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('wishlist').insert([
        {
          name: values.name,
          icon: values.icon,
        },
      ]);

      if (error) throw error;

      toast({
        description: '✅ Wishlist criada com sucesso.',
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: '❌ Erro ao criar wishlist. Tente novamente.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="lg" className="w-full">
          Criar nova wishlist
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 sm:max-w-[425px]">
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
                    <Input placeholder="Nome da Wishlist" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-row flex-wrap gap-2">
                      {icons.map((icon, index) => {
                        const isSelected = field.value === icon;
                        return (
                          <Button
                            key={icon}
                            className={cn(
                              'h-12 w-12 rounded-full hover:bg-transparent',
                              isSelected && gradients[index % gradients.length]
                            )}
                            size="icon"
                            variant="ghost"
                            type="button"
                            onClick={() => {
                              field.onChange(icon);
                              form.setValue('icon', icon);
                            }}
                          >
                            {icon}
                          </Button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              className="w-full"
            >
              Salvar
            </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
