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
      icon: '🏷️',
    },
  });

  const icons = ['🏡', '🍳', '🛁', '📺', '🛏️', '✂️', '🐈', '🛠️', '🛍️', '🏷️'];
  const gradients = [
    'bg-[#ffd97799]',
    'bg-[#c9f2f199]',
    'bg-[#c7dab899]',
    'bg-[#ffba7899]',
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
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full border border-[#275191]"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5"
          >
            <g clip-path="url(#clip0_1030_1834)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M23.89 12.5C23.83 11.83 23.96 10.93 23.89 10.15C23.8699 9.75247 23.7749 9.36229 23.61 9.00001C23.4798 8.74198 23.2643 8.53701 23 8.42001C22.6262 8.27332 22.2371 8.16933 21.84 8.11001C21.2065 7.99428 20.564 7.93405 19.92 7.93001C18.9733 7.93572 18.028 8.00253 17.09 8.13001C14.96 8.38001 15.7 8.69001 15.7 6.26002L15.57 3.19001C15.5692 2.70423 15.5291 2.21932 15.45 1.74001C15.3681 1.34384 15.1484 0.989514 14.83 0.740015C14.6084 0.570211 14.3525 0.45077 14.08 0.390015C13.74 0.300015 13.37 0.270015 13.08 0.210015C12.8155 0.166445 12.5481 0.143044 12.28 0.140015H11.49C10.8008 0.216637 10.1267 0.395254 9.49 0.670015C9.03185 0.841853 8.62071 1.11937 8.29 1.48001C8.16549 1.62912 8.08268 1.80853 8.05 2.00001C8.01935 2.33264 8.01935 2.66739 8.05 3.00001L8.29 7.80001C8.30299 7.87144 8.34063 7.93605 8.39637 7.98256C8.45211 8.02908 8.5224 8.05456 8.595 8.05456C8.6676 8.05456 8.7379 8.02908 8.79363 7.98256C8.84937 7.93605 8.88701 7.87144 8.9 7.80001L8.73 3.00001V2.23001C8.73071 2.12195 8.76572 2.01689 8.83 1.93001C9.09398 1.66623 9.41584 1.46764 9.77 1.35001C10.5442 1.02432 11.3809 0.874061 12.22 0.910015C12.9398 0.935319 13.6486 1.09471 14.31 1.38001C14.4756 1.52621 14.5881 1.72313 14.63 1.94001C14.6835 2.3779 14.7069 2.81893 14.7 3.26001L14.78 6.26002C14.7026 6.92403 14.6592 7.59157 14.65 8.26001C14.6405 8.54263 14.7249 8.82042 14.89 9.05001C15.0762 9.21355 15.3125 9.30878 15.56 9.32001C16.1072 9.31041 16.6526 9.25353 17.19 9.15001C18 9.00001 18.72 9.00001 19.44 9.00001C20.175 8.99028 20.9089 9.05731 21.63 9.20001C22.96 9.45001 22.78 10.1 22.79 10.25C22.84 11.05 22.7 11.96 22.79 12.63C22.79 13.04 22.89 13.55 22.89 14.03C22.8932 14.285 22.8526 14.5387 22.77 14.78C22.77 14.91 22.55 14.92 22.41 14.95C22.09 15.03 21.75 15.05 21.5 15.1C21.01 15.18 20.5 15.25 19.94 15.29C19.12 15.35 18.28 15.37 17.53 15.37C17.22 15.37 16.74 15.28 16.32 15.26C16.0767 15.2501 15.8334 15.2806 15.6 15.35C15.4745 15.3889 15.3623 15.4618 15.2758 15.5607C15.1893 15.6595 15.1319 15.7805 15.11 15.91C15.0767 16.1957 15.0767 16.4843 15.11 16.77C15.11 17.5 15.18 18.24 15.19 18.98V19.86C15.1644 20.5128 15.0808 21.1621 14.94 21.8C14.8774 22.1511 14.722 22.4791 14.49 22.75C14.41 22.83 14.25 22.75 14.11 22.75C13.97 22.75 13.7 22.7 13.55 22.69C12.7907 22.6452 12.0293 22.6452 11.27 22.69C10.9693 22.692 10.6687 22.6753 10.37 22.64C9.78 22.57 9.5 22.02 9.3 21.38C9.04545 20.2593 8.8915 19.1181 8.84 17.97C8.86873 17.5138 8.86873 17.0562 8.84 16.6C8.81373 16.4441 8.75691 16.295 8.67282 16.1611C8.58873 16.0273 8.47902 15.9113 8.35 15.82C8.11974 15.6785 7.86557 15.5802 7.6 15.53C7.07297 15.4184 6.538 15.3481 6 15.32C5.39 15.26 4.75 15.17 4.12 15.07C3.49 14.97 2.85 14.83 2.25 14.69L0.89 14.4C0.862719 14.201 0.846029 14.0008 0.84 13.8C0.84 13.24 0.93 12.61 0.93 12.38C0.895211 11.7925 0.918659 11.2029 1 10.62C1.02422 10.2882 1.15386 9.97289 1.37 9.72001C1.50253 9.5955 1.6641 9.50612 1.84 9.46001C2.18 9.37001 2.56 9.36001 2.9 9.30001C3.64729 9.17834 4.40289 9.11481 5.16 9.11001C5.9207 9.12595 6.67929 9.19613 7.43 9.32001C7.47465 9.32724 7.52028 9.32559 7.5643 9.31518C7.60831 9.30477 7.64985 9.28579 7.68653 9.25932C7.7232 9.23286 7.75431 9.19943 7.77807 9.16094C7.80183 9.12245 7.81778 9.07966 7.825 9.03501C7.83222 8.99037 7.83058 8.94473 7.82017 8.90071C7.80975 8.8567 7.79077 8.81517 7.76431 8.77849C7.73784 8.74181 7.70441 8.7107 7.66593 8.68694C7.62744 8.66318 7.58465 8.64724 7.54 8.64001C6.75439 8.49627 5.95849 8.41601 5.16 8.40001C4.35978 8.38241 3.55967 8.43932 2.77 8.57001C2.38703 8.59947 2.00628 8.65291 1.63 8.73001C1.32016 8.80089 1.0362 8.95672 0.81 9.18001C0.481851 9.54185 0.272452 9.99555 0.21 10.48C0.120154 11.1091 0.0866875 11.745 0.11 12.38C0.0398895 13.0177 0.00317267 13.6585 0 14.3C0.00562246 14.5559 0.0972046 14.8025 0.26 15C0.392307 15.1195 0.549385 15.2083 0.72 15.26C1.13 15.39 1.78 15.47 2.05 15.54C2.66 15.69 3.31 15.84 3.97 15.96C4.63 16.08 5.28 16.18 5.92 16.24C6.24 16.24 6.71 16.31 7.14 16.39C7.35464 16.4153 7.56204 16.4833 7.75 16.59C7.84 16.65 7.83 16.78 7.85 16.9V18.05C7.85932 19.4832 8.08866 20.9064 8.53 22.27C8.66081 22.635 8.88787 22.9578 9.18714 23.2042C9.4864 23.4507 9.84674 23.6116 10.23 23.67C10.5615 23.715 10.8955 23.7384 11.23 23.74C11.9562 23.7015 12.6838 23.7015 13.41 23.74C13.7828 23.8061 14.1619 23.8295 14.54 23.81C14.8096 23.7817 15.0625 23.6658 15.26 23.48C15.626 23.0752 15.8809 22.5826 16 22.05C16.1635 21.3507 16.2606 20.6376 16.29 19.92C16.3104 19.587 16.3104 19.253 16.29 18.92C16.29 18.19 16.22 17.45 16.22 16.73V16.38C16.64 16.38 17.14 16.49 17.46 16.49C18.24 16.49 19.11 16.49 19.96 16.4C20.54 16.35 21.11 16.29 21.64 16.19C22.133 16.1475 22.6177 16.0364 23.08 15.86C23.3891 15.7257 23.6357 15.4791 23.77 15.17C23.9162 14.797 23.9941 14.4007 24 14C24 13.49 23.93 12.94 23.89 12.5Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_1030_1834">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="m-auto p-4 sm:max-w-[425px]">
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
                    <div className="flex flex-row flex-wrap justify-around gap-1">
                      {icons.map((icon, index) => {
                        const isSelected = field.value === icon;

                        return (
                          <Button
                            key={icon}
                            className={cn(
                              'h-14 w-14 rounded-full hover:bg-transparent',
                              isSelected && gradients[index % gradients.length],
                              isSelected &&
                                'hover:' + gradients[index % gradients.length]
                            )}
                            size="icon"
                            variant="ghost"
                            type="button"
                            onClick={() => {
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
