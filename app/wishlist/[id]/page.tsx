import { createClient } from '@/lib/supabase/client';
import { WishlistDetailClient } from './wishlist-detail-client';

// Server Component
export async function generateStaticParams() {
  const supabase = createClient();
  const { data } = await supabase.from('wishlist').select('id');

  return (data ?? []).map((wishlist) => ({
    id: wishlist.id,
  }));
}

export default function WishlistDetail() {
  return <WishlistDetailClient />;
}
