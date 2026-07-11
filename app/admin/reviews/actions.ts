'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function togglePublishReview(reviewId: string, publish: boolean) {
  const supabase = await createClient();
  await supabase.from('reviews').update({ is_published: publish }).eq('id', reviewId);
  revalidatePath('/admin/reviews');
  revalidatePath('/');
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();
  await supabase.from('reviews').delete().eq('id', reviewId);
  revalidatePath('/admin/reviews');
  revalidatePath('/');
}
